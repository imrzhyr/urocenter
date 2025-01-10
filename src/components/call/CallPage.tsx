import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { useCallSetup } from "./hooks/useCallSetup";
import { useCallSubscription } from "@/hooks/useCallSubscription";
import { useCallHandlers } from "@/hooks/useCallHandlers";
import { useWebRTC } from "@/hooks/useWebRTC";
import { CallContainer } from "./CallContainer";
import { toast } from "sonner";

export const CallPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { profile } = useProfile();
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  
  const {
    callingUser,
    callStatus,
    setCallStatus,
    isIncoming,
    activeCallId
  } = useCallSetup(userId, profile);

  const {
    duration,
    setDuration,
    handleEndCall,
    handleAcceptCall: baseHandleAcceptCall,
    handleRejectCall,
    setCallStartTime
  } = useCallHandlers(userId, profile);

  const {
    localStream,
    remoteStream,
    isConnected,
    startCall,
    endCall: endWebRTCCall
  } = useWebRTC(
    activeCallId || '', 
    profile?.id || '', 
    userId || ''
  );

  useEffect(() => {
    if (remoteStream && !audioElement) {
      const audio = new Audio();
      audio.srcObject = remoteStream;
      audio.play().catch(console.error);
      setAudioElement(audio);
    }
  }, [remoteStream, audioElement]);

  useEffect(() => {
    if (audioElement) {
      audioElement.muted = isMuted;
    }
    
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !isMuted;
      });
    }
  }, [isMuted, localStream, audioElement]);

  useCallSubscription({
    userId: userId || '',
    onCallAccepted: () => {
      setCallStatus('connected');
      setCallStartTime(new Date());
      startCall().catch(error => {
        console.error('Error starting WebRTC call:', error);
        toast.error('Failed to establish call connection');
      });
    },
    onCallEnded: async () => {
      await endWebRTCCall();
      handleEndCall();
      navigate(-1);
    }
  });

  const handleAcceptCall = async () => {
    await baseHandleAcceptCall();
    startCall().catch(error => {
      console.error('Error starting WebRTC call:', error);
      toast.error('Failed to establish call connection');
    });
  };

  const onEndCall = async () => {
    await endWebRTCCall();
    handleEndCall();
    navigate(-1);
  };

  return (
    <CallContainer
      onBack={() => navigate(-1)}
      duration={duration}
      callStatus={callStatus}
      callingUser={callingUser}
      isIncoming={isIncoming}
      isMuted={isMuted}
      isSpeaker={isSpeaker}
      onToggleMute={() => setIsMuted(!isMuted)}
      onToggleSpeaker={() => setIsSpeaker(!isSpeaker)}
      onEndCall={onEndCall}
      onAcceptCall={handleAcceptCall}
      onRejectCall={handleRejectCall}
    />
  );
};