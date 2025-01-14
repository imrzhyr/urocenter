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
  const notificationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const initializeCallChannel = async () => {
      if (profile?.id && !channelInitializedRef.current) {
        try {
          console.log('Initializing call channel for recipient:', recipientId);
          await callSignaling.initialize(recipientId);
          channelInitializedRef.current = true;
          console.log('Call channel initialized successfully');
        } catch (error) {
          console.error('Failed to initialize call channel:', error);
          toast.error('Failed to initialize call');
          handleEndCall();
        }
      }
    };

    const setupCallHandlers = async () => {
      if (profile?.id) {
        try {
          await initializeCallChannel();
          
          if (callState.getStatus() === 'ringing') {
            console.log('Starting call to:', recipientId);
            await webRTCCall.startCall(recipientId);
            
            webRTCCall.onRemoteStream((stream) => {
              console.log('Received remote stream:', stream);
              if (audioRef.current) {
                audioRef.current.srcObject = stream;
              }
            });
            
            // Only send call request after WebRTC setup is complete
            await callSignaling.sendCallRequest(profile.id);
            toast.info('Calling...');
          }
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
        // Clear any existing timeout
        if (notificationTimeoutRef.current) {
          clearTimeout(notificationTimeoutRef.current);
        }
        
        // Set a new timeout to show the notification after 2 seconds
        notificationTimeoutRef.current = setTimeout(() => {
          setShowNotification(true);
          toast.info('Incoming call...', {
            duration: 10000,
          });
        }, 2000);
      }
    };

    const handleCallResponse = async (event: CustomEvent) => {
      const { accepted } = event.detail;
      console.log('Call response received:', accepted);
      
      if (accepted) {
        try {
          await webRTCCall.startCall(recipientId);
          callState.setStatus('connected', recipientId);
          toast.success('Call connected');
        } catch (error) {
          console.error('Error starting call after acceptance:', error);
          toast.error('Failed to establish call connection');
          handleEndCall();
        }
      } else {
        handleEndCall();
        toast.error('Call rejected');
      }
    };

    const handleWebRTCOffer = async (event: CustomEvent) => {
      const { offer } = event.detail;
      console.log('Received WebRTC offer:', offer);
      try {
        await webRTCCall.handleIncomingOffer(offer);
      } catch (error) {
        console.error('Error handling WebRTC offer:', error);
        toast.error('Failed to establish connection');
        handleEndCall();
      }
    };

    const handleWebRTCAnswer = async (event: CustomEvent) => {
      const { answer } = event.detail;
      console.log('Received WebRTC answer:', answer);
      try {
        await webRTCCall.handleAnswer(answer);
      } catch (error) {
        console.error('Error handling WebRTC answer:', error);
        toast.error('Failed to establish connection');
        handleEndCall();
      }
    };

    const handleIceCandidate = async (event: CustomEvent) => {
      const { candidate } = event.detail;
      console.log('Received ICE candidate:', candidate);
      try {
        await webRTCCall.handleIceCandidate(candidate);
      } catch (error) {
        console.error('Error handling ICE candidate:', error);
      }
    };

    const handleCallEnded = () => {
      console.log('Call ended event received');
      handleEndCall();
      toast.info('Call ended');
    };

    setupCallHandlers();

    window.addEventListener('incomingCall', handleIncomingCall as EventListener);
    window.addEventListener('callResponse', handleCallResponse as EventListener);
    window.addEventListener('webrtcOffer', handleWebRTCOffer as EventListener);
    window.addEventListener('webrtcAnswer', handleWebRTCAnswer as EventListener);
    window.addEventListener('iceCandidate', handleIceCandidate as EventListener);
    window.addEventListener('callEnded', handleCallEnded as EventListener);

    return () => {
      // Clear the notification timeout if component unmounts
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
    console.log('Ending call');
    if (channelInitializedRef.current) {
      // Clear any pending notification timeout
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
      onCallEnded?.();
    }
  };

  const handleAcceptCall = async () => {
    console.log('Accepting call');
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
    console.log('Rejecting call');
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