const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");
const { redirectAuth } = require("../config/redirectAuth");
const User = require("../models/User");
const ejs = require("ejs");
var fs = require("fs");
//mail library
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  host: process.env.MAILHOST,
  port: process.env.MAILPORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.MAILUSR, // generated ethereal user
    pass: process.env.MAILPW // generated ethereal password
  },
  tls: {
    // do not fail on invalid certs
    rejectUnauthorized: false
  }
});

//Encrypt Password
const bcrypt = require("bcryptjs");
router.get("/", redirectAuth, (req, res) => {
  res.render("welcome");
});
router.get("/cron", ensureAuthenticated, (req, res) => {
  var CronJob = require("cron").CronJob;
  var job = new CronJob(
    "* * * * * *",
    () => {
      console.log("You will see this message every second");
    },
    null,
    true,
    "America/Los_Angeles"
  );
  job.start();

  res.redirect("dashboard");
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

router.get("/mail", ensureAuthenticated, async (req, res) => {
  const data = await ejs.renderFile(__dirname + "/../views/mail.ejs", {
    name: "test"
  });

  const mailOptions = {
    from: process.env.MAILUSR,
    to: process.env.MAILUSR,
    subject: "Sending Email using Node.js",
    html: data
  };
  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
  req.flash("success_msg", "mail sent");
  res.redirect("dashboard");
});

module.exports = router;
