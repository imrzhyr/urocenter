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
        console.log('Setting up test call simulation...', { recipientId, userRole: profile?.role });
        
        try {
          console.log('Initializing test call...');
          
          // Initialize call signaling
          await callSignaling.initialize('ADMIN_TEST_CALL');
          console.log('Call signaling initialized');
          
          // Set call status to ringing
          callState.setStatus('ringing', 'ADMIN_TEST_CALL');
          console.log('Call status set to ringing');
          
          // Get user media and set up WebRTC
          const stream = await navigator.mediaDevices.getUserMedia({ 
            audio: true,
            video: false 
          });
          console.log('Got media stream:', stream.id);
          
          // Set up WebRTC call
          await webRTCCall.startCall('ADMIN_TEST_CALL');
          console.log('WebRTC call started');
          
          webRTCCall.onRemoteStream((remoteStream) => {
            console.log('Received remote stream in test call:', remoteStream.id);
          });
          
          // Send test call request after a short delay
          setTimeout(async () => {
            try {
              await callSignaling.sendCallRequest('ADMIN_TEST_CALL');
              console.log('Test call request sent');
              
              toast.info('Incoming test call...', {
                duration: 10000
              });
            } catch (error) {
              console.error('Error sending test call request:', error);
              toast.error('Failed to send test call request');
              callState.setStatus('idle');
              webRTCCall.endCall();
            }
          }, 5000);
          
          console.log('Test call initiated successfully');
        } catch (error) {
          console.error('Error simulating test call:', error);
          toast.error('Failed to simulate test call');
          callState.setStatus('idle');
          webRTCCall.endCall();
        }
      };

      // Start test call simulation
      simulateTestCall();
    }
  }, [recipientId, profile?.role]);

  return null;
};