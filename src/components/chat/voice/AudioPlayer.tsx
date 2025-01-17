import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Play, Pause, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { logger } from "@/utils/logger";

interface AudioPlayerProps {
  audioUrl: string;
  messageId: string;
  duration?: number;
}

export const AudioPlayer = ({ audioUrl, messageId, duration }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playPromiseRef = useRef<Promise<void> | null>(null);

  useEffect(() => {
    const audio = new Audio();
    
    const handleCanPlay = () => {
      setIsLoading(false);
      logger.info('AudioPlayer', 'Audio ready to play', {
        messageId,
        duration: audio.duration,
        readyState: audio.readyState,
        networkState: audio.networkState,
        mimeType: audio.src.split('.').pop()?.toLowerCase() === 'webm' ? 'audio/webm' : 'audio/mp3',
        browser: navigator.userAgent
      });
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handleError = () => {
      // Try to convert WebM to MP3 URL if WebM fails
      if (audioUrl.toLowerCase().endsWith('.webm')) {
        const mp3Url = audioUrl.replace('.webm', '.mp3');
        audio.src = mp3Url;
        return;
      }

      const error = new Error(audio.error?.message || 'Audio playback error');
      const errorDetails = {
        messageId,
        errorCode: audio.error?.code,
        errorMessage: audio.error?.message,
        networkState: audio.networkState,
        readyState: audio.readyState,
        currentSrc: audio.currentSrc,
        browser: navigator.userAgent
      };

      setIsLoading(false);
      setIsPlaying(false);
      
      logger.error('AudioPlayer', 'Audio playback error', errorDetails, error);
      toast.error('Unable to play audio message');
    };

    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    // Set proper MIME type based on file extension
    const fileExtension = audioUrl.split('.').pop()?.toLowerCase();
    const mimeType = fileExtension === 'webm' ? 'audio/webm' : 'audio/mp3';
    
    // Set crossOrigin to allow CORS requests
    audio.crossOrigin = 'anonymous';
    
    // Set audio source with proper MIME type
    audio.src = audioUrl;
    
    audioRef.current = audio;

    return () => {
      if (playPromiseRef.current) {
        playPromiseRef.current.then(() => {
          audio.pause();
        }).catch(() => {});
      } else {
        audio.pause();
      }
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.src = '';
      audioRef.current = null;
    };
  }, [audioUrl, messageId]);

  const togglePlayPause = async () => {
    if (!audioRef.current || isLoading) return;

    try {
      if (isPlaying) {
        if (playPromiseRef.current) {
          await playPromiseRef.current;
        }
        audioRef.current.pause();
        setIsPlaying(false);
        playPromiseRef.current = null;
      } else {
        setIsLoading(true);
        if (audioRef.current.ended) {
          audioRef.current.currentTime = 0;
        }
        
        playPromiseRef.current = audioRef.current.play();
        try {
          await playPromiseRef.current;
          setIsPlaying(true);
        } catch (error) {
          logger.error('AudioPlayer', 'Failed to play audio', error instanceof Error ? error : new Error('Playback failed'));
          toast.error('Failed to play audio');
          setIsPlaying(false);
        }
        setIsLoading(false);
      }
    } catch (error) {
      logger.error('AudioPlayer', 'Error in playback control', error instanceof Error ? error : new Error('Playback control failed'));
      setIsPlaying(false);
      setIsLoading(false);
      toast.error('Failed to play audio');
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-2 min-w-[120px]">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 hover:bg-black/10 dark:hover:bg-white/10"
        onClick={togglePlayPause}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
      </Button>
      <div className="text-xs">
        {formatTime(currentTime)} / {formatTime(duration || 0)}
      </div>
    </div>
  );
};