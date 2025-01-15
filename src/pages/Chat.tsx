import { UserChatContainer } from "@/components/chat/UserChatContainer";
import { DoctorChatContainer } from "@/components/chat/doctor/DoctorChatContainer";

const Chat = () => {
  return (
    <div className="min-h-screen bg-background">
      <UserChatContainer />
      <DoctorChatContainer />
    </div>
  );
};

export default Chat;