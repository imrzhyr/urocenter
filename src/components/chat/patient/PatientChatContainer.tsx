import { useProfile } from "@/hooks/useProfile";
import { MessageList } from "../MessageList";
import { MessageInput } from "../MessageInput";
import { PatientChatHeader } from "./PatientChatHeader";
import { usePatientChat } from "./hooks/usePatientChat";
import { FileInfo } from "@/types/chat";

export const PatientChatContainer = () => {
  const { profile } = useProfile();
  const { messages, isLoading, sendMessage } = usePatientChat(profile?.phone);

  if (!profile?.id) {
    return null;
  }

  const handleSendMessage = (content: string, fileInfo?: FileInfo) => {
    sendMessage(content, fileInfo);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="p-4 border-b">
        <PatientChatHeader />
      </div>
      <MessageList 
        messages={messages} 
        currentUserId={profile.id}
        isLoading={isLoading}
      />
      <MessageInput 
        onSendMessage={handleSendMessage} 
        isLoading={isLoading}
      />
    </div>
  );
};