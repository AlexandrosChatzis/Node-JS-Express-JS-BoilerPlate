const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

//User Model
const User = require("../models/User");

const passport = passport => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email"
      },
      (email, password, done) => {
        //Match User
        User.findOne({ email: email })
          .then(user => {
            if (!user) {
              return done(null, false, { message: "not found" });
            }
            //Match Password   plain,hash
            const dotheymatch = bcrypt.compareSync(password, user.password);
            if (dotheymatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: "wrong password" });
            }
          })
          .catch(err => console.log(err));
      }
    )
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};

module.exports = passport;
