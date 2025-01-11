import { useEffect, useRef } from 'react';
import { incomingCallPlayer, outgoingCallPlayer } from '@/utils/audioUtils';

export const useCallAudio = (callStatus: string, isIncoming: boolean) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (callStatus === 'ringing' && !isIncoming) {
      outgoingCallPlayer.play();
    } else {
      outgoingCallPlayer.stop();
    }

    return () => {
      outgoingCallPlayer.stop();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.srcObject = null;
        audioRef.current = null;
      }
    };
  }, [callStatus, isIncoming]);

  return { audioRef };
};