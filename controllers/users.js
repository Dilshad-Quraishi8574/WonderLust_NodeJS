const User = require("../models/user.js");

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// (Render Signup form)
module.exports.renderSignupForm=(req,res)=>{
    res.render("user/signup.ejs");
}
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// (Submit Form POST(SIGNUP))
module.exports.signup=async (req, res) => {
    let { username, email, password, first_name, last_name, mobile_number } = req.body;
    const newUser = new User({ username, email, first_name, last_name, mobile_number });
    try {
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser,(err)=>{
            if(err){
                next();
            }
            req.flash("success","Welcome to the Wonderlust");
            res.redirect("/listings");
        })
         // Redirect to the login page after successful signup
    } catch (error) {
        console.error(error);
        req.flash("error", "Failed to register user");
        res.redirect("/signup");
    }
}
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// (Login)
module.exports.renderLoginForm=(req,res)=>{
    res.render("user/login.ejs");
}
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// (User login check user register or not )
// Using middleware passport check authenticate or not
module.exports.login=async(req,res)=>{
    req.flash("success","Welcome to the Wonderful website");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
 
 }

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// (Logout user)
module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Logged You out");
        res.redirect("/listings");
    })
}