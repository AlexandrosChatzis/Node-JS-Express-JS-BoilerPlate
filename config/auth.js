module.exports = {
  ensureAuthenticated: async (req, res, next) => {
    if (await req.isAuthenticated()) {
      return next();
    }
    req.flash("error_msg", "Please log in to view this resource");
    res.redirect("/login");
  }
};
