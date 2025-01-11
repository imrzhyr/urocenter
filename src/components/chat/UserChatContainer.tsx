import { useProfile } from "@/hooks/useProfile";
import { MessageContainer } from "./MessageContainer";
import { PatientChatHeader } from "./patient/PatientChatHeader";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { useChat } from "@/hooks/useChat";
import { useNavigate } from "react-router-dom";

export const UserChatContainer = () => {
  const { profile } = useProfile();
  const { messages, isLoading, sendMessage } = useChat(profile?.id);
  const navigate = useNavigate();
  useAuthRedirect();

  const handleSendMessage = async (content: string, fileInfo?: { url: string; name: string; type: string }) => {
    if (!profile?.id) {
      console.error('No profile ID found');
      return;
    }
    await sendMessage(content, fileInfo);
  };

  const handleBack = () => {
    navigate('/dashboard');
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
      header={<PatientChatHeader onBack={handleBack} />}
      userId={profile.id}
    />
  );
};