import { Button } from "@/components/ui/button";
import { Mic, MicOff, Volume2, PhoneOff } from "lucide-react";

interface CallControlsProps {
  isMuted: boolean;
  isSpeaker: boolean;
  onToggleMute: () => void;
  onToggleSpeaker: () => void;
  onEndCall: () => void;
}

export const CallControls = ({
  isMuted,
  isSpeaker,
  onToggleMute,
  onToggleSpeaker,
  onEndCall,
}: CallControlsProps) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      <Button
        variant="outline"
        className={`flex flex-col items-center p-4 ${isMuted ? 'bg-red-50 hover:bg-red-100' : ''}`}
        onClick={onToggleMute}
      >
        {isMuted ? (
          <MicOff className="h-6 w-6 mb-2 text-red-500" />
        ) : (
          <Mic className="h-6 w-6 mb-2 text-primary" />
        )}
        <span className="text-sm">{isMuted ? 'Unmute' : 'Mute'}</span>
      </Button>

      <Button
        variant="outline"
        className={`flex flex-col items-center p-4 ${isSpeaker ? 'bg-primary/10' : ''}`}
        onClick={onToggleSpeaker}
      >
        <Volume2 className={`h-6 w-6 mb-2 ${isSpeaker ? 'text-primary' : ''}`} />
        <span className="text-sm">Speaker</span>
      </Button>

      <Button
        variant="destructive"
        className="flex flex-col items-center p-4"
        onClick={onEndCall}
      >
        <PhoneOff className="h-6 w-6 mb-2" />
        <span className="text-sm">End</span>
      </Button>
    </div>
  );
};