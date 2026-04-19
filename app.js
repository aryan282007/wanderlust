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

app.set("views", path.join(__dirname, "view"));
app.set("view engine", "ejs");
app.engine('ejs', ejsMate);
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
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