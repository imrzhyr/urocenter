import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

class WebRTCService {
  private peerConnection: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;
  private callId: string | null = null;
  private userId: string | null = null;
  private remoteUserId: string | null = null;

  constructor() {
    this.peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
      ]
    });

    this.setupPeerConnectionHandlers();
  }

  private setupPeerConnectionHandlers() {
    if (!this.peerConnection) return;

    this.peerConnection.onicecandidate = async (event) => {
      if (event.candidate && this.callId && this.userId && this.remoteUserId) {
        await this.sendSignalingData({
          type: 'ice-candidate',
          data: event.candidate,
          callId: this.callId,
          senderId: this.userId,
          receiverId: this.remoteUserId
        });
      }
    };

    this.peerConnection.ontrack = (event) => {
      this.remoteStream = event.streams[0];
    };
  }

  private async sendSignalingData({
    type,
    data,
    callId,
    senderId,
    receiverId
  }: {
    type: string;
    data: any;
    callId: string;
    senderId: string;
    receiverId: string;
  }) {
    try {
      console.log('Sending signaling data:', { type, callId, senderId, receiverId });
      
      // First check if we're authenticated
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        throw new Error('Not authenticated');
      }

      const { error } = await supabase.from('webrtc_signaling').insert({
        call_id: callId,
        sender_id: senderId,
        receiver_id: receiverId,
        type,
        data
      });

      if (error) {
        console.error('Error sending signaling data:', error);
        toast.error('Failed to establish connection');
        throw error;
      }
    } catch (error) {
      console.error('Error sending signaling data:', error);
      toast.error('Failed to establish connection');
      throw error;
    }
  }

  async startCall(callId: string, userId: string, remoteUserId: string) {
    try {
      this.callId = callId;
      this.userId = userId;
      this.remoteUserId = remoteUserId;

      console.log('Starting call with:', { callId, userId, remoteUserId });

      // Check authentication before starting
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        throw new Error('Not authenticated');
      }

      // Get local audio stream
      this.localStream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Add tracks to peer connection
      this.localStream.getTracks().forEach(track => {
        if (this.peerConnection && this.localStream) {
          this.peerConnection.addTrack(track, this.localStream);
        }
      });

      // Create and send offer
      const offer = await this.peerConnection?.createOffer();
      await this.peerConnection?.setLocalDescription(offer);

      await this.sendSignalingData({
        type: 'offer',
        data: offer,
        callId,
        senderId: userId,
        receiverId: remoteUserId
      });

      return this.localStream;
    } catch (error) {
      console.error('Error starting call:', error);
      toast.error('Could not start call. Please check your microphone permissions.');
      throw error;
    }
  }

  async handleIncomingCall(callId: string, userId: string, remoteUserId: string) {
    this.callId = callId;
    this.userId = userId;
    this.remoteUserId = remoteUserId;

    console.log('Handling incoming call:', { callId, userId, remoteUserId });

    try {
      // Check authentication before proceeding
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        throw new Error('Not authenticated');
      }

      this.localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      this.localStream.getTracks().forEach(track => {
        if (this.peerConnection && this.localStream) {
          this.peerConnection.addTrack(track, this.localStream);
        }
      });

      return this.localStream;
    } catch (error) {
      console.error('Error handling incoming call:', error);
      toast.error('Could not handle incoming call');
      throw error;
    }
  }

  async acceptCall(offer: RTCSessionDescriptionInit) {
    try {
      console.log('Accepting call with offer:', offer);
      
      // Check authentication before accepting
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        throw new Error('Not authenticated');
      }

      await this.peerConnection?.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await this.peerConnection?.createAnswer();
      await this.peerConnection?.setLocalDescription(answer);

      if (this.callId && this.userId && this.remoteUserId) {
        await this.sendSignalingData({
          type: 'answer',
          data: answer,
          callId: this.callId,
          senderId: this.userId,
          receiverId: this.remoteUserId
        });
      }
    } catch (error) {
      console.error('Error accepting call:', error);
      toast.error('Could not accept call');
      throw error;
    }
  }

  async handleAnswer(answer: RTCSessionDescriptionInit) {
    try {
      console.log('Handling answer:', answer);
      await this.peerConnection?.setRemoteDescription(new RTCSessionDescription(answer));
    } catch (error) {
      console.error('Error handling answer:', error);
      toast.error('Error establishing connection');
      throw error;
    }
  }

  async handleIceCandidate(candidate: RTCIceCandidateInit) {
    try {
      console.log('Handling ICE candidate:', candidate);
      await this.peerConnection?.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (error) {
      console.error('Error handling ICE candidate:', error);
      toast.error('Error establishing connection');
    }
  }

  async endCall() {
    console.log('Ending call');
    this.localStream?.getTracks().forEach(track => track.stop());
    this.peerConnection?.close();
    this.localStream = null;
    this.remoteStream = null;
    this.peerConnection = null;
    this.callId = null;
    this.userId = null;
    this.remoteUserId = null;
  }

  getRemoteStream() {
    return this.remoteStream;
  }

  getLocalStream() {
    return this.localStream;
  }
}

export const webRTCService = new WebRTCService();