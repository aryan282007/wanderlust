const Listing = require("./modals/listing.js");
const reviewSch = require("./modals/review.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema,reviewSchema } = require("./schema.js");

module.exports.isLoggedIn = (req,res,next)=>{
  if(!req.isAuthenticated()){
    req.session.redirectUrl = req.originalUrl;
    req.flash("error","You must be signed in to create a listing!");
    return res.redirect("/login");
  }
  next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
  if( req.session.redirectUrl){
    res.locals.redirectUrl =  req.session.redirectUrl;
    delete req.session.redirectUrl;
  }
   next();
}

module.exports.isOwner = async (req,res,next)=>{
  let {id} = req.params;
  if(!req.user){
    req.flash("error","You must be signed in!");
    return res.redirect("/login");
  }
  let listing_ = await Listing.findById(id);
  if(!listing_){
    req.flash("error","Listing not found!");
    return res.redirect("/listings");
  }
  if(!listing_.owner || !listing_.owner.equals(req.user._id)){
    req.flash("error","you don't have ownerShip of this listing!");
    return res.redirect(`/listings/${id}`);
  }
  next();
}

module.exports.validateListing = (req,res,next) =>{
  const { error } = listingSchema.validate(req.body);
  if(error){
    const errMsg = error.details.map(el => el.message).join(",");
    throw new ExpressError(errMsg,400);
  }
  next();
}
  
module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);

  if (!error) return next();

  return next(new ExpressError(
    error.details.map(el => el.message).join(","), 
    400
  ));
};

module.exports.isReviewAuthor = async (req,res,next)=>{
  let {id, reviewId} = req.params;
  if(!req.user){
    req.flash("error","You must be signed in!");
    return res.redirect("/login");
  }
  let reviewV = await reviewSch.findById(reviewId);
  if(!reviewV){
    req.flash("error","Review not found!");
    return res.redirect(`/listings/${id}`);
  }
  if(!reviewV.author || !reviewV.author.equals(req.user._id)){
    req.flash("error","you don't have ownerShip of this review!");
    return res.redirect(`/listings/${id}`);
  }
  next();
}
