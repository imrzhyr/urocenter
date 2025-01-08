import { MessageContainer } from "../MessageContainer";
import { DoctorChatHeader } from "./DoctorChatHeader";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { useChat } from "@/hooks/useChat";
import { toast } from "sonner";

interface DoctorChatContainerProps {
  patientId: string;
}

export const DoctorChatContainer = ({ patientId }: DoctorChatContainerProps) => {
  const { messages, isLoading, sendMessage } = useChat(patientId);
  useAuthRedirect();

  const handleSendMessage = async (content: string, fileInfo?: { url: string; name: string; type: string }) => {
    if (!patientId) {
      toast.error("No patient selected");
      return;
    }
    await sendMessage(content, fileInfo);
  };

  return (
    <MessageContainer
      messages={messages}
      onSendMessage={handleSendMessage}
      isLoading={isLoading}
      header={<DoctorChatHeader patientId={patientId} />}
    />
  );
};