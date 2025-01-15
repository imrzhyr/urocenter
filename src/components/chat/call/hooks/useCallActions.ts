import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UseCallActionsProps {
  profileId: string | undefined;
  setupAgoraClient: () => Promise<boolean>;
  clearCallTimeout: () => void;
  setCurrentCallId: (id: string | null) => void;
  setIsInCall: (isInCall: boolean) => void;
  setIncomingCall: (call: { id: string; callerName: string } | null) => void;
  setIsCallEnded: (ended: boolean) => void;
  startDurationTimer: () => void;
  updateCallStatus: (callId: string, status: string, endCall?: boolean) => Promise<void>;
}

export const useCallActions = ({
  profileId,
  setupAgoraClient,
  clearCallTimeout,
  setCurrentCallId,
  setIsInCall,
  setIncomingCall,
  setIsCallEnded,
  startDurationTimer,
  updateCallStatus,
}: UseCallActionsProps) => {
  const acceptCall = useCallback(async (callId: string) => {
    if (!profileId) return;

    try {
      console.log('Accepting call:', callId);
      const success = await setupAgoraClient();
      if (!success) {
        toast.error('Failed to initialize call');
        return;
      }

      clearCallTimeout();
      setCurrentCallId(callId);
      setIsInCall(true);
      setIncomingCall(null);
      setIsCallEnded(false);

      await updateCallStatus(callId, 'active');
      startDurationTimer();
      toast.success('Call connected');
    } catch (error) {
      console.error('Error accepting call:', error);
      toast.error('Failed to accept call');
    }
  }, [profileId, setupAgoraClient, clearCallTimeout, setCurrentCallId, setIsInCall, setIncomingCall, setIsCallEnded, startDurationTimer, updateCallStatus]);

  const rejectCall = useCallback(async (callId: string) => {
    try {
      await updateCallStatus(callId, 'rejected', true);
      setIncomingCall(null);
      toast.info('Call rejected');
    } catch (error) {
      console.error('Error rejecting call:', error);
      toast.error('Failed to reject call');
    }
  }, [updateCallStatus, setIncomingCall]);

  const initiateCall = useCallback(async (receiverId: string, recipientName: string) => {
    if (!profileId) {
      toast.error('You must be logged in to make calls');
      return;
    }

    try {
      console.log('Initiating call to:', receiverId);
      const success = await setupAgoraClient();
      if (!success) return;

      const { data: call, error } = await supabase
        .from('calls')
        .insert({
          caller_id: profileId,
          receiver_id: receiverId,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      setCurrentCallId(call.id);
    } catch (error) {
      console.error('Error in initiateCall:', error);
      toast.error('Failed to start call');
    }
  }, [profileId, setupAgoraClient, setCurrentCallId]);

  return {
    acceptCall,
    rejectCall,
    initiateCall
  };
};