import React from 'react';
import { Play, Pause, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AudioControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  isLoading: boolean;
}

export const AudioControls = ({ isPlaying, onPlayPause, isLoading }: AudioControlsProps) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-10 w-10 rounded-full bg-primary/10 hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30"
      onClick={onPlayPause}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
      ) : isPlaying ? (
        <Pause className="h-5 w-5 text-primary" />
      ) : (
        <Play className="h-5 w-5 text-primary ml-0.5" />
      )}
    </Button>
  );
};