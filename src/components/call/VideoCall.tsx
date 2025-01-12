import React, { useEffect, useRef, useState } from 'react';
import { CallControls } from './CallControls';
import { webRTCCall } from '@/features/call/WebRTCCall';
import { useProfile } from '@/hooks/useProfile';

interface VideoCallProps {
  recipientId: string;
}

export const VideoCall: React.FC<VideoCallProps> = ({ recipientId }) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const { profile } = useProfile();

  useEffect(() => {
    const startCall = async () => {
      if (profile?.id) {
        await webRTCCall.startCall(recipientId);
        const localStream = webRTCCall.getLocalStream();
        if (localVideoRef.current && localStream) {
          localVideoRef.current.srcObject = localStream;
        }
      }
    };

    startCall();

    const handleRemoteStream = (event: CustomEvent) => {
      if (remoteVideoRef.current && event.detail.stream) {
        remoteVideoRef.current.srcObject = event.detail.stream;
      }
    };

    window.addEventListener('remoteStreamUpdated', handleRemoteStream as EventListener);

    return () => {
      window.removeEventListener('remoteStreamUpdated', handleRemoteStream as EventListener);
      webRTCCall.endCall();
    };
  }, [recipientId, profile?.id]);

  const handleEndCall = () => {
    webRTCCall.endCall();
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
  );
};