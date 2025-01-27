import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Phone, PhoneOff, Minimize2 } from "lucide-react";
import { useCall } from './CallProvider';
import { callSoundUtils } from '@/utils/callSoundUtils';
import { MinimizedCallUI } from './MinimizedCallUI';

interface CallingUIProps {
  recipientName: string;
}

export const CallingUI = ({ recipientName }: CallingUIProps) => {
  const { endCall } = useCall();
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    callSoundUtils.startCallingSound().catch(console.error);
    return () => {
      callSoundUtils.stopCallingSound().catch(console.error);
    };
  }, []);

  if (isMinimized) {
    return <MinimizedCallUI onMaximize={() => setIsMinimized(false)} />;
  }

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center text-white z-50">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 text-white hover:bg-white/10"
        onClick={() => setIsMinimized(true)}
      >
        <Minimize2 className="h-5 w-5" />
      </Button>

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