import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX, Minimize2 } from "lucide-react";
import { useCall } from './CallProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { MinimizedCallUI } from './MinimizedCallUI';

export const ActiveCallUI = () => {
  const { callDuration, endCall, toggleMute, toggleSpeaker, isCallEnded } = useCall();
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [showUI, setShowUI] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleToggleMute = () => {
    const muted = toggleMute();
    setIsMuted(muted);
  };

  const handleToggleSpeaker = async () => {
    const speakerOn = await toggleSpeaker();
    setIsSpeakerOn(speakerOn);
  };

  useEffect(() => {
    if (isCallEnded) {
      const timer = setTimeout(() => {
        setShowUI(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isCallEnded]);

  if (isMinimized) {
    return <MinimizedCallUI onMaximize={() => setIsMinimized(false)} />;
  }

  return (
    <AnimatePresence>
      {showUI && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center text-white z-50"
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/10"
            onClick={() => setIsMinimized(true)}
          >
            <Minimize2 className="h-5 w-5" />
          </Button>

          <motion.div 
            className="text-center space-y-8"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="space-y-4">
              <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto">
                <Phone className="w-12 h-12" />
              </div>
              <h2 className="text-2xl font-semibold">
                {isCallEnded ? 'Call Ended' : 'Active Call'}
              </h2>
              <p className="text-4xl font-mono">{formatDuration(callDuration)}</p>
              {isCallEnded && (
                <p className="text-gray-400">Call duration: {formatDuration(callDuration)}</p>
              )}
            </div>
            
            {!isCallEnded && (
              <div className="flex gap-6 mt-8">
                <Button
                  variant="outline"
                  size="lg"
                  className={`rounded-full p-6 ${isMuted ? 'bg-red-500 hover:bg-red-600 border-red-400' : 'bg-white/10 hover:bg-white/20 border-white/20'}`}
                  onClick={handleToggleMute}
                >
                  {isMuted ? 
                    <MicOff className="w-6 h-6 text-white" /> : 
                    <Mic className="w-6 h-6 text-white" />
                  }
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className={`rounded-full p-6 ${isSpeakerOn ? 'bg-blue-500 hover:bg-blue-600 border-blue-400' : 'bg-white/10 hover:bg-white/20 border-white/20'}`}
                  onClick={handleToggleSpeaker}
                >
                  {isSpeakerOn ? 
                    <Volume2 className="w-6 h-6 text-white" /> : 
                    <VolumeX className="w-6 h-6 text-white" />
                  }
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
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};