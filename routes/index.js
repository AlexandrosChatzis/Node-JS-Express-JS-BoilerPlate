const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");
const { redirectAuth } = require("../config/redirectAuth");

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
module.exports = router;
