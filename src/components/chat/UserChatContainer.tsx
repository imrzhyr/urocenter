import { useProfile } from "@/hooks/useProfile";
import { useMessages } from "@/hooks/useMessages";
import { MessageContainer } from "./MessageContainer";
import { PatientChatHeader } from "./patient/PatientChatHeader";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const UserChatContainer = () => {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const { messages, isLoading, sendMessage } = useMessages(profile?.id);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Please sign in to access the chat");
        navigate("/signin");
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        navigate("/signin");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

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