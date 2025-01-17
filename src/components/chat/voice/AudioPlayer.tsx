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
  const [isSupported, setIsSupported] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playPromiseRef = useRef<Promise<void> | null>(null);

  useEffect(() => {
    // Check browser compatibility
    const audio = new Audio();
    const isWebmSupported = audio.canPlayType('audio/webm; codecs="opus"') !== "";
    setIsSupported(isWebmSupported);

    if (!isWebmSupported) {
      logger.warn('AudioPlayer', 'WebM audio format not supported', {
        browser: navigator.userAgent,
        messageId,
        audioUrl
      });
      toast.error('Your browser may not support this audio format');
    }

    const newAudio = new Audio();
    
    const handleCanPlay = () => {
      setIsLoading(false);
      logger.info('AudioPlayer', 'Audio ready to play', {
        messageId,
        duration: newAudio.duration,
        readyState: newAudio.readyState,
        networkState: newAudio.networkState,
        type: 'audio/webm',
        browser: navigator.userAgent,
        audioUrl
      });
    };

    const handleTimeUpdate = () => {
      setCurrentTime(newAudio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handleError = (e: ErrorEvent) => {
      const errorDetails = {
        messageId,
        errorCode: newAudio.error?.code,
        errorMessage: newAudio.error?.message,
        networkState: newAudio.networkState,
        readyState: newAudio.readyState,
        currentSrc: newAudio.currentSrc,
        type: 'audio/webm',
        browser: navigator.userAgent,
        audioUrl,
        timestamp: new Date().toISOString()
      };

      logger.error('AudioPlayer', 'Audio playback error', errorDetails);
      
      setIsLoading(false);
      setIsPlaying(false);
      
      // Detailed error handling based on specific error types
      switch (newAudio.error?.code) {
        case 1:
          logger.error('AudioPlayer', 'Audio fetch aborted', errorDetails);
          toast.error('Audio loading was interrupted');
          break;
        case 2:
          logger.error('AudioPlayer', 'Network error', errorDetails);
          toast.error('Network error while loading audio');
          break;
        case 3:
          logger.error('AudioPlayer', 'Audio decoding error', errorDetails);
          toast.error('Error processing audio file');
          break;
        case 4:
          logger.error('AudioPlayer', 'Audio format not supported', errorDetails);
          toast.error('Audio format not supported by your browser');
          break;
        default:
          if (newAudio.networkState === 3) {
            logger.error('AudioPlayer', 'Network resource unavailable', errorDetails);
            toast.error('Unable to load audio file');
            // Attempt to reload the audio
            newAudio.load();
          } else {
            logger.error('AudioPlayer', 'Unknown audio error', errorDetails);
            toast.error('Unable to play this audio message');
          }
      }
    };

    newAudio.addEventListener('canplay', handleCanPlay);
    newAudio.addEventListener('timeupdate', handleTimeUpdate);
    newAudio.addEventListener('ended', handleEnded);
    newAudio.addEventListener('error', handleError);

    // Set audio properties
    newAudio.preload = 'auto';
    newAudio.src = audioUrl;
    
    audioRef.current = newAudio;

    // Attempt initial load
    try {
      newAudio.load();
    } catch (error) {
      logger.error('AudioPlayer', 'Error loading audio', {
        messageId,
        error,
        audioUrl
      });
    }

    return () => {
      if (playPromiseRef.current) {
        playPromiseRef.current.then(() => {
          newAudio.pause();
        }).catch(() => {});
      } else {
        newAudio.pause();
      }
      newAudio.removeEventListener('canplay', handleCanPlay);
      newAudio.removeEventListener('timeupdate', handleTimeUpdate);
      newAudio.removeEventListener('ended', handleEnded);
      newAudio.removeEventListener('error', handleError);
      newAudio.src = '';
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
          logger.error('AudioPlayer', 'Error playing audio', {
            messageId,
            error,
            audioUrl
          });
          toast.error('Failed to play audio');
          setIsPlaying(false);
        }
        setIsLoading(false);
      }
    } catch (error) {
      logger.error('AudioPlayer', 'Error in togglePlayPause', {
        messageId,
        error,
        audioUrl
      });
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

  if (!isSupported) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        Audio playback not supported in your browser
      </div>
    );
  }

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