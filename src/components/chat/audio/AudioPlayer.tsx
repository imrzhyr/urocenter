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
  const [isLoading, setIsLoading] = useState(false);
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
      
      // Check WebM support
      const canPlayWebm = audio.canPlayType('audio/webm; codecs="opus"');
      if (audioUrl.endsWith('.webm') && !canPlayWebm) {
        toast.error('Your browser does not support WebM audio. Please try using Chrome or Firefox.');
        return;
      }

      // Check if URL is accessible
      fetch(audioUrl, { method: 'HEAD' })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          // URL is valid but audio still won't play - might be a codec issue
          toast.error('This audio format is not supported by your browser. Try using Chrome or Firefox.');
        })
        .catch(error => {
          console.error('Error checking audio URL:', error);
          toast.error('Unable to access the audio file. Please try again later.');
        });
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
    audio.addEventListener('error', handleError as EventListener);

    return () => {
      // Cleanup
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError as EventListener);
      
      if (audio) {
        audio.pause();
        setIsPlaying(false);
        setIsLoading(false);
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
        setIsLoading(true);
        
        // Check WebM support before playing
        const canPlayWebm = audioRef.current.canPlayType('audio/webm; codecs="opus"');
        if (audioUrl.endsWith('.webm') && !canPlayWebm) {
          toast.error('Your browser does not support WebM audio. Please try using Chrome or Firefox.');
          setIsLoading(false);
          return;
        }

        try {
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (error) {
          console.error('Playback error:', error);
          toast.error('Unable to play voice message. Please try using Chrome or Firefox.');
          setIsPlaying(false);
        } finally {
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.error('Playback error:', error);
      toast.error('Unable to play voice message. Please try again.');
      setIsPlaying(false);
      setIsLoading(false);
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