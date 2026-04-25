if(process.env.NODE_ENV !== "production"){
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listing_route = require("./routes/listing.js");
const review_route = require("./routes/review.js");
const user_route = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const flash = require('connect-flash');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./modals/user.js");

app.set("views", path.join(__dirname, "view"));
app.set("view engine", "ejs");
app.engine('ejs', ejsMate);
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const store = MongoStore.create({
  mongoUrl: process.env.ATLAS_URI,
  crypto: {
    secret: process.env.SESSION_SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", (e)=>{
  console.log("session store error",e);
});

const sessionOption = {
  store,
  secret : process.env.SESSION_SECRET,
  resave : false,
  saveUninitialized : true,
  cookie : {
    expires : Date.now() + 7 * 24 * 60 *60 * 1000,
    maxAge : 7 * 24 * 60 *60 * 1000,
    httpOnly : true
  }
}

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) =>{
res.locals.success = req.flash("success");
res.locals.error = req.flash("error");
res.locals.currentUser = req.user;
next();
});

app.get("/fakeUser", async (req,res)=>{
  const user = new User({email : "student@gmail.com", username : "student"});
  const newUser = await User.register(user,"chicken");
  res.send(newUser);
});

app.use("/listings", listing_route);
app.use("/listings/:id/reviews", review_route);
app.use("/", user_route);


app.get('/', (req, res) => {
  res.redirect('/listings');
});

const mongoose_url = process.env.ATLAS_URI ;

main()
.then(()=>{
  console.log("mongoose is connected");
})
.catch(()=>{
  console.log("error in mongoose connection");
});

async function main() {
  await mongoose.connect(mongoose_url);
}

app.use((req,res,next)=>{
  next(new ExpressError("page not found",404));
});

app.use((err,req,res,next)=>{
  let {message = "Something went wrong!" ,statusCode = 500} = err;
  // res.status(statusCode).send(message);
  res.render("listing/error.ejs",{err});
});


app.listen(port,()=>{
  console.log(`server is hearing on ${port}`);
});