import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { useCallSetup } from "./hooks/useCallSetup";
import { useCallSubscription } from "@/hooks/useCallSubscription";
import { useCallHandlers } from "@/hooks/useCallHandlers";
import { useWebRTC } from "@/hooks/useWebRTC";
import { CallContainer } from "./CallContainer";
import { useCall } from "@/contexts/CallContext";
import { toast } from "sonner";

export const CallPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { profile } = useProfile();
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { setCallActive, setDuration, setCallingUser, setActiveCallId } = useCall();
  
  const {
    callingUser,
    callStatus,
    setCallStatus,
    isIncoming,
    setIsIncoming,
    activeCallId: setupCallId
  } = useCallSetup(userId, profile);

  useEffect(() => {
    if (callingUser) {
      setCallingUser(callingUser);
    }
  }, [callingUser, setCallingUser]);

  useEffect(() => {
    if (setupCallId) {
      setActiveCallId(setupCallId);
    }
  }, [setupCallId, setActiveCallId]);

  const {
    localStream,
    remoteStream,
    isConnected,
    startCall,
    endCall: endWebRTCCall,
    initializeWebRTC
  } = useWebRTC(
    setupCallId || '', 
    profile?.id || '', 
    userId || ''
  );

  const {
    duration,
    handleEndCall,
    handleAcceptCall: baseHandleAcceptCall,
    handleRejectCall,
    setCallStartTime
  } = useCallHandlers(userId, profile);

  useEffect(() => {
    setDuration(duration);
  }, [duration, setDuration]);

  // Initialize WebRTC when accepting a call
  const handleCallAccepted = useCallback(async () => {
    if (!setupCallId) {
      console.error('No active call ID available');
      toast.error('Call setup incomplete');
      return;
    }

    console.log('Call accepted, initializing WebRTC with:', {
      activeCallId: setupCallId,
      userId: profile?.id,
      remoteUserId: userId
    });

    try {
      const webrtcConnection = await initializeWebRTC();
      console.log('WebRTC initialized successfully:', webrtcConnection);
      
      setCallStatus('connected');
      setIsIncoming(false);
      setCallStartTime(new Date());
      setCallActive(true);
      
      console.log('Starting WebRTC call...');
      await startCall();
      console.log('WebRTC call started successfully');
    } catch (error) {
      console.error('Error starting WebRTC call:', error);
      toast.error('Failed to establish call connection');
    }
  }, [setupCallId, setCallStatus, setIsIncoming, setCallStartTime, startCall, initializeWebRTC, profile?.id, userId, setCallActive]);

  const handleCallEnded = useCallback(async () => {
    console.log('Call ended, cleaning up WebRTC...');
    await endWebRTCCall();
    handleEndCall();
    setCallActive(false);
    navigate('/chat', { replace: true });
  }, [endWebRTCCall, handleEndCall, navigate, setCallActive]);

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
      audio.play().catch(error => {
        console.error('Error playing audio:', error);
        toast.error('Could not play audio stream');
      });
      audioRef.current = audio;
    }

    return () => {
      if (audioRef.current) {
        console.log('Cleaning up audio element');
        audioRef.current.pause();
        audioRef.current.srcObject = null;
        audioRef.current = null;
      }
    };
  }, [remoteStream]);

  // Handle mute/speaker settings
  useEffect(() => {
    if (audioRef.current) {
      console.log('Updating audio settings:', { isMuted, isSpeaker });
      audioRef.current.muted = !isSpeaker;
    }
    
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !isMuted;
      });
    }
  }, [isMuted, isSpeaker, localStream]);

  // Update call status when WebRTC connection is established
  useEffect(() => {
    if (isConnected && callStatus === 'ringing') {
      console.log('WebRTC connection established, updating call status');
      setCallStatus('connected');
      setCallStartTime(new Date());
    }
  }, [isConnected, callStatus, setCallStatus, setCallStartTime]);

  const handleAcceptCall = useCallback(async () => {
    if (!setupCallId) {
      console.error('No active call ID available');
      toast.error('Call setup incomplete');
      return;
    }

    console.log('Accepting call...', { setupCallId });
    try {
      await baseHandleAcceptCall();
      await handleCallAccepted();
    } catch (error) {
      console.error('Error accepting call:', error);
      toast.error('Failed to establish call connection');
    }
  }, [setupCallId, baseHandleAcceptCall, handleCallAccepted]);

  const onEndCall = useCallback(async () => {
    try {
      console.log('Ending call...');
      await endWebRTCCall();
      await handleEndCall();
      setCallActive(false);
      navigate('/chat', { replace: true });
    } catch (error) {
      console.error('Error ending call:', error);
      toast.error('Failed to end call properly');
      navigate('/chat', { replace: true });
    }
  }, [endWebRTCCall, handleEndCall, navigate, setCallActive]);

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