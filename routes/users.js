const express = require("express");
const router = express.Router();
const passport = require("passport");

//Encrypt Password
const bcrypt = require("bcryptjs");

//User Model
const User = require("../models/User");

//Login Page
router.get("/login", (req, res) => {
  res.render("login");
});
//Login Handler

//Register Page
router.get("/register", (req, res) => {
  res.render("register");
});

//Register Handler
router.post("/register", (req, res) => {
  // const user = new User({
  //   name: req.body.username,
  //   email: req.body.email,
  //   password: req.body.password
  // });

  const { name, email, password, password2 } = req.body;
  let errors = [];

  //Check required fields
  if (!name || !email || !password || !password2) {
    errors.push({ msg: "please fill all fields" });
  }
  if (password != password2) {
    errors.push({ msg: "passwords dont match" });
  }
  if (password.length < 6) {
    errors.push({ msg: "password should be at least 6 characters" });
  }
  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    //Validation passed
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: "User already exists." });

        if (errors.length > 0) {
          res.render("register", {
            errors,
            name,
            email,
            password,
            password2
          });
        }
      } else {
        //Hash Password
        const encryptedPass = bcrypt.hashSync(password, 10);
        const user = new User({
          name: name,
          email: email,
          password: encryptedPass
        });
        user.save();
        req.flash(
          "success_msg",
          "You are succesfully registered.You can Login now!"
        );
        res.redirect("login");
      }
    });
  }
});

//Login Handle
router.post("/login", function(req, res, next) {
  passport.authenticate("local", {
    successRedirect: "../dashboard",
    failureRedirect: "login",
    failureFlash: true
  })(req, res, next);
  console.log(req.flash());
});

// Logout
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/users/login");
});

module.exports = router;
