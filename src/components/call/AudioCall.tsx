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
  const [isSpeakerEnabled, setIsSpeakerEnabled] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { profile } = useProfile();

  useEffect(() => {
    const startCall = async () => {
      if (profile?.id) {
        try {
          await webRTCCall.startCall(recipientId);
          webRTCCall.onRemoteStream((stream) => {
            if (audioRef.current) {
              audioRef.current.srcObject = stream;
            }
          });
          // Send call request to recipient
          await callSignaling.sendCallRequest(recipientId, profile.id);
          toast.info('Calling...');
        } catch (error) {
          console.error('Error starting call:', error);
          toast.error('Failed to start audio call');
          callState.setStatus('ended');
        }
      }
    };

    const handleIncomingCall = (event: CustomEvent) => {
      const { callerId } = event.detail;
      if (callerId === recipientId) {
        setShowNotification(true);
        toast.info('Incoming call...', {
          duration: 10000,
        });
      }
    };

    const handleCallResponse = async (event: CustomEvent) => {
      const { accepted } = event.detail;
      if (accepted) {
        callState.setStatus('connected', recipientId);
        toast.success('Call connected');
      } else {
        callState.setStatus('ended');
        toast.error('Call rejected');
        handleEndCall();
      }
    };

    const handleCallEnded = () => {
      callState.setStatus('ended');
      toast.info('Call ended');
      webRTCCall.endCall();
      if (audioRef.current) {
        audioRef.current.srcObject = null;
      }
    };

    // Only start call if we're the initiator
    if (callState.getStatus() === 'ringing') {
      startCall();
    }

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
    if (audioRef.current) {
      audioRef.current.srcObject = null;
    }
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

  const toggleSpeaker = () => {
    if (audioRef.current) {
      audioRef.current.setSinkId(isSpeakerEnabled ? 'default' : 'speaker');
      setIsSpeakerEnabled(!isSpeakerEnabled);
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
      
      <audio ref={audioRef} autoPlay />
      
      <CallControls
        onEndCall={handleEndCall}
        isAudioEnabled={isAudioEnabled}
        isSpeakerEnabled={isSpeakerEnabled}
        onToggleAudio={toggleAudio}
        onToggleSpeaker={toggleSpeaker}
      />
    </>
  );
};