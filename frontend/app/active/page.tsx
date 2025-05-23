'use client';
import React, { useState } from 'react';
import { Stack, Typography, Button, Box } from '@mui/material';
import AudioVisualizer from './components/AudioVisualizer';
import Transcript from './components/Transcript';
import AudioRecorder from './components/AudioRecorder';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function Active() {
  const [isRecording, setRecording] = useState(false);
  const [messageList, setMessageList] = useState([]);

  const handleTranscript = async (text: string) => {
    console.log("🧠 handleTranscript fired:", text);
  
    const userMessage = { sender: 'user', text };
  
    let aiReply = "";
  
    try {
      const response = await fetch('http://localhost:5000/api/cohere/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: [...messageList, userMessage], // okay to use for the request
        }),
      });
  
      const data = await response.json();
      aiReply = data.reply;
    } catch (err) {
      console.error('🛑 Error getting AI response:', err);
      aiReply = "Sorry, I couldn’t generate a response.";
    }
  
    // ✅ Only update once, preserving full history
    setMessageList(prev => [
      ...prev,
      userMessage,
      { sender: 'ai', text: aiReply }
    ]);
  };  

  const primaryColor = '#002D62';
  const hoverColor = '#00509E';

  const baseButtonStyle = {
    minWidth: '20%',
    py: '1%',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: primaryColor,
    borderRadius: 2,
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: hoverColor,
      transform: 'translateY(-2px)',
    },
    textTransform: 'none',
  };

  const recordButtonStyle = {
    ...baseButtonStyle,
    backgroundColor: isRecording ? '#C62828' : '#0066b2',
    '&:hover': {
      backgroundColor: isRecording ? '#B71C1C' : '#00509E',
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '75vh',
        height: '75vh',
        justifyContent: 'space-between',
        padding: '2%',
        backgroundColor: '#f9f9f9',
      }}
    >
      <Box sx={{ position: 'absolute', top: 20, left: 10 }}>
      <Button
        variant="text"
        onClick={() => window.location.href = '/'}
        sx={{
          color: 'white',
          fontWeight: 'bold',
          fontSize: '1rem',
          textTransform: 'none',
          zIndex: 10000
        }}
        startIcon={<ArrowBackIcon />}
      />
    </Box>
      <Stack direction="row" sx={{height: '100%', pb: '2%'}}>
        <Stack sx={{width: '30%'}} alignItems="center" justifyContent="center" spacing={0}>
          <AudioVisualizer isRecording={isRecording}/>
          <AudioRecorder isRecording={isRecording} onTranscript={handleTranscript}/>
        </Stack>
        <Stack sx={{width: '70%'}} alignItems="left" justifyContent="center">
          <Transcript messages={messageList}/>
          <Button variant="contained" sx={{backgroundColor: 'green', ml: 'auto', mr: '7%', textTransform: 'none'}}>Speech Score: 99%</Button>
        </Stack>
      </Stack>

      <Stack direction="row" spacing={3} justifyContent="center">
        <Button
          sx={recordButtonStyle}
          variant="contained"
          onClick={() => setRecording(!isRecording)}
        >
          {isRecording ? 'Stop' : 'Record'}
        </Button>

        <Button sx={baseButtonStyle} variant="contained">
          End Conversation
        </Button>

        <Button sx={baseButtonStyle} variant="contained">
          Hide Transcript
        </Button>
      </Stack>
    </Box>
  );
}
