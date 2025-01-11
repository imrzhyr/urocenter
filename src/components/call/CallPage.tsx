import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { useCallSetup } from "@/hooks/useCallSetup";
import { useCallHandlers } from "@/hooks/useCallHandlers";
import { CallControls } from "./CallControls";
import { CallingTonePlayer } from "@/utils/audioPlayer";
import { useCall } from "@/contexts/CallContext";

export const CallPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { profile } = useProfile();
  const { callingUser, callStatus, setCallStatus } = useCallSetup(userId, profile);
  const { duration, handleEndCall, handleAcceptCall, handleRejectCall } = useCallHandlers(userId, profile);
  const { setActiveCall } = useCall();

  useEffect(() => {
    if (!profile || !userId) {
      navigate('/');
      return;
    }
  }, [profile, userId, navigate]);

  useEffect(() => {
    if (callStatus === 'initiated') {
      CallingTonePlayer.play();
    } else {
      CallingTonePlayer.stop();
    }

    return () => {
      CallingTonePlayer.stop();
    };
  }, [callStatus]);

  useEffect(() => {
    if (callingUser) {
      setActiveCall({
        isActive: true,
        duration,
        callingUser,
        callStatus
      });
    }

    return () => {
      setActiveCall({
        isActive: false,
        duration: 0,
        callingUser: null,
        callStatus: 'ended'
      });
    };
  }, [callingUser, duration, callStatus, setActiveCall]);

  if (!callingUser || !profile) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-semibold mb-4">{callingUser.full_name}</h2>
        <p className="text-gray-600 mb-6">
          {callStatus === 'initiated' ? 'Calling...' : 
           callStatus === 'connected' ? `${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')}` :
           'Call ended'}
        </p>
        <CallControls
          onEndCall={handleEndCall}
          onAcceptCall={handleAcceptCall}
          onRejectCall={handleRejectCall}
          status={callStatus}
        />
      </div>
    </div>
  );
};