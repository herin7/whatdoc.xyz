const { Router } = require('express');
const { z } = require('zod');
const bcrypt = require('bcrypt');
const UserModel = require("../models/User.js");
const router = Router();
const jwt = require('jsonwebtoken');
const JWT_SECRET = "s3cret";

//signin
router.post("/signup", async (req, res) => {
    const requiredBody = z.object({
        fname: z.string(),
        lname: z.string(),
        email: z.string(),
        githubId: z.string(),
        password: z.string().min(6)
    })
    const parsedresponse = requiredBody.safeParse(req.body);
    const fname = req.body.fname;
    const lname = req.body.lname;
    const email = req.body.email;
    const githubId = req.body.githubId;
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
            githubId: githubId,
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

//signup
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

module.exports = router;