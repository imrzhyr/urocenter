import React, { useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Phone, PhoneOff } from "lucide-react";
import { callSoundUtils } from '@/utils/callSoundUtils';

interface CallNotificationProps {
  callerName: string;
  onAccept: () => void;
  onReject: () => void;
  open: boolean;
}

export const CallNotification = ({
  callerName,
  onAccept,
  onReject,
  open
}: CallNotificationProps) => {
  useEffect(() => {
    if (open) {
      // Start playing the call sound when the notification opens
      callSoundUtils.startCallingSound();
    }
    
    return () => {
      // Stop the sound when the notification closes
      callSoundUtils.stopCallingSound();
    };
  }, [open]);

  const handleAccept = () => {
    callSoundUtils.stopCallingSound();
    onAccept();
  };

  const handleReject = () => {
    callSoundUtils.stopCallingSound();
    onReject();
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-green-500 animate-pulse" />
            Incoming Call
          </AlertDialogTitle>
          <AlertDialogDescription>
            {callerName} is calling you
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleReject} className="flex items-center gap-2">
            <PhoneOff className="h-4 w-4" />
            Reject
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleAccept} className="flex items-center gap-2 bg-green-500 hover:bg-green-600">
            <Phone className="h-4 w-4" />
            Accept
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};