import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useProfile } from '@/hooks/useProfile';
import { toast } from 'sonner';

interface CallContextType {
  isInCall: boolean;
  currentCallId: string | null;
  acceptCall: (callId: string) => Promise<void>;
  rejectCall: (callId: string) => Promise<void>;
  endCall: () => Promise<void>;
  initiateCall: (receiverId: string) => Promise<void>;
}

const CallContext = createContext<CallContextType | null>(null);

const ICE_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
  { urls: 'stun:stun2.l.google.com:19302' },
];

export const CallProvider = ({ children }: { children: React.ReactNode }) => {
  const { profile } = useProfile();
  const [isInCall, setIsInCall] = useState(false);
  const [currentCallId, setCurrentCallId] = useState<string | null>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const localStream = useRef<MediaStream | null>(null);

  const initiateCall = async (receiverId: string) => {
    if (!profile?.id) {
      toast.error('You must be logged in to make calls');
      return;
    }

    try {
      const { data: call, error } = await supabase
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

      setCurrentCallId(call.id);
      setIsInCall(true);
      await initializePeerConnection();

    } catch (error) {
      console.error('Error in initiateCall:', error);
      toast.error('Failed to start call');
    }
  };

  useEffect(() => {
    if (!profile?.id || !currentCallId) return;

    const channel = supabase
      .channel('call_signals')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'call_signals',
          filter: `to_user=eq.${profile.id}`,
        },
        async (payload) => {
          const signal = payload.new;
          if (signal.call_id !== currentCallId) return;

          try {
            switch (signal.type) {
              case 'offer':
                await handleOffer(signal);
                break;
              case 'answer':
                await handleAnswer(signal);
                break;
              case 'candidate':
                await handleCandidate(signal);
                break;
              case 'leave':
                await endCall();
                break;
            }
          } catch (error) {
            console.error('Error handling signal:', error);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile?.id, currentCallId]);

  const initializePeerConnection = async () => {
    peerConnection.current = new RTCPeerConnection({ iceServers: ICE_SERVERS });

    try {
      localStream.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      localStream.current.getTracks().forEach(track => {
        if (localStream.current && peerConnection.current) {
          peerConnection.current.addTrack(track, localStream.current);
        }
      });
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast.error('Failed to access microphone');
      throw error;
    }

    peerConnection.current.onicecandidate = async (event) => {
      if (event.candidate && currentCallId && profile?.id) {
        await supabase.from('call_signals').insert({
          call_id: currentCallId,
          from_user: profile.id,
          to_user: event.candidate.sdpMid!, // The other participant's ID
          type: 'candidate',
          data: event.candidate,
        });
      }
    };

    peerConnection.current.ontrack = (event) => {
      const remoteAudio = document.createElement('audio');
      remoteAudio.srcObject = event.streams[0];
      remoteAudio.autoplay = true;
      document.body.appendChild(remoteAudio);
    };
  };

  const handleOffer = async (signal: any) => {
    if (!peerConnection.current || !profile?.id) return;

    await peerConnection.current.setRemoteDescription(new RTCSessionDescription(signal.data));
    const answer = await peerConnection.current.createAnswer();
    await peerConnection.current.setLocalDescription(answer);

    await supabase.from('call_signals').insert({
      call_id: signal.call_id,
      from_user: profile.id,
      to_user: signal.from_user,
      type: 'answer',
      data: answer,
    });
  };

  const handleAnswer = async (signal: any) => {
    if (!peerConnection.current) return;
    await peerConnection.current.setRemoteDescription(new RTCSessionDescription(signal.data));
  };

  const handleCandidate = async (signal: any) => {
    if (!peerConnection.current) return;
    await peerConnection.current.addIceCandidate(new RTCIceCandidate(signal.data));
  };

  const acceptCall = async (callId: string) => {
    if (!profile?.id) return;

    try {
      await initializePeerConnection();
      setCurrentCallId(callId);
      setIsInCall(true);

      const { error } = await supabase
        .from('calls')
        .update({ status: 'active' })
        .eq('id', callId);

      if (error) throw error;
    } catch (error) {
      console.error('Error accepting call:', error);
      toast.error('Failed to accept call');
    }
  };

  const rejectCall = async (callId: string) => {
    try {
      const { error } = await supabase
        .from('calls')
        .update({ status: 'rejected', ended_at: new Date().toISOString() })
        .eq('id', callId);

      if (error) throw error;
    } catch (error) {
      console.error('Error rejecting call:', error);
      toast.error('Failed to reject call');
    }
  };

  const endCall = async () => {
    if (!currentCallId || !profile?.id) return;

    try {
      const { error } = await supabase
        .from('calls')
        .update({ status: 'ended', ended_at: new Date().toISOString() })
        .eq('id', currentCallId);

      if (error) throw error;

      // Cleanup
      if (peerConnection.current) {
        peerConnection.current.close();
        peerConnection.current = null;
      }
      if (localStream.current) {
        localStream.current.getTracks().forEach(track => track.stop());
        localStream.current = null;
      }

      setCurrentCallId(null);
      setIsInCall(false);
    } catch (error) {
      console.error('Error ending call:', error);
      toast.error('Failed to end call');
    }
  };

  useEffect(() => {
    if (!profile?.id) return;

    const channel = supabase
      .channel('calls')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'calls',
          filter: `receiver_id=eq.${profile.id}`,
        },
        async (payload) => {
          if (payload.eventType === 'INSERT') {
            const call = payload.new;
            if (call.status === 'pending') {
              const { data: caller } = await supabase
                .from('profiles')
                .select('full_name')
                .eq('id', call.caller_id)
                .maybeSingle();

              toast(`Incoming call from ${caller?.full_name || 'Unknown'}`, {
                action: {
                  label: 'Accept',
                  onClick: () => acceptCall(call.id),
                },
                cancel: {
                  label: 'Reject',
                  onClick: () => rejectCall(call.id),
                },
              });
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile?.id]);

  return (
    <CallContext.Provider 
      value={{ 
        isInCall, 
        currentCallId, 
        acceptCall, 
        rejectCall, 
        endCall,
        initiateCall 
      }}
    >
      {children}
    </CallContext.Provider>
  );
};

export const useCall = () => {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error('useCall must be used within a CallProvider');
  }
  return context;
};
