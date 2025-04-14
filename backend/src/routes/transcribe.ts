import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { SpeechClient } from '@google-cloud/speech';

const router = express.Router();

const upload = multer({ dest: 'uploads/'}); //temp folder

const client = new SpeechClient(); // no need to pass keyFilename

router.post('/', upload.single('audio'), async (req, res) : Promise<any> => {
  try {
    const filePath = req.file?.path;
    if (!filePath) return res.status(400).json({ error: 'No audio file uploaded' });

    const file = fs.readFileSync(filePath);
    const audioBytes = file.toString('base64');

    const [response] = await client.recognize({
      audio: { content: audioBytes },
      config: {
        encoding: 'WEBM_OPUS',
        sampleRateHertz: 48000,
        languageCode: 'en-US' //CHANGE ACCORDINGLY
      }
    });

    fs.unlinkSync(filePath); //Clean up temp file

    const transcript = response.results?.map(result => result.alternatives?.[0].transcript).join(' ').trim();

    res.status(200).json({ transcript: transcript || ''});
  } catch (err) {
    console.error('Google Speech API error:', err);
    res.status(500).json({ error: 'Transcription failed' });
  }
});

export default router;