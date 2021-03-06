module.exports = {
  redirectAuth: async (req, res, next) => {
    if (req.path == "/logout") return next();
    if (await req.isAuthenticated()) {
      res.render("dashboard", {
        name: req.user.name
      });
    } else {
      next();
    }
  }
};
