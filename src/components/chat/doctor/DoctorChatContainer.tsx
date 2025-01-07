import { useMessages } from "@/hooks/useMessages";
import { MessageContainer } from "../MessageContainer";
import { DoctorChatHeader } from "./DoctorChatHeader";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { toast } from "sonner";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface DoctorChatContainerProps {
  patientId?: string;
}

export const DoctorChatContainer = ({ patientId }: DoctorChatContainerProps) => {
  const { messages, isLoading, sendMessage } = useMessages(patientId);
  const navigate = useNavigate();
  useAuthRedirect();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Please sign in to access the chat");
        navigate("/signin");
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        navigate("/signin");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleSendMessage = async (content: string) => {
    if (!patientId) {
      toast.error("No patient selected");
      return;
    }
    await sendMessage(content, patientId, true);
  };

  return (
    <MessageContainer
      messages={messages}
      onSendMessage={handleSendMessage}
      isLoading={isLoading}
      header={<DoctorChatHeader patientId={patientId} />}
    />
  );
};