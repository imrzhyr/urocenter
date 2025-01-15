import React from 'react';
import { Button } from '@/components/ui/button';
import { Phone } from 'lucide-react';
import { useCall } from './CallProvider';
import { toast } from 'sonner';
import { useProfile } from '@/hooks/useProfile';

interface CallButtonProps {
  receiverId: string;
  recipientName: string;
  className?: string;
}

export const CallButton = ({ receiverId, recipientName, className }: CallButtonProps) => {
  const { profile } = useProfile();
  const { initiateCall } = useCall();

  const handleCall = async () => {
    if (!profile?.id) {
      toast.error('You must be logged in to make calls');
      return;
    }

    if (profile.id === receiverId) {
      toast.error('You cannot call yourself');
      return;
    }

    try {
      await initiateCall(receiverId, recipientName);
    } catch (error) {
      console.error('Error initiating call:', error);
      toast.error('Failed to initiate call');
    }
  };

  return (
    <Button
      onClick={handleCall}
      className={className}
      variant="ghost"
      size="icon"
    >
      <Phone className="h-4 w-4" />
    </Button>
  );
};