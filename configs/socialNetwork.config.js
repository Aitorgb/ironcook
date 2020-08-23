const passport = require("passport");
const User = require("../models/user.model");
const FacebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const Google = new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  (accessToken, refreshToken, profile, next) => {
    
    User.findOne({ "social.google": profile.id })
      .then((user) => {
        if (user) {
          next(null, user);
        } else {
        User.deleteOne({email : `${profile.emails[0].value}`})
          .then(() => {
                  const newUser = new User({
                  name: profile.displayName,
                  username: profile.emails[0].value.split("@")[0],
                  email: profile.emails[0].value,
                  avatar: profile.photos[0].value,
                  password:
                    profile.provider + Math.random().toString(36).substring(7),
                  social: {
                    google: profile.id,
                  },
                });
      
                newUser
                  .save()
                  .then((user) => {
                    next(null, user);
                  })
                  .catch((err) => next(err))
         })
      .catch((err) => next(err));
      }
    });
});

passport.use(Google)

module.exports = passport.initialize()