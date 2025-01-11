import { rtcConfiguration } from "./config";
import { SignalingService } from "./signalingService";

export class ConnectionManager {
  private peerConnection: RTCPeerConnection;
  private signalingService: SignalingService;

  constructor(
    callId: string,
    userId: string,
    remoteUserId: string
  ) {
    this.signalingService = new SignalingService(callId, userId, remoteUserId);
    this.initializePeerConnection();
  }

  private initializePeerConnection() {
    try {
      if (this.peerConnection) {
        this.cleanupPeerConnection();
      }
      
      this.peerConnection = new RTCPeerConnection(rtcConfiguration);
      this.setupPeerConnectionListeners();
      console.log('PeerConnection initialized');
    } catch (error) {
      console.error('Error initializing PeerConnection:', error);
      throw error;
    }
  }

  private cleanupPeerConnection() {
    this.peerConnection.close();
    this.peerConnection.onicecandidate = null;
    this.peerConnection.ontrack = null;
    this.peerConnection.onconnectionstatechange = null;
  }

  private setupPeerConnectionListeners() {
    this.peerConnection.onicecandidate = async (event) => {
      if (event.candidate) {
        await this.signalingService.sendSignalingMessage('ice-candidate', event.candidate);
      }
    };

    this.peerConnection.ontrack = (event) => {
      window.dispatchEvent(new CustomEvent('remoteStreamUpdated', { 
        detail: { stream: event.streams[0] } 
      }));
    };

    this.peerConnection.onconnectionstatechange = () => {
      console.log('Connection state changed:', this.peerConnection.connectionState);
      if (this.peerConnection.connectionState === 'failed') {
        this.initializePeerConnection();
      }
    };
  }

  async addTracks(stream: MediaStream) {
    if (!this.peerConnection || this.peerConnection.connectionState === 'closed') {
      this.initializePeerConnection();
    }

    stream.getTracks().forEach(track => {
      this.peerConnection.addTrack(track, stream);
    });
  }

  async createAndSendOffer() {
    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);
    await this.signalingService.sendSignalingMessage('offer', offer);
  }

  async handleOffer(offer: RTCSessionDescriptionInit) {
    if (this.peerConnection.connectionState === 'closed') {
      this.initializePeerConnection();
    }
    await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await this.peerConnection.createAnswer();
    await this.peerConnection.setLocalDescription(answer);
    await this.signalingService.sendSignalingMessage('answer', answer);
  }

  async handleAnswer(answer: RTCSessionDescriptionInit) {
    if (this.peerConnection.connectionState === 'closed') {
      this.initializePeerConnection();
    }
    await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
  }

  async handleIceCandidate(candidate: RTCIceCandidateInit) {
    if (this.peerConnection.connectionState === 'closed') {
      this.initializePeerConnection();
    }
    await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
  }

  close() {
    this.cleanupPeerConnection();
  }
}