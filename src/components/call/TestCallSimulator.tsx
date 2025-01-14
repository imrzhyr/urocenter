import { useEffect } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { callState } from '@/features/call/CallState';
import { callSignaling } from '@/features/call/CallSignaling';
import { webRTCCall } from '@/features/call/WebRTCCall';
import { toast } from 'sonner';

export const TestCallSimulator = ({ recipientId }: { recipientId: string }) => {
  const { profile } = useProfile();

  useEffect(() => {
    // Only simulate test call if current user is not admin
    if (profile?.role !== 'admin') {
      const simulateTestCall = async () => {
        console.log('[TestCallSimulator] Starting test call simulation...', { recipientId, userRole: profile?.role });
        
        try {
          // Initialize call signaling
          console.log('[TestCallSimulator] Initializing call signaling...');
          await callSignaling.initialize('ADMIN_TEST_CALL');
          console.log('[TestCallSimulator] Call signaling initialized');
          
          // Get user media and set up WebRTC
          console.log('[TestCallSimulator] Getting user media...');
          const stream = await navigator.mediaDevices.getUserMedia({ 
            audio: true,
            video: false 
          });
          console.log('[TestCallSimulator] Got media stream:', stream.id);
          
          // Set up WebRTC call
          console.log('[TestCallSimulator] Setting up WebRTC call...');
          await webRTCCall.startCall('ADMIN_TEST_CALL');
          console.log('[TestCallSimulator] WebRTC call started');
          
          webRTCCall.onRemoteStream((remoteStream) => {
            console.log('[TestCallSimulator] Received remote stream:', remoteStream.id);
          });
          
          // Set call status and send request after a delay
          console.log('[TestCallSimulator] Setting up delayed test call...');
          setTimeout(async () => {
            try {
              console.log('[TestCallSimulator] Setting call status to ringing...');
              callState.setStatus('ringing', 'ADMIN_TEST_CALL');
              
              console.log('[TestCallSimulator] Sending call request...');
              await callSignaling.sendCallRequest('ADMIN_TEST_CALL');
              console.log('[TestCallSimulator] Test call request sent successfully');
              
              toast.info('Incoming test call...', {
                duration: 10000,
                position: 'top-center'
              });
            } catch (error) {
              console.error('[TestCallSimulator] Error during test call:', error);
              toast.error('Failed to initiate test call');
              callState.setStatus('idle');
              webRTCCall.endCall();
            }
          }, 3000); // Reduced delay to 3 seconds for better UX
          
        } catch (error) {
          console.error('[TestCallSimulator] Error setting up test call:', error);
          toast.error('Failed to set up test call');
          callState.setStatus('idle');
          webRTCCall.endCall();
        }
      };

      // Start test call simulation with initial delay
      console.log('[TestCallSimulator] Scheduling test call simulation...');
      const timer = setTimeout(() => {
        simulateTestCall();
      }, 2000);

      // Cleanup function
      return () => {
        clearTimeout(timer);
        console.log('[TestCallSimulator] Cleaning up test call simulation...');
        webRTCCall.endCall();
        callState.setStatus('idle');
      };
    }
  }, [recipientId, profile?.role]);

  return null;
};