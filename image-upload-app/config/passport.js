const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { saveUserToDynamoDB } = require('../models/dynamoDB');

// Serialize and deserialize user information
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

const now = new Date();
// Set up Google OAuth strategy
passport.use(new GoogleStrategy({
  clientID: '274022818559-ea6ef22vv6li95t754epb48ug70hoh4m.apps.googleusercontent.com',
  clientSecret: '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',
  callbackURL: 'http://motif-official.com/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  const user = {
    google_id: profile.id,
    name: profile.displayName,
    email: profile.emails[0].value,
    // join_time: now.toISOString().split('T')[0],
    // styles: {
    //   "casual": 0,
    //   "edgy": 0,
    //   "minimalist": 0,
    //   "sophisticated": 0,
    //   "athleisure": 0,
    //   "romantic": 0,
    //   "bohemian": 0,
    //   "street": 0,
    //   "glam": 0
    // }
  };

  // Save user to DynamoDB if new
  await saveUserToDynamoDB(user);
  return done(null, user);
}));

module.exports = passport;

