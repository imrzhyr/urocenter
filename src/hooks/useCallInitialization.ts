import { useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { useCall } from '@/contexts/CallContext';
import { CallStatus } from '@/types/call';

export const useCallInitialization = (
  activeCallId: string | null,
  userId: string | undefined,
  initializeWebRTC: () => Promise<RTCPeerConnection | null>,
  startCall: () => Promise<void>,
  setCallStatus: (status: CallStatus) => void,
  setIsIncoming: (isIncoming: boolean) => void,
  setCallStartTime: (date: Date) => void
) => {
  const { setActiveCall } = useCall();
  const callInitializedRef = useRef(false);

  const handleCallAccepted = useCallback(async () => {
    if (!activeCallId || !userId || callInitializedRef.current) {
      console.error('No active call ID available or call already initialized');
      return;
    }

    console.log('Call accepted, initializing WebRTC with:', {
      activeCallId,
      userId
    });

    try {
      callInitializedRef.current = true;
      const webrtcConnection = await initializeWebRTC();
      console.log('WebRTC initialized successfully:', webrtcConnection);
      
      setCallStatus('connected');
      setIsIncoming(false);
      setCallStartTime(new Date());
      setActiveCall(activeCallId, userId);
      
      console.log('Starting WebRTC call...');
      await startCall();
      console.log('WebRTC call started successfully');
    } catch (error) {
      console.error('Error starting WebRTC call:', error);
      toast.error('Failed to establish call connection');
      callInitializedRef.current = false;
    }
  }, [activeCallId, userId, initializeWebRTC, startCall, setCallStatus, setIsIncoming, setCallStartTime, setActiveCall]);

  return {
    handleCallAccepted,
    callInitializedRef
  };
};