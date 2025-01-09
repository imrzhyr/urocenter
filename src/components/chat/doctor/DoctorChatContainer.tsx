import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MessageContainer } from "../MessageContainer";
import { DoctorChatHeader } from "./DoctorChatHeader";
import { useChat } from "@/hooks/useChat";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useProfile } from "@/hooks/useProfile";
import { Profile } from "@/types/profile";

export const DoctorChatContainer = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [patientProfile, setPatientProfile] = useState<Profile | null>(null);
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
        toast.error("Cannot chat with yourself");
        navigate("/admin");
        return;
      }

      try {
        console.log('Fetching patient info for ID:', userId);
        const { data: patientData, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();

        if (error) {
          console.error("Error fetching patient info:", error);
          toast.error("Could not load patient information");
          navigate("/admin");
          return;
        }

        if (!patientData) {
          console.error("No patient found with ID:", userId);
          toast.error("Patient not found");
          navigate("/admin");
          return;
        }

        // Verify that the logged-in user is an admin
        if (profile?.role !== 'admin') {
          console.error("Non-admin user attempting to access doctor chat");
          toast.error("Unauthorized access");
          navigate("/dashboard");
          return;
        }

        console.log('Patient profile found:', patientData);
        setPatientProfile(patientData);
      } catch (error) {
        console.error("Error in fetchPatientInfo:", error);
        toast.error("Could not load patient information");
        navigate("/admin");
      }
    };

    fetchPatientInfo();
  }, [userId, navigate, profile?.id, profile?.role]);

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

  if (!patientProfile) {
    return null;
  }

  return (
    <MessageContainer
      messages={messages}
      onSendMessage={handleSendMessage}
      isLoading={isLoading}
      header={
        <DoctorChatHeader
          patientId={userId || ''}
          patientName={patientProfile.full_name || "Unknown Patient"}
          onRefresh={refreshMessages}
        />
      }
      userId={userId || ''}
    />
  );
};