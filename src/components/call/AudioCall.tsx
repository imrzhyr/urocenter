import React, { useRef, useState } from 'react';
import { CallControls } from './CallControls';
import { webRTCCall } from '@/features/call/WebRTCCall';
import { useProfile } from '@/hooks/useProfile';
import { callState } from '@/features/call/CallState';
import { callSignaling } from '@/features/call/CallSignaling';
import { CallNotification } from './CallNotification';
import { toast } from 'sonner';
import { useCallHandlers } from './hooks/useCallHandlers';
import { useCallSetup } from './hooks/useCallSetup';
import { TestCallSimulator } from './TestCallSimulator';

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

  const { channelInitializedRef, callInitiatedRef } = useCallHandlers(
    recipientId,
    () => onCallEnded?.(),
    audioRef,
    setShowNotification
  );

  useCallSetup(
    recipientId,
    profile?.id,
    audioRef,
    channelInitializedRef,
    callInitiatedRef
  );

  const handleAcceptCall = async () => {
    console.log('Accepting call');
    setShowNotification(false);
    try {
      await callSignaling.sendCallResponse(true);
      callState.setStatus('connected', recipientId);
      toast.success('Call connected');
    } catch (error) {
      console.error('Error accepting call:', error);
      toast.error('Failed to accept call');
    }
  };

  const handleRejectCall = async () => {
    console.log('Rejecting call');
    setShowNotification(false);
    try {
      await callSignaling.sendCallResponse(false);
      callState.setStatus('idle');
      webRTCCall.endCall();
      toast.info('Call rejected');
    } catch (error) {
      console.error('Error rejecting call:', error);
      toast.error('Failed to reject call');
    }
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
      <TestCallSimulator recipientId={recipientId} />
      
      {showNotification && (
        <CallNotification
          callerId={recipientId}
          onAccept={handleAcceptCall}
          onReject={handleRejectCall}
        />
      )}
      
      <audio ref={audioRef} autoPlay />
      
      {(callState.getStatus() === 'ringing' || callState.getStatus() === 'connected') && (
        <CallControls
          onEndCall={() => {
            webRTCCall.endCall();
            callState.setStatus('idle');
            onCallEnded?.();
          }}
          isAudioEnabled={isAudioEnabled}
          isSpeakerEnabled={isSpeakerEnabled}
          onToggleAudio={toggleAudio}
          onToggleSpeaker={toggleSpeaker}
        />
      )}
    </>
  );
};