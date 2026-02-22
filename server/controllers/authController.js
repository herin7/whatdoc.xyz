const { z } = require("zod");
const bcrypt = require("bcrypt");
const { UserModel } = require("../models/User");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const GITHUB_CALLBACK_URL = process.env.GITHUB_CALLBACK_URL;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

const signupSchema = z.object({
    fname: z.string(),
    lname: z.string(),
    email: z.string().email(),
    password: z.string().min(6)
});
const signinSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
});

async function signup(req, res) {
    try {
        const parsed = signupSchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({
                message: "Invalid input",
                errors: parsed.error.issues
            });
        }

        const { fname, lname, email, password } = parsed.data;

        // Check if email already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                message: "An account with this email already exists"
            });
        }

        const hashed = await bcrypt.hash(password, 10);

        const user = await UserModel.create({
            firstName: fname,
            lastName: lname,
            email,
            password: hashed
        });

        const token = jwt.sign(
            { id: user._id.toString() },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.status(201).json({
            message: "Welcome to whatdoc!",
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }
        });

    } catch (e) {
        // Handle duplicate key error (e.g. race condition on email)
        if (e.code === 11000) {
            const field = Object.keys(e.keyPattern || {})[0] || 'email';
            return res.status(409).json({
                message: field === 'email'
                    ? "An account with this email already exists"
                    : `Duplicate value for field: ${field}`
            });
        }
        console.error('Signup error:', e);
        return res.status(500).json({
            message: "Server error"
        });
    }
}
async function signin(req, res) {
    const parsed = signinSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).send({
            message: "Invalid email/password"
        })
    }
    const { email, password } = parsed.data;
    try {
        const response = await UserModel.findOne({ email });
        if (!response) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }
        const ismatch = await bcrypt.compare(password, response.password);
        if (ismatch) {
            const token = jwt.sign({
                id: response._id.toString()
            },
                JWT_SECRET,
                { expiresIn: "7d" }
            );
            return res.json({
                message: "Welcome back " + response.firstName,
                token,
                user: {
                    id: response._id,
                    firstName: response.firstName,
                    lastName: response.lastName,
                    email: response.email
                }
            });
        }
        else {
            return res.status(400).json({
                message: "Invalid creds"
            })
        }
    }
    catch (e) {
        console.error('Signin error:', e);
        return res.status(500).json({
            message: "Server error"
        })
    }

}

async function getMe(req, res) {
    const userId = req.userId;
    const current_user = await UserModel.findById(userId).select("-password -githubAccessToken");

    if (!current_user) {
        return res.status(403).send({
            message: "user not found"
        });
    }
    return res.send({
        current_user
    });
}

// Returns the GitHub OAuth URL for the frontend to redirect to
function githubAuth(req, res) {
    const state = req.userId;
    const includePrivate = req.query.includePrivate === 'true';
    const scope = includePrivate ? 'user:email,repo' : 'user:email,public_repo';
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${GITHUB_CALLBACK_URL}&scope=${scope}&state=${state}`;
    res.json({ url: githubAuthUrl });
}

// GitHub redirects here after user authorizes — we then redirect back to the SPA
async function githubCallback(req, res) {
    const { code, state } = req.query;
    const userId = state;

    if (!code) {
        return res.redirect(`${CLIENT_URL}/dashboard?github=error&reason=no_code`);
    }

    try {
        const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                client_id: GITHUB_CLIENT_ID,
                client_secret: GITHUB_CLIENT_SECRET,
                code
            })
        });

        const tokenData = await tokenResponse.json();

        if (tokenData.error) {
            return res.redirect(`${CLIENT_URL}/dashboard?github=error&reason=${tokenData.error}`);
        }

        const accessToken = tokenData.access_token;

        // Fetch GitHub user profile
        const userResponse = await fetch("https://api.github.com/user", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: "application/vnd.github.v3+json"
            }
        });

        const githubUser = await userResponse.json();

        // Save GitHub info to the user
        await UserModel.findByIdAndUpdate(userId, {
            githubId: githubUser.id.toString(),
            githubUsername: githubUser.login,
            githubAccessToken: accessToken
        });

        // Redirect back to the frontend with success
        res.redirect(`${CLIENT_URL}/dashboard?github=success`);

    } catch (e) {
        console.error("GitHub callback error:", e);
        res.redirect(`${CLIENT_URL}/dashboard?github=error&reason=server_error`);
    }
}

// Fetch all repos for the authenticated user from GitHub
async function getRepos(req, res) {
    try {
        const user = await UserModel.findById(req.userId);

        if (!user || !user.githubAccessToken) {
            return res.status(400).json({ message: "GitHub not connected" });
        }

        // Fetch all repos (paginated — GitHub returns max 100 per page)
        let allRepos = [];
        let page = 1;
        let hasMore = true;

        while (hasMore) {
            const response = await fetch(
                `https://api.github.com/user/repos?per_page=100&page=${page}&sort=updated&affiliation=owner`,
                {
                    headers: {
                        Authorization: `Bearer ${user.githubAccessToken}`,
                        Accept: "application/vnd.github.v3+json"
                    }
                }
            );

            if (!response.ok) {
                const err = await response.json();
                return res.status(response.status).json({ message: err.message || "GitHub API error" });
            }

            const repos = await response.json();
            allRepos = allRepos.concat(repos);

            // If we got fewer than 100, we've reached the last page
            hasMore = repos.length === 100;
            page++;
        }

        // Return a clean list
        const repoList = allRepos.map((repo) => ({
            id: repo.id,
            name: repo.name,
            fullName: repo.full_name,
            private: repo.private,
            url: repo.html_url,
            description: repo.description,
            language: repo.language,
            updatedAt: repo.updated_at,
            defaultBranch: repo.default_branch,
            starCount: repo.stargazers_count
        }));

        res.json({
            username: user.githubUsername,
            repos: repoList
        });

    } catch (e) {
        console.error("getRepos error:", e);
        res.status(500).json({ message: "Failed to fetch repos" });
    }
}

async function redeemProCode(req, res) {
    try {
        const { code } = req.body;
        const PRO_CODE = process.env.PRO_CODE;

        if (!code || code !== PRO_CODE) {
            return res.status(400).json({ message: 'Invalid pro code.' });
        }

        const user = await UserModel.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        if (user.isPro) {
            return res.json({ message: 'You already have Pro access!' });
        }

        user.isPro = true;
        await user.save();

        return res.json({ message: 'Pro access activated! You now have unlimited doc generation.' });
    } catch (e) {
        console.error('redeemProCode error:', e);
        return res.status(500).json({ message: 'Server error.' });
    }
}

async function updateProfile(req, res) {
    try {
        const { firstName, lastName, avatarUrl } = req.body;
        const user = await UserModel.findByIdAndUpdate(
            req.userId,
            { firstName, lastName, avatarUrl },
            { new: true }
        ).select('-password -githubAccessToken');

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        return res.json({ user });
    } catch (e) {
        console.error('updateProfile error:', e);
        return res.status(500).json({ message: 'Server error.' });
    }
}
async function unlinkGithub(req, res) {
    try {
        const user = await UserModel.findByIdAndUpdate(
            req.userId,
            { $unset: { githubId: '', githubUsername: '', githubAccessToken: '' } },
            { new: true }
        ).select('-password -githubAccessToken');

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        return res.json({ message: 'GitHub account unlinked.', user });
    } catch (e) {
        console.error('unlinkGithub error:', e);
        return res.status(500).json({ message: 'Server error.' });
    }
}

async function deleteAccount(req, res) {
    try {
        const { password } = req.body;
        if (!password) {
            return res.status(400).json({ message: 'Password is required to delete your account.' });
        }

        const user = await UserModel.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect password.' });
        }

        // Delete all projects belonging to this user
        const Project = require('../models/Project');
        await Project.deleteMany({ userId: req.userId });

        // Delete the user
        await UserModel.findByIdAndDelete(req.userId);

        return res.json({ message: 'Account deleted successfully.' });
    } catch (e) {
        console.error('deleteAccount error:', e);
        return res.status(500).json({ message: 'Server error.' });
    }
}

module.exports = { signup, signin, getMe, githubAuth, githubCallback, getRepos, redeemProCode, updateProfile, unlinkGithub, deleteAccount };