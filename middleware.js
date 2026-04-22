const Listing = require("./modals/listing.js");
const reviewSch = require("./modals/review.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema,reviewSchema } = require("./schema.js");
const Review = require("./modals/review.js");
const review = require("./modals/review.js");

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
    let listing_ = await Listing.findById(id);
    if(!listing_.owner._id.equals(res.locals.currentUser._id)){
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
    let reviewV = await reviewSch.findById(reviewId);
    if(!reviewV.author.equals(res.locals.currentUser._id)){
      req.flash("error","you don't have ownerShip of this review!");
      return res.redirect(`/listings/${id}`);
    }
    next();
  }