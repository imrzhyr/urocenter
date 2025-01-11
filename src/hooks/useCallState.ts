import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Profile } from '@/types/profile';

export const useCallState = (userId: string | undefined, profile: Profile | null) => {
  const navigate = useNavigate();
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(true);
  
  const handleCallEnded = useCallback(async () => {
    try {
      if (!userId || !profile?.id) return;

      const { data: activeCalls, error: fetchError } = await supabase
        .from('calls')
        .select('*')
        .or(`caller_id.eq.${profile.id},receiver_id.eq.${profile.id}`)
        .eq('status', 'initiated')
        .order('started_at', { ascending: false })
        .limit(1);

      if (fetchError) {
        console.error('Error fetching active call:', fetchError);
        toast.error('Could not find active call');
        return;
      }

      if (!activeCalls || activeCalls.length === 0) {
        console.log('No active call found');
        return;
      }

      const { error } = await supabase
        .from('calls')
        .update({
          status: 'ended',
          ended_at: new Date().toISOString()
        })
        .eq('id', activeCalls[0].id);

      if (error) {
        console.error('Error ending call:', error);
        toast.error('Could not end call');
        return;
      }

      if (profile?.role === 'admin') {
        navigate(`/chat/${userId}`, { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (error) {
      console.error('Error in handleCallEnded:', error);
      toast.error('Failed to end call properly');
      navigate(profile?.role === 'admin' ? `/chat/${userId}` : '/dashboard', { replace: true });
    }
  }, [userId, profile, navigate]);

  return {
    isMuted,
    setIsMuted,
    isSpeaker,
    setIsSpeaker,
    handleCallEnded
  };
};