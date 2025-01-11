import { useNavigate, useParams } from "react-router-dom";
import { CallContainer } from "./CallContainer";
import { useProfile } from "@/hooks/useProfile";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useCallConnection } from "@/hooks/useCallConnection";
import { Database } from "@/integrations/supabase/types";

type Call = Database['public']['Tables']['calls']['Row'];

export const CallPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { profile } = useProfile();
  const {
    callId,
    setCallId,
    duration,
    setDuration,
    callStatus,
    setCallStatus,
    isMuted,
    isSpeaker,
    startCall,
    answerCall,
    handleEndCall,
    handleToggleMute,
    handleToggleSpeaker
  } = useCallConnection(userId, profile);

  useEffect(() => {
    if (!profile?.id || !userId) return;

    const setupCall = async () => {
      try {
        if (!localStorage.getItem('userPhone')) {
          toast.error('Please sign in to make calls');
          navigate('/signin');
          return;
        }

        const { data: existingCalls, error: queryError } = await supabase
          .from('calls')
          .select('*')
          .eq('status', 'initiated')
          .or(`caller_id.eq.${profile.id},receiver_id.eq.${profile.id}`)
          .order('created_at', { ascending: false })
          .limit(1);

        if (queryError) {
          console.error('Error querying calls:', queryError);
          toast.error('Could not check existing calls');
          return;
        }

        if (existingCalls && existingCalls.length > 0) {
          const existingCall = existingCalls[0];
          setCallId(existingCall.id);
          const isReceiver = existingCall.receiver_id === profile.id;
          
          if (isReceiver) {
            await answerCall();
            // Update call status to connected when receiver answers
            const { error: updateError } = await supabase
              .from('calls')
              .update({ 
                status: 'connected',
                started_at: new Date().toISOString()
              })
              .eq('id', existingCall.id);

            if (updateError) {
              console.error('Error updating call status:', updateError);
              return;
            }

            setCallStatus('connected');
          } else {
            await startCall();
          }
        } else {
          const { data: newCall, error } = await supabase
            .from('calls')
            .insert({
              caller_id: profile.id,
              receiver_id: userId,
              status: 'initiated'
            })
            .select()
            .single();

          if (error) {
            console.error('Error creating call record:', error);
            toast.error('Could not initiate call');
            return;
          }

          setCallId(newCall.id);
          await startCall();
        }
      } catch (error) {
        console.error('Error setting up call:', error);
        toast.error('Call setup failed');
      }
    };

    setupCall();

    // Subscribe to call status changes
    const channel = supabase
      .channel(`call_${callId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'calls',
          filter: `id=eq.${callId}`
        },
        (payload) => {
          const call = payload.new as Call;
          if (!call) return;

          console.log('Call status updated:', call.status);
          
          if (call.status === 'connected') {
            setCallStatus('connected');
            // Start duration counter when call is connected
            const startTime = new Date(call.started_at).getTime();
            const currentTime = new Date().getTime();
            setDuration(Math.floor((currentTime - startTime) / 1000));
          } else if (call.status === 'ended') {
            setCallStatus('ended');
            handleEndCall();
          }
        }
      )
      .subscribe();

    return () => {
      if (callId) {
        handleEndCall();
      }
      supabase.removeChannel(channel);
    };
  }, [profile?.id, userId, callId]);

  const mockUser = {
    full_name: "User",
    id: userId || ""
  };

  return (
    <CallContainer
      onBack={handleEndCall}
      duration={duration}
      callStatus={callStatus}
      callingUser={mockUser}
      isIncoming={false}
      isMuted={isMuted}
      isSpeaker={isSpeaker}
      onToggleMute={handleToggleMute}
      onToggleSpeaker={handleToggleSpeaker}
      onEndCall={handleEndCall}
      onAcceptCall={answerCall}
      onRejectCall={handleEndCall}
    />
  );
};