import { useProfile } from "@/hooks/useProfile";
import { MessageContainer } from "./MessageContainer";
import { PatientChatHeader } from "./patient/PatientChatHeader";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { useChat } from "@/hooks/useChat";
import { LoadingScreen } from "../LoadingScreen";

export const UserChatContainer = () => {
  const { profile, isLoading: isProfileLoading } = useProfile();
  const { messages, isLoading: isChatLoading, sendMessage } = useChat(profile?.id);
  useAuthRedirect();

  if (isProfileLoading || !profile?.id) {
    return <LoadingScreen message="Loading chat..." />;
  }

  return (
    <MessageContainer
      messages={messages}
      onSendMessage={sendMessage}
      isLoading={isChatLoading}
      header={<PatientChatHeader />}
      userId={profile.id}
    />
  );
};