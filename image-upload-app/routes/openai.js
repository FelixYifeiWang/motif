// routes/openai.js
const express = require('express');
const multer = require('multer');
const OpenAI = require('openai'); // Import the OpenAI class
const router = express.Router();

// Configure multer to handle multiple image uploads
const upload = multer({ storage: multer.memoryStorage() });

// Initialize OpenAI SDK
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY }); // Ensure your API key is passed here

// POST route to analyze up to three images in one request
router.post('/analyze-images', upload.array('images', 3), async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'Please upload up to three images.' });
  }

  try {
    // Construct the content array with text prompt and multiple image URLs
    const content = [{ type: "text", text: "this is a game of finding which fashion designer are you based on your ootd. I am going to upload few images of my outfit. based on the pictures, output a famous fashion designer that best matches my style, give a two sentence description of the designer's style, begin with 'your style best matches...' and another outlining the history of this designer, then a last sentence that describes/compliment my outfit, relate it to the fashion designer's style. Use fashion magazine language that also suits my outfit style. Please limit to 200 characters. After this, output three fashion style hashtags for my outfit. For these hashtags, please use one word or phrase and do NOT combine two words into one." }];

    // Loop through each uploaded file to create an image URL and add it to content
    req.files.forEach(file => {
      const imageDataUrl = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
      content.push({ type: "image_url", image_url: { url: imageDataUrl } });
    });

    // Send a single request to OpenAI with all images
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: content,
        },
      ],
    });

    // Extract and return the result text
    const resultText = response.choices[0].message.content;

    // Send the result back to the client
    res.status(200).json({ results: [resultText] });
  } catch (error) {
    console.error('Error interacting with OpenAI API:', error);
    res.status(500).json({ error: 'Failed to analyze images' });
  }
});

module.exports = router;

