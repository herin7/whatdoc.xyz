const { z } = require("zod");
const bcrypt = require("bcrypt");
const { UserModel } = require("../models/User");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const GITHUB_CALLBACK_URL = process.env.GITHUB_CALLBACK_URL;

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

        const hashed = await bcrypt.hash(password, 10);

        await UserModel.create({
            firstName: fname,
            lastName: lname,
            email,
            password: hashed
        });

        return res.status(201).json({
            message: "Welcome to whatdoc!"
        });

    } catch (e) {
        return res.status(500).json({
            error : e,
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
            return res.send({
                message: "Welcome back" + response.lastName,
                token
            });
        }
        else {
            return res.status(400).json({
                message: "Invalid creds"
            })
        }
    }
    catch (e) {
        return res.send({
            message: "Error in signin controller"
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

function githubAuth(req, res) {
    const state = req.userId;
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${GITHUB_CALLBACK_URL}&scope=user:email,repo&state=${state}`;
    res.redirect(githubAuthUrl);
}

async function githubCallback(req, res) {
    const { code, state } = req.query;
    const userId = state;

    if (!code) {
        return res.status(400).json({ message: "No code provided" });
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
                code: code
            })
        });

        const tokenData = await tokenResponse.json();

        if (tokenData.error) {
            return res.status(400).json({ message: tokenData.error_description });
        }

        const accessToken = tokenData.access_token;

        const userResponse = await fetch("https://api.github.com/user", {
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Accept": "application/vnd.github.v3+json"
            }
        });

        const githubUser = await userResponse.json();

        await UserModel.findByIdAndUpdate(userId, {
            githubId: githubUser.id.toString(),
            githubAccessToken: accessToken
        });

        res.json({
            message: "GitHub linked successfully",
            githubUsername: githubUser.login
        });

    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Failed to link GitHub" });
    }
}

module.exports = { signup, signin, getMe, githubAuth, githubCallback };