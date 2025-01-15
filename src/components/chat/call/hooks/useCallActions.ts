import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UseCallActionsProps {
  profileId: string | undefined;
  setupWebRTC: () => Promise<boolean>;
  clearCallTimeout: () => void;
  setCurrentCallId: (id: string | null) => void;
  setIsInCall: (isInCall: boolean) => void;
  setIncomingCall: (call: { id: string; callerName: string } | null) => void;
  setIsCallEnded: (ended: boolean) => void;
  startDurationTimer: () => void;
  updateCallStatus: (callId: string, status: string, endCall?: boolean) => Promise<void>;
  peerConnection: React.MutableRefObject<RTCPeerConnection | null>;
}

export const useCallActions = ({
  profileId,
  setupWebRTC,
  clearCallTimeout,
  setCurrentCallId,
  setIsInCall,
  setIncomingCall,
  setIsCallEnded,
  startDurationTimer,
  updateCallStatus,
  peerConnection
}: UseCallActionsProps) => {
  const acceptCall = useCallback(async (callId: string) => {
    if (!profileId) return;

    try {
      console.log('Accepting call:', callId);
      const success = await setupWebRTC();
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
  }, [profileId, setupWebRTC, clearCallTimeout, setCurrentCallId, setIsInCall, setIncomingCall, setIsCallEnded, startDurationTimer, updateCallStatus]);

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
      const success = await setupWebRTC();
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
      
      if (peerConnection.current) {
        console.log('Creating offer...');
        const offer = await peerConnection.current.createOffer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: false
        });
        await peerConnection.current.setLocalDescription(offer);

        await supabase.from('call_signals').insert({
          call_id: call.id,
          from_user: profileId,
          to_user: receiverId,
          type: 'offer',
          data: { sdp: offer }
        });
      }
    } catch (error) {
      console.error('Error in initiateCall:', error);
      toast.error('Failed to start call');
    }
  }, [profileId, setupWebRTC, setCurrentCallId, peerConnection]);

  return {
    acceptCall,
    rejectCall,
    initiateCall
  };
};