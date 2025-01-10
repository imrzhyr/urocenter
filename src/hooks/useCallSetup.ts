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
    let isMounted = true;

    const fetchUserDetails = async () => {
      if (!userId || !profile?.id) return;

      try {
        // Check for existing active calls first
        const { data: existingCalls, error: checkError } = await supabase
          .from('calls')
          .select('*')
          .or(`caller_id.eq.${profile.id},receiver_id.eq.${profile.id}`)
          .eq('status', 'initiated')
          .single();

        if (checkError && checkError.code !== 'PGRST116') {
          console.error('Error checking existing calls:', checkError);
          toast.error('Could not check existing calls');
          return;
        }

        if (existingCalls) {
          console.log('Active call already exists:', existingCalls);
          toast.error('You already have an active call');
          return;
        }

        // Fetch user details
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

        if (isMounted) {
          setCallingUser(data);
          
          // Only create call record if we're initiating the call and there's no active call
          if (!isIncoming && !existingCalls) {
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
        }
      } catch (error) {
        console.error('Error in call setup:', error);
        toast.error('Call setup failed');
      }
    };

    const checkIfIncoming = async () => {
      if (!profile?.id || !userId) return;

      try {
        console.log('Checking for incoming calls - Current user:', profile.id, 'Other user:', userId);
        
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

        if (activeCalls && activeCalls.length > 0 && isMounted) {
          const activeCall = activeCalls[0];
          console.log('Active call found:', activeCall);

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
      } catch (error) {
        console.error('Error checking incoming calls:', error);
      }
    };

    fetchUserDetails();
    checkIfIncoming();

    return () => {
      isMounted = false;
    };
  }, [userId, profile?.id, isIncoming]);

  return {
    callingUser,
    callStatus,
    setCallStatus,
    isIncoming
  };
};