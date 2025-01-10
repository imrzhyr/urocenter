import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { useCallSetup } from "./hooks/useCallSetup";
import { useCallSubscription } from "@/hooks/useCallSubscription";
import { useCallHandlers } from "@/hooks/useCallHandlers";
import { CallContainer } from "./CallContainer";

export const CallPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { profile } = useProfile();
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);
  
  const {
    callingUser,
    callStatus,
    setCallStatus,
    isIncoming
  } = useCallSetup(userId, profile);

  const {
    duration,
    setDuration,
    handleEndCall,
    handleAcceptCall,
    handleRejectCall,
    setCallStartTime
  } = useCallHandlers(userId, profile);

  useCallSubscription({
    userId: userId || '',
    onCallAccepted: () => {
      setCallStatus('connected');
      setCallStartTime(new Date());
    },
    onCallEnded: () => {
      handleEndCall();
      navigate(-1);
    }
  });

  const onEndCall = () => {
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