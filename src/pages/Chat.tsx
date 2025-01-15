import { useProfile } from "@/hooks/useProfile";
import { UserChatContainer } from "@/components/chat/UserChatContainer";
import { DoctorChatContainer } from "@/components/chat/doctor/DoctorChatContainer";
import { CallProvider } from "@/components/chat/call/CallProvider";

const Chat = () => {
  const { profile } = useProfile();

  return (
    <div className="min-h-screen bg-background">
      <CallProvider>
        {profile?.role === 'admin' ? (
          <DoctorChatContainer />
        ) : (
          <UserChatContainer />
        )}
      </CallProvider>
    </div>
  );
};

export default Chat;