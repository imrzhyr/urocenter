import { useNavigate, useParams } from "react-router-dom";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { PatientInfoContainer } from "@/components/chat/PatientInfoContainer";
import { ChatContainer } from "@/components/chat/ChatContainer";

const Chat = () => {
  const navigate = useNavigate();
  const { patientId } = useParams();

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="p-4 bg-white/80 backdrop-blur-sm border-b border-blue-100 shadow-sm">
        <ChatHeader onBack={() => navigate(-1)} />
        {patientId && <PatientInfoContainer patientId={patientId} />}
      </div>

      <ChatContainer patientId={patientId} />
    </div>
  );
};

export default Chat;