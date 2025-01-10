import { UserChatContainer } from "@/components/chat/UserChatContainer";
import { DoctorChatContainer } from "@/components/chat/doctor/DoctorChatContainer";
import { useProfile } from "@/hooks/useProfile";
import { useParams, useNavigate } from "react-router-dom";
import { useIncomingCalls } from "@/hooks/useIncomingCalls";

export const Chat = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { profile } = useProfile();
  useIncomingCalls(); // Add the hook here

  if (!profile) {
    navigate('/signin');
    return null;
  }

  const isAdmin = profile.role === 'admin';

  if (!userId && !isAdmin) {
    return <UserChatContainer />;
  }

  if (userId && isAdmin) {
    return <DoctorChatContainer />;
  }

  navigate(isAdmin ? '/dashboard' : '/dashboard');
  return null;
};

export default Chat;