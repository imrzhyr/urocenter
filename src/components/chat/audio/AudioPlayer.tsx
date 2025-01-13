import { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface AudioPlayerProps {
  audioUrl: string;
  messageId: string;
  duration?: number;
}

export const AudioPlayer = ({ audioUrl, messageId, duration }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(duration || 0);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setAudioDuration(audio.duration || duration || 0);
      setIsLoading(false);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      audio.currentTime = 0;
    };

    const handleError = (e: ErrorEvent) => {
      console.error('Audio playback error:', audioUrl);
      toast.error('Unable to play audio message. Please try again.');
      setIsPlaying(false);
      setIsLoading(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    // Preload the audio
    audio.preload = 'metadata';
    audio.src = audioUrl;

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.pause();
      audio.src = '';
    };
  }, [duration, audioUrl]);

  const formatTime = (time: number) => {
    if (!isFinite(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      setIsLoading(true);
      
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          await playPromise;
          setIsPlaying(true);
        }
      }
    } catch (error) {
      console.error('Playback error:', error);
      toast.error('Failed to play audio message');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-2 flex items-center gap-2 bg-[#E5F6FF] dark:bg-[#1A2433] rounded-full p-2">
      <Button
        onClick={handlePlayPause}
        disabled={isLoading}
        size="icon"
        variant="ghost"
        className="w-8 h-8 rounded-full bg-[#0066CC] hover:bg-[#0052A3] dark:bg-[#0066CC] dark:hover:bg-[#0052A3]"
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : isPlaying ? (
          <Pause className="h-4 w-4 text-white" />
        ) : (
          <Play className="h-4 w-4 text-white" />
        )}
      </Button>
      
      <div className="flex-1">
        <div className="h-1.5 bg-[#E5F6FF] dark:bg-[#1A2433] rounded-full">
          <div 
            className="h-full bg-[#0066CC] dark:bg-[#0066CC] rounded-full transition-all duration-100"
            style={{ 
              width: `${(currentTime / audioDuration) * 100}%`
            }}
          />
        </div>
      </div>
      
      <span className="text-xs text-gray-600 dark:text-gray-300 min-w-[40px]">
        {formatTime(audioDuration)}
      </span>
      
      <Volume2 className="w-4 h-4 text-gray-500" />
      <audio ref={audioRef} preload="metadata" />
    </div>
  );
};