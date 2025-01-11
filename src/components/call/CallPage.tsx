import { useNavigate, useParams } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { CallContainer } from "./CallContainer";

export const CallPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { profile } = useProfile();

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
      callStatus="ringing"
      callingUser={mockCallingUser}
      isIncoming={false}
      isMuted={false}
      isSpeaker={true}
      onToggleMute={() => {}}
      onToggleSpeaker={() => {}}
      onEndCall={onBack}
      onAcceptCall={() => {}}
      onRejectCall={() => {}}
    />
  );
};