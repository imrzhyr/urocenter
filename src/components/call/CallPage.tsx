import { useNavigate, useParams } from "react-router-dom";
import { CallContainer } from "./CallContainer";
import { useProfile } from "@/hooks/useProfile";
import { useWebRTC } from "@/hooks/useWebRTC";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { Database } from "@/integrations/supabase/types";

type Call = Database['public']['Tables']['calls']['Row'];

export const CallPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { profile } = useProfile();
  const [callId, setCallId] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [callStatus, setCallStatus] = useState<string>("ringing");
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(true);

  useAuthRedirect();

  const { localStream, remoteStream, startCall, answerCall, endCall } = useWebRTC(
    callId || '',
    profile?.id || '',
    userId || ''
  );

  useEffect(() => {
    if (!callId) return;

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
        async (payload: RealtimePostgresChangesPayload<Call>) => {
          const newCall = payload.new as Call | null;
          if (!newCall) return;

          if (newCall.status === 'connected') {
            setCallStatus('connected');
          } else if (newCall.status === 'ended') {
            setCallStatus('ended');
            endCall();
            onBack();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [callId]);

  useEffect(() => {
    if (remoteStream && isSpeaker) {
      const audioElement = new Audio();
      audioElement.srcObject = remoteStream;
      audioElement.play().catch(console.error);

      return () => {
        audioElement.pause();
        audioElement.srcObject = null;
      };
    }
  }, [remoteStream, isSpeaker]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (callStatus === 'connected') {
      intervalId = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [callStatus]);

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
            await supabase
              .from('calls')
              .update({ status: 'connected' })
              .eq('id', existingCall.id);
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

    return () => {
      if (callId) {
        endCall();
      }
    };
  }, [profile?.id, userId]);

  const onBack = () => {
    if (!userId) {
      navigate('/dashboard');
      return;
    }
    navigate(`/chat/${userId}`);
  };

  const handleEndCall = async () => {
    if (!callId) return;

    try {
      await supabase
        .from('calls')
        .update({ 
          status: 'ended',
          ended_at: new Date().toISOString(),
          duration
        })
        .eq('id', callId);

      endCall();
      onBack();
    } catch (error) {
      console.error('Error ending call:', error);
      toast.error('Could not end call properly');
    }
  };

  const handleToggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const handleToggleSpeaker = () => {
    setIsSpeaker(!isSpeaker);
  };

  const mockUser = {
    full_name: "User",
    id: userId || ""
  };

  return (
    <CallContainer
      onBack={onBack}
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