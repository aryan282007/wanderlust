const express = require("express");
const router = express.Router();
const User = require("../modals/user");
const asyncWrap = require("../utils/asyncWrap.js");
const passport = require("passport");

router.get("/signup",(req,res)=>{
  res.render("./listing/user/signup.ejs");
})

router.post("/signup", asyncWrap(async(req,res)=>{
  try {
    let {email, username, password} = req.body;
    let newUser = new User({ email, username });
    let registerUser = await User.register(newUser, password);
    console.log(registerUser);
    req.flash("success","welcome to wanderlust");
    res.redirect("/listings");
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/signup");
  }
}));

router.get("/login",(req,res)=>{
  res.render("./listing/user/login.ejs");
});

router.post("/login",passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }),async (req,res)=>{
  
  req.flash("success","welcome back!");
  res.redirect("/listings");
});

module.exports = router;
