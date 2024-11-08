const express = require('express');
const session = require('express-session');
const passport = require('passport');
const authRoutes = require('./routes/auth');
const uploadRoutes = require('./routes/upload');
const path = require('path');
const isLoggedIn = require('./middleware/auth'); // Middleware to protect routes


// Initialize Express app
const app = express();
require('dotenv').config(); // Load environment variables
const openaiRoutes = require('./routes/openai');
const replicateRoutes = require('./routes/replicate');

app.use('/api/openai', openaiRoutes);
app.use('/api/replicate', replicateRoutes);
app.use('/static', express.static('views'));
app.use('/assets', express.static(path.join(__dirname, 'views/assets')));
// Express session configuration
app.use(session({
  secret: 'motif_secret_key',
  resave: false,
  saveUninitialized: true,
}));

// Passport configuration
require('./config/passport'); // Import passport config
app.use(passport.initialize());
app.use(passport.session());

// Define routes
app.use('/auth', authRoutes);       // Authentication routes
app.use('/upload', uploadRoutes);   // Image upload routes

app.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    // If the user is authenticated, send them to home.html
    res.sendFile(path.join(__dirname, '/views/home.html'));
  } else {
    // If the user is not authenticated, send them to index.html
    res.sendFile(path.join(__dirname, '/views/index.html'));
  }
});

app.get('/home', isLoggedIn, (req, res) => {
  res.sendFile(path.join(__dirname, '/views/home.html'));
});

app.get('/profile', isLoggedIn, (req, res) => {
  res.sendFile(path.join(__dirname, '/views/profile.html'));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

