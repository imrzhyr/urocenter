import { useProfile } from "@/hooks/useProfile";
import { MessageContainer } from "./MessageContainer";
import { PatientChatHeader } from "./patient/PatientChatHeader";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { useChat } from "@/hooks/useChat";
import { CallProvider } from "@/components/chat/call/CallProvider";
import { Message } from "@/types/profile";

export const UserChatContainer = () => {
  const { profile } = useProfile();
  const { messages, isLoading, sendMessage } = useChat(profile?.id);
  useAuthRedirect();

  const handleSendMessage = async (content: string, replyTo?: Message) => {
    if (!profile?.id) {
      console.error('No profile ID found');
      return;
    }
    await sendMessage(content, undefined, replyTo);
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