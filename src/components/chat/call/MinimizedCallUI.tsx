import React, { useState } from 'react';
import { Phone, Maximize2 } from "lucide-react";
import { motion } from "framer-motion";
import { useCall } from './CallProvider';
import { Button } from "@/components/ui/button";

interface MinimizedCallUIProps {
  onMaximize: () => void;
}

export const MinimizedCallUI = ({ onMaximize }: MinimizedCallUIProps) => {
  const { callDuration, isCallEnded } = useCall();
  const [position, setPosition] = useState({ x: 20, y: 20 }); // Set initial position

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0}
      dragConstraints={{ 
        left: 0, 
        right: window.innerWidth - 150, 
        top: 0, 
        bottom: window.innerHeight - 60 
      }}
      initial={position}
      animate={position}
      onDragEnd={(event, info) => {
        setPosition({ 
          x: position.x + info.offset.x, 
          y: position.y + info.offset.y 
        });
      }}
      className="fixed z-50 cursor-move"
      style={{ 
        touchAction: 'none',
        top: 0,
        left: 0,
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`
      }}
    >
      <div className="bg-primary rounded-lg shadow-lg p-2 flex items-center gap-2 w-[150px]">
        <div className="w-8 h-8 bg-primary-foreground rounded-full flex items-center justify-center">
          <Phone className="w-4 h-4 text-primary" />
        </div>
        <span className="text-primary-foreground font-mono">
          {formatDuration(callDuration)}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto h-8 w-8 hover:bg-primary-foreground/10"
          onClick={onMaximize}
        >
          <Maximize2 className="h-4 w-4 text-primary-foreground" />
        </Button>
      </div>
    </motion.div>
  );
};