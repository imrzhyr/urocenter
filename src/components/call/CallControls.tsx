import React from 'react';
import { Button } from "@/components/ui/button";
import { PhoneOff, Mic, MicOff, Volume2, Volume1 } from 'lucide-react';
import { CallDuration } from './CallDuration';

interface CallControlsProps {
  onEndCall: () => void;
  isAudioEnabled: boolean;
  isSpeakerEnabled: boolean;
  onToggleAudio: () => void;
  onToggleSpeaker: () => void;
}

export const CallControls: React.FC<CallControlsProps> = ({
  onEndCall,
  isAudioEnabled,
  isSpeakerEnabled,
  onToggleAudio,
  onToggleSpeaker
}) => {
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-gray-900/95 border-b border-gray-800">
      <CallDuration />
      
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleAudio}
          className="hover:bg-gray-800"
        >
          {isAudioEnabled ? (
            <Mic className="h-4 w-4 text-white" />
          ) : (
            <MicOff className="h-4 w-4 text-red-500" />
          )}
        </Button>

        <Button
          variant="destructive"
          size="icon"
          onClick={onEndCall}
          className="h-8 w-8 rounded-full bg-red-500 hover:bg-red-600"
        >
          <PhoneOff className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSpeaker}
          className="hover:bg-gray-800"
        >
          {isSpeakerEnabled ? (
            <Volume2 className="h-4 w-4 text-white" />
          ) : (
            <Volume1 className="h-4 w-4 text-gray-400" />
          )}
        </Button>
      </div>
    </div>
  );
};