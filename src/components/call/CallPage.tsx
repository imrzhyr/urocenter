import { useNavigate, useParams } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { CallContainer } from "./CallContainer";
import { useState } from "react";
import { CallStatus } from "@/types/call";

export const CallPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { profile } = useProfile();
  const [callStatus] = useState<CallStatus>("ringing");
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(true);

  const onBack = () => {
    if (!userId) {
      navigate('/dashboard');
      return;
    }
    navigate(`/chat/${userId}`);
  };

  const mockCallingUser = profile ? {
    full_name: profile.full_name || "Unknown",
    id: profile.id
  } : null;

  return (
    <CallContainer
      onBack={onBack}
      duration={0}
      callStatus={callStatus}
      callingUser={mockCallingUser}
      isIncoming={false}
      isMuted={isMuted}
      isSpeaker={isSpeaker}
      onToggleMute={() => setIsMuted(!isMuted)}
      onToggleSpeaker={() => setIsSpeaker(!isSpeaker)}
      onEndCall={onBack}
      onAcceptCall={() => {}}
      onRejectCall={() => {}}
    />
  );
};