import React from 'react';
import { callState } from '@/features/call/CallState';
import { useEffect, useState } from 'react';

export const CallDuration = () => {
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDuration(callState.getCallDuration());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="text-sm text-white">
      {formatDuration(duration)}
    </div>
  );
};