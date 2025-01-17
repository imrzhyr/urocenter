import { useProfile } from "@/hooks/useProfile";
import { MessageList } from "../MessageList";
import { MessageInput } from "../MessageInput";
import { PatientChatHeader } from "./PatientChatHeader";
import { usePatientChat } from "./hooks/usePatientChat";
import { Message } from "@/types/profile";

export const PatientChatContainer = () => {
  const { profile } = useProfile();
  const { messages, isLoading, sendMessage } = usePatientChat(profile?.phone);

  if (!profile?.id) {
    return null;
  }

  const handleSendMessage = (content: string, fileInfo?: { url: string; name: string; type: string; duration?: number }, replyTo?: Message) => {
    sendMessage(content);
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
        userId={profile.id}
      />
    </div>
  );
};