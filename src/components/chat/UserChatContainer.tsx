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
  const { profile, isLoading, refetchProfile } = useAuth();
  const { messages, isLoading: isChatLoading, sendMessage } = useChat(profile?.id);
  const { t } = useLanguage();
  useAuthRedirect();

  // Ensure profile is loaded when component mounts
  useEffect(() => {
    if (!profile?.id) {
      refetchProfile();
    }
  }, [profile?.id, refetchProfile]);

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
    return <LoadingScreen message={t('loading_profile')} />;
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