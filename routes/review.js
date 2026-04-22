//review
const express = require("express");
const router = express.Router({ mergeParams: true });
const asyncWrap = require("../utils/asyncWrap.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../modals/review.js");
// const { link } = require("fs");
const Listing = require("../modals/listing.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");

router.post("/",isLoggedIn,validateReview,asyncWrap(async(req,res)=>{
  let newlisting = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  newlisting.reviews.push(newReview);

  await newReview.save();
  await newlisting.save();
req.flash("success","new Review created!");
  console.log("new review save");
  res.redirect(`/listings/${req.params.id}`);
}));

//delete review
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,asyncWrap(async(req,res)=>{
  let {id, reviewId} = req.params;
  await Listing.findByIdAndUpdate(id,{$pull : {reviews : reviewId}});
  await Review.findByIdAndDelete(reviewId);
  req.flash("success","new Review deleted");
  res.redirect(`/listings/${id}`);
}));

module.exports = router;