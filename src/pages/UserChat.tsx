import { UserChatContainer } from "@/components/chat/UserChatContainer";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { CallProvider } from "@/components/chat/call/CallProvider";
import { MigrateUsers } from "@/components/auth/MigrateUsers";

const UserChat = () => {
  useAuthRedirect();

  return (
    <div className="min-h-screen bg-white">
      <CallProvider>
        <div className="max-w-md mx-auto p-4">
          <MigrateUsers />
        </div>
        <UserChatContainer />
      </CallProvider>
    </div>
  );
};

export default UserChat;