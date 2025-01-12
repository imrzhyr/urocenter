import React from 'react';
import { Button } from "@/components/ui/button";
import { PhoneOff, Mic, MicOff, Video, VideoOff } from 'lucide-react';
import { CallDuration } from './CallDuration';

interface CallControlsProps {
  onEndCall: () => void;
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
}

export const CallControls: React.FC<CallControlsProps> = ({
  onEndCall,
  isAudioEnabled,
  isVideoEnabled,
  onToggleAudio,
  onToggleVideo
}) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-4 bg-gray-900 rounded-lg">
      <CallDuration />
      
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleAudio}
          className="hover:bg-gray-800"
        >
          {isAudioEnabled ? (
            <Mic className="h-6 w-6 text-white" />
          ) : (
            <MicOff className="h-6 w-6 text-red-500" />
          )}
        </Button>

        <Button
          variant="destructive"
          size="icon"
          onClick={onEndCall}
          className="rounded-full bg-red-500 hover:bg-red-600"
        >
          <PhoneOff className="h-6 w-6" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleVideo}
          className="hover:bg-gray-800"
        >
          {isVideoEnabled ? (
            <Video className="h-6 w-6 text-white" />
          ) : (
            <VideoOff className="h-6 w-6 text-red-500" />
          )}
        </Button>
      </div>
    </div>
  );
};