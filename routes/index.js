const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");
const { redirectAuth } = require("../config/redirectAuth");
const User = require("../models/User");
//Encrypt Password
const bcrypt = require("bcryptjs");
router.get("/", redirectAuth, (req, res) => {
  res.render("welcome");
});

router.get("/dashboard", ensureAuthenticated, (req, res) => {
  req.session.name = req.user.name;
  res.locals.name = req.user.name;
  res.render("dashboard");
});

router.get("/settings", ensureAuthenticated, (req, res) => {
  res.render("settings", {
    user: req.user
  });
});
router.post("/change_settings", ensureAuthenticated, async (req, res) => {
  const { email, password, password2 } = req.body;
  let errors = [];

  //Check required fields
  if (!email || !password || !password2) {
    errors.push({ msg: "please fill all fields" });
  }
  if (password != password2) {
    errors.push({ msg: "passwords dont match" });
  }
  if (password.length < 6) {
    errors.push({ msg: "password should be at least 6 characters" });
  }
  if (errors.length > 0) {
    res.render("settings", {
      user: req.user,
      errors,
      email,
      password,
      password2
    });
  } else {
    //Validation passed

    //Hash Password
    const encryptedPass = bcrypt.hashSync(password, 10);
    const user = await User.updateOne(
      { email: email },
      {
        $set: {
          email: email,
          password: encryptedPass
        }
      }
    );
    req.flash("success_msg", "Account Settings Updated");
    res.redirect("settings");
  }
  //   res.render("settings", {
  //   user: req.user
  // });
});
module.exports = router;
