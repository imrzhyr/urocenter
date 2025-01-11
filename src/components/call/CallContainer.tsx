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
  console.log('CallContainer render:', { callStatus, isIncoming });
  
  return (
    <div className="fixed inset-0 w-screen h-screen bg-gradient-to-b from-primary/20 to-primary/5">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full h-full flex flex-col justify-between p-4"
      >
        <div className="w-full max-w-md mx-auto">
          <CallHeader 
            onBack={onBack}
            duration={duration}
            callStatus={callStatus}
          />
          
          <CallInfo 
            callingUser={callingUser}
            callStatus={callStatus}
            isIncoming={isIncoming}
            duration={duration}
          />
        </div>

        <div className="w-full max-w-md mx-auto mb-8">
          {callStatus === 'ringing' && isIncoming ? (
            <IncomingCallControls
              onAcceptCall={onAcceptCall}
              onRejectCall={onRejectCall}
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