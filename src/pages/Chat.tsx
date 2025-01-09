import { useParams, Navigate } from "react-router-dom";
import { DoctorChatContainer } from "@/components/chat/doctor/DoctorChatContainer";
import { useProfile } from "@/hooks/useProfile";
import { UserChatContainer } from "@/components/chat/UserChatContainer";
import { LoadingScreen } from "@/components/LoadingScreen";

const Chat = () => {
  const { userId } = useParams();
  const { profile, isLoading } = useProfile();

  if (isLoading) {
    return <LoadingScreen />;
  }

  // Check if user is logged in by checking localStorage
  const userPhone = localStorage.getItem('userPhone');
  if (!userPhone) {
    return <Navigate to="/signin" replace />;
  }

  // If no userId is provided and user is not admin, show patient chat container
  if (!userId && profile?.role !== 'admin') {
    return <UserChatContainer />;
  }

  // If userId is provided and user is admin, show doctor chat container
  if (userId && profile?.role === 'admin') {
    return <DoctorChatContainer />;
  }

  // For any other case, redirect to appropriate dashboard
  return <Navigate to={profile?.role === 'admin' ? "/admin" : "/dashboard"} replace />;
};

export default Chat;