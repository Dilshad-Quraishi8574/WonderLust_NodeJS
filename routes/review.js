const express = require("express");
// const { listingSchema } = require("../schema");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError= require("../utils/expressError.js");
const{reviewSchema}=require("../schema.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const{validateReview,isLoggedIn,isReviewAuthor}= require("../middleware.js");
const reviewController = require("../controllers/reviews.js");
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// (Review Router)
// (Review Router)
router.post("/",
isLoggedIn,
validateReview,
wrapAsync(reviewController.createReview)
);

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// (Delete Reveiw)
// Delete Review
router.delete("/:reviewId", 
isReviewAuthor,
wrapAsync(reviewController.destroyReview));


module.exports=router;