import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AudioCall } from '@/components/call/AudioCall';
import { callState } from '@/features/call/CallState';

const CallPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      navigate('/chat');
      return;
    }

    // Set call status to ringing when page loads
    callState.setStatus('ringing', userId);

    return () => {
      if (callState.getStatus() !== 'ended') {
        callState.endCall();
      }
    };
  }, [userId, navigate]);

  if (!userId) return null;

  return (
    <div className="min-h-screen bg-background">
      <AudioCall recipientId={userId} />
    </div>
  );
};

export default CallPage;