import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AudioPlayerProps {
  audioUrl: string;
  messageId: string;
  duration?: number;
  isUserMessage?: boolean;
}

export const AudioPlayer = ({ audioUrl, messageId, duration, isUserMessage }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / (duration || audio.duration || 1)) * 100);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      setProgress(0);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [duration]);

  const togglePlayback = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    const progressBar = progressBarRef.current;
    if (!audio || !progressBar) return;

    const rect = progressBar.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * (duration || audio.duration || 0);
    
    audio.currentTime = newTime;
    setCurrentTime(newTime);
    setProgress(percentage * 100);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={cn(
      "flex items-center gap-3",
      "min-w-[200px]"
    )}>
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      
      <button
        onClick={togglePlayback}
        className={cn(
          "w-8 h-8 rounded-full",
          "flex items-center justify-center",
          "transition-colors duration-200",
          isUserMessage 
            ? "text-white hover:bg-white/10" 
            : "text-primary hover:bg-primary/10"
        )}
      >
        {isPlaying ? (
          <Pause className="w-5 h-5" />
        ) : (
          <Play className="w-5 h-5" />
        )}
      </button>

      <div className="flex-1 space-y-1">
        <div 
          ref={progressBarRef}
          className="relative h-1 cursor-pointer"
          onClick={handleProgressClick}
        >
          <div 
            className={cn(
              "absolute top-0 left-0 h-full rounded-full",
              isUserMessage ? "bg-white/30" : "bg-primary/30"
            )} 
            style={{ width: '100%' }} 
          />
          <div 
            className={cn(
              "absolute top-0 left-0 h-full rounded-full",
              isUserMessage ? "bg-white" : "bg-primary"
            )}
            style={{ width: `${progress}%` }} 
          />
        </div>
        <div className={cn(
          "text-xs",
          isUserMessage ? "text-white" : "text-primary"
        )}>
          {formatTime(currentTime)} / {formatTime(duration || 0)}
        </div>
      </div>
    </div>
  );
};