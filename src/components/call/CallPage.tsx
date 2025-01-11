import { useState, useEffect, useCallback, useRef } from "react";
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
  const [isSpeaker, setIsSpeaker] = useState(true); // Default to true for better UX
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
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

  const handleCallAccepted = useCallback(async () => {
    console.log('Call accepted, updating status to connected');
    setCallStatus('connected');
    setIsIncoming(false);
    setCallStartTime(new Date());
    try {
      await startCall();
    } catch (error) {
      console.error('Error starting WebRTC call:', error);
      toast.error('Failed to establish call connection');
    }
  }, [setCallStatus, setIsIncoming, setCallStartTime, startCall]);

  const handleCallEnded = useCallback(async () => {
    console.log('Call ended, cleaning up');
    await endWebRTCCall();
    handleEndCall();
    navigate('/chat', { replace: true });
  }, [endWebRTCCall, handleEndCall, navigate]);

  useCallSubscription({
    userId: userId || '',
    onCallAccepted: handleCallAccepted,
    onCallEnded: handleCallEnded
  });

  // Handle remote stream
  useEffect(() => {
    if (remoteStream && !audioRef.current) {
      console.log('Setting up audio element with remote stream');
      const audio = new Audio();
      audio.srcObject = remoteStream;
      audio.autoplay = true;
      audio.play().catch(console.error);
      audioRef.current = audio;
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.srcObject = null;
        audioRef.current = null;
      }
    };
  }, [remoteStream]);

  // Handle mute/speaker settings
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = !isSpeaker;
    }
    
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !isMuted;
      });
    }
  }, [isMuted, isSpeaker, localStream]);

  const handleAcceptCall = useCallback(async () => {
    console.log('Accepting call...');
    try {
      await baseHandleAcceptCall();
      await handleCallAccepted();
    } catch (error) {
      console.error('Error accepting call:', error);
      toast.error('Failed to establish call connection');
    }
  }, [baseHandleAcceptCall, handleCallAccepted]);

  const onEndCall = useCallback(async () => {
    try {
      await endWebRTCCall();
      await handleEndCall();
      navigate('/chat', { replace: true });
    } catch (error) {
      console.error('Error ending call:', error);
      toast.error('Failed to end call properly');
      navigate('/chat', { replace: true });
    }
  }, [endWebRTCCall, handleEndCall, navigate]);

  const onBack = useCallback(() => {
    navigate('/chat', { replace: true });
  }, [navigate]);

  return (
    <CallContainer
      onBack={onBack}
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