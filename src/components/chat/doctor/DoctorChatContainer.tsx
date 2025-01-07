import { useMessages } from "@/hooks/useMessages";
import { MessageContainer } from "../MessageContainer";
import { DoctorChatHeader } from "./DoctorChatHeader";

interface DoctorChatContainerProps {
  patientId?: string;
}

export const DoctorChatContainer = ({ patientId }: DoctorChatContainerProps) => {
  const { messages, isLoading, sendMessage } = useMessages(patientId);

  const handleSendMessage = async (content: string) => {
    if (!patientId) return;
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