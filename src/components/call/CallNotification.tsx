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
import { useProfile } from '@/hooks/useProfile';
import { webRTCCall } from '@/features/call/WebRTCCall';

interface CallNotificationProps {
  callerId: string;
  onAccept: () => void;
  onReject: () => void;
}

export const CallNotification: React.FC<CallNotificationProps> = ({
  callerId,
  onAccept,
  onReject
}) => {
  const { profile } = useProfile();

  if (!profile) return null;

  return (
    <AlertDialog defaultOpen>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Incoming Call</AlertDialogTitle>
          <AlertDialogDescription>
            You have an incoming call from {callerId}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onReject}>Reject</AlertDialogCancel>
          <AlertDialogAction onClick={onAccept}>Accept</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};