const Listing = require("./models/listing");
const ExpressError = require("./utils/expressError.js");
const { listingSchema,reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    console.log(req.session.redirectUrl);
    
    // When click new listing /listings/new
    req.flash("error", "You must be logged in to create a listing");
    return res.redirect("/login");
  }
  console.log(req.user);
  next();
};

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// (saveRedirectUrl are create the url path and this path are save in savedirectUrl beacuase direct are not access)
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// (Listing Edit or Delete only autorized only owner)
module.exports.isOwner= async(req,res,next)=>{
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if(!listing){
    req.flash("error","Listing does not exist");
    return res.redirect("/listings");
  }
  if(!listing.owner._id.equals(res.locals.currUser._id)){
    req.flash("error","You dont have permission");
    return res.redirect(`/listings/${id}`);
  }
  next();
}

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// (Validate Listing)
module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400, errMsg);
    } else {
      next();
    }
  };
  

  
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// (Review Validate)
module.exports.validateReview = (req, res, next) => {
    console.log("Validating review:", req.body);
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        console.error("Review validation error:", error.message);
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

// (Review Author)
module.exports.isReviewAuthor= async(req,res,next)=>{
  let {id, reviewId} = req.params;
  let review = await Review.findById(reviewId);
  if(!review.author._id.equals(res.locals.currUser._id)){
    req.flash("error","you didn't create this review");
    return res.redirect(`/listings/${id}`);
  }
  next();
}