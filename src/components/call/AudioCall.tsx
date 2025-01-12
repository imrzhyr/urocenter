import React, { useEffect, useRef, useState } from 'react';
import { CallControls } from './CallControls';
import { webRTCCall } from '@/features/call/WebRTCCall';
import { useProfile } from '@/hooks/useProfile';
import { callState } from '@/features/call/CallState';
import { callSignaling } from '@/features/call/CallSignaling';
import { CallNotification } from './CallNotification';
import { toast } from 'sonner';

interface AudioCallProps {
  recipientId: string;
}

export const AudioCall: React.FC<AudioCallProps> = ({ recipientId }) => {
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const { profile } = useProfile();

  useEffect(() => {
    const startCall = async () => {
      if (profile?.id) {
        try {
          await webRTCCall.startCall(recipientId);
        } catch (error) {
          console.error('Error starting call:', error);
          toast.error('Failed to start audio call');
          callState.setStatus('ended');
        }
      }
    };

    const handleIncomingCall = (event: CustomEvent) => {
      const { callerId } = event.detail;
      setShowNotification(true);
      toast.info('Incoming call...', {
        duration: 10000,
      });
    };

    const handleCallResponse = async (event: CustomEvent) => {
      const { accepted } = event.detail;
      if (accepted) {
        callState.setStatus('connected', recipientId);
        toast.success('Call connected');
      } else {
        callState.setStatus('ended');
        toast.error('Call rejected');
      }
    };

    const handleCallEnded = () => {
      callState.setStatus('ended');
      toast.info('Call ended');
      webRTCCall.endCall();
    };

    startCall();

    window.addEventListener('incomingCall', handleIncomingCall as EventListener);
    window.addEventListener('callResponse', handleCallResponse as EventListener);
    window.addEventListener('callEnded', handleCallEnded as EventListener);

    return () => {
      window.removeEventListener('incomingCall', handleIncomingCall as EventListener);
      window.removeEventListener('callResponse', handleCallResponse as EventListener);
      window.removeEventListener('callEnded', handleCallEnded as EventListener);
      webRTCCall.endCall();
      callSignaling.cleanup();
    };
  }, [recipientId, profile?.id]);

  const handleEndCall = () => {
    callSignaling.sendCallEnded();
    webRTCCall.endCall();
    callState.setStatus('ended');
  };

  const handleAcceptCall = async () => {
    setShowNotification(false);
    await callSignaling.sendCallResponse(true);
    callState.setStatus('connected', recipientId);
  };

  const handleRejectCall = async () => {
    setShowNotification(false);
    await callSignaling.sendCallResponse(false);
    callState.setStatus('ended');
  };

  const toggleAudio = () => {
    const localStream = webRTCCall.getLocalStream();
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  return (
    <>
      {showNotification && (
        <CallNotification
          callerId={recipientId}
          onAccept={handleAcceptCall}
          onReject={handleRejectCall}
        />
      )}
      
      <div className="fixed inset-0 bg-gray-900/80 flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
          <CallControls
            onEndCall={handleEndCall}
            isAudioEnabled={isAudioEnabled}
            isVideoEnabled={false}
            onToggleAudio={toggleAudio}
            onToggleVideo={() => {}}
          />
        </div>
      </div>
    </>
  );
};