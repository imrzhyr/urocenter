import * as React from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Mic } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AudioPlayerProps } from '../../types';

export const AudioPlayer = React.memo(({ 
  audioUrl, 
  messageId, 
  duration = 0,
  isUserMessage 
}: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const progressRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handleCanPlayThrough = () => {
      setIsLoaded(true);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('canplaythrough', handleCanPlayThrough);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('canplaythrough', handleCanPlayThrough);
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !progressRef.current) return;

    const rect = progressRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * duration;
    
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full flex items-center gap-4 px-1">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      
      {/* Play/Pause Button */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={togglePlay}
        className={cn(
          "flex-shrink-0",
          "w-11 h-11",
          "rounded-full",
          "flex items-center justify-center",
          "transition-colors",
          isUserMessage
            ? "bg-white/20 hover:bg-white/30"
            : "bg-black/10 hover:bg-black/20"
        )}
      >
        {isPlaying ? (
          <Pause className="w-5 h-5" />
        ) : (
          <Play className="w-5 h-5 ml-0.5" />
        )}
      </motion.button>

      <div className="flex-1 min-w-0 flex flex-col gap-2">
        {/* Waveform Progress */}
        <div 
          ref={progressRef}
          onClick={handleProgressClick}
          className={cn(
            "relative h-[20px]",
            "cursor-pointer",
            "flex items-center"
          )}
        >
          <div className="absolute inset-0 flex items-center justify-between">
            {/* Progress bars */}
            {Array.from({ length: 40 }).map((_, i) => {
              const progress = currentTime / duration;
              const barHeight = Math.sin((i / 39) * Math.PI) * 16 + 4;
              const isActive = i / 39 <= progress;

              return (
                <div
                  key={i}
                  className={cn(
                    "w-[2px] rounded-full transition-all duration-200",
                    isActive
                      ? isUserMessage
                        ? "bg-white/90"
                        : "bg-[#3B9EDB]"
                      : isUserMessage
                      ? "bg-white/30"
                      : "bg-black/20"
                  )}
                  style={{ height: `${barHeight}px` }}
                />
              );
            })}
          </div>
        </div>

        {/* Duration */}
        <div className="flex items-center gap-2">
          <Mic className="w-3.5 h-3.5 opacity-70" />
          <span className={cn(
            "text-[13px] font-medium",
            isUserMessage ? "text-white/70" : "text-black/50"
          )}>
            {formatTime(isLoaded ? currentTime : duration)}
          </span>
        </div>
      </div>
    </div>
  );
});

AudioPlayer.displayName = 'AudioPlayer'; 