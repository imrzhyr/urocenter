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
import { PhoneCall, PhoneOff } from 'lucide-react';

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
      <AlertDialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-900">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center text-xl font-semibold">
            Incoming Call
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-gray-500 dark:text-gray-400">
            You have an incoming test call
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex justify-center gap-4 sm:justify-center">
          <AlertDialogCancel
            onClick={onReject}
            className="mt-0 flex items-center gap-2 bg-red-500 text-white hover:bg-red-600 dark:hover:bg-red-700"
          >
            <PhoneOff className="h-4 w-4" />
            Reject
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onAccept}
            className="flex items-center gap-2 bg-green-500 text-white hover:bg-green-600 dark:hover:bg-green-700"
          >
            <PhoneCall className="h-4 w-4" />
            Accept
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};