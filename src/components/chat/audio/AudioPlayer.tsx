import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";
import { AudioProgress } from "./AudioProgress";
import { cn } from "@/lib/utils";

interface AudioPlayerProps {
  url: string;
  duration?: number | null;
  className?: string;
}

export const AudioPlayer = ({ url, duration, className }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(duration || 0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(url);
    audioRef.current.addEventListener('loadedmetadata', () => {
      if (audioRef.current) {
        setAudioDuration(audioRef.current.duration);
      }
    });
    audioRef.current.addEventListener('timeupdate', () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
      }
    });
    audioRef.current.addEventListener('ended', () => {
      setIsPlaying(false);
      setCurrentTime(0);
    });

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('loadedmetadata', () => {});
        audioRef.current.removeEventListener('timeupdate', () => {});
        audioRef.current.removeEventListener('ended', () => {});
      }
    };
  }, [url]);

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={cn("flex items-center gap-2 bg-secondary p-2 rounded-lg", className)}>
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
      <AudioProgress
        currentTime={currentTime}
        duration={audioDuration}
        onSeek={(time) => {
          if (audioRef.current) {
            audioRef.current.currentTime = time;
            setCurrentTime(time);
          }
        }}
      />
      <span className="text-xs min-w-[40px]">
        {formatTime(currentTime)} / {formatTime(audioDuration)}
      </span>
    </div>
  );
};