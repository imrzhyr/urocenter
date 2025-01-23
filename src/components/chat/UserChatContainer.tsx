import { useAuth } from "@/contexts/AuthContext";
import { MessageContainer } from "./MessageContainer";
import { PatientChatHeader } from "./patient/PatientChatHeader";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { useChat } from "@/hooks/useChat";
import { Message } from "@/types/profile";
import { FileInfo } from "@/types/chat";
import { LoadingScreen } from "@/components/LoadingScreen";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect } from "react";

export const UserChatContainer = () => {
  const { profile, isLoading } = useAuth();
  const { messages, isLoading: isChatLoading, sendMessage } = useChat(profile?.id);
  const { t } = useLanguage();
  useAuthRedirect();

  useEffect(() => {
    // Ensure profile ID is in localStorage when component mounts
    if (profile?.id) {
      localStorage.setItem('profileId', profile.id);
    }
  }, [profile?.id]);

  if (isLoading) {
    return <LoadingScreen message={t('loading')} />;
  }

  if (!profile?.id) {
    console.error('No profile ID found, redirecting to signin');
    return <LoadingScreen message={t('loading')} />;
  }

  const handleSendMessage = async (content: string, fileInfo?: FileInfo, replyTo?: Message) => {
    if (!profile?.id) {
      console.error('No profile ID found');
      return;
    }
    await sendMessage(content, fileInfo, replyTo);
  };

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