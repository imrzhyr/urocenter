import { useProfile } from "@/hooks/useProfile";
import { MessageContainer } from "@/components/chat/MessageContainer";
import { PatientChatHeader } from "@/components/chat/patient/PatientChatHeader";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { useChat } from "../../hooks/useChat";

export const UserChatContainer = () => {
  const { profile } = useProfile();
  const { messages, isLoading, sendMessage } = useChat(profile?.id);
  useAuthRedirect();

  const handleSendMessage = async (content: string, fileInfo?: { url: string; name: string; type: string }) => {
    if (!profile?.id) {
      console.error('No profile ID found');
      return;
    }
    await sendMessage(content, fileInfo);
  };

  if (!profile?.id) {
    console.log('No profile ID found, not rendering chat');
    return null;
  }

  return (
    <MessageContainer
      messages={messages}
      onSendMessage={handleSendMessage}
      isLoading={isLoading}
      header={<PatientChatHeader />}
      userId={profile.id}
    />
  );
};