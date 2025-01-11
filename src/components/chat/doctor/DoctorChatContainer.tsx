import { MessageContainer } from "../MessageContainer";
import { DoctorChatHeader } from "./DoctorChatHeader";
import { useChat } from "@/hooks/useChat";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useDoctorChat } from "./hooks/useDoctorChat";
import { useProfile } from "@/hooks/useProfile";

export const DoctorChatContainer = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { messages, sendMessage, isLoading, refreshMessages } = useChat(userId);
  const { patientProfile } = useDoctorChat(userId);
  const { profile } = useProfile();

  const handleSendMessage = async (content: string, fileInfo?: { url: string; name: string; type: string; duration?: number }) => {
    if (!userId || !profile?.id) {
      toast.error("Unable to send message");
      return;
    }

    try {
      await sendMessage(content, fileInfo);
      refreshMessages();
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };

  const handleBack = () => {
    navigate('/admin');
  };

  if (!patientProfile) {
    return null;
  }

  return (
    <div className="flex flex-col h-[100vh] w-full bg-gray-50">
      <MessageContainer
        messages={messages}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        header={
          <DoctorChatHeader
            patientId={userId || ''}
            patientName={patientProfile.full_name || "Unknown Patient"}
            patientPhone={patientProfile.phone}
            onRefresh={refreshMessages}
            onBack={handleBack}
          />
        }
        userId={userId || ''}
      />
    </div>
  );
};