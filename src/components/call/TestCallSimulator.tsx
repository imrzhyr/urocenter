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
        
        // Wait 5 seconds before initiating test call
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        try {
          console.log('Initializing test call...');
          
          // Initialize call signaling for admin
          await callSignaling.initialize(recipientId);
          
          // Set call status to ringing
          callState.setStatus('ringing', recipientId);
          console.log('Call status set to ringing');
          
          // Get user media and set up WebRTC
          const stream = await navigator.mediaDevices.getUserMedia({ 
            audio: true,
            video: false 
          });
          console.log('Got media stream:', stream.id);
          
          // Set up WebRTC call
          await webRTCCall.startCall(recipientId);
          console.log('WebRTC call started');
          
          webRTCCall.onRemoteStream((remoteStream) => {
            console.log('Received remote stream in test call:', remoteStream.id);
          });
          
          // Send test call request
          await callSignaling.sendCallRequest('ADMIN_TEST_CALL');
          console.log('Test call request sent');
          
          toast.info('Incoming test call...', {
            duration: 10000
          });
          
          console.log('Test call initiated successfully');
        } catch (error) {
          console.error('Error simulating test call:', error);
          toast.error('Failed to simulate test call');
          callState.setStatus('idle');
          webRTCCall.endCall();
        }
      };

      simulateTestCall();
    }
  }, [recipientId, profile?.role]);

  return null;
};