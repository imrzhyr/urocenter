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