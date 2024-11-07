// routes/bgremove.js
const express = require('express');
const multer = require('multer');
const Replicate = require('replicate'); // Import Replicate SDK
const fetch = require('node-fetch'); // Import fetch to get image from URL

const router = express.Router();

// Configure multer to handle single image upload
const upload = multer({ storage: multer.memoryStorage() });

// Initialize Replicate SDK
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY, // Ensure your Replicate API key is passed here
});

// Helper function to convert image URL to base64
async function convertImageUrlToBase64(url) {
  const response = await fetch(url);
  const buffer = await response.buffer();
  return `data:image/png;base64,${buffer.toString('base64')}`;
}

// POST route to remove background from a single image
router.post('/remove-bg', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Please upload an image.' });
  }

  try {
    // Convert the uploaded file to a base64-encoded data URL
    const imageDataUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    // Run the Replicate model for background removal
    const outputUrl = await replicate.run(
      "lucataco/remove-bg:95fcc2a26d3899cd6c2691c900465aaeff466285a65c14638cc5f36f34befaf1", 
      { input: { image: imageDataUrl } }
    );

    // Convert the output URL to a base64-encoded string
    const base64Image = await convertImageUrlToBase64(outputUrl);

    // Send the base64-encoded image back to the client
    res.status(200).json({ imageData: base64Image });
  } catch (error) {
    console.error('Error interacting with Replicate API:', error);
    res.status(500).json({ error: 'Failed to remove background' });
  }
});

module.exports = router;