import { useEffect, useRef } from 'react';

interface VideoContainerProps {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
}

export const VideoContainer = ({ localStream, remoteStream }: VideoContainerProps) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  return (
    <div className="relative w-full h-full">
      {remoteStream && (
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
      )}
      {localStream && (
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          className="absolute bottom-4 right-4 w-32 h-48 object-cover rounded-lg shadow-lg"
        />
      )}
    </div>
  );
};