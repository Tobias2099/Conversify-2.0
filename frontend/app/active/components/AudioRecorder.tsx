'use client';
import React, { useEffect, useRef, useState } from 'react';

export default function AudioRecorder({ isRecording }: { isRecording: boolean }) {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    const prepareMedia = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setStream(mediaStream);

        const recorder = new MediaRecorder(mediaStream);
        mediaRecorderRef.current = recorder;

        recorder.ondataavailable = (e) => {
          chunksRef.current.push(e.data);
        };

        recorder.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
          const url = URL.createObjectURL(blob);
          setAudioURL(url);
          chunksRef.current = []; // clear for next round
        };
      } catch (err) {
        console.error('Microphone access error:', err);
      }
    };

    prepareMedia();

    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  useEffect(() => {
    const recorder = mediaRecorderRef.current;

    if (!recorder) return;

    if (isRecording && recorder.state === 'inactive') {
      setAudioURL(null); // clear old audio
      chunksRef.current = [];
      recorder.start();
    } else if (!isRecording && recorder.state === 'recording') {
      recorder.stop();
    }
  }, [isRecording]);

  return (
    <>
      {audioURL && (
        <audio controls src={audioURL} style={{marginTop: '5%'}}>
          Your browser does not support the audio element.
        </audio>
      )}
    </>
  );
}
