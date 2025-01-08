import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageContainer } from "../MessageContainer";
import { DoctorChatHeader } from "./DoctorChatHeader";
import { useChat } from "@/hooks/useChat";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useProfile } from "@/hooks/useProfile";

interface DoctorChatContainerProps {
  patientId?: string;
}

export const DoctorChatContainer = ({ patientId }: DoctorChatContainerProps) => {
  const navigate = useNavigate();
  const [patientName, setPatientName] = useState("");
  const { messages, sendMessage, isLoading, refreshMessages } = useChat(patientId);
  const { profile } = useProfile();

  useEffect(() => {
    const fetchPatientInfo = async () => {
      if (!patientId) {
        console.log("No patient ID provided, redirecting to admin dashboard");
        navigate("/admin");
        return;
      }

      try {
        console.log('Fetching patient info for ID:', patientId);
        const { data: patientProfile, error } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", patientId)
          .single();

        if (error) {
          console.error("Error fetching patient info:", error);
          toast.error("Could not load patient information");
          navigate("/admin");
          return;
        }

        if (!patientProfile) {
          console.error("No patient found with ID:", patientId);
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
  }, [patientId, navigate]);

  const handleSendMessage = async (content: string, fileInfo?: { url: string; name: string; type: string; duration?: number }) => {
    if (!patientId || !profile?.id) {
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

  if (!patientId) {
    console.log("No patient ID, redirecting to admin dashboard");
    navigate("/admin");
    return null;
  }

  return (
    <MessageContainer
      messages={messages}
      onSendMessage={handleSendMessage}
      isLoading={isLoading}
      header={
        <DoctorChatHeader
          patientId={patientId}
          patientName={patientName}
          onRefresh={refreshMessages}
        />
      }
    />
  );
};