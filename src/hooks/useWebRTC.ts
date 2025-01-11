import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useWebRTC = (callId: string, userId: string, remoteUserId: string) => {
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Initialize WebRTC
  useEffect(() => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
      ]
    });

    pc.ontrack = (event) => {
      console.log('Received remote track:', event.streams[0]);
      setRemoteStream(event.streams[0]);
    };

    pc.onicecandidate = async (event) => {
      if (event.candidate) {
        try {
          await supabase.from('webrtc_signaling').insert({
            call_id: callId,
            sender_id: userId,
            receiver_id: remoteUserId,
            type: 'ice-candidate',
            data: event.candidate
          });
        } catch (error) {
          console.error('Error sending ICE candidate:', error);
        }
      }
    };

    setPeerConnection(pc);

    return () => {
      pc.close();
      setPeerConnection(null);
    };
  }, [callId, userId, remoteUserId]);

  // Listen for signaling messages
  useEffect(() => {
    if (!peerConnection) return;

    const channel = supabase.channel(`webrtc_${callId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'webrtc_signaling',
          filter: `receiver_id=eq.${userId}`
        },
        async (payload) => {
          if (!payload.new || !peerConnection) return;

          const { type, data } = payload.new;

          try {
            switch (type) {
              case 'offer':
                console.log('Received offer:', data);
                await peerConnection.setRemoteDescription(new RTCSessionDescription(data));
                const answer = await peerConnection.createAnswer();
                await peerConnection.setLocalDescription(answer);
                
                await supabase.from('webrtc_signaling').insert({
                  call_id: callId,
                  sender_id: userId,
                  receiver_id: remoteUserId,
                  type: 'answer',
                  data: answer
                });
                break;

              case 'answer':
                console.log('Received answer:', data);
                await peerConnection.setRemoteDescription(new RTCSessionDescription(data));
                setIsConnected(true);
                break;

              case 'ice-candidate':
                console.log('Received ICE candidate:', data);
                await peerConnection.addIceCandidate(new RTCIceCandidate(data));
                break;
            }
          } catch (error) {
            console.error('Error handling signaling message:', error);
            toast.error('Error establishing connection');
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [peerConnection, callId, userId, remoteUserId]);

  const startCall = async () => {
    try {
      console.log('Starting call, requesting microphone access...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setLocalStream(stream);

      stream.getTracks().forEach(track => {
        if (peerConnection) {
          console.log('Adding local track to peer connection:', track);
          peerConnection.addTrack(track, stream);
        }
      });

      if (peerConnection) {
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        await supabase.from('webrtc_signaling').insert({
          call_id: callId,
          sender_id: userId,
          receiver_id: remoteUserId,
          type: 'offer',
          data: offer
        });
      }
    } catch (error) {
      console.error('Error starting call:', error);
      toast.error('Could not access microphone. Please check your permissions.');
      throw error;
    }
  };

  const endCall = async () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    if (remoteStream) {
      remoteStream.getTracks().forEach(track => track.stop());
      setRemoteStream(null);
    }
    if (peerConnection) {
      peerConnection.close();
      setPeerConnection(null);
    }
    setIsConnected(false);
  };

  return {
    localStream,
    remoteStream,
    isConnected,
    startCall,
    endCall
  };
};