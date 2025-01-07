import { useProfile } from "@/hooks/useProfile";
import { useMessages } from "@/hooks/useMessages";
import { MessageContainer } from "./MessageContainer";
import { PatientChatHeader } from "./patient/PatientChatHeader";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { toast } from "sonner";
import { useEffect } from "react";
import { messageService } from "@/services/messageService";

export const UserChatContainer = () => {
  const { profile } = useProfile();
  const { messages, isLoading, sendMessage } = useMessages(profile?.id);
  useAuthRedirect();

  useEffect(() => {
    const initializeUserContext = async () => {
      const userPhone = localStorage.getItem('userPhone');
      if (userPhone) {
        try {
          await messageService.setUserContext(userPhone);
        } catch (error) {
          console.error('Error initializing user context:', error);
        }
      }
    };

    initializeUserContext();
  }, []);

  const handleSendMessage = async (content: string, fileInfo?: { url: string; name: string; type: string }) => {
    if (!profile?.id) {
      console.error("No profile ID available", { profile });
      toast.error("Unable to send message. Please try signing in again.");
      return;
    }

    try {
      await sendMessage(content, profile.id, false, fileInfo);
    } catch (error) {
      console.error("Error in handleSendMessage:", error);
      toast.error("Failed to send message. Please try again.");
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