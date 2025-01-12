import React, { useEffect, useRef, useState } from 'react';
import { CallControls } from './CallControls';
import { webRTCCall } from '@/features/call/WebRTCCall';
import { useProfile } from '@/hooks/useProfile';
import { callState } from '@/features/call/CallState';
import { callSignaling } from '@/features/call/CallSignaling';
import { CallNotification } from './CallNotification';
import { toast } from 'sonner';

interface VideoCallProps {
  recipientId: string;
}

export const VideoCall: React.FC<VideoCallProps> = ({ recipientId }) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const { profile } = useProfile();

  useEffect(() => {
    const startCall = async () => {
      if (profile?.id) {
        try {
          await webRTCCall.startCall(recipientId);
          const localStream = webRTCCall.getLocalStream();
          if (localVideoRef.current && localStream) {
            localVideoRef.current.srcObject = localStream;
          }
        } catch (error) {
          console.error('Error starting call:', error);
          toast.error('Failed to start video call');
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

    const handleRemoteStream = (event: CustomEvent) => {
      if (remoteVideoRef.current && event.detail.stream) {
        remoteVideoRef.current.srcObject = event.detail.stream;
      }
    };

    startCall();

    window.addEventListener('incomingCall', handleIncomingCall as EventListener);
    window.addEventListener('callResponse', handleCallResponse as EventListener);
    window.addEventListener('callEnded', handleCallEnded as EventListener);
    window.addEventListener('remoteStreamUpdated', handleRemoteStream as EventListener);

    return () => {
      window.removeEventListener('incomingCall', handleIncomingCall as EventListener);
      window.removeEventListener('callResponse', handleCallResponse as EventListener);
      window.removeEventListener('callEnded', handleCallEnded as EventListener);
      window.removeEventListener('remoteStreamUpdated', handleRemoteStream as EventListener);
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

  const toggleVideo = () => {
    const localStream = webRTCCall.getLocalStream();
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoEnabled(!isVideoEnabled);
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
      
      <div className="relative h-full w-full bg-gray-900">
        <div className="absolute inset-0 flex items-center justify-center">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="absolute top-4 right-4 w-1/4 aspect-video">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover rounded-lg shadow-lg"
          />
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <CallControls
            onEndCall={handleEndCall}
            isAudioEnabled={isAudioEnabled}
            isVideoEnabled={isVideoEnabled}
            onToggleAudio={toggleAudio}
            onToggleVideo={toggleVideo}
          />
        </div>
      </div>
    </>
  );
};