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
  onCallEnded?: () => void;
}

export const AudioCall: React.FC<AudioCallProps> = ({ 
  recipientId,
  onCallEnded 
}) => {
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isSpeakerEnabled, setIsSpeakerEnabled] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { profile } = useProfile();

  useEffect(() => {
    const startCall = async () => {
      if (profile?.id) {
        try {
          console.log('Starting call to:', recipientId);
          await webRTCCall.startCall(recipientId);
          
          webRTCCall.onRemoteStream((stream) => {
            console.log('Received remote stream:', stream);
            if (audioRef.current) {
              audioRef.current.srcObject = stream;
            }
          });
          
          await callSignaling.sendCallRequest(recipientId, profile.id);
          toast.info('Calling...');
          
        } catch (error) {
          console.error('Error starting call:', error);
          toast.error('Failed to start audio call');
          handleEndCall();
        }
      }
    };

    const handleIncomingCall = (event: CustomEvent) => {
      const { callerId } = event.detail;
      console.log('Incoming call from:', callerId);
      if (callerId === recipientId) {
        setShowNotification(true);
        toast.info('Incoming call...', {
          duration: 10000,
        });
      }
    };

    const handleCallResponse = async (event: CustomEvent) => {
      const { accepted } = event.detail;
      console.log('Call response:', accepted);
      
      if (accepted) {
        callState.setStatus('connected', recipientId);
        toast.success('Call connected');
      } else {
        handleEndCall();
        toast.error('Call rejected');
      }
    };

    const handleCallEnded = () => {
      console.log('Call ended');
      handleEndCall();
      toast.info('Call ended');
    };

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
      handleEndCall();
    };
  }, [recipientId, profile?.id]);

  const handleEndCall = () => {
    console.log('Ending call');
    callSignaling.sendCallEnded();
    webRTCCall.endCall();
    callState.setStatus('idle');  // Set status to idle when call ends
    if (audioRef.current) {
      audioRef.current.srcObject = null;
    }
    onCallEnded?.();
  };

  const handleAcceptCall = async () => {
    console.log('Accepting call');
    setShowNotification(false);
    await callSignaling.sendCallResponse(true);
    callState.setStatus('connected', recipientId);
  };

  const handleRejectCall = async () => {
    console.log('Rejecting call');
    setShowNotification(false);
    await callSignaling.sendCallResponse(false);
    handleEndCall();
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
      audioRef.current.setSinkId(isSpeakerEnabled ? 'default' : 'speaker')
        .then(() => {
          setIsSpeakerEnabled(!isSpeakerEnabled);
        })
        .catch(error => {
          console.error('Error switching audio output:', error);
          toast.error('Failed to switch speaker');
        });
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
