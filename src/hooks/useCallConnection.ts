import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Call, CallStatus } from "@/types/call";
import { Profile } from "@/types/profile";
import { useWebRTC } from "./useWebRTC";
import { useNavigate } from "react-router-dom";

export const useCallConnection = (
  userId: string | undefined,
  profile: Profile | null
) => {
  const navigate = useNavigate();
  const [callId, setCallId] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [callStatus, setCallStatus] = useState<CallStatus>("ringing");
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(true);

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
        async (payload) => {
          const newCall = payload.new as Call;
          if (!newCall) return;

          console.log('Call status updated:', newCall.status);
          
          if (newCall.status === 'connected') {
            setCallStatus('connected');
            // Start duration counter when call is connected
            const startTime = new Date(newCall.started_at).getTime();
            const currentTime = new Date().getTime();
            setDuration(Math.floor((currentTime - startTime) / 1000));
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

  return {
    callId,
    setCallId,
    duration,
    setDuration,
    callStatus,
    setCallStatus,
    isMuted,
    isSpeaker,
    localStream,
    remoteStream,
    startCall,
    answerCall,
    endCall,
    handleEndCall,
    handleToggleMute,
    handleToggleSpeaker,
    onBack
  };
};