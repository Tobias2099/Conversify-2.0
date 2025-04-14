'use client';
import React from 'react';
import { Box, Typography, Paper, Stack } from '@mui/material';
import { Message } from './Message';


export default function Transcript({ messages }: { messages: Message[] }) {
  return (
    <Box
      sx={{
        width: '90%',
        height: '45vh', // or 300px, 500px — whatever fits your layout
        maxHeight: '45vh',
        overflowY: 'auto',
        backgroundColor: '#f2f2f2',
        borderRadius: 2,
        p: 2,
        boxShadow: 1,
      }}
    >
      <Stack spacing={2}>
        {messages.map((msg, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            <Paper
              elevation={1}
              sx={{
                maxWidth: '70%',
                p: 1.5,
                borderRadius: 3,
                bgcolor: msg.sender === 'user' ? '#002D62' : '#F9F4E6',
                color: msg.sender === 'user' ? '#FFFFFF' : '#002D62',
                fontSize: '1rem',
              }}
            >
              <Typography>{msg.text}</Typography>
            </Paper>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
