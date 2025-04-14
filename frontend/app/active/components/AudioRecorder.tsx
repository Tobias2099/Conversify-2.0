'use client';
import React, { useEffect, useRef, useState } from 'react';

export default function AudioRecorder({ isRecording, onTranscript }: { isRecording: boolean, onTranscript: (text: string) => void }) {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const sendToBackend = async (blob: Blob) => {
    const formData = new FormData();
    formData.append('audio', blob, 'recording.webm');
  
    try {
      const res = await fetch('http://localhost:5000/api/transcribe', {
        method: 'POST',
        body: formData
      });
  
      const data = await res.json();
      console.log('📝 Transcript:', data.transcript);
      if (onTranscript) {
        console.log("📤 Calling onTranscript with:", data.transcript);
        onTranscript(data.transcript);
      } else {
        console.warn("⚠️ onTranscript is undefined!");
      }
    } catch (err) {
      console.error('Transcription failed:', err);
    }
  };

  
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

        recorder.onstop = async () => {
          const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
          setAudioURL(URL.createObjectURL(blob));
          chunksRef.current = [];
          sendToBackend(blob);
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
