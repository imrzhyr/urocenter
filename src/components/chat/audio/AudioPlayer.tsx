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
    if (audio) {
      audio.addEventListener('timeupdate', () => {
        setCurrentTime(audio.currentTime || 0);
      });
      audio.addEventListener('loadedmetadata', () => {
        setAudioDuration(audio.duration || 0);
        setIsLoading(false);
      });
      audio.addEventListener('ended', () => {
        setIsPlaying(false);
        setCurrentTime(0);
      });
      audio.addEventListener('error', (e) => {
        console.error('Audio playback error:', e);
        toast.error('Failed to play audio message');
        setIsPlaying(false);
        setIsLoading(false);
      });
    }

    return () => {
      if (audio) {
        audio.pause();
        audio.src = '';
      }
    };
  }, []);

  const handlePlayPause = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      setIsLoading(true);
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.src = audioUrl;
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Playback error:', error);
      toast.error('Failed to play audio message');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-2 flex items-center gap-2 bg-gray-100 rounded-full p-2">
      <Button
        onClick={handlePlayPause}
        disabled={isLoading}
        className="w-8 h-8 flex items-center justify-center bg-primary rounded-full text-white hover:bg-primary/90 transition-colors"
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : isPlaying ? (
          <Pause className="w-4 h-4" />
        ) : (
          <Play className="w-4 h-4" />
        )}
      </Button>
      <div className="flex-1">
        <div className="h-1 bg-gray-200 rounded-full">
          <div 
            className="h-full bg-primary rounded-full transition-all duration-100"
            style={{ 
              width: `${(currentTime / audioDuration) * 100}%`
            }}
          />
        </div>
      </div>
      <span className="text-xs text-gray-500 min-w-[40px]">
        {audioDuration ? 
          `${Math.floor(audioDuration / 60)}:${(Math.floor(audioDuration) % 60).toString().padStart(2, '0')}` 
          : '0:00'}
      </span>
      <Volume2 className="w-4 h-4 text-gray-500" />
      <audio ref={audioRef} className="hidden" />
    </div>
  );
};