import { useNavigate, useParams } from "react-router-dom";
import { CallContainer } from "./CallContainer";

export const CallPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const onBack = () => {
    if (!userId) {
      navigate('/dashboard');
      return;
    }
    navigate(`/chat/${userId}`);
  };

  const mockUser = {
    full_name: "User",
    id: userId || ""
  };

  return (
    <CallContainer
      onBack={onBack}
      duration={0}
      callStatus="ringing"
      callingUser={mockUser}
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