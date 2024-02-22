const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Reviews
//(Post Review Route)
module.exports.createReview=async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    console.log(listing);
    let newReview = new Review(req.body.review);
    newReview.author= req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    // res.send("Saved")  // First response
    req.flash("success","New Review Created");
    res.redirect(`/listings/${listing._id}`);  // Second response (causing the error)
 }

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// (Delete Review Route:)
module.exports.destroyReview=async(req,res)=>{
    let { id, reviewId } = req.params;
   
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    req.flash("success","Review Deleted");
    res.redirect(`/listings/${id}`);
}