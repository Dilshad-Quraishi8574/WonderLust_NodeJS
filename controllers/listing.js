const Listing = require("../models/listing.js");
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// (Mapbox GeoCoding)
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  const allListing = await Listing.find({});
  res.render("listings/index.ejs", { allListing });
};

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// (Listing/new) -->(New Render Form)
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

//   +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// (Show Listing)
module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  console.log("Show", listing);
  if (!listing) {
    req.flash("error", "Listing does not exist");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// (New Create Route)
module.exports.createListing = async (req, res) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();
  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
    newListing.owner= req.user._id;
    newListing.image={url , filename}
    newListing.geometry=response.body.features[0].geometry;
    // console.log(newListing.owner);
    let savedListing =await newListing.save();
    console.log(savedListing);
    req.flash("success","New Listing are created");
    res.redirect("/listings");
  }
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// (Edit Route -->show route send the request);
module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  console.log(listing);
  if (!listing) {
    req.flash("error", "Listing does not exist");
    return res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl.replace("/upload", "/upload/h_300,w_250");
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// (update Route -->updateListing);
module.exports.updateListing = async (req, res) => {
  let { id } = req.params; //id->65ca17e28a49cfa0c4281b77
  let updateListing = await Listing.findByIdAndUpdate(id, {
    ...req.body.listing,
  });
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    updateListing.image = { url, filename };
    await updateListing.save();
  }
  // console.log("Welcome Update Data ", updateListing);
  req.flash("success", "New Listed Updated");
  res.redirect(`/listings/${id}`);
};

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// (Delete Route -->Destroy Listing Route)
module.exports.destroyListing = async (req, res, next) => {
  let { id } = req.params;
  let deleteListing = await Listing.findByIdAndDelete(id);
  // console.log("Delete Data ", deleteListing);
  req.flash("success", " Listing Deleted");
  res.redirect(`/listings`);
};
