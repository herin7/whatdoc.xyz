const { Router } = require('express');
const { z } = require('zod');
const bcrypt = require('bcrypt');
const UserModel = require("../models/User.js");
const authmware = require("../middlewares/authmware.js");
const router = Router();
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const GITHUB_CALLBACK_URL = process.env.GITHUB_CALLBACK_URL;
//signup
router.post("/signup", async (req, res) => {
    const requiredBody = z.object({
        fname: z.string(),
        lname: z.string(),
        email: z.string(),
        password: z.string().min(6)
    })
    const parsedresponse = requiredBody.safeParse(req.body);
    const fname = req.body.fname;
    const lname = req.body.lname;
    const email = req.body.email;
    const password = req.body.password;
    if (!parsedresponse.success) {
        console.log(parsedresponse.error);
        return res.status(403).send({
            message: parsedresponse.error,
            message: "Invalid Input"
        })
    }
    try {
        const hashedpassword = await bcrypt.hash(password, 5);
        await UserModel.create({
            firstName: fname,
            lastName: lname,
            password: hashedpassword,
            email: email
        })
    }
    catch (e) {
        return res.status(403).send({
            message: "Error in storing"
        })
    }
    return res.json({
        message: "Welcome to whatdoc!"
    })
});
//signin
router.post("/signin", async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const response = await UserModel.findOne({
        email: email
    })
    if (!response) {
        return res.status(403).json({ message: "Invalid creds" });
    }
    const ismatch = await bcrypt.compare(password, response.password);
    if (ismatch) {
        const token = jwt.sign({
            id: response._id.toString()
        },
            JWT_SECRET
        );
        res.json({
            token
        })
    }
    else {
        res.status(403).json({
            message: "Invalid creds"
        })
    }
})

router.get("/github", authmware, (req, res) => {
    const state = req.userId; // pass userId in state to retrieve after callback
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${GITHUB_CALLBACK_URL}&scope=user:email,repo&state=${state}`;
    res.redirect(githubAuthUrl);
});

router.get("/github/callback", async (req, res) => {
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
});

module.exports = router;