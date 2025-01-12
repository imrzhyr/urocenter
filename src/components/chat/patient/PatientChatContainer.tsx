import { useProfile } from "@/hooks/useProfile";
import { MessageList } from "../MessageList";
import { MessageInput } from "../MessageInput";
import { PatientChatHeader } from "./PatientChatHeader";
import { usePatientChat } from "./hooks/usePatientChat";

export const PatientChatContainer = () => {
  const { profile } = useProfile();
  const { messages, isLoading, sendMessage } = usePatientChat(profile?.phone);

  if (!profile?.id) {
    return null;
  }

  const handleStartCall = async () => {
    // Implement call functionality
    console.log("Starting call...");
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
        onSendMessage={sendMessage} 
        isLoading={isLoading}
        onStartCall={handleStartCall}
      />
    </div>
  );
};