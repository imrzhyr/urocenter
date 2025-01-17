import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { AudioControls } from './AudioControls';
import { AudioProgress } from './AudioProgress';

interface AudioPlayerProps {
  audioUrl: string;
  messageId: string;
  duration?: number;
}

export const AudioPlayer = ({ audioUrl, messageId, duration = 0 }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(duration);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    const handleLoadedMetadata = () => {
      setAudioDuration(audio.duration);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      if (audio.currentTime && audio.duration) {
        setCurrentTime(audio.currentTime);
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      setProgress(0);
      audio.currentTime = 0;
    };

    const handleError = (e: ErrorEvent) => {
      console.error('Audio loading error:', e);
      setIsPlaying(false);
      setIsLoading(false);
      
      // Check if the audio format is supported
      const audioFormat = audioUrl.split('.').pop()?.toLowerCase();
      if (audioFormat === 'webm' && !audio.canPlayType('audio/webm')) {
        toast.error('This audio format is not supported by your browser. Please try using a different browser.');
      } else {
        toast.error('Unable to play voice message. Please try again.');
      }
    };

    // Add cache busting and handle CORS
    const timestamp = new Date().getTime();
    const urlWithCache = `${audioUrl}?t=${timestamp}`;
    
    // Configure audio
    audio.preload = 'auto';
    audio.crossOrigin = 'anonymous'; // Handle CORS issues
    
    // Set MIME type for WebM audio
    if (audioUrl.endsWith('.webm')) {
      audio.type = 'audio/webm';
    }
    
    audio.src = urlWithCache;
    
    // Add event listeners
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    // Load the audio
    audio.load();

    return () => {
      // Cleanup
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      
      if (audio) {
        audio.pause();
        audio.src = '';
        audioRef.current = null;
      }
    };
  }, [audioUrl]);

  const handlePlayPause = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        // Check if the audio format is supported before playing
        const audioFormat = audioUrl.split('.').pop()?.toLowerCase();
        const audio = audioRef.current;
        
        if (audioFormat === 'webm' && !audio.canPlayType('audio/webm')) {
          throw new Error('Unsupported audio format');
        }
        
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Playback error:', error);
      if (error instanceof Error && error.message === 'Unsupported audio format') {
        toast.error('This audio format is not supported by your browser. Please try using a different browser.');
      } else {
        toast.error('Unable to play voice message. Please try again.');
      }
      setIsPlaying(false);
    }
  };

  return (
    <div className="flex items-center gap-3 w-full max-w-[300px] bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm">
      <AudioControls 
        isPlaying={isPlaying} 
        onPlayPause={handlePlayPause}
        isLoading={isLoading}
      />
      <AudioProgress 
        currentTime={currentTime}
        duration={audioDuration}
        progress={progress}
      />
    </div>
  );
};