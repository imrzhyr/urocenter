import { useMessages } from "@/hooks/useMessages";
import { MessageContainer } from "../MessageContainer";
import { DoctorChatHeader } from "./DoctorChatHeader";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { toast } from "sonner";

interface DoctorChatContainerProps {
  patientId?: string;
}

export const DoctorChatContainer = ({ patientId }: DoctorChatContainerProps) => {
  const { messages, isLoading, sendMessage } = useMessages(patientId);
  useAuthRedirect();

  const handleSendMessage = async (content: string) => {
    if (!patientId) {
      toast.error("No patient selected");
      return;
    }
    await sendMessage(content, patientId, true);
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