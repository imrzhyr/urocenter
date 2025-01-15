import { MessageContainer } from "../MessageContainer";
import { DoctorChatHeader } from "./DoctorChatHeader";
import { useChat } from "@/hooks/useChat";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { useDoctorChat } from "./hooks/useDoctorChat";
import { useProfile } from "@/hooks/useProfile";
import { CallProvider } from "@/components/chat/call/CallProvider";

export const DoctorChatContainer = () => {
  const { userId } = useParams();
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

  if (!patientProfile) {
    return null;
  }

  return (
    <div className="flex flex-col h-[100vh] w-full bg-gray-50">
      <div className="bg-primary sticky top-0 z-50">
        <CallProvider>
          <>
            <DoctorChatHeader
              patientId={userId || ''}
              patientName={patientProfile.full_name || "Unknown Patient"}
              patientPhone={patientProfile.phone}
              onRefresh={refreshMessages}
            />
            <MessageContainer
              messages={messages}
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              header={<div />}
              userId={userId || ''}
            />
          </>
        </CallProvider>
      </div>
    </div>
  );
};