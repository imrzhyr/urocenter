import { useProfile } from "@/hooks/useProfile";
import { useMessages } from "@/hooks/useMessages";
import { MessageContainer } from "./MessageContainer";
import { PatientChatHeader } from "./patient/PatientChatHeader";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { toast } from "sonner";

export const UserChatContainer = () => {
  const { profile } = useProfile();
  const { messages, isLoading, sendMessage } = useMessages(profile?.id);
  useAuthRedirect();

  const handleSendMessage = async (content: string) => {
    if (!profile?.id) {
      console.error("No profile ID available");
      toast.error("Unable to send message. Please try signing in again.");
      return;
    }
    await sendMessage(content, profile.id, false);
  };

  if (!profile?.id) {
    return null;
  }

  return (
    <MessageContainer
      messages={messages}
      onSendMessage={handleSendMessage}
      isLoading={isLoading}
      header={<PatientChatHeader />}
    />
  );
};