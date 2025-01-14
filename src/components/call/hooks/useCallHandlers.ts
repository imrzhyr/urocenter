import { useEffect, useRef } from 'react';
import { webRTCCall } from '@/features/call/WebRTCCall';
import { callSignaling } from '@/features/call/CallSignaling';
import { callState } from '@/features/call/CallState';
import { toast } from 'sonner';

export const useCallHandlers = (
  recipientId: string,
  onCallEnded: () => void,
  audioRef: React.RefObject<HTMLAudioElement>,
  setShowNotification: (show: boolean) => void
) => {
  const channelInitializedRef = useRef(false);
  const callInitiatedRef = useRef(false);
  const notificationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleIncomingCall = (event: CustomEvent) => {
      const { callerId } = event.detail;
      if (callerId === recipientId) {
        if (notificationTimeoutRef.current) {
          clearTimeout(notificationTimeoutRef.current);
        }
        
        notificationTimeoutRef.current = setTimeout(() => {
          setShowNotification(true);
          toast.info('Incoming call...', { duration: 10000 });
        }, 2000);
      }
    };

    const handleCallResponse = async (event: CustomEvent) => {
      const { accepted } = event.detail;
      if (accepted) {
        try {
          await webRTCCall.startCall(recipientId);
          callState.setStatus('connected', recipientId);
          toast.success('Call connected');
        } catch (error) {
          console.error('Error establishing call connection:', error);
          toast.error('Failed to connect call');
          handleEndCall();
        }
      } else {
        handleEndCall();
        toast.error('Call rejected');
      }
    };

    const handleWebRTCOffer = async (event: CustomEvent) => {
      try {
        await webRTCCall.handleIncomingOffer(event.detail.offer);
      } catch (error) {
        console.error('Error handling WebRTC offer:', error);
        toast.error('Failed to establish connection');
        handleEndCall();
      }
    };

    const handleWebRTCAnswer = async (event: CustomEvent) => {
      try {
        await webRTCCall.handleAnswer(event.detail.answer);
      } catch (error) {
        console.error('Error handling WebRTC answer:', error);
        toast.error('Failed to establish connection');
        handleEndCall();
      }
    };

    const handleIceCandidate = async (event: CustomEvent) => {
      try {
        await webRTCCall.handleIceCandidate(event.detail.candidate);
      } catch (error) {
        console.error('Error handling ICE candidate:', error);
      }
    };

    const handleCallEnded = () => {
      handleEndCall();
      toast.info('Call ended');
    };

    const handleEndCall = () => {
      if (channelInitializedRef.current) {
        if (notificationTimeoutRef.current) {
          clearTimeout(notificationTimeoutRef.current);
        }
        
        callSignaling.endCall();
        webRTCCall.endCall();
        callState.setStatus('idle');
        if (audioRef.current) {
          audioRef.current.srcObject = null;
        }
        channelInitializedRef.current = false;
        callInitiatedRef.current = false;
        onCallEnded();
      }
    };

    window.addEventListener('incomingCall', handleIncomingCall as EventListener);
    window.addEventListener('callResponse', handleCallResponse as EventListener);
    window.addEventListener('webrtcOffer', handleWebRTCOffer as EventListener);
    window.addEventListener('webrtcAnswer', handleWebRTCAnswer as EventListener);
    window.addEventListener('iceCandidate', handleIceCandidate as EventListener);
    window.addEventListener('callEnded', handleCallEnded as EventListener);

    return () => {
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }
      
      window.removeEventListener('incomingCall', handleIncomingCall as EventListener);
      window.removeEventListener('callResponse', handleCallResponse as EventListener);
      window.removeEventListener('webrtcOffer', handleWebRTCOffer as EventListener);
      window.removeEventListener('webrtcAnswer', handleWebRTCAnswer as EventListener);
      window.removeEventListener('iceCandidate', handleIceCandidate as EventListener);
      window.removeEventListener('callEnded', handleCallEnded as EventListener);
      handleEndCall();
    };
  }, [recipientId, onCallEnded]);

  return { channelInitializedRef, callInitiatedRef };
};