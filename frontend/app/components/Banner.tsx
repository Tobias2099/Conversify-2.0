'use client';
import * as React from 'react';
import { Typography, Box } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';

export default function Banner() {
  return (
    <Box
      sx={{
        width: '100%',
        background: 'linear-gradient(to right, #002D62, #00509E)',
        py: 3,
        boxShadow: 3,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Typography
        variant="h2"
        sx={{
          color: 'white',
          fontWeight: 900,
          letterSpacing: 3,
          textAlign: 'center',
          fontFamily: 'sans-serif',
          transform: 'skewX(-5deg)',
          textShadow: `
            -1px -1px 0 #C0C0C0,
            1px -1px 0 #C0C0C0,
            -1px 1px 0 #C0C0C0,
            1px 1px 0 #C0C0C0,
            2px 2px 8px rgba(0, 0, 0, 0.3)
          `
        }}
      >
        Conversify
      </Typography>
      <ChatIcon
        sx={{
          fontSize: '3.5rem', // match the h2 roughly
          color: '#F8F8F8',
          transform: 'skewX(-5deg)',
          textShadow: `
            -1px -1px 0 #C0C0C0,
             1px -1px 0 #C0C0C0,
            -1px  1px 0 #C0C0C0,
             1px  1px 0 #C0C0C0,
             2px  2px 8px rgba(0, 0, 0, 0.3)
          `
        }}
      />
    </Box>
  );
}