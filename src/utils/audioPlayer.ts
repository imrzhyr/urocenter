export class RingtonePlayer {
  private static audio: HTMLAudioElement | null = null;

  static initialize() {
    if (!this.audio) {
      this.audio = new Audio('/mixkit-on-hold-ringtone-1361.mp3');
      this.audio.loop = true;
    }
  }

  static play() {
    this.initialize();
    this.audio?.play().catch(error => {
      console.error('Error playing ringtone:', error);
    });
  }

  static stop() {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
  }
}