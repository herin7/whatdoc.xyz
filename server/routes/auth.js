const { Router } = require('express');
const authmware = require("../middlewares/authmware.js");
const { signup, signin, getMe, githubAuth, githubCallback } = require('../controllers/authController.js');

const router = Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/me", authmware, getMe);
router.get("/github", authmware, githubAuth);
router.get("/github/callback", githubCallback);

module.exports = router;