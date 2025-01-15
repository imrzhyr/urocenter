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
  const callStartTimeRef = useRef<number | null>(null);

  const setupWebRTC = async () => {
    try {
      console.log('Setting up WebRTC...');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true,
        video: false
      });
      
      localStream.current = stream;
      console.log('Got local stream:', stream.getTracks());

      const configuration: RTCConfiguration = {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
        ],
      };

      peerConnection.current = new RTCPeerConnection(configuration);
      console.log('Created peer connection');

      // Add local stream tracks to peer connection
      stream.getTracks().forEach(track => {
        if (peerConnection.current && localStream.current) {
          console.log('Adding track to peer connection:', track.kind);
          peerConnection.current.addTrack(track, localStream.current);
        }
      });

      // Handle incoming remote stream
      peerConnection.current.ontrack = (event) => {
        console.log('Received remote track:', event.track.kind);
        if (!remoteStream.current) {
          remoteStream.current = new MediaStream();
        }
        remoteStream.current.addTrack(event.track);
        
        // Create and play audio element for remote stream
        const audioElement = new Audio();
        audioElement.srcObject = remoteStream.current;
        audioElement.autoplay = true;
        audioElement.play().catch(error => {
          console.error('Error playing remote audio:', error);
        });
      };

      // Handle connection state changes
      peerConnection.current.onconnectionstatechange = () => {
        console.log('Connection state:', peerConnection.current?.connectionState);
        if (peerConnection.current?.connectionState === 'connected') {
          console.log('Peers connected!');
          if (callTimeoutRef.current) {
            clearTimeout(callTimeoutRef.current);
            callTimeoutRef.current = undefined;
          }
        }
      };

      // Handle ICE connection state changes
      peerConnection.current.oniceconnectionstatechange = () => {
        console.log('ICE connection state:', peerConnection.current?.iceConnectionState);
        if (peerConnection.current?.iceConnectionState === 'disconnected') {
          console.log('ICE connection disconnected');
          endCall();
        }
      };

      // Handle ICE candidates
      peerConnection.current.onicecandidate = async (event) => {
        if (event.candidate && currentCallId && profile?.id) {
          console.log('Sending ICE candidate:', event.candidate);
          await supabase.from('call_signals').insert({
            call_id: currentCallId,
            from_user: profile.id,
            to_user: profile.id,
            type: 'ice-candidate',
            data: { candidate: event.candidate }
          });
        }
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
    callStartTimeRef.current = Date.now();
    setCallDuration(0);
    durationIntervalRef.current = setInterval(() => {
      if (callStartTimeRef.current) {
        const duration = Math.floor((Date.now() - callStartTimeRef.current) / 1000);
        setCallDuration(duration);
      }
    }, 1000);
  };

  const stopDurationTimer = () => {
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
      if (callStartTimeRef.current) {
        const finalDuration = Math.floor((Date.now() - callStartTimeRef.current) / 1000);
        setCallDuration(finalDuration);
      }
    }
  };

  const initiateCall = async (receiverId: string, recipientName: string) => {
    if (!profile?.id) {
      toast.error('You must be logged in to make calls');
      return;
    }

    try {
      console.log('Initiating call to:', receiverId);
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

      if (error) throw error;

      setCurrentCallId(call.id);
      setIsCalling(true);
      setRecipientName(recipientName);

      // Create and send offer
      if (peerConnection.current) {
        console.log('Creating offer...');
        const offer = await peerConnection.current.createOffer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: false
        });
        await peerConnection.current.setLocalDescription(offer);

        await supabase.from('call_signals').insert({
          call_id: call.id,
          from_user: profile.id,
          to_user: receiverId,
          type: 'offer',
          data: { sdp: offer }
        });
      }

      // Set up call timeout
      callTimeoutRef.current = setTimeout(async () => {
        if (call.id && !isInCall) {
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
      console.log('Accepting call:', callId);
      const success = await setupWebRTC();
      if (!success) {
        toast.error('Failed to initialize call');
        return;
      }

      // Clear any existing timeout immediately when accepting the call
      if (callTimeoutRef.current) {
        clearTimeout(callTimeoutRef.current);
        callTimeoutRef.current = undefined;
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
      stopDurationTimer();

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

        setCurrentCallId(null);
        setIsInCall(false);
        setIsCalling(false);
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
          console.log('Call change event:', payload);
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
          } else if (payload.eventType === 'UPDATE') {
            if (payload.new.status === 'active' && 
               (payload.new.caller_id === profile.id || payload.new.receiver_id === profile.id)) {
              // Clear timeout when call becomes active
              if (callTimeoutRef.current) {
                clearTimeout(callTimeoutRef.current);
                callTimeoutRef.current = undefined;
              }
              setIsInCall(true);
              setIsCalling(false);
              startDurationTimer();
            } else if (payload.new.status === 'ended' && 
                     (payload.new.caller_id === profile.id || payload.new.receiver_id === profile.id)) {
              setIsCallEnded(true);
              stopDurationTimer();
              setTimeout(() => {
                setIsInCall(false);
                setIsCalling(false);
                setCurrentCallId(null);
              }, 2000);
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

          try {
            console.log('Received signal:', signal.type, signal.data);
            if (signal.type === 'offer') {
              console.log('Setting remote description (offer)');
              await peerConnection.current.setRemoteDescription(new RTCSessionDescription(signal.data.sdp));
              const answer = await peerConnection.current.createAnswer({
                offerToReceiveAudio: true,
                offerToReceiveVideo: false
              });
              await peerConnection.current.setLocalDescription(answer);

              console.log('Sending answer');
              await supabase.from('call_signals').insert({
                call_id: signal.call_id,
                from_user: profile.id,
                to_user: signal.from_user,
                type: 'answer',
                data: { sdp: answer }
              });
            } else if (signal.type === 'answer') {
              console.log('Setting remote description (answer)');
              await peerConnection.current.setRemoteDescription(new RTCSessionDescription(signal.data.sdp));
            } else if (signal.type === 'ice-candidate' && signal.data.candidate) {
              console.log('Adding ICE candidate');
              await peerConnection.current.addIceCandidate(new RTCIceCandidate(signal.data.candidate));
            }
          } catch (error) {
            console.error('Error handling WebRTC signal:', error);
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