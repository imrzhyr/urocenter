import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MessageContainer } from "../MessageContainer";
import { DoctorChatHeader } from "./DoctorChatHeader";
import { useChat } from "@/hooks/useChat";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useProfile } from "@/hooks/useProfile";

export const DoctorChatContainer = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [patientName, setPatientName] = useState("");
  const { messages, sendMessage, isLoading, refreshMessages } = useChat(userId);
  const { profile } = useProfile();

  useEffect(() => {
    const fetchPatientInfo = async () => {
      if (!userId) {
        console.log("No patient ID provided, redirecting to admin dashboard");
        navigate("/admin");
        return;
      }

      // Prevent self-chat
      if (userId === profile?.id) {
        console.log("Cannot chat with self, redirecting to admin dashboard");
        navigate("/admin");
        return;
      }

      try {
        console.log('Fetching patient info for ID:', userId);
        const { data: patientProfile, error } = await supabase
          .from("profiles")
          .select("full_name, id")
          .eq("id", userId)
          .single();

        if (error) {
          console.error("Error fetching patient info:", error);
          toast.error("Could not load patient information");
          navigate("/admin");
          return;
        }

        if (!patientProfile) {
          console.error("No patient found with ID:", userId);
          toast.error("Patient not found");
          navigate("/admin");
          return;
        }

        console.log('Patient profile found:', patientProfile);
        setPatientName(patientProfile.full_name || "Unknown Patient");
      } catch (error) {
        console.error("Error in fetchPatientInfo:", error);
        toast.error("Could not load patient information");
        navigate("/admin");
      }
    };

    fetchPatientInfo();
  }, [userId, navigate, profile?.id]);

  const handleSendMessage = async (content: string, fileInfo?: { url: string; name: string; type: string; duration?: number }) => {
    if (!userId || !profile?.id) {
      toast.error("Unable to send message");
      return;
    }

    try {
      await sendMessage(content, fileInfo);
      refreshMessages();
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };

  return (
    <MessageContainer
      messages={messages}
      onSendMessage={handleSendMessage}
      isLoading={isLoading}
      header={
        <DoctorChatHeader
          patientId={userId || ''}
          patientName={patientName}
          onRefresh={refreshMessages}
        />
      }
    />
  );
};