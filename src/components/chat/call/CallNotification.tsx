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
      callSoundUtils.playCallSound();
    }
    
    return () => {
      callSoundUtils.stopCallSound();
    };
  }, [open]);

  const handleAccept = () => {
    callSoundUtils.stopCallSound();
    onAccept();
  };

  const handleReject = () => {
    callSoundUtils.stopCallSound();
    onReject();
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="w-[90vw] max-w-[425px] overflow-hidden">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-green-500 animate-pulse" />
            Incoming Call
          </AlertDialogTitle>
          <AlertDialogDescription className="break-words">
            {callerName} is calling you
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel onClick={handleReject} className="flex items-center justify-center gap-2 w-full sm:w-auto">
            <PhoneOff className="h-4 w-4" />
            Reject
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleAccept} className="flex items-center justify-center gap-2 w-full sm:w-auto bg-green-500 hover:bg-green-600">
            <Phone className="h-4 w-4" />
            Accept
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};