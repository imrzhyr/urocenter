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
  const channelInitializedRef = useRef(false);
  const callInitiatedRef = useRef(false);
  const notificationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const initializeCallChannel = async () => {
      if (!profile?.id || channelInitializedRef.current) return;
      
      try {
        await callSignaling.initialize(recipientId);
        channelInitializedRef.current = true;
        console.log('Call channel initialized for:', recipientId);
      } catch (error) {
        console.error('Failed to initialize call channel:', error);
        toast.error('Failed to initialize call');
        handleEndCall();
      }
    };

    const startOutgoingCall = async () => {
      if (!profile?.id || callInitiatedRef.current) return;
      
      try {
        callInitiatedRef.current = true;
        await webRTCCall.startCall(recipientId);
        
        webRTCCall.onRemoteStream((stream) => {
          if (audioRef.current) {
            audioRef.current.srcObject = stream;
          }
        });
        
        await callSignaling.sendCallRequest(profile.id);
        toast.info('Calling...');
      } catch (error) {
        console.error('Error starting call:', error);
        toast.error('Failed to start audio call');
        handleEndCall();
      }
    };

    const handleIncomingCall = (event: CustomEvent) => {
      const { callerId } = event.detail;
      if (callerId === recipientId) {
        if (notificationTimeoutRef.current) {
          clearTimeout(notificationTimeoutRef.current);
        }
        
        notificationTimeoutRef.current = setTimeout(() => {
          setShowNotification(true);
          toast.info('Incoming call...', { duration: 10000 });
        }, 2000);
      }
    };

    const handleCallResponse = async (event: CustomEvent) => {
      const { accepted } = event.detail;
      if (accepted) {
        try {
          await webRTCCall.startCall(recipientId);
          callState.setStatus('connected', recipientId);
          toast.success('Call connected');
        } catch (error) {
          console.error('Error establishing call connection:', error);
          toast.error('Failed to connect call');
          handleEndCall();
        }
      } else {
        handleEndCall();
        toast.error('Call rejected');
      }
    };

    const handleWebRTCOffer = async (event: CustomEvent) => {
      try {
        await webRTCCall.handleIncomingOffer(event.detail.offer);
      } catch (error) {
        console.error('Error handling WebRTC offer:', error);
        toast.error('Failed to establish connection');
        handleEndCall();
      }
    };

    const handleWebRTCAnswer = async (event: CustomEvent) => {
      try {
        await webRTCCall.handleAnswer(event.detail.answer);
      } catch (error) {
        console.error('Error handling WebRTC answer:', error);
        toast.error('Failed to establish connection');
        handleEndCall();
      }
    };

    const handleIceCandidate = async (event: CustomEvent) => {
      try {
        await webRTCCall.handleIceCandidate(event.detail.candidate);
      } catch (error) {
        console.error('Error handling ICE candidate:', error);
      }
    };

    const handleCallEnded = () => {
      handleEndCall();
      toast.info('Call ended');
    };

    const setup = async () => {
      await initializeCallChannel();
      if (callState.getStatus() === 'ringing') {
        await startOutgoingCall();
      }
    };

    setup();

    window.addEventListener('incomingCall', handleIncomingCall as EventListener);
    window.addEventListener('callResponse', handleCallResponse as EventListener);
    window.addEventListener('webrtcOffer', handleWebRTCOffer as EventListener);
    window.addEventListener('webrtcAnswer', handleWebRTCAnswer as EventListener);
    window.addEventListener('iceCandidate', handleIceCandidate as EventListener);
    window.addEventListener('callEnded', handleCallEnded as EventListener);

    return () => {
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }
      
      window.removeEventListener('incomingCall', handleIncomingCall as EventListener);
      window.removeEventListener('callResponse', handleCallResponse as EventListener);
      window.removeEventListener('webrtcOffer', handleWebRTCOffer as EventListener);
      window.removeEventListener('webrtcAnswer', handleWebRTCAnswer as EventListener);
      window.removeEventListener('iceCandidate', handleIceCandidate as EventListener);
      window.removeEventListener('callEnded', handleCallEnded as EventListener);
      handleEndCall();
    };
  }, [recipientId, profile?.id]);

  const handleEndCall = () => {
    if (channelInitializedRef.current) {
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }
      
      callSignaling.endCall();
      webRTCCall.endCall();
      callState.setStatus('idle');
      if (audioRef.current) {
        audioRef.current.srcObject = null;
      }
      channelInitializedRef.current = false;
      callInitiatedRef.current = false;
      onCallEnded?.();
    }
  };

  const handleAcceptCall = async () => {
    setShowNotification(false);
    try {
      await callSignaling.sendCallResponse(true);
      callState.setStatus('connected', recipientId);
    } catch (error) {
      console.error('Error accepting call:', error);
      toast.error('Failed to accept call');
      handleEndCall();
    }
  };

  const handleRejectCall = async () => {
    setShowNotification(false);
    try {
      await callSignaling.sendCallResponse(false);
      handleEndCall();
    } catch (error) {
      console.error('Error rejecting call:', error);
      toast.error('Failed to reject call');
      handleEndCall();
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
          onEndCall={handleEndCall}
          isAudioEnabled={isAudioEnabled}
          isSpeakerEnabled={isSpeakerEnabled}
          onToggleAudio={toggleAudio}
          onToggleSpeaker={toggleSpeaker}
        />
      )}
    </>
  );
};