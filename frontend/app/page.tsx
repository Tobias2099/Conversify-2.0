'use client';
import React, { useState, useEffect } from 'react';
import { Stack, Button, Typography, TextField } from '@mui/material';

export default function Home() {
  const buttonSpacing = 2;

  const primaryColor = '#002D62';
  const hoverColor = '#00509E';

  const settingPlaceholders = [
    "Ordering at a restaurant",
    "Interviewing for a job",
    "Meeting someone new at a party",
    "Asking for directions in a city"
  ];

  const [placeholder, setPlaceholder] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedProficiency, setSelectedProficiency] = useState('');
  const [conversationSetting, setConversationSetting] = useState('');

  useEffect(() => {
    const random = Math.floor(Math.random() * settingPlaceholders.length);
    setPlaceholder(settingPlaceholders[random]);
  }, []);

  // 🔹 Button styling helper
  const getButtonStyle = (isSelected: boolean) => ({
    color: isSelected ? 'white' : primaryColor,
    borderColor: isSelected ? hoverColor : primaryColor,
    backgroundColor: isSelected ? hoverColor : 'transparent',
    fontWeight: 'bold',
    fontSize: '1rem',
    px: 3,
    py: 1.25,
    '&:hover': {
      backgroundColor: hoverColor,
      color: 'white',
      borderColor: hoverColor,
    }
  });

  const handleLaunch = async () => {
    if (!selectedLanguage || !selectedProficiency) {
      alert("Please select both a language and a proficiency level.");
      return;
    }

    const settings = {
      language: selectedLanguage,
      proficiency: selectedProficiency,
      conversationSetting: conversationSetting,
    };

    try {
      const res = await fetch("http://localhost:5000/api/settings", {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        credentials: 'include',
        body: JSON.stringify(settings)
      })

      if (!res.ok) {
        throw new Error("Failed to save settings.");
      }

      window.location.href='/active';
    } catch (err) {
      console.error(err);
      alert("Failed to launch the conversation. Please try again.");
    }
  }

  return (
    <Stack
      sx={{
        border: `2px solid ${primaryColor}`,
        borderRadius: 3,
        margin: '40px auto',
        width: '80%',
        padding: 4,
        py: '2%',
        boxShadow: 3,
        backgroundColor: '#f0f4f8',
        gap: 4,
        mt: '4.5%'
      }}
      spacing={1.5}
    >
      {/* Language Section */}
      <Stack spacing={2}>
        <Typography variant="h6" color={primaryColor}>Select language:</Typography>
        <Stack direction="row" spacing={buttonSpacing} flexWrap="wrap">
          {['English', 'French', 'Spanish', 'Mandarin'].map((lang) => (
            <Button
              key={lang}
              variant="outlined"
              sx={getButtonStyle(selectedLanguage === lang)}
              onClick={() => setSelectedLanguage(lang)}
            >
              {lang}
            </Button>
          ))}
        </Stack>
      </Stack>

      {/* Proficiency Section */}
      <Stack spacing={2}>
        <Typography variant="h6" color={primaryColor}>Select proficiency:</Typography>
        <Stack direction="row" spacing={buttonSpacing} flexWrap="wrap">
          {['Beginner', 'Intermediate', 'Advanced', 'Expert'].map((level) => (
            <Button
              key={level}
              variant="outlined"
              sx={getButtonStyle(selectedProficiency === level)}
              onClick={() => setSelectedProficiency(level)}
            >
              {level}
            </Button>
          ))}
        </Stack>
      </Stack>

      {/* Conversation Setting */}
      <Stack spacing={1}>
        <Typography variant="h6" color={primaryColor}>
          Conversation setting (optional):
        </Typography>
        <TextField
          multiline
          rows={5}
          placeholder={placeholder}
          fullWidth
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: primaryColor,
              },
              '&:hover fieldset': {
                borderColor: hoverColor,
                boxShadow: '0 0 4px rgba(0,80,158,0.2)'
              },
              '&.Mui-focused fieldset': {
                borderColor: hoverColor,
              },
            }
          }}
          onChange={(event) => setConversationSetting(event.target.value)}
          value={conversationSetting}
        />
      </Stack>

      {/* Launch Button */}
      <Button
        variant="contained"
        sx={{
          alignSelf: 'flex-end',
          width: 'fit-content',
          px: 4,
          py: 1.5,
          fontWeight: 'bold',
          color: 'white',
          backgroundColor: hoverColor,
          '&:hover': {
            background: primaryColor
          }
        }}
        onClick={handleLaunch}
      >
        Launch
      </Button>
    </Stack>
  );
}