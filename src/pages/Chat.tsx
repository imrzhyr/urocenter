import { UserChatContainer } from "@/components/chat/UserChatContainer";
import { DoctorChatContainer } from "@/components/chat/doctor/DoctorChatContainer";
import { useProfile } from "@/hooks/useProfile";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Chat = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { profile } = useProfile();

  useEffect(() => {
    if (!profile) {
      navigate('/signin');
      return;
    }

    const isAdmin = profile.role === 'admin';
    
    // If admin but no userId, redirect to admin dashboard
    if (isAdmin && !userId) {
      navigate('/admin');
      return;
    }

    // If regular user but has userId in URL, redirect to normal chat
    if (!isAdmin && userId) {
      navigate('/chat');
      return;
    }
  }, [profile, userId, navigate]);

  if (!profile) return null;

  return (
    <>
      {!userId && profile.role !== 'admin' ? (
        <UserChatContainer />
      ) : userId && profile.role === 'admin' ? (
        <DoctorChatContainer />
      ) : null}
    </>
  );
};

export default Chat;