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
const session = require("express-session");
const flash = require('connect-flash');

app.set("views", path.join(__dirname, "view"));
app.set("view engine", "ejs");
app.engine('ejs', ejsMate);
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const sessionOption = {
  secret : "mysupersercreatcode",
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

app.use((req,res,next) =>{
res.locals.success = req.flash("success");
res.locals.error = req.flash("error");
next();
});

app.use("/listings", listing_route);
app.use("/listings/:id/reviews", review_route);


app.get('/', (req, res) => {
  res.redirect('/listings');
});

const mongoose_url = "mongodb://127.0.0.1:27017/wanderlust";

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

// app.get("/",(req,res)=>{
//   res.send("i'm root");
// });

app.listen(port,()=>{
  console.log(`server is hearing on ${port}`);
});