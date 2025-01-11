import { useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { useCallSetup } from "./hooks/useCallSetup";
import { useCallSubscription } from "@/hooks/useCallSubscription";
import { useCallHandlers } from "@/hooks/useCallHandlers";
import { useWebRTC } from "@/hooks/useWebRTC";
import { CallContainer } from "./CallContainer";
import { useCallState } from "@/hooks/useCallState";
import { useCallAudio } from "@/hooks/useCallAudio";
import { useCallInitialization } from "@/hooks/useCallInitialization";
import { toast } from "sonner";

export const CallPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { profile } = useProfile();

  const {
    callingUser,
    callStatus,
    setCallStatus,
    isIncoming,
    setIsIncoming,
    activeCallId
  } = useCallSetup(userId, profile);

  const {
    localStream,
    remoteStream,
    isConnected,
    startCall,
    endCall: endWebRTCCall,
    initializeWebRTC
  } = useWebRTC(
    activeCallId || '', 
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

  const {
    isMuted,
    setIsMuted,
    isSpeaker,
    setIsSpeaker,
    handleCallEnded
  } = useCallState(userId, profile);

  const { audioRef } = useCallAudio(callStatus, isIncoming);

  const { handleCallAccepted, callInitializedRef } = useCallInitialization(
    activeCallId,
    userId,
    initializeWebRTC,
    startCall,
    setCallStatus,
    setIsIncoming,
    setCallStartTime
  );

  useCallSubscription({
    userId: userId || '',
    onCallAccepted: handleCallAccepted,
    onCallEnded: handleCallEnded
  });

  const handleAcceptCall = useCallback(async () => {
    if (!activeCallId || callInitializedRef.current) {
      console.error('No active call ID available or call already initialized');
      toast.error('Call setup incomplete');
      return;
    }

    console.log('Accepting call...', { activeCallId });
    try {
      await baseHandleAcceptCall();
      await handleCallAccepted();
    } catch (error) {
      console.error('Error accepting call:', error);
      toast.error('Failed to establish call connection');
      callInitializedRef.current = false;
    }
  }, [activeCallId, baseHandleAcceptCall, handleCallAccepted]);

  const onEndCall = useCallback(async () => {
    try {
      console.log('Ending call...');
      await endWebRTCCall();
      await handleEndCall();
      await handleCallEnded();
    } catch (error) {
      console.error('Error ending call:', error);
      toast.error('Failed to end call properly');
      if (userId && profile?.role === 'admin') {
        navigate(`/chat/${userId}`, { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [endWebRTCCall, handleEndCall, handleCallEnded, navigate, profile?.role, userId]);

  const onBack = useCallback(() => {
    if (!userId) {
      console.error('No userId available for navigation');
      navigate('/dashboard');
      return;
    }
    navigate(`/chat/${userId}`);
  }, [navigate, userId]);

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