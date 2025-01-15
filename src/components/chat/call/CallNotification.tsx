import React from 'react';
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
          <AlertDialogCancel onClick={onReject} className="flex items-center gap-2">
            <PhoneOff className="h-4 w-4" />
            Reject
          </AlertDialogCancel>
          <AlertDialogAction onClick={onAccept} className="flex items-center gap-2 bg-green-500 hover:bg-green-600">
            <Phone className="h-4 w-4" />
            Accept
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};