import { useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { formatTime } from '@/utils/audioUtils';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AudioPlayerProps {
  audioUrl: string;
  messageId: string;
  duration?: number;
  fromCurrentUser?: boolean;
}

export const AudioPlayer = ({ audioUrl, messageId, duration, fromCurrentUser }: AudioPlayerProps) => {
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

  const togglePlayPause = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        // Add haptic feedback when available
        if (window.navigator && window.navigator.vibrate) {
          window.navigator.vibrate(10); // Light tap feedback
        }
        await audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !progressBarRef.current) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    const time = (percentage / 100) * (duration || audioRef.current.duration || 0);

    audioRef.current.currentTime = time;
    setCurrentTime(time);
    setProgress(percentage);
  };

  return (
    <div className={cn(
      "flex items-center gap-3",
      "min-w-[200px] min-h-[44px]", // iOS minimum touch target
      "px-1" // Add padding for touch targets
    )}>
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      
      {/* Play/Pause Button */}
      <motion.div
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.1 }}
      >
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={togglePlayPause}
          className={cn(
            "h-8 w-8 rounded-full", // iOS circular button
            "flex items-center justify-center",
            "transition-colors duration-200",
            fromCurrentUser
              ? "text-white hover:bg-white/10"
              : "text-[#007AFF] dark:text-[#0A84FF] hover:bg-[#007AFF]/10 dark:hover:bg-[#0A84FF]/10"
          )}
        >
          <motion.div
            initial={false}
            animate={{ rotate: isPlaying ? 0 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </motion.div>
        </Button>
      </motion.div>

      {/* Progress Bar and Time */}
      <div className="flex-1 space-y-1">
        {/* Progress Bar */}
        <div
          ref={progressBarRef}
          onClick={handleProgressClick}
          className={cn(
            "h-1 rounded-full overflow-hidden cursor-pointer",
            "bg-black/10 dark:bg-white/10"
          )}
        >
          <motion.div
            className={cn(
              "h-full rounded-full",
              fromCurrentUser
                ? "bg-white/80"
                : "bg-[#007AFF] dark:bg-[#0A84FF]"
            )}
            style={{ width: `${progress}%` }}
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>

        {/* Time Display */}
        <div className={cn(
          "flex justify-between",
          "text-[11px]", // iOS caption text
          fromCurrentUser
            ? "text-white/80"
            : "text-[#8E8E93] dark:text-[#98989D]"
        )}>
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration || 0)}</span>
        </div>
      </div>
    </div>
  );
};