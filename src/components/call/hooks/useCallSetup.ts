import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Profile } from "@/types/profile";
import { CallingUser, CallStatus } from "@/types/call";

export const useCallSetup = (userId: string | undefined, profile: Profile | null) => {
  const [callingUser, setCallingUser] = useState<CallingUser | null>(null);
  const [callStatus, setCallStatus] = useState<CallStatus>('ringing');
  const [isIncoming, setIsIncoming] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!userId || !profile?.id) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, id')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user details:', error);
        toast.error('Could not fetch user details');
        return;
      }

      setCallingUser(data);
      
      // Only create call record if we're initiating the call
      if (!isIncoming) {
        console.log('Creating outgoing call record:', { caller: profile.id, receiver: userId });
        const { error: callError } = await supabase
          .from('calls')
          .insert({
            caller_id: profile.id,
            receiver_id: userId,
            status: 'initiated'
          });

        if (callError) {
          console.error('Error creating call record:', callError);
          toast.error('Could not initiate call');
          return;
        }
      }
    };

    const checkIfIncoming = async () => {
      if (!profile?.id || !userId) return;

      console.log('Checking for incoming calls - Current user:', profile.id, 'Other user:', userId);
      
      // Get the most recent initiated call between these users
      const { data: activeCalls, error: fetchError } = await supabase
        .from('calls')
        .select('*')
        .or(`and(caller_id.eq.${userId},receiver_id.eq.${profile.id}),and(caller_id.eq.${profile.id},receiver_id.eq.${userId})`)
        .eq('status', 'initiated')
        .order('started_at', { ascending: false })
        .limit(1);

      if (fetchError) {
        console.error('Error checking incoming call:', fetchError);
        return;
      }

      console.log('Active calls found:', activeCalls);

      if (activeCalls && activeCalls.length > 0) {
        const activeCall = activeCalls[0];
        console.log('Most recent active call:', activeCall);
        console.log('Current user is receiver?', activeCall.receiver_id === profile.id);
        console.log('Other user is caller?', activeCall.caller_id === userId);

        // Set as incoming only if we are the receiver and the other user is the caller
        if (activeCall.receiver_id === profile.id && activeCall.caller_id === userId) {
          console.log('Setting as incoming call - we are the receiver');
          setIsIncoming(true);
          setCallStatus('ringing');
        } else if (activeCall.caller_id === profile.id && activeCall.receiver_id === userId) {
          console.log('Setting as outgoing call - we are the caller');
          setIsIncoming(false);
          setCallStatus('ringing');
        }
      }
    };

    fetchUserDetails();
    checkIfIncoming();
  }, [userId, profile?.id, isIncoming]);

  return {
    callingUser,
    callStatus,
    setCallStatus,
    isIncoming
  };
};