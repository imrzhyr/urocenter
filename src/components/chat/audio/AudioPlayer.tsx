import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { AudioControls } from './AudioControls';
import { AudioProgress } from './AudioProgress';

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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const checkAudioAccess = async () => {
      try {
        const response = await fetch(audioUrl, { method: 'HEAD' });
        if (!response.ok) {
          throw new Error('Audio file not accessible');
        }
        setIsLoading(false);
      } catch (err) {
        console.error('Audio access error:', err);
        setError('Unable to load audio');
        setIsLoading(false);
        toast.error('Failed to load audio file');
      }
    };

    checkAudioAccess();
  }, [audioUrl]);

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    const handleLoadedMetadata = () => {
      setAudioDuration(audio.duration);
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
      setError('Failed to load audio');
      
      // Check WebM support
      const canPlayWebm = audio.canPlayType('audio/webm; codecs="opus"');
      if (audioUrl.endsWith('.webm') && !canPlayWebm) {
        toast.error('Your browser does not support WebM audio. Please try using Chrome or Firefox.');
        return;
      }
    };

    audio.preload = 'auto';
    audio.crossOrigin = 'anonymous';
    audio.src = audioUrl;

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError as EventListener);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError as EventListener);
      
      if (audio) {
        audio.pause();
        setIsPlaying(false);
        setIsLoading(false);
        audio.src = '';
        audioRef.current = null;
      }
    };
  }, [audioUrl]);

  const handlePlayPause = async () => {
    if (!audioRef.current || error) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        setIsLoading(true);
        
        try {
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (error) {
          console.error('Playback error:', error);
          toast.error('Unable to play audio message. Please try using Chrome or Firefox.');
          setIsPlaying(false);
        } finally {
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.error('Playback error:', error);
      toast.error('Unable to play audio message. Please try again.');
      setIsPlaying(false);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 w-full max-w-[300px] bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Loading audio...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 w-full max-w-[300px] bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm">
        <span className="text-sm text-red-500">{error}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 w-full max-w-[300px] bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm">
      <AudioControls 
        isPlaying={isPlaying} 
        onPlayPause={handlePlayPause}
        isLoading={isLoading}
      />
      <AudioProgress 
        currentTime={currentTime}
        duration={audioDuration}
        progress={progress}
      />
    </div>
  );
};