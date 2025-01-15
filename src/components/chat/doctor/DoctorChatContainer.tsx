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
  const { messages, sendMessage } = useChat(id);
  const { selectedPatient } = useDoctorChat();

  if (!profile) {
    return null;
  }

  if (!selectedPatient) {
    toast.error("No patient selected");
    return null;
  }

  return (
    <CallProvider>
      <div className="flex flex-col h-screen bg-background">
        <DoctorChatHeader patient={selectedPatient} />
        <MessageContainer
          messages={messages}
          sendMessage={sendMessage}
          recipientId={selectedPatient.id}
          recipientName={selectedPatient.full_name || "Patient"}
        />
      </div>
    </CallProvider>
  );
};