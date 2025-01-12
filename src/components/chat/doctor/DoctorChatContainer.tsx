import { useEffect, useState } from "react";
import { MessageContainer } from "../MessageContainer";
import { DoctorChatHeader } from "./DoctorChatHeader";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useDoctorChat } from "./hooks/useDoctorChat";
import { startTransition } from "react";
import { Profile } from "@/types/profile";
import { Message } from "@/types/profile";

interface PatientInfo {
  name: string;
  phone: string;
}

interface DoctorChatData {
  messages: Message[];
  isLoading: boolean;
  sendMessage: (content: string, fileInfo?: { url: string; name: string; type: string; duration?: number }) => Promise<Message>;
  refreshMessages: () => Promise<void>;
  patientProfile?: Profile;
}

export const DoctorChatContainer = () => {
  const { patientId } = useParams();
  const [patientInfo, setPatientInfo] = useState<PatientInfo | null>(null);

  const chatData = useDoctorChat(patientId) as DoctorChatData;
  const messages = chatData?.messages || [];
  const isLoading = chatData?.isLoading || false;
  const sendMessage = chatData?.sendMessage || (() => Promise.resolve({} as Message));
  const refreshMessages = chatData?.refreshMessages || (() => Promise.resolve());
  const patientProfile = chatData?.patientProfile;

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