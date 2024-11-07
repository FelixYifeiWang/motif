const express = require('express');
const session = require('express-session');
const passport = require('passport');
const authRoutes = require('./routes/auth');
const uploadRoutes = require('./routes/upload');
const path = require('path');
const isLoggedIn = require('../middleware/auth');

// Initialize Express app
const app = express();
require('dotenv').config(); // Load environment variables
const openaiRoutes = require('./routes/openai');
const replicateRoutes = require('./routes/replicate');

app.use('/api/openai', openaiRoutes);
app.use('/api/replicate', replicateRoutes);
app.use('/static', express.static('views'));
// Express session configuration
app.use(session({
  secret: 'your_secret_key',
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

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

