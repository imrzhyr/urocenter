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
      setAudioDuration(audio.duration);
      setIsLoading(false);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      audio.currentTime = 0;
    };

    const handleError = (e: Event) => {
      console.error('Audio playback error:', e);
      toast.error('Failed to play audio message');
      setIsPlaying(false);
      setIsLoading(false);
    };

    // Add event listeners
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    // Set audio output to speaker
    if ('setSinkId' in audio) {
      (audio as any).setSinkId('default')
        .catch((e: Error) => console.error('Error setting audio output:', e));
    }

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.pause();
      audio.src = '';
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
        size="icon"
        variant="ghost"
        className="w-8 h-8 rounded-full bg-primary hover:bg-primary/90"
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
        <div className="h-1.5 bg-gray-200 rounded-full">
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
      <audio ref={audioRef} preload="metadata" />
    </div>
  );
};