import { DoctorChatContainer } from "@/components/chat/doctor/DoctorChatContainer";
import { CallProvider } from "@/components/chat/call/CallProvider";

const Chat = () => {
  return (
    <CallProvider>
      <DoctorChatContainer />
    </CallProvider>
  );
};

export default Chat;