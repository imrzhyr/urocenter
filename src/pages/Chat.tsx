import { useParams, Navigate } from "react-router-dom";
import { DoctorChatContainer } from "@/components/chat/doctor/DoctorChatContainer";
import { useProfile } from "@/hooks/useProfile";
import { UserChatContainer } from "@/components/chat/UserChatContainer";

const Chat = () => {
  const { userId } = useParams();
  const { profile } = useProfile();
  const isAdmin = profile?.role === 'admin';

  // If no userId is provided and user is not admin, show patient chat container
  if (!userId && !isAdmin) {
    return <UserChatContainer />;
  }

  // If userId is provided and user is admin, show doctor chat container
  if (userId && isAdmin) {
    return <DoctorChatContainer />;
  }

  // For any other case, redirect to appropriate dashboard
  return <Navigate to={isAdmin ? "/admin" : "/dashboard"} replace />;
};

export default Chat;