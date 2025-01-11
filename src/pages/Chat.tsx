import { UserChatContainer } from "@/components/chat/UserChatContainer";
import { DoctorChatContainer } from "@/components/chat/doctor/DoctorChatContainer";
import { useProfile } from "@/hooks/useProfile";
import { useParams, useNavigate } from "react-router-dom";
import { useIncomingCalls } from "@/hooks/useIncomingCalls";
import { IncomingCallDialog } from "@/components/call/IncomingCallDialog";
import { FloatingCallBar } from "@/components/call/FloatingCallBar";
import { useCall } from "@/contexts/CallContext";

export const Chat = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { profile } = useProfile();
  const { callDialog, setCallDialog } = useIncomingCalls();
  const { activeCallId, callDuration, userId: callUserId, clearActiveCall } = useCall();

  if (!profile) {
    navigate('/signin');
    return null;
  }

  const isAdmin = profile.role === 'admin';

  const handleEndCall = async () => {
    clearActiveCall();
  };

  return (
    <>
      {activeCallId && callUserId && (
        <FloatingCallBar
          duration={callDuration}
          onEndCall={handleEndCall}
          userId={callUserId}
        />
      )}
      {!userId && !isAdmin ? (
        <UserChatContainer />
      ) : userId && isAdmin ? (
        <DoctorChatContainer />
      ) : null}
      <IncomingCallDialog
        open={callDialog.isOpen}
        onOpenChange={(open) => setCallDialog({ ...callDialog, isOpen: open })}
        callerId={callDialog.callerId}
        callerName={callDialog.callerName}
        callId={callDialog.callId}
      />
    </>
  );
};

export default Chat;