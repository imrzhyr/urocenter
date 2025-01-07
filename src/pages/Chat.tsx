import { useParams } from "react-router-dom";
import { DoctorChatContainer } from "@/components/chat/doctor/DoctorChatContainer";
import { UserChatContainer } from "@/components/chat/UserChatContainer";
import { useProfile } from "@/hooks/useProfile";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";

const Chat = () => {
  const { patientId } = useParams();
  const { profile } = useProfile();
  useAuthRedirect();

  return (
    <div className="min-h-screen bg-white">
      {profile?.role === 'admin' ? (
        <DoctorChatContainer patientId={patientId} />
      ) : (
        <UserChatContainer />
      )}
    </div>
  );
};

export default Chat;