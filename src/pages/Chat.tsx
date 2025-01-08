import { useParams, Navigate } from "react-router-dom";
import { DoctorChatContainer } from "@/components/chat/doctor/DoctorChatContainer";
import { useProfile } from "@/hooks/useProfile";
import { UserChatContainer } from "@/components/chat/UserChatContainer";

const Chat = () => {
  const { userId } = useParams();
  const { profile } = useProfile();
  const isAdmin = profile?.role === 'admin';

  // Prevent admin from chatting with themselves
  if (isAdmin && userId === profile?.id) {
    return <Navigate to="/admin" replace />;
  }

  // For admin users, show the DoctorChatContainer with the selected patient's ID
  if (isAdmin && userId) {
    return <DoctorChatContainer />;
  }

  // For regular users, show their own chat
  return <UserChatContainer />;
};

export default Chat;