import { useParams } from "react-router-dom";
import { ChatContainer } from "@/components/chat/ChatContainer";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";

const Chat = () => {
  const { patientId } = useParams();
  useAuthRedirect();

  return (
    <div className="min-h-screen bg-white">
      <ChatContainer patientId={patientId} />
    </div>
  );
};

export default Chat;