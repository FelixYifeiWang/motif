// routes/openai.js
const express = require('express');
const multer = require('multer');
const OpenAI = require('openai'); // Import the OpenAI class
const { z } = require("zod");
const { zodResponseFormat } = require("openai/helpers/zod");
const router = express.Router();

// Configure multer to handle multiple image uploads
const upload = multer({ storage: multer.memoryStorage() });

// Initialize OpenAI SDK
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY }); // Ensure your API key is passed here

const Feedback = z.object({
  designer: z.string(),
  description: z.string(),
  compliment: z.string(),
  tags: z.array(z.string()),
});

// POST route to analyze up to three images in one request
router.post('/analyze-images', upload.array('images', 3), async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'Please upload up to three images.' });
  }

  try {
    // Construct the content array with text prompt and multiple image URLs
    const content = [{ type: "text", text: "this is a game of finding which fashion designer are you based on your ootd. I am going to upload 1 to 3 images of my outfit. Do the following based on the picture inputs. First, output a famous fashion designer that best matches my style. Then, give one sentence describing of the designer's style, and another insightful sentence of the designer's era and history, within 180-200 characters. After this, write a sentence that describes/compliment my outfit, relating it to the fashion designer's style, within to 70-90 characters. Use fashion magazine language that also suits my outfit style. Finally, pick two styles tags out of this list that best matches my outfit '#casual, #edgy, #romantic, #athleisure, #minimalist, #sophisticated, #bohemian, #street, #glam'. Output in json format, split into 'designer name', 'description', 'compliment', and 'tags'." }];

    // Loop through each uploaded file to create an image URL and add it to content
    req.files.forEach(file => {
      const imageDataUrl = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
      content.push({ type: "image_url", image_url: { url: imageDataUrl } });
    });

    // Send a single request to OpenAI with all images
    const response = await openai.beta.chat.completions.parse({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: content,
        },
      ],
      response_format: zodResponseFormat(Feedback, "feedback"),
    });

    // Extract and return the result text
    const resultText = response.choices[0].message.parsed;

    // Send the result back to the client
    res.status(200).json({ results: [resultText] });
  } catch (error) {
    console.error('Error interacting with OpenAI API:', error);
    res.status(500).json({ error: 'Failed to analyze images' });
  }
});

module.exports = router;

