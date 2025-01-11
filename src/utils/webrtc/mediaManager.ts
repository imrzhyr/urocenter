export class MediaManager {
  private localStream: MediaStream | null = null;

  async getLocalStream(isVideo: boolean = false): Promise<MediaStream> {
    try {
      const constraints = {
        audio: true,
        video: isVideo
      };
      
      this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
      return this.localStream;
    } catch (error) {
      console.error('Error getting local stream:', error);
      throw error;
    }
  }

  stopLocalStream() {
    this.localStream?.getTracks().forEach(track => track.stop());
    this.localStream = null;
  }

  getStream() {
    return this.localStream;
  }
}