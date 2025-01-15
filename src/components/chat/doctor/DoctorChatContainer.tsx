import { MessageContainer } from "../MessageContainer";
import { DoctorChatHeader } from "./DoctorChatHeader";
import { useChat } from "@/hooks/useChat";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { useDoctorChat } from "./hooks/useDoctorChat";
import { useProfile } from "@/hooks/useProfile";
import { CallProvider } from "../call/CallProvider";

export const DoctorChatContainer = () => {
  const { id } = useParams();
  const { profile } = useProfile();
  const { messages, sendMessage, isLoading } = useChat(id);
  const { patientProfile } = useDoctorChat(id);

  if (!profile) {
    return null;
  }

  if (!patientProfile) {
    toast.error("No patient selected");
    return null;
  }

  return (
    <CallProvider>
      <div className="flex flex-col h-screen bg-background">
        <DoctorChatHeader 
          patientId={patientProfile.id}
          patientName={patientProfile.full_name || "Patient"}
          patientPhone={patientProfile.phone}
          onRefresh={() => {}}
        />
        <MessageContainer
          messages={messages}
          onSendMessage={sendMessage}
          isLoading={isLoading}
          header={
            <DoctorChatHeader 
              patientId={patientProfile.id}
              patientName={patientProfile.full_name || "Patient"}
              patientPhone={patientProfile.phone}
              onRefresh={() => {}}
            />
          }
          userId={id || ''}
        />
      </div>
    </CallProvider>
  );
};