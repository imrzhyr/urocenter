import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AudioCall } from '@/components/call/AudioCall';
import { callState } from '@/features/call/CallState';
import { callSignaling } from '@/features/call/CallSignaling';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const CallPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      console.log('Initializing call to:', userId);
      callState.setStatus('ringing');
      callSignaling.initialize(userId);
    }

    return () => {
      callSignaling.cleanup();
      callState.setStatus('ended');
    };
  }, [userId]);

  const handleBack = () => {
    navigate(`/chat/${userId}`);
  };

  if (!userId) {
    return null;
  }

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-[#1A1F2C]">
      <div className="fixed top-0 left-0 right-0 z-10 bg-[#0066CC] text-white shadow-sm">
        <div className="flex items-center py-2 px-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-primary-foreground/10 h-8 w-8 mr-2"
            onClick={handleBack}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-sm font-medium">Call</h1>
        </div>
      </div>
      
      <div className="flex-1 mt-[48px]">
        <AudioCall recipientId={userId} />
      </div>
    </div>
  );
};

export default CallPage;