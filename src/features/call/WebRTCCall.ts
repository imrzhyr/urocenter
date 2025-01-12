import { supabase } from "@/integrations/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";

export class WebRTCCall {
  private peerConnection: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;
  private currentCallPeerId: string | null = null;
  private channel: RealtimeChannel | null = null;

  private config: RTCConfiguration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' }
    ]
  };

  constructor() {
    this.setupSignalingChannel();
  }

  private setupSignalingChannel() {
    this.channel = supabase.channel('webrtc');
    
    this.channel
      .on('broadcast', { event: 'offer' }, ({ payload }) => {
        console.log('Received offer:', payload);
        this.handleIncomingOffer(payload);
      })
      .on('broadcast', { event: 'answer' }, ({ payload }) => {
        console.log('Received answer:', payload);
        this.handleIncomingAnswer(payload);
      })
      .on('broadcast', { event: 'candidate' }, ({ payload }) => {
        console.log('Received ICE candidate:', payload);
        this.handleIncomingCandidate(payload);
      })
      .on('broadcast', { event: 'callStatus' }, ({ payload }) => {
        console.log('Received call status:', payload);
        this.handleCallStatus(payload);
      })
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });
  }

  async startCall(calleeId: string) {
    try {
      this.currentCallPeerId = calleeId;
      this.localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      this.peerConnection = new RTCPeerConnection(this.config);

      this.localStream.getTracks().forEach((track) => {
        if (this.peerConnection && this.localStream) {
          this.peerConnection.addTrack(track, this.localStream);
        }
      });

      this.setupPeerConnectionHandlers();

      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);
      
      this.channel?.send({
        type: 'broadcast',
        event: 'offer',
        payload: {
          to: calleeId,
          offer
        }
      });

      this.channel?.send({
        type: 'broadcast',
        event: 'callStatus',
        payload: {
          to: calleeId,
          status: 'ringing'
        }
      });

    } catch (error) {
      console.error('startCall error:', error);
      this.endCall();
    }
  }

  private setupPeerConnectionHandlers() {
    if (!this.peerConnection) return;

    this.peerConnection.ontrack = (event) => {
      this.remoteStream = event.streams[0];
      window.dispatchEvent(new CustomEvent('remoteStreamUpdated', { 
        detail: { stream: this.remoteStream }
      }));
    };

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate && this.currentCallPeerId) {
        this.channel?.send({
          type: 'broadcast',
          event: 'candidate',
          payload: {
            to: this.currentCallPeerId,
            candidate: event.candidate
          }
        });
      }
    };
  }

  private async handleIncomingOffer(data: { from: string; offer: RTCSessionDescriptionInit }) {
    try {
      const callerId = data.from;
      this.currentCallPeerId = callerId;
      this.localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      this.peerConnection = new RTCPeerConnection(this.config);

      this.localStream.getTracks().forEach((track) => {
        if (this.peerConnection && this.localStream) {
          this.peerConnection.addTrack(track, this.localStream);
        }
      });

      this.setupPeerConnectionHandlers();

      await this.peerConnection.setRemoteDescription(data.offer);
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);

      this.channel?.send({
        type: 'broadcast',
        event: 'answer',
        payload: {
          to: callerId,
          answer
        }
      });

      this.channel?.send({
        type: 'broadcast',
        event: 'callStatus',
        payload: {
          to: callerId,
          status: 'accepted'
        }
      });

    } catch (error) {
      console.error('handleIncomingOffer error:', error);
      this.endCall();
    }
  }

  private async handleIncomingAnswer(data: { from: string; answer: RTCSessionDescriptionInit }) {
    if (!this.peerConnection) return;
    try {
      await this.peerConnection.setRemoteDescription(data.answer);
    } catch (error) {
      console.error('handleIncomingAnswer error:', error);
      this.endCall();
    }
  }

  private async handleIncomingCandidate(data: { from: string; candidate: RTCIceCandidateInit }) {
    if (!this.peerConnection) return;
    try {
      await this.peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
    } catch (error) {
      console.error('handleIncomingCandidate error:', error);
    }
  }

  private handleCallStatus(data: { from: string; status: string }) {
    switch (data.status) {
      case 'ended':
      case 'rejected':
        this.endCall();
        break;
      default:
        console.log('Call status:', data.status);
    }
  }

  endCall() {
    if (this.currentCallPeerId) {
      this.channel?.send({
        type: 'broadcast',
        event: 'callStatus',
        payload: {
          to: this.currentCallPeerId,
          status: 'ended'
        }
      });
    }

    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }

    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }

    this.remoteStream = null;
    this.currentCallPeerId = null;

    window.dispatchEvent(new CustomEvent('callEnded'));
  }

  getLocalStream() {
    return this.localStream;
  }

  getRemoteStream() {
    return this.remoteStream;
  }
}

export const webRTCCall = new WebRTCCall();