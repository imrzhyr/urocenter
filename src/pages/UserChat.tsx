import { UserChatContainer } from "@/components/chat/UserChatContainer";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";

const UserChat = () => {
  useAuthRedirect();

  return (
    <div className="min-h-screen bg-white">
      <UserChatContainer />
    </div>
  );
};

export default UserChat;