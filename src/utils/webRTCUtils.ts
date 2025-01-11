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
    this.callId = callId;
    this.userId = userId;
    this.remoteUserId = remoteUserId;
    this.initializePeerConnection();
    console.log('WebRTCConnection initialized with:', { callId, userId, remoteUserId });
  }

  private initializePeerConnection() {
    if (this.peerConnection?.connectionState !== 'closed') {
      this.peerConnection?.close();
    }
    
    this.peerConnection = new RTCPeerConnection(configuration);
    this.setupPeerConnectionListeners();
    console.log('PeerConnection initialized, state:', this.peerConnection.connectionState);
  }

  private setupPeerConnectionListeners() {
    this.peerConnection.onicecandidate = async (event) => {
      if (event.candidate) {
        await this.sendSignalingMessage('ice-candidate', event.candidate);
      }
    };

    this.peerConnection.ontrack = (event) => {
      this.remoteStream = event.streams[0];
      window.dispatchEvent(new CustomEvent('remoteStreamUpdated', { 
        detail: { stream: this.remoteStream } 
      }));
    };

    this.peerConnection.onconnectionstatechange = () => {
      console.log('Connection state changed:', this.peerConnection.connectionState);
      if (this.peerConnection.connectionState === 'failed') {
        this.initializePeerConnection();
      }
    };
  }

  async startCall(isVideo: boolean = false) {
    try {
      console.log('Starting call with params:', { isVideo, userId: this.userId, remoteUserId: this.remoteUserId });
      
      // Always reinitialize for a new call
      this.initializePeerConnection();

      const constraints = {
        audio: true,
        video: isVideo
      };
      
      this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (this.localStream) {
        const tracks = this.localStream.getTracks();
        console.log('Adding tracks to peer connection:', tracks.length);
        
        for (const track of tracks) {
          if (this.peerConnection.connectionState !== 'closed') {
            this.peerConnection.addTrack(track, this.localStream);
          } else {
            console.error('Cannot add track: PeerConnection is closed');
            throw new Error('PeerConnection is closed');
          }
        }
      }

      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);
      
      console.log('Sending offer signal');
      await this.sendSignalingMessage('offer', offer);

      return this.localStream;
    } catch (error) {
      console.error('Error starting call:', error);
      throw error;
    }
  }

  async handleIncomingCall(isVideo: boolean = false) {
    try {
      // Always reinitialize for incoming call
      this.initializePeerConnection();

      const constraints = {
        audio: true,
        video: isVideo
      };
      
      this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (this.localStream) {
        const tracks = this.localStream.getTracks();
        for (const track of tracks) {
          if (this.peerConnection.connectionState !== 'closed') {
            this.peerConnection.addTrack(track, this.localStream);
          }
        }
      }

      return this.localStream;
    } catch (error) {
      console.error('Error handling incoming call:', error);
      throw error;
    }
  }

  async handleOffer(offer: RTCSessionDescriptionInit) {
    try {
      if (this.peerConnection.connectionState === 'closed') {
        this.initializePeerConnection();
      }
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
      if (this.peerConnection.connectionState === 'closed') {
        this.initializePeerConnection();
      }
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    } catch (error) {
      console.error('Error handling answer:', error);
      throw error;
    }
  }

  async handleIceCandidate(candidate: RTCIceCandidateInit) {
    try {
      if (this.peerConnection.connectionState === 'closed') {
        this.initializePeerConnection();
      }
      await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (error) {
      console.error('Error handling ICE candidate:', error);
      throw error;
    }
  }

  private async sendSignalingMessage(type: string, data: any) {
    try {
      const session = await supabase.auth.getSession();
      if (!session.data.session) {
        throw new Error('No authenticated session found');
      }

      console.log('Sending signaling message:', {
        type,
        callId: this.callId,
        senderId: this.userId,
        receiverId: this.remoteUserId
      });

      const { error } = await supabase.from('webrtc_signaling').insert({
        call_id: this.callId,
        sender_id: this.userId,
        receiver_id: this.remoteUserId,
        type,
        data
      });

      if (error) {
        console.error('Error sending signaling message:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error sending signaling message:', error);
      throw error;
    }
  }

  endCall() {
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