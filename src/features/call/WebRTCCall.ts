class WebRTCCall {
  private peerConnection: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;
  private onRemoteStreamCallback: ((stream: MediaStream) => void) | null = null;
  private iceServers = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
  ];

  async startCall(recipientId: string) {
    try {
      console.log('Starting call to:', recipientId);
      
      // Get user media
      this.localStream = await navigator.mediaDevices.getUserMedia({ 
        audio: true,
        video: false 
      });

      console.log('Got local stream:', this.localStream);

      // Create and configure peer connection
      this.peerConnection = new RTCPeerConnection({
        iceServers: this.iceServers
      });

      // Add tracks to peer connection
      this.localStream.getTracks().forEach(track => {
        if (this.localStream && this.peerConnection) {
          console.log('Adding track to peer connection:', track);
          this.peerConnection.addTrack(track, this.localStream);
        }
      });

      // Handle ICE candidates
      this.peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          console.log('New ICE candidate:', event.candidate);
          // Send candidate to signaling server
        }
      };

      // Handle connection state changes
      this.peerConnection.onconnectionstatechange = () => {
        console.log('Connection state:', this.peerConnection?.connectionState);
      };

      // Handle remote stream
      this.peerConnection.ontrack = (event) => {
        console.log('Received remote track:', event.track);
        this.remoteStream = event.streams[0];
        if (this.onRemoteStreamCallback) {
          this.onRemoteStreamCallback(this.remoteStream);
        }
      };

      // Create offer
      const offer = await this.peerConnection.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: false
      });
      
      await this.peerConnection.setLocalDescription(offer);
      console.log('Created and set local offer:', offer);

      return offer;
    } catch (error) {
      console.error('Error starting call:', error);
      this.endCall();
      throw error;
    }
  }

  async handleIncomingOffer(offer: RTCSessionDescriptionInit) {
    try {
      console.log('Handling incoming offer:', offer);
      
      this.localStream = await navigator.mediaDevices.getUserMedia({ 
        audio: true,
        video: false 
      });

      this.peerConnection = new RTCPeerConnection({
        iceServers: this.iceServers
      });

      this.localStream.getTracks().forEach(track => {
        if (this.localStream && this.peerConnection) {
          console.log('Adding track to peer connection:', track);
          this.peerConnection.addTrack(track, this.localStream);
        }
      });

      this.peerConnection.ontrack = (event) => {
        console.log('Received remote track:', event.track);
        this.remoteStream = event.streams[0];
        if (this.onRemoteStreamCallback) {
          this.onRemoteStreamCallback(this.remoteStream);
        }
      };

      await this.peerConnection.setRemoteDescription(offer);
      console.log('Set remote description');

      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);
      console.log('Created and set local answer:', answer);

      return answer;
    } catch (error) {
      console.error('Error handling incoming offer:', error);
      this.endCall();
      throw error;
    }
  }

  async handleAnswer(answer: RTCSessionDescriptionInit) {
    try {
      if (!this.peerConnection) {
        throw new Error('No peer connection exists');
      }
      console.log('Setting remote answer:', answer);
      await this.peerConnection.setRemoteDescription(answer);
    } catch (error) {
      console.error('Error handling answer:', error);
      this.endCall();
      throw error;
    }
  }

  async handleIceCandidate(candidate: RTCIceCandidateInit) {
    try {
      if (!this.peerConnection) {
        throw new Error('No peer connection exists');
      }
      console.log('Adding ICE candidate:', candidate);
      await this.peerConnection.addIceCandidate(candidate);
    } catch (error) {
      console.error('Error handling ICE candidate:', error);
      throw error;
    }
  }

  onRemoteStream(callback: (stream: MediaStream) => void) {
    this.onRemoteStreamCallback = callback;
    if (this.remoteStream) {
      callback(this.remoteStream);
    }
  }

  getLocalStream() {
    return this.localStream;
  }

  getRemoteStream() {
    return this.remoteStream;
  }

  endCall() {
    console.log('Ending call');
    
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        console.log('Stopping track:', track);
        track.stop();
      });
      this.localStream = null;
    }
    
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }

    this.remoteStream = null;
    this.onRemoteStreamCallback = null;
  }
}

export const webRTCCall = new WebRTCCall();