import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

router.post('/generate', async (req, res): Promise<any> => {
  const { message, history } = req.body;

  if (!message || !Array.isArray(history)) {
    return res.status(400).json({ error: "Missing message or conversation history" });
  }

  const systemPrompt = `
  You are a friendly and casual conversation partner. Speak naturally, like a human.
  Keep your responses short, engaging, and emotionally intelligent.
  Avoid repeating what the user says. Pretend that you are not an AI.
  Answer questions like an ordinary human would, make things up if you have to.
  Ask relevant follow-up questions occasionally to keep the conversation flowing.
  `;

  const promptLines = [
    systemPrompt.trim(),
    ...history.map((line: { sender: string, text: string }) =>
      `${line.sender.toLowerCase()}: ${line.text}`
    ),
    `user: ${message}`,
    'ai:'
  ];

  const prompt = promptLines.join('\n');
  console.log("📝 Sent prompt:", prompt);


  try {
    const response = await axios.post(
      'https://api.cohere.ai/generate',
      {
        model: "command",
        prompt,
        max_tokens: 100,
        temperature: 0.7,
        stop_sequences: ["user:"],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("📦 Cohere response data:", response.data);
    const generatedText = response.data.text?.trim();

    if (!generatedText) {
      console.error("Cohere error: No text was generated.");
      return res.status(500).json({ error: "No text generated from Cohere." });
    }

    res.status(200).json({ reply: generatedText });

  } catch (error) {
    console.error("Cohere error: ", error);
    res.status(500).json({ error: "Failed to generate response" });
  }
});

export default router;
