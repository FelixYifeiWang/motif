const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
const { saveImageData, getUserImages } = require('../models/dynamoDB');
const router = express.Router();
const path = require('path');
const isLoggedIn = require('../middleware/auth'); // Middleware to protect routes

// Configure Multer for file upload
const upload = multer({
  storage: multer.memoryStorage(), // store in memory temporarily
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

const s3 = new AWS.S3();

// router.get('/', isLoggedIn, (req, res) => {
//   res.render('upload');  // This serves the upload.ejs page (or upload.html if you use static HTML)
// });
router.get('/', isLoggedIn, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/upload.html'));
});

router.post('/', isLoggedIn, upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Please upload a file' });
  }

  const fileContent = req.file.buffer;
  const fileName = `${req.user.google_id}/${Date.now()}_${req.file.originalname}`;

  // S3 Upload parameters
  const params = {
    Bucket: 'motif-user-images', // replace with your bucket name
    Key: fileName,                // File name you want to save as in S3
    Body: fileContent,
    ContentType: req.file.mimetype,
    // ACL: 'public-read',           // Makes the file publicly accessible
  };

  try {
    // Upload the image to S3
    console.log(`Upload started`)
    const data = await s3.upload(params).promise();
    console.log(`File uploaded successfully. ${data.Location}`);

    // Save image data in DynamoDB
    await saveImageData(req.user.google_id, fileName, data.Location);

    res.status(200).json({ message: 'Image uploaded successfully', imageUrl: data.Location });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Failed to upload image' + String(error)});
  }
});

router.get('/list', isLoggedIn, async (req, res) => {
  try {
    // Retrieve images for the logged-in user from DynamoDB
    const images = await getUserImages(req.user.google_id);
    
    // Send the list of images as a JSON response
    res.status(200).json(images);
  } catch (error) {
    console.error('Error retrieving images:', error);
    res.status(500).json({ error: 'Failed to retrieve image' });
  }
});

module.exports = router;
