import React, { createContext, useContext, useState, useEffect } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { toast } from 'sonner';
import { CallNotification } from './CallNotification';
import { ActiveCallUI } from './ActiveCallUI';
import { CallingUI } from './CallingUI';
import { useWebRTC } from './hooks/useWebRTC';
import { useCallState } from './hooks/useCallState';
import { supabase } from '@/integrations/supabase/client';

const CALL_TIMEOUT = 30000; // 30 seconds

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

/**
 * Provider component for managing WebRTC calls
 */
export const CallProvider = ({ children }: { children: React.ReactNode }) => {
  const { profile } = useProfile();
  const [incomingCall, setIncomingCall] = useState<{ id: string; callerName: string } | null>(null);
  const [recipientName, setRecipientName] = useState('');

  const {
    isInCall,
    setIsInCall,
    isCalling,
    setIsCalling,
    isCallEnded,
    setIsCallEnded,
    currentCallId,
    setCurrentCallId,
    callDuration,
    callTimeoutRef,
    startDurationTimer,
    stopDurationTimer,
    clearCallTimeout,
    updateCallStatus
  } = useCallState({ profileId: profile?.id });

  const {
    peerConnection,
    localStream,
    setupWebRTC,
    cleanup: cleanupWebRTC
  } = useWebRTC({ currentCallId, profileId: profile?.id });

  /**
   * Initialize a new call to another user
   */
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

      if (error) {
        console.error('Error creating call:', error);
        throw error;
      }

      setCurrentCallId(call.id);
      setIsCalling(true);
      setRecipientName(recipientName);

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

  /**
   * Accept an incoming call
   */
  const acceptCall = async (callId: string) => {
    if (!profile?.id) return;

    try {
      console.log('Accepting call:', callId);
      const success = await setupWebRTC();
      if (!success) {
        toast.error('Failed to initialize call');
        return;
      }

      clearCallTimeout();
      setCurrentCallId(callId);
      setIsInCall(true);
      setIncomingCall(null);
      setIsCallEnded(false);

      await updateCallStatus(callId, 'active');
      startDurationTimer();
      toast.success('Call connected');
    } catch (error) {
      console.error('Error accepting call:', error);
      toast.error('Failed to accept call');
    }
  };

  /**
   * Reject an incoming call
   */
  const rejectCall = async (callId: string) => {
    try {
      await updateCallStatus(callId, 'rejected', true);
      setIncomingCall(null);
      toast.info('Call rejected');
    } catch (error) {
      console.error('Error rejecting call:', error);
      toast.error('Failed to reject call');
    }
  };

  /**
   * End the current call
   */
  const endCall = async () => {
    if (!currentCallId || !profile?.id) return;

    try {
      await updateCallStatus(currentCallId, 'ended', true);
      setIsCallEnded(true);
      stopDurationTimer();

      // Cleanup after 2 seconds
      setTimeout(() => {
        cleanupWebRTC();
        clearCallTimeout();
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
          try {
            console.log('Call change event:', payload);
            if (payload.eventType === 'INSERT' && payload.new.receiver_id === profile.id) {
              const { data: caller, error: callerError } = await supabase
                .from('profiles')
                .select('full_name')
                .eq('id', payload.new.caller_id)
                .maybeSingle();

              if (callerError) throw callerError;

              setIncomingCall({
                id: payload.new.id,
                callerName: caller?.full_name || 'Unknown'
              });
            } else if (payload.eventType === 'UPDATE') {
              if (payload.new.status === 'active' && 
                 (payload.new.caller_id === profile.id || payload.new.receiver_id === profile.id)) {
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
          } catch (error) {
            console.error('Error handling call event:', error);
            toast.error('Error processing call update');
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
