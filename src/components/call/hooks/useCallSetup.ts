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
            status: 'active'
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

      console.log('Checking for incoming calls from:', userId, 'to:', profile.id);
      
      // Get the most recent active call where current user is the receiver and other user is the caller
      const { data, error } = await supabase
        .from('calls')
        .select('*')
        .eq('receiver_id', profile.id)
        .eq('caller_id', userId)
        .eq('status', 'active')
        .order('started_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking incoming call:', error);
        return;
      }

      console.log('Incoming call check result:', data);

      // Only set as incoming if we are the receiver of an active call
      if (data && data.receiver_id === profile.id) {
        console.log('Setting as incoming call because we are the receiver');
        setIsIncoming(true);
        setCallStatus('ringing');
      } else {
        console.log('Not an incoming call for us');
        setIsIncoming(false);
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