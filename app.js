const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const asyncWrap = require("./utils/asyncWrap.js");
const ExpressError = require("./utils/ExpressError.js");

const Listing = require("./modals/listing.js");
// const { link } = require("fs");
const { listingSchema , reviewSchema} = require("./schema.js");
const reviews = require("./modals/review.js");

app.set("views", path.join(__dirname, "view"));
app.set("view engine", "ejs");
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "public")));

const validateListing = (req,res,next) =>{
let {error} = listingSchema.validate(req.body);
let errMsg = error.details.map(el => el.message).join(",");
  if(error){
    throw new ExpressError(errMsg,400);
  }else{
    next();
  }
}

// const validateReview = (req,res,next) =>{
// let {error} = reviewSchema.validate(req.body);
// let errMsg = error.details.map(el => el.message).join(",");
//   if(error){
//     throw new ExpressError(errMsg,400);
//   }else{
//     next();
//   }
// }

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);

  if (!error) return next();

  const errMsg = error.details.map(el => el.message).join(",");
  throw new ExpressError(errMsg, 400);
};

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

app.get("/allList", asyncWrap(async (req,res)=>{
  const allListing = await Listing.find({});
  res.render("listing/index", { allListing });
}));

app.get("/listing/new",(req,res)=>{
  res.render("listing/new.ejs");
})

app.post("/listing",validateListing, async (req,res,next)=>{
  
  let newlist = new Listing(req.body.listing);
  await newlist.save();
  console.log(newlist);
  res.redirect("/allList");
});

app.get("/allList/:id/edit",asyncWrap(async(req,res)=>{
  let {id} = req.params;
  const listing = await Listing.findById(id);
  res.render("listing/edit.ejs",{listing});
}));

app.put("/allList/:id", validateListing, asyncWrap(async (req,res)=>{
  if(!req.body.Listing){
    throw new ExpressError("send vaild data for listing",400);
  }
  let {id} = req.params;
  const listing = await Listing.findByIdAndUpdate(id,{...req.body.listing},{ new: true });
  res.redirect(`/listing/${id}`);
}));

app.get("/listing/:id", asyncWrap(async (req,res)=>{
  let {id} = req.params;
  const listing = await Listing.findById(id).populate("reviews");
  res.render("listing/show.ejs", {listing});
}));

app.delete("/allList/:id",asyncWrap(async(req,res)=>{
  let {id} = req.params;
   const listing = await Listing.findByIdAndDelete(id);
   console.log(listing);
   res.redirect("/allList");
}));

//review
app.post("/listings/:id/reviews",validateReview,asyncWrap(async(req,res)=>{
let newlisting = await Listing.findById(req.params.id);
let newReview = new reviews(req.body.review);

newlisting.reviews.push(newReview);

await newReview.save();
await newlisting.save();

console.log("new review save");
res.redirect(`/listing/${req.params.id}`);
}));

//delete review
app.delete("/listings/:id/reviews/:reviewId", asyncWrap(async(req,res)=>{
  let {id, reviewId} = req.params;
  await Listing.findByIdAndUpdate(id,{$pull : {reviews : reviewId}});
  await reviews.findByIdAndDelete(reviewId);
  res.redirect(`/listing/${id}`);
}));

app.use((req,res,next)=>{
  next(new ExpressError("page not found",404));
});

app.use((err,req,res,next)=>{
  let {message = "Something went wrong!" ,statusCode = 500} = err;
  // res.status(statusCode).send(message);
  res.render("listing/error.ejs",{err});
});

app.get("/",(req,res)=>{
  res.send("i'm root");
});

app.listen(port,()=>{
  console.log(`server is hearing on ${port}`);
});