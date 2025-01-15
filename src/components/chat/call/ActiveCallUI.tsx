import React from 'react';
import { Button } from "@/components/ui/button";
import { Phone, PhoneOff, Mic, MicOff } from "lucide-react";
import { useCall } from './CallProvider';

export const ActiveCallUI = () => {
  const { callDuration, endCall } = useCall();
  const [isMuted, setIsMuted] = React.useState(false);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    // Add mute functionality here when needed
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center text-white z-50">
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto">
            <Phone className="w-12 h-12" />
          </div>
          <h2 className="text-2xl font-semibold">Active Call</h2>
          <p className="text-4xl font-mono">{formatDuration(callDuration)}</p>
        </div>
        
        <div className="flex gap-6 mt-8">
          <Button
            variant="outline"
            size="lg"
            className="rounded-full p-6"
            onClick={toggleMute}
          >
            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </Button>
          
          <Button
            variant="destructive"
            size="lg"
            className="rounded-full p-6"
            onClick={endCall}
          >
            <PhoneOff className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </div>
  );
};