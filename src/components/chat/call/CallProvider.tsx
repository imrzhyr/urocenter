import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useProfile } from '@/hooks/useProfile';
import { toast } from 'sonner';
import { CallNotification } from './CallNotification';
import { ActiveCallUI } from './ActiveCallUI';
import { CallingUI } from './CallingUI';

interface CallContextType {
  isInCall: boolean;
  isCalling: boolean;
  currentCallId: string | null;
  callDuration: number;
  isCallEnded: boolean;
  localStream: React.MutableRefObject<MediaStream | null>;
  acceptCall: (callId: string) => Promise<void>;
  rejectCall: (callId: string) => Promise<void>;
  endCall: () => Promise<void>;
  initiateCall: (receiverId: string, recipientName: string) => Promise<void>;
}

const CallContext = createContext<CallContextType | null>(null);

const CALL_TIMEOUT = 30000; // 30 seconds

export const CallProvider = ({ children }: { children: React.ReactNode }) => {
  const { profile } = useProfile();
  const [isInCall, setIsInCall] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [isCallEnded, setIsCallEnded] = useState(false);
  const [currentCallId, setCurrentCallId] = useState<string | null>(null);
  const [incomingCall, setIncomingCall] = useState<{ id: string; callerName: string } | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [recipientName, setRecipientName] = useState('');
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const localStream = useRef<MediaStream | null>(null);
  const remoteStream = useRef<MediaStream | null>(null);
  const callTimeoutRef = useRef<NodeJS.Timeout>();
  const durationIntervalRef = useRef<NodeJS.Timeout>();

  const setupWebRTC = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true,
        video: false
      });
      
      localStream.current = stream;

      const configuration: RTCConfiguration = {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
        ],
      };

      peerConnection.current = new RTCPeerConnection(configuration);

      stream.getTracks().forEach(track => {
        if (peerConnection.current && localStream.current) {
          peerConnection.current.addTrack(track, localStream.current);
        }
      });

      peerConnection.current.ontrack = (event) => {
        remoteStream.current = event.streams[0];
        const audio = new Audio();
        audio.srcObject = remoteStream.current;
        audio.play().catch(console.error);
      };

      return true;
    } catch (error) {
      console.error('Error setting up WebRTC:', error);
      toast.error('Failed to access microphone');
      return false;
    }
  };

  const startDurationTimer = () => {
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
    }
    setCallDuration(0);
    durationIntervalRef.current = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
  };

  const initiateCall = async (receiverId: string, recipientName: string) => {
    if (!profile?.id) {
      toast.error('You must be logged in to make calls');
      return;
    }

    try {
      const success = await setupWebRTC();
      if (!success) return;

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
      setIsCalling(true);
      setRecipientName(recipientName);

      // Create and send offer
      if (peerConnection.current) {
        const offer = await peerConnection.current.createOffer();
        await peerConnection.current.setLocalDescription(offer);

        await supabase.from('call_signals').insert({
          call_id: call.id,
          from_user: profile.id,
          to_user: receiverId,
          type: 'offer',
          data: { sdp: offer }
        });
      }

      callTimeoutRef.current = setTimeout(async () => {
        if (call.id) {
          await endCall();
          toast.error('Call was not answered');
        }
      }, CALL_TIMEOUT);

    } catch (error) {
      console.error('Error in initiateCall:', error);
      toast.error('Failed to start call');
    }
  };

  const acceptCall = async (callId: string) => {
    if (!profile?.id) return;

    try {
      const success = await setupWebRTC();
      if (!success) {
        toast.error('Failed to initialize call');
        return;
      }

      setCurrentCallId(callId);
      setIsInCall(true);
      setIncomingCall(null);
      setIsCallEnded(false);

      const { error } = await supabase
        .from('calls')
        .update({ status: 'active', started_at: new Date().toISOString() })
        .eq('id', callId);

      if (error) throw error;

      startDurationTimer();
      toast.success('Call connected');
    } catch (error) {
      console.error('Error accepting call:', error);
      toast.error('Failed to accept call');
    }
  };

  const rejectCall = async (callId: string) => {
    try {
      const { error } = await supabase
        .from('calls')
        .update({ 
          status: 'rejected', 
          ended_at: new Date().toISOString() 
        })
        .eq('id', callId);

      if (error) throw error;
      setIncomingCall(null);
      toast.info('Call rejected');
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
        .update({ 
          status: 'ended', 
          ended_at: new Date().toISOString() 
        })
        .eq('id', currentCallId);

      if (error) throw error;

      setIsCallEnded(true);

      // Cleanup after 2 seconds
      setTimeout(() => {
        if (peerConnection.current) {
          peerConnection.current.close();
          peerConnection.current = null;
        }
        if (localStream.current) {
          localStream.current.getTracks().forEach(track => track.stop());
          localStream.current = null;
        }
        if (remoteStream.current) {
          remoteStream.current.getTracks().forEach(track => track.stop());
          remoteStream.current = null;
        }
        if (callTimeoutRef.current) {
          clearTimeout(callTimeoutRef.current);
        }
        if (durationIntervalRef.current) {
          clearInterval(durationIntervalRef.current);
        }

        setCurrentCallId(null);
        setIsInCall(false);
        setIsCalling(false);
        setCallDuration(0);
        setIsCallEnded(false);
      }, 2000);

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
        },
        async (payload) => {
          if (payload.eventType === 'INSERT' && payload.new.receiver_id === profile.id) {
            const { data: caller } = await supabase
              .from('profiles')
              .select('full_name')
              .eq('id', payload.new.caller_id)
              .maybeSingle();

            setIncomingCall({
              id: payload.new.id,
              callerName: caller?.full_name || 'Unknown'
            });
          } else if (payload.eventType === 'UPDATE' && payload.new.status === 'active') {
            if (payload.new.caller_id === profile.id || payload.new.receiver_id === profile.id) {
              setIsInCall(true);
              setIsCalling(false);
              startDurationTimer();
            }
          }
        }
      )
      .subscribe();

    const signalChannel = supabase
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
          if (!peerConnection.current) return;

          if (signal.type === 'offer') {
            await peerConnection.current.setRemoteDescription(new RTCSessionDescription(signal.data.sdp));
            const answer = await peerConnection.current.createAnswer();
            await peerConnection.current.setLocalDescription(answer);

            await supabase.from('call_signals').insert({
              call_id: signal.call_id,
              from_user: profile.id,
              to_user: signal.from_user,
              type: 'answer',
              data: { sdp: answer }
            });
          } else if (signal.type === 'answer') {
            await peerConnection.current.setRemoteDescription(new RTCSessionDescription(signal.data.sdp));
          } else if (signal.type === 'ice-candidate') {
            await peerConnection.current.addIceCandidate(new RTCIceCandidate(signal.data.candidate));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(signalChannel);
    };
  }, [profile?.id]);

  return (
    <CallContext.Provider 
      value={{ 
        isInCall, 
        isCalling,
        currentCallId,
        callDuration,
        isCallEnded,
        localStream,
        acceptCall, 
        rejectCall, 
        endCall,
        initiateCall 
      }}
    >
      {children}
      {incomingCall && (
        <CallNotification
          callerName={incomingCall.callerName}
          onAccept={() => acceptCall(incomingCall.id)}
          onReject={() => rejectCall(incomingCall.id)}
          open={!!incomingCall}
        />
      )}
      {isCalling && <CallingUI recipientName={recipientName} />}
      {isInCall && <ActiveCallUI />}
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
