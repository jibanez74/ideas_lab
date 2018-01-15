//node modules
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");

//load user schema
require("../models/User");
const User = mongoose.model("users");

//login route
router.get("/login", (req, res) => {
  res.render("users/login");
});

//user register route
router.get("/register", (req, res) => {
  res.render("users/register");
});

//register form post route
router.post("/register", (req, res) => {
  //register form validation
  let errors = [];
  let emailVal = req.body.register_email;
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  
  if (req.body.register_name.length < 2 || req.body.register_name > 25) {
    errors.push({text: "Your name must be at least 2 characters long and no more than 25"});
  }

  if (!re.test(emailVal)) {
    errors.push({text: "Please enter a valid email"});
  }

  if (req.body.register_password.length < 4) {
    errors.push({text: "Password must be at least 4 characters long"});
  }

  if (req.body.register_password != req.body.reenter_password) {
    errors.push({text: "Passwords do not match"});
  }

  if (errors.length > 0) {
    res.render("users/register", {
      errors: errors,
      register_name: req.body.register_name,
      register_email: req.body.register_email
    });
  } else {
    User.findOne({
      email: req.body.register_email
    }).then((user) => {
      if (user) {
        req.flash("error_msg", "A user with that email address already exists");
        res.redirect("/users/register");
      } else {
        const new_user = new User({
          name: req.body.register_name,
          email: req.body.register_email,
          password: req.body.register_password
        });

        //encrypt user's password
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(new_user.password, salt, (err, hash) => {
            if (err) throw err;
            new_user.password = hash;
            new_user.save().then((user) => {
              req.flash("success_msg", "You are now registered and can login");
              res.redirect("/users/login");
            }).catch((err) => {
              console.log(err);
              return;
            });
          });
        });
      }
    });
  }
});

//post request to sign in
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/users/login",
    failureFlash: true
  })(req, res, next);
});

//route to logout
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You have logged out");
  res.redirect("/users/login");
});

module.exports = router;