const User = require("../modals/user");

module.exports.signup = (req,res)=>{
  res.render("./listing/user/signup.ejs");
};

module.exports.createUser = async(req,res)=>{
  try {
    let {email, username, password} = req.body;
    let newUser = new User({ email, username });
    let registerUser = await User.register(newUser, password);
    console.log(registerUser);
    req.login(registerUser,(err)=>{
      if(err){
        return next(err);
      }
       req.flash("success","welcome to wanderlust");
       res.redirect("/listings");
    });
   
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/signup");
  }
};

module.exports.login = (req,res)=>{
  res.render("./listing/user/login.ejs");
};

module.exports.loginUser = async (req, res) => {
  req.flash("success", "welcome back!");
  const redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

module.exports.logout = (req,res,next)=>{
  req.logout((err)=>{
    if(err){
      return next(err);
    }
    req.flash("success","you have been logged out!");
    res.redirect("/listings");
  });
};

