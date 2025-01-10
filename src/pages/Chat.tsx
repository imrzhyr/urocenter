import { UserChatContainer } from "@/components/chat/UserChatContainer";
import { DoctorChatContainer } from "@/components/chat/doctor/DoctorChatContainer";
import { useProfile } from "@/hooks/useProfile";
import { useParams, useNavigate } from "react-router-dom";
import { useIncomingCalls } from "@/hooks/useIncomingCalls";
import { TestCallComponent } from "@/components/chat/TestCallComponent";
import { IncomingCallDialog } from "@/components/call/IncomingCallDialog";

export const Chat = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { profile } = useProfile();
  const { callDialog, setCallDialog } = useIncomingCalls();

  if (!profile) {
    navigate('/signin');
    return null;
  }

  const isAdmin = profile.role === 'admin';

  return (
    <>
      {!isAdmin && <TestCallComponent />}
      {!userId && !isAdmin ? (
        <UserChatContainer />
      ) : userId && isAdmin ? (
        <DoctorChatContainer />
      ) : null}
      <IncomingCallDialog
        open={callDialog.isOpen}
        onOpenChange={(open) => setCallDialog(prev => ({ ...prev, isOpen: open }))}
        callerId={callDialog.callerId}
        callerName={callDialog.callerName}
        callId={callDialog.callId}
      />
    </>
  );
};

export default Chat;