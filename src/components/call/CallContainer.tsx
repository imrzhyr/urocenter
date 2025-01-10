import { motion } from "framer-motion";
import { CallHeader } from "./CallHeader";
import { CallInfo } from "./CallInfo";
import { CallControls } from "./CallControls";
import { IncomingCallControls } from "./IncomingCallControls";
import { CallingUser } from "@/types/call";

interface CallContainerProps {
  onBack: () => void;
  duration: number;
  callStatus: string;
  callingUser: CallingUser | null;
  isIncoming: boolean;
  isMuted: boolean;
  isSpeaker: boolean;
  onToggleMute: () => void;
  onToggleSpeaker: () => void;
  onEndCall: () => void;
  onAcceptCall: () => void;
  onRejectCall: () => void;
}

export const CallContainer = ({
  onBack,
  duration,
  callStatus,
  callingUser,
  isIncoming,
  isMuted,
  isSpeaker,
  onToggleMute,
  onToggleSpeaker,
  onEndCall,
  onAcceptCall,
  onRejectCall
}: CallContainerProps) => {
  return (
    <div className="fixed inset-0 w-screen h-screen bg-gradient-to-b from-primary/20 to-primary/5">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full h-full flex items-center justify-center p-4"
      >
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          <CallHeader 
            onBack={onBack}
            duration={duration}
            callStatus={callStatus}
          />
          
          <CallInfo 
            callingUser={callingUser}
            callStatus={callStatus}
            isIncoming={isIncoming}
          />

          {callStatus === 'ringing' && isIncoming ? (
            <IncomingCallControls
              onAccept={onAcceptCall}
              onReject={onRejectCall}
            />
          ) : (
            <CallControls
              isMuted={isMuted}
              isSpeaker={isSpeaker}
              onToggleMute={onToggleMute}
              onToggleSpeaker={onToggleSpeaker}
              onEndCall={onEndCall}
            />
          )}
        </div>
      </motion.div>
    </div>
  );
};