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

    const handleError = () => {
      console.error('Audio loading error');
      setIsPlaying(false);
      setIsLoading(false);
      
      // Check if WebM is supported
      const canPlayWebm = audio.canPlayType('audio/webm; codecs="opus"');
      if (audioUrl.endsWith('.webm') && !canPlayWebm) {
        toast.error('Your browser does not support WebM audio. Please try using Chrome or Firefox.');
        return;
      }
      
      toast.error('Unable to play voice message. Please try again.');
    };

    // Configure audio with proper MIME type and CORS settings
    audio.preload = 'auto';
    audio.crossOrigin = 'anonymous';

    // Add timestamp to prevent caching
    const timestamp = new Date().getTime();
    const urlWithCache = `${audioUrl}?t=${timestamp}`;
    
    // Set source with proper MIME type
    if (audioUrl.endsWith('.webm')) {
      const source = document.createElement('source');
      source.src = urlWithCache;
      source.type = 'audio/webm; codecs="opus"';
      audio.appendChild(source);
    } else {
      audio.src = urlWithCache;
    }

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
        const audio = audioRef.current;
        
        // Check WebM support before playing
        const canPlayWebm = audio.canPlayType('audio/webm; codecs="opus"');
        if (audioUrl.endsWith('.webm') && !canPlayWebm) {
          toast.error('Your browser does not support WebM audio. Please try using Chrome or Firefox.');
          return;
        }

        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Playback error:', error);
      toast.error('Unable to play voice message. Please try again.');
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