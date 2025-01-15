import { UserChatContainer } from "@/components/chat/UserChatContainer";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { CallProvider } from "@/components/chat/call/CallProvider";

const UserChat = () => {
  useAuthRedirect();

  return (
    <div className="min-h-screen bg-white">
      <CallProvider>
        <UserChatContainer />
      </CallProvider>
    </div>
  );
};

export default UserChat;