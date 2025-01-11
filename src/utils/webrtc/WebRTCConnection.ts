import { MediaManager } from "./mediaManager";
import { ConnectionManager } from "./connectionManager";

export class WebRTCConnection {
  private mediaManager: MediaManager;
  private connectionManager: ConnectionManager;

  constructor(callId: string, userId: string, remoteUserId: string) {
    this.mediaManager = new MediaManager();
    this.connectionManager = new ConnectionManager(callId, userId, remoteUserId);
    console.log('WebRTCConnection initialized with:', { callId, userId, remoteUserId });
  }

  async startCall(isVideo: boolean = false) {
    try {
      const localStream = await this.mediaManager.getLocalStream(isVideo);
      await this.connectionManager.addTracks(localStream);
      await this.connectionManager.createAndSendOffer();
      return localStream;
    } catch (error) {
      console.error('Error starting call:', error);
      throw error;
    }
  }

  async handleIncomingCall(isVideo: boolean = false) {
    try {
      const localStream = await this.mediaManager.getLocalStream(isVideo);
      await this.connectionManager.addTracks(localStream);
      return localStream;
    } catch (error) {
      console.error('Error handling incoming call:', error);
      throw error;
    }
  }

  async handleOffer(offer: RTCSessionDescriptionInit) {
    await this.connectionManager.handleOffer(offer);
  }

  async handleAnswer(answer: RTCSessionDescriptionInit) {
    await this.connectionManager.handleAnswer(answer);
  }

  async handleIceCandidate(candidate: RTCIceCandidateInit) {
    await this.connectionManager.handleIceCandidate(candidate);
  }

  endCall() {
    this.mediaManager.stopLocalStream();
    this.connectionManager.close();
  }
}