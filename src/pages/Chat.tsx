import { UserChatContainer } from "@/components/chat/UserChatContainer";
import { DoctorChatContainer } from "@/components/chat/doctor/DoctorChatContainer";
import { useProfile } from "@/hooks/useProfile";
import { useParams, useNavigate } from "react-router-dom";
import { useIncomingCalls } from "@/hooks/useIncomingCalls";
import { TestCallComponent } from "@/components/chat/TestCallComponent";

export const Chat = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { profile } = useProfile();
  useIncomingCalls();

  if (!profile) {
    navigate('/signin');
    return null;
  }

  const isAdmin = profile.role === 'admin';

  // Only add TestCallComponent for non-admin users
  return (
    <>
      {!isAdmin && <TestCallComponent />}
      {!userId && !isAdmin ? (
        <UserChatContainer />
      ) : userId && isAdmin ? (
        <DoctorChatContainer />
      ) : null}
    </>
  );
};

export default Chat;