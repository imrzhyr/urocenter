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
    console.log('[CallButton] Call initiated with:', {
      currentUser: profile,
      receiverId,
      recipientName
    });

    if (!profile?.id) {
      console.error('[CallButton] No profile found');
      toast.error('You must be logged in to make calls');
      return;
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(receiverId)) {
      console.error('[CallButton] Invalid receiver ID format:', receiverId);
      toast.error('Invalid receiver ID format');
      return;
    }

    try {
      console.log('[CallButton] Attempting to initiate call to:', {
        receiverId,
        recipientName
      });
      await initiateCall(receiverId, recipientName);
      console.log('[CallButton] Call initiated successfully');
    } catch (error) {
      console.error('[CallButton] Error initiating call:', error);
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