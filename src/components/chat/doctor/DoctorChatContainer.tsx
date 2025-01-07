import { useMessages } from "@/hooks/useMessages";
import { MessageContainer } from "../MessageContainer";
import { DoctorChatHeader } from "./DoctorChatHeader";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface DoctorChatContainerProps {
  patientId?: string;
}

export const DoctorChatContainer = ({ patientId }: DoctorChatContainerProps) => {
  const navigate = useNavigate();
  const { messages, isLoading, sendMessage } = useMessages(patientId);

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