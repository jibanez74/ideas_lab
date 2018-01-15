//file to setup local strategy for login
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

//load schema for users
const User = mongoose.model("users");

//export function to the app.js file with local strategy to sign in
module.exports = function(passport){
  passport.use(new LocalStrategy({usernameField: 'email'} , (email, password, done) => {
    //match user
    User.findOne({
      email: email
    }).then((user) => {
      if (!user) {
        return done(null,false, {message: "No user with that email"});
      }

      //match password using bcrypt
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, {message: "Incorrect password"});
        }
      })
    })
  }));

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
}