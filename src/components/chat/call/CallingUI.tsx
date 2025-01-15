import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Phone, PhoneOff } from "lucide-react";
import { useCall } from './CallProvider';
import { callSoundUtils } from '@/utils/callSoundUtils';

interface CallingUIProps {
  recipientName: string;
}

export const CallingUI = ({ recipientName }: CallingUIProps) => {
  const { endCall } = useCall();

  useEffect(() => {
    // Start playing the calling sound when the component mounts
    callSoundUtils.startCallingSound();
    
    // Stop the sound when the component unmounts
    return () => {
      callSoundUtils.stopCallingSound();
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center text-white z-50">
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto animate-pulse">
            <Phone className="w-12 h-12" />
          </div>
          <h2 className="text-2xl font-semibold">Calling {recipientName}...</h2>
          <p className="text-gray-400">Waiting for answer</p>
        </div>
        
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
  );
};