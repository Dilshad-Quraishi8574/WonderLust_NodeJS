const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync.js");
const {saveRedirectUrl} = require("../middleware.js")
const userController = require("../controllers/users.js");


// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// (Render Signup form)
router.get("/signup",userController.renderSignupForm);

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// (Signup)
// Route for handling user signup
router.post("/signup",
wrapAsync(userController.signup));


// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// (Login)
router.get("/login",userController.renderLoginForm);

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// (Login)
router.post('/login', 
saveRedirectUrl,
  passport.authenticate('local',
   {failureRedirect: '/login',
   failureFlash:true }),userController.login );

//   ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// (Logout)
router.get("/logout",userController.logout)
module.exports = router;