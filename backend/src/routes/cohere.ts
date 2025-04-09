import express from 'express';
import axios from 'axios'
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.post('/generate', async (req, res) : Promise<any> => {
  const { message, history } = req.body;

  if (!message || !Array.isArray(history)) {
    return res.status(400).json({ error: "Missing message or conversation history" });
  }

  //Formatting prompt
  const promptLines = history.map((line: {speaker: string, text: string }) => `${line.speaker}: ${line.text}`);
  promptLines.push(`User: ${message}`);
  promptLines.push('AI:');

  const prompt = promptLines.join('\n');

  try {
    const response = await axios.post(
      'https://api.cohere.ai/generate',
      {
        model: "command", // or "command-light" for faster response
        prompt,
        max_tokens: 100,
        temperature: 0.7,
        stop_sequences: ["User:"]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    )
    const generatedText = response.data.generations[0].text.trim();
    res.status(200).json({ reply: generatedText });
  } catch (error) {
    console.error("Cohere error: ", error);
    res.status(500).json({error: "Failed to generate response" });
  }
});

export default router;