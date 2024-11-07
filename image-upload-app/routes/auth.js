const express = require('express');
const passport = require('passport');
const path = require('path');
const router = express.Router();

router.use('/static', express.static('../views'));
router.use('/assets', express.static(path.join(__dirname, '../views/assets')));

// Initiate Google login
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google callback route
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Redirect to home.html after successful login
    res.sendFile(path.join(__dirname, '../views/index.html'));
  }
);

// Logout route
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

module.exports = router;
