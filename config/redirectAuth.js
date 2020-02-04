module.exports = {
  redirectAuth: async (req, res, next) => {
    if (req.path == "/logout") return next();
    if (await req.isAuthenticated()) {
      res.render("dashboard", {
        name: req.user.name
      });
    }

    req.flash("error_msg", "Please log in to view this resource");
    next();
  }
};
