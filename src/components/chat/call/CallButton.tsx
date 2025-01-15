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

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(receiverId)) {
      toast.error('Invalid receiver ID format');
      return;
    }

    if (profile.id === receiverId) {
      toast.error('You cannot call yourself');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('calls')
        .insert({
          caller_id: profile.id,
          receiver_id: receiverId,
          status: 'pending'
        })
        .select()
        .single();

      if (error) {
        console.error('Error initiating call:', error);
        toast.error('Failed to initiate call');
        return;
      }

      if (data) {
        toast.success('Call initiated');
      }
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