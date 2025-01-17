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
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playPromiseRef = useRef<Promise<void> | null>(null);

  useEffect(() => {
    const audio = new Audio();
    
    const handleCanPlay = () => {
      setIsLoading(false);
      console.log('Audio ready to play:', {
        duration: audio.duration,
        readyState: audio.readyState,
        networkState: audio.networkState,
        type: audio.currentSrc ? audio.currentSrc.split('.').pop() : 'unknown',
        mimeType: 'audio/webm' // We know we're using WebM format for voice messages
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
        currentSrc: audio.currentSrc,
        type: audio.currentSrc ? audio.currentSrc.split('.').pop() : 'unknown'
      });
      setIsLoading(false);
      setIsPlaying(false);
      toast.error('Failed to load audio. Please try again.');
    };

    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    // Set audio properties
    audio.preload = 'auto';
    
    // Set CORS and type hints
    audio.crossOrigin = "anonymous";
    
    // Create source element with explicit MIME type
    const source = document.createElement('source');
    source.src = audioUrl;
    source.type = 'audio/webm;codecs=opus';
    audio.appendChild(source);
    
    audioRef.current = audio;

    // Start loading the audio
    audio.load();

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
      while (audio.firstChild) {
        audio.removeChild(audio.firstChild);
      }
      audio.src = '';
      audioRef.current = null;
    };
  }, [audioUrl]);

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
        // Reset audio position if it ended
        if (audioRef.current.ended) {
          audioRef.current.currentTime = 0;
        }
        
        playPromiseRef.current = audioRef.current.play();
        try {
          await playPromiseRef.current;
          setIsPlaying(true);
        } catch (error) {
          console.error('Error playing audio:', error);
          toast.error('Failed to play audio. Please try again.');
          setIsPlaying(false);
        }
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error in togglePlayPause:', error);
      setIsPlaying(false);
      setIsLoading(false);
      toast.error('Failed to play audio. Please try again.');
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
        disabled={isLoading}
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