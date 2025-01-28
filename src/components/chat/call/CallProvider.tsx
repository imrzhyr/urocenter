import React, { createContext, useContext, useEffect, useRef } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { CallNotification } from './CallNotification';
import { ActiveCallUI } from './ActiveCallUI';
import { CallingUI } from './CallingUI';
import { useCallState } from './hooks/useCallState';
import { useCallNotifications } from './hooks/useCallNotifications';
import { useAgoraCall } from './hooks/useAgoraCall';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Portal } from '@/components/ui/portal';
import { callSoundUtils } from '@/utils/callSoundUtils';
import { verifyProfile } from '@/utils/profileUtils';

interface CallContextType {
  isInCall: boolean;
  isCalling: boolean;
  currentCallId: string | null;
  callDuration: number;
  isCallEnded: boolean;
  acceptCall: (callId: string) => Promise<void>;
  rejectCall: (callId: string) => Promise<void>;
  endCall: () => Promise<void>;
  initiateCall: (receiverId: string, recipientName: string) => Promise<void>;
  toggleMute: () => boolean;
  toggleSpeaker: () => Promise<boolean>;
}

const CallContext = createContext<CallContextType | null>(null);

export const CallProvider = ({ children }: { children: React.ReactNode }) => {
  const { profile } = useProfile();
  const recipientNameRef = useRef<string>('');
  const notificationRef = useRef<Notification | null>(null);
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
    startDurationTimer,
    stopDurationTimer,
    clearCallTimeout,
    updateCallStatus
  } = useCallState({ profileId: profile?.id });

  const { incomingCall, setIncomingCall } = useCallNotifications(profile?.id);

  const {
    setupAgoraClient,
    joinChannel,
    leaveChannel,
    toggleMute,
    toggleSpeaker
  } = useAgoraCall({
    currentCallId,
    profileId: profile?.id,
    onCallConnected: () => {
      setIsInCall(true);
      setIsCalling(false);
      startDurationTimer();
    }
  });

  useEffect(() => {
    const handleEndCallSignal = async (payload: {
      new: {
        type: string;
        call_id: string;
        from_user: string;
        data: { duration: number };
      };
    }) => {
      if (payload.new.type === 'end_call' && payload.new.call_id === currentCallId) {
        await leaveChannel();
        setIsCallEnded(true);
        stopDurationTimer();
        callSoundUtils.stopCallSound();

        // Show end call UI for 3 seconds for both parties
        setTimeout(() => {
          setIsInCall(false);
          setIsCalling(false);
          setIsCallEnded(false);
          setCurrentCallId(null);
        }, 3000);
      }
    };

    const subscription = supabase
      .channel('call_signals')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'call_signals',
          filter: `to_user=eq.${profile?.id}`
        },
        handleEndCallSignal
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [currentCallId, profile?.id, leaveChannel, setIsCallEnded, setIsInCall, setIsCalling, stopDurationTimer, setCurrentCallId]);

  const endCall = async () => {
    if (!currentCallId || !profile?.id) return;

    try {
      // Immediately stop sounds and hide calling UI
      await Promise.all([
        callSoundUtils.stopCallingSound(),
        callSoundUtils.stopCallSound()
      ]);
      setIsCalling(false);
      
      await leaveChannel();
      setIsCallEnded(true);
      stopDurationTimer();

      const { data: callData } = await supabase
        .from('calls')
        .select('caller_id, receiver_id, started_at')
        .eq('id', currentCallId)
        .single();

      if (callData) {
        const otherUserId = callData.caller_id === profile.id 
          ? callData.receiver_id 
          : callData.caller_id;

        const duration = Math.floor(
          (Date.now() - new Date(callData.started_at).getTime()) / 1000
        );

        await supabase
          .from('calls')
          .update({
            status: 'ended',
            ended_at: new Date().toISOString()
          })
          .eq('id', currentCallId);

        try {
          await supabase
            .from('call_signals')
            .insert({
              call_id: currentCallId,
              from_user: profile.id,
              to_user: otherUserId,
              type: 'end_call',
              data: { duration }
            });
        } catch (error) {
          console.error('Error sending end call signal:', error);
          toast.error('Failed to send call end signal');
        }

        // Show end call UI for 3 seconds for both parties
        setTimeout(() => {
          setIsInCall(false);
          setIsCallEnded(false);
          setCurrentCallId(null);
        }, 3000);
      }
    } catch (error) {
      console.error('Error ending call:', error);
      toast.error('Failed to end call');
    }
  };

  const acceptCall = async (callId: string) => {
    if (!profile?.id) return;

    try {
      const success = await setupAgoraClient();
      if (!success) {
        toast.error('Failed to initialize call');
        return;
      }

      clearCallTimeout();
      setCurrentCallId(callId);
      setIncomingCall(null);
      setIsCallEnded(false);

      const joined = await joinChannel(callId);
      if (!joined) {
        throw new Error('Failed to join call');
      }

      await updateCallStatus(callId, 'active');
      startDurationTimer();
      toast.success('Call connected');
    } catch (error) {
      console.error('Error accepting call:', error);
      toast.error('Failed to accept call');
    }
  };

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

  const initiateCall = async (receiverId: string, recipientName: string) => {
    if (!profile?.id) {
      toast.error('You must be logged in to make calls');
      return;
    }

    if (profile.id === receiverId) {
      toast.error('You cannot call yourself');
      return;
    }

    try {
      // First check if we're already in a call or calling
      if (isInCall || isCalling) {
        toast.error('Cannot start a new call while in another call');
        return;
      }

      const receiverExists = await verifyProfile(receiverId);
      if (!receiverExists) {
        toast.error('Cannot initiate call: recipient not found');
        return;
      }

      const success = await setupAgoraClient();
      if (!success) {
        toast.error('Failed to initialize call');
        return;
      }

      // Store recipient name for notifications
      recipientNameRef.current = recipientName;

      // Create call record first
      const { data: newCall, error: createError } = await supabase
        .from('calls')
        .insert({
          caller_id: profile.id,
          receiver_id: receiverId,
          status: 'pending'
        })
        .select()
        .single();

      if (createError || !newCall) {
        throw new Error('Failed to create call record');
      }

      setCurrentCallId(newCall.id);
      setIsCalling(true);
      setIsCallEnded(false);

      try {
        const joined = await joinChannel(newCall.id);
        if (!joined) {
          throw new Error('Failed to join call channel');
        }
      } catch (error) {
        // If joining fails, clean up properly
        console.error('[CallProvider] Failed to join call channel:', error);
        await leaveChannel();
        setIsCalling(false);
        setCurrentCallId(null);
        
        // Update call status to failed
        await supabase
          .from('calls')
          .update({ status: 'failed', ended_at: new Date().toISOString() })
          .eq('id', newCall.id);
        
        throw error;
      }

    } catch (error) {
      // Ensure we clean up any ongoing call state
      setIsCalling(false);
      setCurrentCallId(null);
      toast.error('Failed to initiate call. Please try again.');
    }
  };

  return (
    <CallContext.Provider 
      value={{ 
        isInCall, 
        isCalling,
        currentCallId,
        callDuration,
        isCallEnded,
        acceptCall, 
        rejectCall, 
        endCall,
        initiateCall,
        toggleMute,
        toggleSpeaker
      }}
    >
      {children}
      <Portal>
        {incomingCall && (
          <CallNotification
            callerName={incomingCall.callerName}
            onAccept={() => acceptCall(incomingCall.id)}
            onReject={() => rejectCall(incomingCall.id)}
            open={!!incomingCall}
          />
        )}
        {isCalling && <CallingUI recipientName={recipientNameRef.current} />}
        {(isInCall || isCallEnded) && <ActiveCallUI />}
      </Portal>
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
