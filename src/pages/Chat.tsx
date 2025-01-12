import { UserChatContainer } from "@/components/chat/UserChatContainer";
import { DoctorChatContainer } from "@/components/chat/doctor/DoctorChatContainer";
import { useProfile } from "@/hooks/useProfile";
import { useParams, useNavigate } from "react-router-dom";

export const Chat = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { profile } = useProfile();

  if (!profile) {
    navigate('/signin');
    return null;
  }

  const isAdmin = profile.role === 'admin';

  return (
    <>
      {!userId && !isAdmin ? (
        <UserChatContainer />
      ) : userId && isAdmin ? (
        <DoctorChatContainer />
      ) : null}
    </>
  );
};

export default Chat;