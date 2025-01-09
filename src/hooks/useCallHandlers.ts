import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { formatDuration } from "@/utils/callUtils";
import type { Profile } from "@/types/profile";

export const useCallHandlers = (userId: string | undefined, profile: Profile | null) => {
  const navigate = useNavigate();
  const [duration, setDuration] = useState(0);

  const handleEndCall = async (callStartTime?: Date) => {
    if (!userId || !profile?.id || !callStartTime) return;

    try {
      const { error: callError } = await supabase
        .from('calls')
        .update({
          ended_at: new Date().toISOString(),
          duration,
          status: 'ended'
        })
        .eq('caller_id', profile.id)
        .eq('receiver_id', userId)
        .eq('status', 'active');

      if (callError) {
        console.error('Error updating call record:', callError);
      }

      const { error: messageError } = await supabase
        .from('messages')
        .insert({
          user_id: userId,
          content: `Call ended - Duration: ${formatDuration(duration)}`,
          is_from_doctor: profile.role === 'admin',
          call_duration: duration
        });

      if (messageError) {
        console.error('Error creating call message:', messageError);
      }

      navigate(-1);
    } catch (error) {
      console.error('Error ending call:', error);
      toast.error('Error ending call');
    }
  };

  const handleAcceptCall = async () => {
    if (!userId || !profile?.id) return;

    try {
      const { error } = await supabase
        .from('calls')
        .update({
          status: 'accepted',
          started_at: new Date().toISOString()
        })
        .eq('caller_id', userId)
        .eq('receiver_id', profile.id)
        .eq('status', 'active');

      if (error) {
        console.error('Error accepting call:', error);
        toast.error('Could not accept call');
        return;
      }
    } catch (error) {
      console.error('Error accepting call:', error);
      toast.error('Error accepting call');
    }
  };

  const handleRejectCall = async () => {
    if (!userId || !profile?.id) return;

    try {
      const { error } = await supabase
        .from('calls')
        .update({
          status: 'rejected',
          ended_at: new Date().toISOString()
        })
        .eq('caller_id', userId)
        .eq('receiver_id', profile.id)
        .eq('status', 'active');

      if (error) {
        console.error('Error rejecting call:', error);
        toast.error('Could not reject call');
        return;
      }

      navigate(-1);
    } catch (error) {
      console.error('Error rejecting call:', error);
      toast.error('Error rejecting call');
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