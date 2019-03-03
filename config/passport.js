const mongoose = require("mongoose");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const firebaseAdmin = require("firebase-admin");

const User = mongoose.model("users");

const options = {};
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
options.secretOrKey = process.env.JWT_SECRET;

module.exports = passport => {
  passport.use(
    new JwtStrategy(options, (jwt_payload, done) => {
      User.findById(jwt_payload.id)
        .then(user => {
          if (user) {
            const uid = user.id;
            // keeping it empty for now.
            // will use this later to populate userType, audience, subscriptions
            const additionalClaims = {};

            firebaseAdmin
              .auth()
              .createCustomToken(uid, additionalClaims)
              .then(firebaseToken => {
                return done(null, {
                  ...user._doc,
                  password: undefined,
                  firebaseToken
                });
              })
              .catch(err => console.log(err));
          } else {
            return done(null, false);
          }
        })
        .catch(err => console.error(err));
    })
  );
};
