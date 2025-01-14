import { useEffect } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { callState } from '@/features/call/CallState';
import { callSignaling } from '@/features/call/CallSignaling';

export const TestCallSimulator = ({ recipientId }: { recipientId: string }) => {
  const { profile } = useProfile();

  useEffect(() => {
    // Only simulate test call if current user is not admin
    if (profile?.role !== 'admin') {
      const simulateTestCall = async () => {
        // Wait 5 seconds before initiating test call
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        try {
          // Initialize call signaling for admin
          await callSignaling.initialize(recipientId);
          callState.setStatus('ringing', recipientId);
          
          // Send test call request
          await callSignaling.sendCallRequest('ADMIN_TEST_CALL');
        } catch (error) {
          console.error('Error simulating test call:', error);
        }
      };

      simulateTestCall();
    }
  }, [recipientId, profile?.role]);

  return null;
};