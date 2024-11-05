const express = require('express');
const { saveImageData, getUserImages } = require('../models/dynamoDB');
const router = express.Router();
const isLoggedIn = require('../middleware/auth'); // Middleware to protect routes

// Route to display user's uploaded images
router.get('/', isLoggedIn, async (req, res) => {
  const images = await getUserImages(req.user.google_id);
  res.send(images);  // Replace with your front-end rendering logic
});

// Route to upload images (implement image upload logic here)
router.post('/', isLoggedIn, async (req, res) => {
  // Logic to handle image upload and save it to DynamoDB
});

module.exports = router;

