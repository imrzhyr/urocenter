import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useProfile } from '@/hooks/useProfile';
import { toast } from 'sonner';
import { CallNotification } from './CallNotification';

interface CallContextType {
  isInCall: boolean;
  currentCallId: string | null;
  callDuration: number;
  acceptCall: (callId: string) => Promise<void>;
  rejectCall: (callId: string) => Promise<void>;
  endCall: () => Promise<void>;
  initiateCall: (receiverId: string) => Promise<void>;
}

const CallContext = createContext<CallContextType | null>(null);

const CALL_TIMEOUT = 20000; // 20 seconds

export const CallProvider = ({ children }: { children: React.ReactNode }) => {
  const { profile } = useProfile();
  const [isInCall, setIsInCall] = useState(false);
  const [currentCallId, setCurrentCallId] = useState<string | null>(null);
  const [incomingCall, setIncomingCall] = useState<{ id: string; callerName: string } | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const localStream = useRef<MediaStream | null>(null);
  const callTimeoutRef = useRef<NodeJS.Timeout>();
  const durationIntervalRef = useRef<NodeJS.Timeout>();

  const initializePeerConnection = async () => {
    try {
      // Get user media (audio only for now)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      localStream.current = stream;

      // Create new RTCPeerConnection
      const configuration: RTCConfiguration = {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
        ],
      };

      peerConnection.current = new RTCPeerConnection(configuration);

      // Add local stream tracks to peer connection
      stream.getTracks().forEach(track => {
        if (peerConnection.current && localStream.current) {
          peerConnection.current.addTrack(track, localStream.current);
        }
      });

      // Handle incoming tracks
      peerConnection.current.ontrack = (event) => {
        // Handle remote audio stream
        const [remoteStream] = event.streams;
        // You can handle the remote stream here (e.g., play it through an audio element)
      };

      return true;
    } catch (error) {
      console.error('Error initializing peer connection:', error);
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

      // Set timeout for unanswered call
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
      const success = await initializePeerConnection();
      if (!success) {
        toast.error('Failed to initialize call');
        return;
      }

      setCurrentCallId(callId);
      setIsInCall(true);
      setIncomingCall(null);

      const { error } = await supabase
        .from('calls')
        .update({ status: 'active', started_at: new Date().toISOString() })
        .eq('id', callId);

      if (error) throw error;

      // Start duration timer
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

      // Cleanup
      if (peerConnection.current) {
        peerConnection.current.close();
        peerConnection.current = null;
      }
      if (localStream.current) {
        localStream.current.getTracks().forEach(track => track.stop());
        localStream.current = null;
      }
      if (callTimeoutRef.current) {
        clearTimeout(callTimeoutRef.current);
      }
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }

      setCurrentCallId(null);
      setIsInCall(false);
      setCallDuration(0);
      toast.info('Call ended');
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

              setIncomingCall({
                id: call.id,
                callerName: caller?.full_name || 'Unknown'
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
        callDuration,
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