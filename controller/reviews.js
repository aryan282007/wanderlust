const Listing = require("../modals/listing.js");
const Review = require("../modals/review.js");

module.exports.createReview = async(req,res)=>{
  let newlisting = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  newlisting.reviews.push(newReview);

  await newReview.save();
  await newlisting.save();
  req.flash("success","new Review created!");
  res.redirect(`/listings/${req.params.id}`);
};


module.exports.reviewDelete = async(req,res)=>{
  let {id, reviewId} = req.params;
  await Listing.findByIdAndUpdate(id,{$pull : {reviews : reviewId}});
  await Review.findByIdAndDelete(reviewId);
  req.flash("success","new Review deleted");
  res.redirect(`/listings/${id}`);
};