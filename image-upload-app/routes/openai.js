// routes/openai.js
const express = require('express');
const multer = require('multer');
const OpenAI = require('openai'); // Import the OpenAI class
const router = express.Router();

// Configure multer to handle multiple image uploads
const upload = multer({ storage: multer.memoryStorage() });

// Initialize OpenAI SDK
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY }); // Ensure your API key is passed here

// POST route to analyze up to three images
router.post('/analyze-images', upload.array('images', 3), async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'Please upload up to three images.' });
  }

  try {
    // Process each image in the request
    const results = await Promise.all(
      req.files.map(async (file) => {
        // Convert the image buffer to a base64-encoded URL to use as a data URI
        const imageDataUrl = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

        // Send request to OpenAI API for each image
        const response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: "What’s in this image?" },
                { type: "image_url", image_url: { url: imageDataUrl } },
              ],
            },
          ],
        });

        // Extract and return the result text
        return response.choices[0].message.content;
      })
    );

    // Send all text results back as an array
    res.status(200).json({ results });
  } catch (error) {
    console.error('Error interacting with OpenAI API:', error);
    res.status(500).json({ error: 'Failed to analyze images' });
  }
});

module.exports = router;

