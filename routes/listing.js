const express = require("express");
const { listingSchema } = require("../schema");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/expressError.js");
const{isLoggedIn,isOwner,validateListing}= require("../middleware.js");
const listingController = require("../controllers/listing.js");
const{storage}  = require("../cloudConfig.js");
const multer  = require('multer');
const upload = multer({ storage });

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// (Router.router are used used Get and Post Method)
router
   .route("/")
   .get(wrapAsync(listingController.index))
   .post(
   isLoggedIn,
   upload.single("listing[image]"),
   validateListing,
   wrapAsync(listingController.createListing)
   );


// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// (Index Route)
// Get  /listing --> all Listing
// router.get(
//   "/",
//   wrapAsync(listingController.index)
// );

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// (Listing/new-->render New Form Oopen)
router.get("/new",isLoggedIn,listingController.renderNewForm);

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// (Show specific Listings)
router.get("/:id",
wrapAsync(listingController.showListing)
);

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// (New Create Route Another method used in wrapAsyn avoid try and catch)
// router.post(
//   "/",
//   isLoggedIn,
//   validateListing,
//   wrapAsync(listingController.createListing)
//   .post(upload.single("listing[image]"),(req,res)=>{
//     req.send("req.file")
//   }
//   )
// );
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// (Edit Route -->show route send the request);
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// (Update Specific Listing Detail)
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(listingController.updateListing)
);
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// (Delete)
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.destroyListing)
);

module.exports = router;
