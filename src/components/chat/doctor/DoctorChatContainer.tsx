import { useParams } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { useChat } from "@/hooks/useChat";
import { useDoctorChat } from "./hooks/useDoctorChat";
import { DoctorChatHeader } from "./DoctorChatHeader";
import { MessageContainer } from "@/features/chat/components/MessageContainer/MessageContainer";
import { CallProvider } from "@/components/chat/call/CallProvider";
import { toast } from "sonner";

export const DoctorChatContainer = () => {
  const { id } = useParams();
  const { profile } = useProfile();
  const { messages, sendMessage, isLoading } = useChat(id);
  const { patientProfile } = useDoctorChat(id);

  if (!profile) {
    return null;
  }

  if (!patientProfile) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Loading patient information...</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Please wait while we fetch the patient details.</p>
        </div>
      </div>
    );
  }

  return (
    <CallProvider>
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
        userId={profile.id}
      />
    </CallProvider>
  );
};