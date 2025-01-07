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
      console.error("No profile ID available", { profile });
      toast.error("Unable to send message. Please try signing in again.");
      return;
    }

    try {
      await sendMessage(content, profile.id, false);
    } catch (error) {
      // Error is already handled in useMessages hook
      console.error("Error in handleSendMessage:", error);
    }
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