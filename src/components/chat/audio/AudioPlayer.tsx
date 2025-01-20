import { useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface AudioPlayerProps {
  audioUrl: string;
  messageId: string;
  duration?: number;
}

export const AudioPlayer = ({ audioUrl, messageId, duration }: AudioPlayerProps) => {
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

  const formatTime = (seconds: number): string => {
    if (!isFinite(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const progressBar = progressBarRef.current;
    if (!progressBar || !audioRef.current) return;

    const rect = progressBar.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    const time = (percentage / 100) * (duration || audioRef.current.duration || 0);

    audioRef.current.currentTime = time;
    setProgress(percentage);
    setCurrentTime(time);
  };

  return (
    <div className="flex flex-col gap-2 min-w-[200px]">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      
      {/* Controls row */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-11 w-11 rounded-full", // 44x44 touch target
            "bg-primary/10 hover:bg-primary/20 active:bg-primary/30",
            "transition-colors duration-200"
          )}
          onClick={togglePlayPause}
        >
          <motion.div
            initial={false}
            animate={{ scale: isPlaying ? 0.9 : 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5 ml-0.5" />
            )}
          </motion.div>
        </Button>

        {/* Progress bar */}
        <div className="flex-1 flex flex-col gap-1">
          <div
            ref={progressBarRef}
            className="h-1.5 bg-primary/20 rounded-full overflow-hidden cursor-pointer"
            onClick={handleProgressClick}
          >
            <motion.div
              className="h-full bg-primary"
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", bounce: 0 }}
            />
          </div>

          {/* Time indicators */}
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration || 0)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};