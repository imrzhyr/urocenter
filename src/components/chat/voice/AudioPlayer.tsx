import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

interface AudioPlayerProps {
  audioUrl: string;
  duration: number;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl, duration }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(audioUrl);
    audio.preload = 'metadata';
    audioRef.current = audio;

    audio.addEventListener('loadedmetadata', () => {
      console.log('Audio metadata loaded:', {
        duration: audio.duration,
        src: audio.src,
        type: audio.type
      });
    });

    audio.addEventListener('error', (e) => {
      console.error('Audio loading error:', e);
      toast.error('Failed to load audio file');
    });

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        audioRef.current.removeEventListener('ended', handleEnded);
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [audioUrl]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      setCurrentTime(current);
      setProgress((current / duration) * 100);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  const togglePlayPause = async () => {
    if (!audioRef.current) {
      toast.error('Audio player not initialized');
      return;
    }

    try {
      if (isPlaying) {
        await audioRef.current.pause();
      } else {
        // Check if the audio is supported
        if (audioRef.current.error) {
          console.error('Audio error:', audioRef.current.error);
          toast.error('This audio format is not supported');
          return;
        }
        
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          await playPromise;
        }
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error('Error playing audio:', error);
      toast.error('Failed to play audio');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-3 min-w-[200px] max-w-[300px] bg-white dark:bg-gray-800 rounded-xl p-3">
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
      <div className="flex-1">
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between mt-1 text-xs text-gray-500">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
};