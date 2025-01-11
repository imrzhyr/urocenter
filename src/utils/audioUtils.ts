class AudioPlayer {
  private audio: HTMLAudioElement | null = null;
  private isPlaying = false;

  constructor(private soundPath: string, private loop: boolean = false) {}

  play() {
    if (this.isPlaying) return;
    
    if (!this.audio) {
      this.audio = new Audio(this.soundPath);
      this.audio.loop = this.loop;
    }
    
    this.audio.play().catch(error => {
      console.error('Error playing audio:', error);
    });
    this.isPlaying = true;
  }

  stop() {
    if (!this.audio || !this.isPlaying) return;
    
    this.audio.pause();
    this.audio.currentTime = 0;
    this.isPlaying = false;
  }
}

export const incomingCallPlayer = new AudioPlayer('/mixkit-on-hold-ringtone-1361.wav', true);
export const outgoingCallPlayer = new AudioPlayer('/mixkit-waiting-ringtone-1354.wav', true);
export const messageSound = new AudioPlayer('/mixkit-message-pop-alert-2354.wav');