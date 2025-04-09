'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import VolumeMuteIcon from '@mui/icons-material/VolumeMute';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

export default function AudioVisualizer({ isRecording }: { isRecording: boolean }) {
  const [volume, setVolume] = useState(0);
  const [iconLevel, setIconLevel] = useState<'mute' | 'down' | 'up'>('mute');
  const lastUpdateTimeRef = useRef<number>(Date.now());

  const animationRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  useEffect(() => {
    let dataArray: Uint8Array;
    let mic: MediaStreamAudioSourceNode;
  
    const startMic = async () => {
      try {
        const context = new AudioContext();
        audioContextRef.current = context;
  
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mic = context.createMediaStreamSource(stream);
        const analyser = context.createAnalyser();
        analyser.fftSize = 256;
        dataArray = new Uint8Array(analyser.frequencyBinCount);
        mic.connect(analyser);
        analyserRef.current = analyser;
  
        const animate = () => {
          if (!analyserRef.current) return;
  
          analyser.getByteTimeDomainData(dataArray);
          const normalized = dataArray.reduce((sum, val) => sum + Math.abs(val - 128), 0) / dataArray.length;
          const newVolume = normalized / 128;
          setVolume(newVolume);
  
          let targetLevel: 'mute' | 'down' | 'up' = 'mute';
          if (newVolume >= 0.05) targetLevel = 'up';
          else if (newVolume >= 0.01) targetLevel = 'down';
  
          const now = Date.now();
          if (targetLevel !== iconLevel && now - lastUpdateTimeRef.current > 500) {
            setIconLevel(targetLevel);
            lastUpdateTimeRef.current = now;
          }
  
          animationRef.current = requestAnimationFrame(animate);
        };
  
        animate();
      } catch (err) {
        console.error('Microphone access error:', err);
      }
    };
  
    const stopMic = async () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
  
      if (audioContextRef.current) {
        try {
          if (audioContextRef.current.state === 'running') {
            await audioContextRef.current.close();
          }
        } catch (e) {
          console.warn('AudioContext close failed:', e);
        } finally {
          audioContextRef.current = null;
        }
      }
  
      setVolume(0);
      setIconLevel('mute');
    };
  
    if (isRecording) {
      startMic();
    } else {
      stopMic();
    }
  
    return () => {
      stopMic(); // clean up on unmount or isRecording change
    };
  }, [isRecording]);  

  const iconMap = {
    mute: <VolumeMuteIcon sx={{ fontSize: 120, color: 'white' }} />,
    down: <VolumeDownIcon sx={{ fontSize: 120, color: 'white' }} />,
    up: <VolumeUpIcon sx={{ fontSize: 120, color: 'white' }} />
  };

  return (
    <Box
      sx={{
        width: `220px`,
        height: `220px`,
        borderRadius: '50%',
        backgroundColor: '#002D62',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: isRecording
          ? '0 0 25px rgba(0, 80, 158, 0.6)'
          : '0 0 10px rgba(0, 0, 0, 0.1)',
        animation: isRecording && iconLevel !== 'mute' ? 'pulse 1.2s infinite' : 'none',
        '@keyframes pulse': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
        transition: 'all 0.3s ease-in-out',
      }}
    >
      {iconMap[iconLevel]}
    </Box>
  );
}
