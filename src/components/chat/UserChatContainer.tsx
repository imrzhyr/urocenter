import { useAuth } from "@/contexts/AuthContext";
import { MessageContainer } from "./MessageContainer";
import { PatientChatHeader } from "./patient/PatientChatHeader";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { useChat } from "@/hooks/useChat";
import { Message } from "@/types/profile";
import { FileInfo } from "@/types/chat";
import { LoadingScreen } from "@/components/LoadingScreen";
import { useLanguage } from "@/contexts/LanguageContext";

export const UserChatContainer = () => {
  const { profile, isLoading } = useAuth();
  const { messages, isLoading: isChatLoading, sendMessage } = useChat(profile?.id);
  const { t } = useLanguage();
  useAuthRedirect();

  const handleSendMessage = async (content: string, fileInfo?: FileInfo, replyTo?: Message) => {
    if (!profile?.id) {
      console.error('No profile ID found');
      return;
    }
    await sendMessage(content, fileInfo, replyTo);
  };

  if (isLoading) {
    return <LoadingScreen message={t('loading')} />;
  }

  if (!profile?.id) {
    console.log('No profile ID found, not rendering chat');
    return null;
  }

  return (
    <MessageContainer
      messages={messages}
      onSendMessage={handleSendMessage}
      isLoading={isChatLoading}
      header={<PatientChatHeader />}
      userId={profile.id}
    />
  );
};