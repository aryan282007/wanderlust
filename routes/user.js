const express = require("express");
const router = express.Router();
const User = require("../modals/user");
const asyncWrap = require("../utils/asyncWrap.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controller/user.js");

router.route("/signup").get(userController.signup).post(asyncWrap(userController.createUser));

router.route("/login").get(userController.login).post(passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), saveRedirectUrl, asyncWrap(userController.loginUser));


router.get("/logout",userController.logout);

module.exports = router;
