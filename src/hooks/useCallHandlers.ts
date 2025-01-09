import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Profile } from "@/types/profile";

export const useCallHandlers = (userId: string | undefined, profile: Profile | null) => {
  const [duration, setDuration] = useState(0);

  const handleEndCall = async (callStartTime?: Date) => {
    if (!userId || !profile?.id) return;

    try {
      console.log('Ending call between:', profile.id, 'and', userId);

      let finalDuration = 0;
      if (callStartTime) {
        finalDuration = Math.floor(
          (new Date().getTime() - callStartTime.getTime()) / 1000
        );
      }

      const { error } = await supabase
        .from('calls')
        .update({
          status: 'ended',
          ended_at: new Date().toISOString(),
          duration: finalDuration
        })
        .eq('status', 'active')
        .or(`caller_id.eq.${profile.id},receiver_id.eq.${profile.id}`);

      if (error) {
        console.error('Error ending call:', error);
        toast.error('Could not end call');
        return;
      }

      toast.success('Call ended');
    } catch (error) {
      console.error('Error in handleEndCall:', error);
      toast.error('Failed to end call');
    }
  };

  const handleAcceptCall = async () => {
    if (!userId || !profile?.id) return;

    try {
      console.log('Accepting call from:', userId);

      const { error } = await supabase
        .from('calls')
        .update({ status: 'accepted' })
        .eq('caller_id', userId)
        .eq('receiver_id', profile.id)
        .eq('status', 'active')
        .single();

      if (error) {
        console.error('Error accepting call:', error);
        toast.error('Could not accept call');
        return;
      }

      toast.success('Call accepted');
    } catch (error) {
      console.error('Error in handleAcceptCall:', error);
      toast.error('Failed to accept call');
    }
  };

  const handleRejectCall = async () => {
    if (!userId || !profile?.id) return;

    try {
      console.log('Rejecting call from:', userId);

      const { error } = await supabase
        .from('calls')
        .update({ status: 'rejected' })
        .eq('caller_id', userId)
        .eq('receiver_id', profile.id)
        .eq('status', 'active')
        .single();

      if (error) {
        console.error('Error rejecting call:', error);
        toast.error('Could not reject call');
        return;
      }

      toast.success('Call rejected');
    } catch (error) {
      console.error('Error in handleRejectCall:', error);
      toast.error('Failed to reject call');
    }
  };

  return {
    duration,
    setDuration,
    handleEndCall,
    handleAcceptCall,
    handleRejectCall
  };
};