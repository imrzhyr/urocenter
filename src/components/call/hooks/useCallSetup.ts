import { useEffect } from 'react';
import { webRTCCall } from '@/features/call/WebRTCCall';
import { callSignaling } from '@/features/call/CallSignaling';
import { callState } from '@/features/call/CallState';
import { toast } from 'sonner';

export const useCallSetup = (
  recipientId: string,
  profileId: string | undefined,
  audioRef: React.RefObject<HTMLAudioElement>,
  channelInitializedRef: React.MutableRefObject<boolean>,
  callInitiatedRef: React.MutableRefObject<boolean>
) => {
  useEffect(() => {
    const initializeCallChannel = async () => {
      if (!profileId || channelInitializedRef.current) return;
      
      try {
        await callSignaling.initialize(recipientId);
        channelInitializedRef.current = true;
        console.log('Call channel initialized for:', recipientId);
      } catch (error) {
        console.error('Failed to initialize call channel:', error);
        toast.error('Failed to initialize call');
      }
    };

    const startOutgoingCall = async () => {
      if (!profileId || callInitiatedRef.current) return;
      
      try {
        callInitiatedRef.current = true;
        await webRTCCall.startCall(recipientId);
        
        webRTCCall.onRemoteStream((stream) => {
          if (audioRef.current) {
            audioRef.current.srcObject = stream;
          }
        });
        
        await callSignaling.sendCallRequest(profileId);
        toast.info('Calling...');
      } catch (error) {
        console.error('Error starting call:', error);
        toast.error('Failed to start audio call');
        callState.setStatus('idle');
      }
    };

    const setup = async () => {
      await initializeCallChannel();
      if (callState.getStatus() === 'ringing') {
        await startOutgoingCall();
      }
    };

    setup();
  }, [recipientId, profileId]);
};