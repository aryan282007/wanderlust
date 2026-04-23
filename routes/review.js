//review
const express = require("express");
const router = express.Router({ mergeParams: true });
const asyncWrap = require("../utils/asyncWrap.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../modals/review.js");
const Listing = require("../modals/listing.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controller/reviews.js"); 

router.post("/",isLoggedIn,validateReview,asyncWrap(reviewController.createReview));

//delete review
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,asyncWrap(reviewController.reviewDelete));

module.exports = router;