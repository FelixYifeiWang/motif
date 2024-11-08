const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
const { saveImageData, getUserImages, deleteImageData } = require('../models/dynamoDB');
const router = express.Router();
const path = require('path');
const isLoggedIn = require('../middleware/auth'); // Middleware to protect routes

// Configure Multer for file upload
const upload = multer({
  storage: multer.memoryStorage(), // store in memory temporarily
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

const s3 = new AWS.S3();

router.post('/', isLoggedIn, upload.array('images', 10), async (req, res) => {
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
    await saveImageData(req.user.google_id, fileName, data.Location, ["Yes"]);

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

router.delete('/', isLoggedIn, async (req, res) => {
  const encodedImageId = req.query.imageId;
  if (!encodedImageId) {
    return res.status(400).json({ error: 'Image ID is required' });
  }

  const imageId = decodeURIComponent(encodedImageId); // Decode the image ID to get the full path
  const userId = req.user.google_id;

  const s3Params = {
    Bucket: 'motif-user-images',
    Key: imageId,
  };

  try {
    // Delete the image from S3
    await s3.deleteObject(s3Params).promise();
    console.log(`Image ${imageId} deleted from S3`);

    // Delete the image metadata from DynamoDB
    await deleteImageData(userId, imageId);
    console.log(`Image ${imageId} metadata deleted from DynamoDB`);

    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ error: 'Failed to delete image'+String(error) });
  }
});


module.exports = router;
