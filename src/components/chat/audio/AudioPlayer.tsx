import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Play, Pause, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { formatTime } from '@/utils/audioUtils';

interface AudioPlayerProps {
  audioUrl: string;
  messageId: string;
  duration?: number;
}

export const AudioPlayer = ({ audioUrl, messageId, duration = 0 }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(duration);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setAudioDuration(audio.duration);
      } else {
        setAudioDuration(duration);
      }
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      if (audio.currentTime && audio.duration) {
        setCurrentTime(audio.currentTime);
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      setProgress(0);
      audio.currentTime = 0;
    };

    const handleError = (e: ErrorEvent) => {
      console.error('Audio loading error:', e);
      setIsPlaying(false);
      setIsLoading(false);
      
      // Check WebM support
      const canPlayWebm = audio.canPlayType('audio/webm; codecs="opus"');
      if (audioUrl.endsWith('.webm') && !canPlayWebm) {
        toast.error('Your browser does not support WebM audio. Please try using Chrome or Firefox.');
        return;
      }
      
      toast.error('Unable to play voice message. Please try again.');
    };

    // Configure audio
    audio.preload = 'metadata';
    audio.crossOrigin = 'anonymous';

    // Add timestamp to prevent caching
    const timestamp = new Date().getTime();
    const urlWithCache = `${audioUrl}?t=${timestamp}`;
    audio.src = urlWithCache;

    // Add event listeners
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      
      if (audio) {
        audio.pause();
        setIsPlaying(false);
        setIsLoading(false);
        audio.src = '';
        audioRef.current = null;
      }
    };
  }, [audioUrl, duration]);

  const handlePlayPause = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        const audio = audioRef.current;
        
        // Check WebM support before playing
        const canPlayWebm = audio.canPlayType('audio/webm; codecs="opus"');
        if (audioUrl.endsWith('.webm') && !canPlayWebm) {
          toast.error('Your browser does not support WebM audio. Please try using Chrome or Firefox.');
          return;
        }

        setIsLoading(true);
        try {
          await audio.play();
          setIsPlaying(true);
        } catch (error) {
          console.error('Playback error:', error);
          toast.error('Unable to play voice message. Please try again.');
          setIsPlaying(false);
        } finally {
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.error('Playback error:', error);
      toast.error('Unable to play voice message. Please try again.');
      setIsPlaying(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3 w-full max-w-[300px] bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm">
      {isLoading ? (
        <Button disabled variant="ghost" size="icon" className="h-8 w-8">
          <Loader2 className="h-4 w-4 animate-spin" />
        </Button>
      ) : (
        <Button
          onClick={handlePlayPause}
          variant="ghost"
          size="icon"
          className="h-8 w-8"
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>
      )}
      <div className="flex flex-col gap-1 flex-1">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
          <div
            className="bg-primary h-1 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {formatTime(currentTime)} / {formatTime(audioDuration)}
        </div>
      </div>
    </div>
  );
};