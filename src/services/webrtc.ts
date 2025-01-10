import { supabase } from "@/integrations/supabase/client";

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
      await supabase.from('webrtc_signaling').insert({
        call_id: callId,
        sender_id: senderId,
        receiver_id: receiverId,
        type,
        data
      });
    } catch (error) {
      console.error('Error sending signaling data:', error);
    }
  }

  async startCall(callId: string, userId: string, remoteUserId: string) {
    try {
      this.callId = callId;
      this.userId = userId;
      this.remoteUserId = remoteUserId;

      console.log('Starting call with:', { callId, userId, remoteUserId });

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
      throw error;
    }
  }

  async handleIncomingCall(callId: string, userId: string, remoteUserId: string) {
    this.callId = callId;
    this.userId = userId;
    this.remoteUserId = remoteUserId;

    console.log('Handling incoming call:', { callId, userId, remoteUserId });

    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      this.localStream.getTracks().forEach(track => {
        if (this.peerConnection && this.localStream) {
          this.peerConnection.addTrack(track, this.localStream);
        }
      });

      return this.localStream;
    } catch (error) {
      console.error('Error handling incoming call:', error);
      throw error;
    }
  }

  async acceptCall(offer: RTCSessionDescriptionInit) {
    try {
      console.log('Accepting call with offer:', offer);
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
      throw error;
    }
  }

  async handleAnswer(answer: RTCSessionDescriptionInit) {
    try {
      console.log('Handling answer:', answer);
      await this.peerConnection?.setRemoteDescription(new RTCSessionDescription(answer));
    } catch (error) {
      console.error('Error handling answer:', error);
      throw error;
    }
  }

  async handleIceCandidate(candidate: RTCIceCandidateInit) {
    try {
      console.log('Handling ICE candidate:', candidate);
      await this.peerConnection?.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (error) {
      console.error('Error handling ICE candidate:', error);
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