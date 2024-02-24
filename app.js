if(process.env.NODE_ENV != "production"){
  require('dotenv').config()
}
const express = require("express");
const app = express();
const port = 8080;
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = (engine = require("ejs-mate"));
var methodOverride = require("method-override");
const ExpressError = require("./utils/expressError.js");
const routeListings = require("./routes/listing.js");
const routeReviews = require("./routes/review.js");
const routeUser = require("./routes/user.js")
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
// const MONGO_URL = "mongodb://127.0.0.1:27017/airbnb";
const dbUrl = process.env.ATLASDB_URL;
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// (middleware)
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use('/img', express.static('img'));
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));
// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(methodOverride("_method"));


// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// (Connections Database Successfully Connect)
main()
  .then(() => {
    console.log("Connections database Successfully");
  })
  .catch((err) => console.log(err));

  async function main() {
    // await mongoose.connect(MONGO_URL);
    await mongoose.connect( dbUrl);
  }


// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// (Connect-mongo)
const store=MongoStore.create({ 
  mongoUrl:  dbUrl ,
  crypto:{
    secret: process.env.SECRET,
  },
  touchAfter:24*3600,
})
store.on("error",()=>{
  console.log("Error on the sessong mongo url",err);
})

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// (Express_session--> Adding_Cookies_Option)
const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// (midddlewere used in success and error)
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// (Listing All data --> routes/listing.js)
app.get("/", (req, res) => {
  res.redirect("/listings");
});
app.use("/listings", routeListings);
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// (Review Router All data --> routes/review.js)
app.use("/listings/:id/reviews",routeReviews);
app.use("/",routeUser)







// (Not match any route)
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "page not found"));
});

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Error handling middleware
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// (Check Server work or not)

app.listen(port, () => {
  console.log(`App Listen on the Port ${port}`);
});
