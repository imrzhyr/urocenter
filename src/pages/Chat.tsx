import { useProfile } from "@/hooks/useProfile";
import { UserChatContainer } from "@/components/chat/UserChatContainer";
import { DoctorChatContainer } from "@/components/chat/doctor/DoctorChatContainer";

const Chat = () => {
  const { profile } = useProfile();

  return (
    <div className="min-h-screen bg-background">
      {profile?.role === 'admin' ? (
        <DoctorChatContainer />
      ) : (
        <UserChatContainer />
      )}
    </div>
  );
};

export default Chat;