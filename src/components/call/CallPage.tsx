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
    setIsIncoming,
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
      console.log('Call accepted, updating status to connected');
      setCallStatus('connected');
      setIsIncoming(false);
      setCallStartTime(new Date());
      startCall().catch(error => {
        console.error('Error starting WebRTC call:', error);
        toast.error('Failed to establish call connection');
      });
    },
    onCallEnded: async () => {
      console.log('Call ended, cleaning up');
      await endWebRTCCall();
      handleEndCall();
      navigate('/chat', { replace: true });
    }
  });

  const handleAcceptCall = async () => {
    console.log('Accepting call...');
    await baseHandleAcceptCall();
    setCallStatus('connected');
    setIsIncoming(false);
    setCallStartTime(new Date());
    startCall().catch(error => {
      console.error('Error starting WebRTC call:', error);
      toast.error('Failed to establish call connection');
    });
  };

  const onEndCall = async () => {
    try {
      await endWebRTCCall();
      await handleEndCall();
      navigate('/chat', { replace: true });
    } catch (error) {
      console.error('Error ending call:', error);
      toast.error('Failed to end call properly');
      navigate('/chat', { replace: true });
    }
  };

  const onBack = () => {
    navigate('/chat', { replace: true });
  };

  // Only show incoming controls on the IncomingCallDialog, not on the CallPage
  const showIncomingControls = false;

  return (
    <CallContainer
      onBack={onBack}
      duration={duration}
      callStatus={callStatus}
      callingUser={callingUser}
      isIncoming={showIncomingControls}
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