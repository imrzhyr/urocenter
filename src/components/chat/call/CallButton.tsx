import React from 'react';
import { Button } from '@/components/ui/button';
import { Phone } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useProfile } from '@/hooks/useProfile';

interface CallButtonProps {
  receiverId: string;
  className?: string;
}

export const CallButton = ({ receiverId, className }: CallButtonProps) => {
  const { profile } = useProfile();

  const initiateCall = async () => {
    if (!profile?.id) {
      toast.error('You must be logged in to make calls');
      return;
    }

    if (profile.id === receiverId) {
      toast.error('You cannot call yourself');
      return;
    }

    try {
      const { error } = await supabase
        .from('calls')
        .insert({
          caller_id: profile.id,
          receiver_id: receiverId,
          status: 'pending'
        });

      if (error) {
        console.error('Error initiating call:', error);
        toast.error('Failed to initiate call');
        return;
      }

      toast.success('Call initiated');
    } catch (error) {
      console.error('Error initiating call:', error);
      toast.error('Failed to initiate call');
    }
  };

  return (
    <Button
      onClick={initiateCall}
      className={className}
      variant="outline"
      size="icon"
    >
      <Phone className="h-4 w-4" />
    </Button>
  );
};