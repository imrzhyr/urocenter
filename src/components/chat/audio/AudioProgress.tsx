import React from 'react';
import { Volume2 } from 'lucide-react';
import { formatTime } from '@/utils/audioUtils';

interface AudioProgressProps {
  currentTime: number;
  duration: number;
  progress: number;
}

export const AudioProgress = ({ currentTime, duration, progress }: AudioProgressProps) => {
  return (
    <div className="flex items-center gap-2 flex-1">
      <div className="relative flex-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div 
          className="absolute left-0 top-0 h-full bg-primary transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="text-xs text-gray-600 dark:text-gray-300 min-w-[80px] text-right">
        {formatTime(currentTime)} / {formatTime(duration)}
      </span>
      <Volume2 className="w-4 h-4 text-gray-500" />
    </div>
  );
};