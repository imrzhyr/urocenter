import { UserChatContainer } from "@/components/chat/UserChatContainer";
import { DoctorChatContainer } from "@/components/chat/doctor/DoctorChatContainer";
import { useProfile } from "@/hooks/useProfile";
import { useParams, useNavigate } from "react-router-dom";
import { useIncomingCalls } from "@/hooks/useIncomingCalls";
import { IncomingCallDialog } from "@/components/call/IncomingCallDialog";
import { PersistentCallBar } from "@/components/call/PersistentCallBar";
import { useCall } from "@/contexts/CallContext";

export const Chat = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { profile } = useProfile();
  const { callDialog, setCallDialog } = useIncomingCalls();
  const { isCallActive, duration, callingUser, activeCallId } = useCall();

  if (!profile) {
    navigate('/signin');
    return null;
  }

  const isAdmin = profile.role === 'admin';

  const handleEndCall = () => {
    // This will trigger the CallPage's onEndCall handler through the subscription
    navigate(`/call/${callingUser?.id}`);
  };

  return (
    <>
      {isCallActive && (
        <PersistentCallBar
          duration={duration}
          callingUser={callingUser}
          onEndCall={handleEndCall}
          callId={activeCallId || ''}
        />
      )}
      <div className={`${isCallActive ? 'mt-14' : ''}`}>
        {!userId && !isAdmin ? (
          <UserChatContainer />
        ) : userId && isAdmin ? (
          <DoctorChatContainer />
        ) : null}
      </div>
      <IncomingCallDialog
        open={callDialog.isOpen}
        onOpenChange={(open) => setCallDialog({
          ...callDialog,
          isOpen: open
        })}
        callerId={callDialog.callerId}
        callerName={callDialog.callerName}
        callId={callDialog.callId}
      />
    </>
  );
};

export default Chat;