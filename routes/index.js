const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");
const { redirectAuth } = require("../config/redirectAuth");

router.get("/", redirectAuth, (req, res) => {
  res.render("welcome");
});

router.get("/dashboard", ensureAuthenticated, (req, res) => {
  res.render("dashboard", {
    name: req.user.name
  });
});

router.get("/settings", ensureAuthenticated, (req, res) => {
  res.render("settings", {
    user: req.user,
    name: req.user.name
  });
});
module.exports = router;
