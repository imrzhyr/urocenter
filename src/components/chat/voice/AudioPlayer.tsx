import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";
import { toast } from "sonner";

interface AudioPlayerProps {
  audioUrl: string;
  messageId: string;
  duration?: number;
}

export const AudioPlayer = ({ audioUrl, messageId, duration }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio();
    
    // Set CORS policy
    audio.crossOrigin = "anonymous";
    
    // Add multiple sources for better browser compatibility
    const sourceWebm = document.createElement('source');
    sourceWebm.src = audioUrl;
    sourceWebm.type = 'audio/webm;codecs=opus';
    
    const sourceMp3 = document.createElement('source');
    sourceMp3.src = audioUrl.replace('.webm', '.mp3');
    sourceMp3.type = 'audio/mpeg';
    
    audio.appendChild(sourceWebm);
    audio.appendChild(sourceMp3);
    
    // Preload metadata
    audio.preload = 'metadata';
    
    const handleCanPlayThrough = () => {
      console.log('Audio can play through:', {
        duration: audio.duration,
        readyState: audio.readyState,
        networkState: audio.networkState
      });
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handleError = (e: ErrorEvent) => {
      console.error('Audio error:', {
        error: audio.error,
        networkState: audio.networkState,
        readyState: audio.readyState,
        currentSrc: audio.currentSrc
      });
      
      toast.error('Failed to load audio. Please try again.');
    };

    audio.addEventListener('canplaythrough', handleCanPlayThrough);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    audioRef.current = audio;

    return () => {
      audio.removeEventListener('canplaythrough', handleCanPlayThrough);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.pause();
      audioRef.current = null;
    };
  }, [audioUrl]);

  const togglePlayPause = async () => {
    if (!audioRef.current) {
      console.error('Audio element not initialized');
      return;
    }

    try {
      if (isPlaying) {
        await audioRef.current.pause();
        setIsPlaying(false);
      } else {
        // Force reload the audio before playing
        audioRef.current.currentTime = 0;
        await audioRef.current.load();
        const playPromise = audioRef.current.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log('Audio started playing successfully');
              setIsPlaying(true);
            })
            .catch(error => {
              console.error('Error playing audio:', error);
              toast.error('Failed to play audio. Please try again.');
              setIsPlaying(false);
            });
        }
      }
    } catch (error) {
      console.error('Error in togglePlayPause:', error);
      toast.error('Failed to play audio. Please try again.');
      setIsPlaying(false);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-2 min-w-[200px]">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={togglePlayPause}
      >
        {isPlaying ? (
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