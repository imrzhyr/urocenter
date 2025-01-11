import { supabase } from "@/integrations/supabase/client";

const configuration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

export class WebRTCConnection {
  private peerConnection: RTCPeerConnection;
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;
  private callId: string;
  private userId: string;
  private remoteUserId: string;

  constructor(callId: string, userId: string, remoteUserId: string) {
    this.peerConnection = new RTCPeerConnection(configuration);
    this.callId = callId;
    this.userId = userId;
    this.remoteUserId = remoteUserId;
    this.setupPeerConnectionListeners();
  }

  private setupPeerConnectionListeners() {
    // Handle ICE candidates
    this.peerConnection.onicecandidate = async (event) => {
      if (event.candidate) {
        await this.sendSignalingMessage('ice-candidate', event.candidate);
      }
    };

    // Handle remote stream
    this.peerConnection.ontrack = (event) => {
      this.remoteStream = event.streams[0];
      // Notify any listeners about the new remote stream
      window.dispatchEvent(new CustomEvent('remoteStreamUpdated', { 
        detail: { stream: this.remoteStream } 
      }));
    };
  }

  async startCall(isVideo: boolean = false) {
    try {
      const constraints = {
        audio: true,
        video: isVideo
      };
      
      this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      // Add tracks to peer connection
      this.localStream.getTracks().forEach(track => {
        if (this.localStream) {
          this.peerConnection.addTrack(track, this.localStream);
        }
      });

      // Create and send offer
      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);
      await this.sendSignalingMessage('offer', offer);

      return this.localStream;
    } catch (error) {
      console.error('Error starting call:', error);
      throw error;
    }
  }

  async handleIncomingCall(isVideo: boolean = false) {
    try {
      const constraints = {
        audio: true,
        video: isVideo
      };
      
      this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      this.localStream.getTracks().forEach(track => {
        if (this.localStream) {
          this.peerConnection.addTrack(track, this.localStream);
        }
      });

      return this.localStream;
    } catch (error) {
      console.error('Error handling incoming call:', error);
      throw error;
    }
  }

  async handleOffer(offer: RTCSessionDescriptionInit) {
    try {
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);
      await this.sendSignalingMessage('answer', answer);
    } catch (error) {
      console.error('Error handling offer:', error);
      throw error;
    }
  }

  async handleAnswer(answer: RTCSessionDescriptionInit) {
    try {
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    } catch (error) {
      console.error('Error handling answer:', error);
      throw error;
    }
  }

  async handleIceCandidate(candidate: RTCIceCandidateInit) {
    try {
      await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (error) {
      console.error('Error handling ICE candidate:', error);
      throw error;
    }
  }

  private async sendSignalingMessage(type: string, data: any) {
    try {
      await supabase.from('webrtc_signaling').insert({
        call_id: this.callId,
        sender_id: this.userId,
        receiver_id: this.remoteUserId,
        type,
        data
      });
    } catch (error) {
      console.error('Error sending signaling message:', error);
      throw error;
    }
  }

  async endCall() {
    this.localStream?.getTracks().forEach(track => track.stop());
    this.peerConnection.close();
  }

  getLocalStream() {
    return this.localStream;
  }

  getRemoteStream() {
    return this.remoteStream;
  }
}