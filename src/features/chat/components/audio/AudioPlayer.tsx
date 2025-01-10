import { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2 } from "lucide-react";

interface AudioPlayerProps {
  audioUrl: string;
  messageId: string;
  duration?: number;
}

export const AudioPlayer = ({ audioUrl, messageId, duration }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(duration || 0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('timeupdate', () => {
        setCurrentTime(audioRef.current?.currentTime || 0);
      });
      audioRef.current.addEventListener('loadedmetadata', () => {
        setAudioDuration(audioRef.current?.duration || 0);
      });
      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
        setCurrentTime(0);
      });
    }
  }, []);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="mt-2 flex items-center gap-2 bg-gray-100 rounded-full p-2">
      <button
        onClick={handlePlayPause}
        className="w-8 h-8 flex items-center justify-center bg-primary rounded-full text-white"
      >
        {isPlaying ? (
          <Pause className="w-4 h-4" />
        ) : (
          <Play className="w-4 h-4" />
        )}
      </button>
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
      <span className="text-xs text-gray-500">
        {audioDuration ? 
          `${Math.floor(audioDuration / 60)}:${(Math.floor(audioDuration) % 60).toString().padStart(2, '0')}` 
          : '0:00'}
      </span>
      <Volume2 className="w-4 h-4 text-gray-500" />
      <audio ref={audioRef} className="hidden" />
    </div>
  );
};