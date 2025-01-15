import { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UseCallStateProps {
  profileId: string | null;
}

/**
 * Hook to manage call state and timing
 */
export const useCallState = ({ profileId }: UseCallStateProps) => {
  const [isInCall, setIsInCall] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [isCallEnded, setIsCallEnded] = useState(false);
  const [currentCallId, setCurrentCallId] = useState<string | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const callTimeoutRef = useRef<NodeJS.Timeout>();
  const durationIntervalRef = useRef<NodeJS.Timeout>();
  const callStartTimeRef = useRef<number | null>(null);

  const startDurationTimer = () => {
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
    }
    callStartTimeRef.current = Date.now();
    setCallDuration(0);
    durationIntervalRef.current = setInterval(() => {
      if (callStartTimeRef.current) {
        const duration = Math.floor((Date.now() - callStartTimeRef.current) / 1000);
        setCallDuration(duration);
      }
    }, 1000);
  };

  const stopDurationTimer = () => {
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
      if (callStartTimeRef.current) {
        const finalDuration = Math.floor((Date.now() - callStartTimeRef.current) / 1000);
        setCallDuration(finalDuration);
      }
    }
  };

  const clearCallTimeout = () => {
    if (callTimeoutRef.current) {
      clearTimeout(callTimeoutRef.current);
      callTimeoutRef.current = undefined;
    }
  };

  const updateCallStatus = async (callId: string, status: string, endCall?: boolean) => {
    try {
      const updates: any = { status };
      if (endCall) {
        updates.ended_at = new Date().toISOString();
      }
      
      const { error } = await supabase
        .from('calls')
        .update(updates)
        .eq('id', callId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating call status:', error);
      toast.error('Failed to update call status');
    }
  };

  return {
    isInCall,
    setIsInCall,
    isCalling,
    setIsCalling,
    isCallEnded,
    setIsCallEnded,
    currentCallId,
    setCurrentCallId,
    callDuration,
    callTimeoutRef,
    startDurationTimer,
    stopDurationTimer,
    clearCallTimeout,
    updateCallStatus
  };
};