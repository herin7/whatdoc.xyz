const { Router } = require('express');
const authmware = require("../middlewares/authmware.js");
const { signup, signin, getMe, githubAuth, githubCallback, getRepos, redeemProCode, updateProfile } = require('../controllers/authController.js');

const router = Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/me", authmware, getMe);
router.get("/github", authmware, githubAuth);
router.get("/github/callback", githubCallback);
router.get("/github/repos", authmware, getRepos);
router.post("/redeem-pro", authmware, redeemProCode);
router.put("/profile", authmware, updateProfile);

module.exports = router;