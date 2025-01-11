import { useState, useEffect, useRef } from 'react';
import { WebRTCConnection } from '@/utils/webrtc/WebRTCConnection';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useWebRTC = (callId: string, userId: string, remoteUserId: string) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const webRTCConnection = useRef<WebRTCConnection | null>(null);

  useEffect(() => {
    if (!callId || !userId || !remoteUserId) return;

    // Create new connection instance
    webRTCConnection.current = new WebRTCConnection(callId, userId, remoteUserId);

    const handleRemoteStream = (event: CustomEvent<{ stream: MediaStream }>) => {
      setRemoteStream(event.detail.stream);
    };

    window.addEventListener('remoteStreamUpdated', handleRemoteStream as EventListener);

    // Subscribe to signaling channel
    const channel = supabase
      .channel(`webrtc_${callId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'webrtc_signaling',
          filter: `call_id=eq.${callId}`
        },
        async (payload) => {
          if (!webRTCConnection.current) return;
          
          const { type, data } = payload.new;
          
          try {
            switch (type) {
              case 'offer':
                await webRTCConnection.current.handleOffer(data);
                break;
              case 'answer':
                await webRTCConnection.current.handleAnswer(data);
                break;
              case 'ice-candidate':
                await webRTCConnection.current.handleIceCandidate(data);
                break;
            }
          } catch (error) {
            console.error('Error handling signaling message:', error);
            toast.error('Error in call connection');
          }
        }
      )
      .subscribe();

    return () => {
      window.removeEventListener('remoteStreamUpdated', handleRemoteStream as EventListener);
      if (webRTCConnection.current) {
        webRTCConnection.current.endCall();
      }
      supabase.removeChannel(channel);
    };
  }, [callId, userId, remoteUserId]);

  const startCall = async (isVideo: boolean = false) => {
    try {
      if (!webRTCConnection.current) return;
      
      const stream = await webRTCConnection.current.startCall(isVideo);
      setLocalStream(stream);
    } catch (error) {
      console.error('Error starting call:', error);
      toast.error('Could not start call');
      throw error;
    }
  };

  const answerCall = async (isVideo: boolean = false) => {
    try {
      if (!webRTCConnection.current) return;
      
      const stream = await webRTCConnection.current.handleIncomingCall(isVideo);
      setLocalStream(stream);
    } catch (error) {
      console.error('Error answering call:', error);
      toast.error('Could not answer call');
      throw error;
    }
  };

  const endCall = () => {
    if (webRTCConnection.current) {
      webRTCConnection.current.endCall();
      setLocalStream(null);
      setRemoteStream(null);
    }
  };

  return {
    localStream,
    remoteStream,
    startCall,
    answerCall,
    endCall
  };
};