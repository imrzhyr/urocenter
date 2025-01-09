import { useProfile } from "@/hooks/useProfile";
import { MessageList } from "../MessageList";
import { MessageInput } from "../MessageInput";
import { PatientChatHeader } from "./PatientChatHeader";
import { usePatientChat } from "./hooks/usePatientChat";

export const PatientChatContainer = () => {
  const { profile } = useProfile();
  const { messages, isLoading, sendMessage } = usePatientChat(profile?.phone);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="p-4 border-b">
        <PatientChatHeader />
      </div>
      <MessageList messages={messages} />
      <MessageInput onSendMessage={sendMessage} isLoading={isLoading} />
    </div>
  );
};