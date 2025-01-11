import { Button } from "@/components/ui/button";
import { Mic, MicOff, Volume2, PhoneOff } from "lucide-react";
import { CallStatus } from "@/types/call";

interface CallControlsProps {
  isMuted?: boolean;
  isSpeaker?: boolean;
  onToggleMute?: () => void;
  onToggleSpeaker?: () => void;
  onEndCall: () => void;
  onAcceptCall?: () => void;
  onRejectCall?: () => void;
  status: CallStatus;
}

export const CallControls = ({
  isMuted = false,
  isSpeaker = false,
  onToggleMute,
  onToggleSpeaker,
  onEndCall,
  onAcceptCall,
  onRejectCall,
  status
}: CallControlsProps) => {
  if (status === 'initiated') {
    return (
      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          size="lg"
          className="flex flex-col items-center justify-center h-20 rounded-full bg-green-50 hover:bg-green-100 border-green-200"
          onClick={onAcceptCall}
        >
          <div className="flex flex-col items-center">
            <PhoneOff className="h-6 w-6 mb-2 text-green-500" />
            <span className="text-sm">Accept</span>
          </div>
        </Button>

        <Button
          variant="destructive"
          size="lg"
          className="flex flex-col items-center justify-center h-20 rounded-full"
          onClick={onRejectCall}
        >
          <div className="flex flex-col items-center">
            <PhoneOff className="h-6 w-6 mb-2" />
            <span className="text-sm">Reject</span>
          </div>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {onToggleMute && (
        <Button
          variant="outline"
          size="lg"
          className={`flex flex-col items-center justify-center h-20 rounded-full ${
            isMuted ? 'bg-red-50 hover:bg-red-100 border-red-200' : ''
          }`}
          onClick={onToggleMute}
        >
          <div className="flex flex-col items-center">
            {isMuted ? (
              <MicOff className="h-6 w-6 mb-2 text-red-500" />
            ) : (
              <Mic className="h-6 w-6 mb-2 text-primary" />
            )}
            <span className="text-sm">{isMuted ? 'Unmute' : 'Mute'}</span>
          </div>
        </Button>
      )}

      {onToggleSpeaker && (
        <Button
          variant="outline"
          size="lg"
          className={`flex flex-col items-center justify-center h-20 rounded-full ${
            isSpeaker ? 'bg-primary/10 border-primary/20' : ''
          }`}
          onClick={onToggleSpeaker}
        >
          <div className="flex flex-col items-center">
            <Volume2 className={`h-6 w-6 mb-2 ${isSpeaker ? 'text-primary' : ''}`} />
            <span className="text-sm">Speaker</span>
          </div>
        </Button>
      )}

      <Button
        variant="destructive"
        size="lg"
        className="flex flex-col items-center justify-center h-20 rounded-full"
        onClick={onEndCall}
      >
        <div className="flex flex-col items-center">
          <PhoneOff className="h-6 w-6 mb-2" />
          <span className="text-sm">End</span>
        </div>
      </Button>
    </div>
  );
};