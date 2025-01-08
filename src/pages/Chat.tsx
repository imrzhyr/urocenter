import { useParams } from "react-router-dom";
import { DoctorChatContainer } from "@/components/chat/doctor/DoctorChatContainer";
import { useProfile } from "@/hooks/useProfile";
import { UserChatContainer } from "@/components/chat/UserChatContainer";

const Chat = () => {
  const { userId } = useParams();
  const { profile } = useProfile();
  const isAdmin = profile?.role === 'admin';

  // For admin users, show the DoctorChatContainer with the selected patient's ID
  if (isAdmin && userId) {
    return <DoctorChatContainer />;
  }

  // For regular users, show their own chat
  return <UserChatContainer />;
};

export default Chat;