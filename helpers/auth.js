module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("error_msg", "YOU ARE NOT AUTHORIZED");
    res.redirect("/users/login");
  }
}