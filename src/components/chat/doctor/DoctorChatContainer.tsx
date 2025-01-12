import { useEffect, useState } from "react";
import { MessageContainer } from "../MessageContainer";
import { DoctorChatHeader } from "./DoctorChatHeader";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useDoctorChat } from "./hooks/useDoctorChat";
import { startTransition } from "react";
import { Profile } from "@/types/profile";

export const DoctorChatContainer = () => {
  const { patientId } = useParams();
  const [patientInfo, setPatientInfo] = useState<{
    name: string;
    phone: string;
  } | null>(null);

  const { messages = [], isLoading = false, sendMessage = () => {}, refreshMessages = async () => {}, patientProfile } = useDoctorChat(patientId) || {};

  useEffect(() => {
    const fetchPatientInfo = async () => {
      if (!patientId) return;

      const { data: patient, error } = await supabase
        .from("profiles")
        .select("full_name, phone")
        .eq("id", patientId)
        .single();

      if (error) {
        console.error("Error fetching patient info:", error);
        toast.error("Failed to load patient information");
        return;
      }

      setPatientInfo({
        name: patient.full_name || "Unknown Patient",
        phone: patient.phone || "",
      });
    };

    startTransition(() => {
      fetchPatientInfo();
    });
  }, [patientId]);

  if (!patientId || !patientInfo) {
    return <div>Loading...</div>;
  }

  return (
    <MessageContainer
      messages={messages}
      onSendMessage={sendMessage}
      isLoading={isLoading}
      header={
        <DoctorChatHeader
          patientName={patientInfo.name}
          patientId={patientId}
          patientPhone={patientInfo.phone}
          onRefresh={refreshMessages}
        />
      }
      userId={patientId}
    />
  );
};