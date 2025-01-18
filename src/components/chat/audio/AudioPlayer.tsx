import { useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { formatTime } from '@/utils/audioUtils';
import { cn } from "@/lib/utils";

interface AudioPlayerProps {
  url: string;
  messageId: string;
  duration?: number;
  className?: string;
}

export const AudioPlayer = ({ url, messageId, duration, className }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className={cn("flex items-center gap-2 min-w-[200px]", className)}>
      <audio ref={audioRef} src={url} preload="metadata" />
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
      <div className="text-[12px] leading-4 opacity-80">
        {formatTime(currentTime)} / {formatTime(duration || 0)}
      </div>
    </div>
  );
};