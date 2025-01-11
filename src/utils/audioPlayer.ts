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

export class CallingTonePlayer {
  private static audio: HTMLAudioElement | null = null;

  static initialize() {
    if (!this.audio) {
      this.audio = new Audio('/mixkit-waiting-ringtone-1354.mp3');
      this.audio.loop = true;
    }
  }

  static play() {
    this.initialize();
    this.audio?.play().catch(error => {
      console.error('Error playing calling tone:', error);
    });
  }

  static stop() {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
  }
}

export class MessageSoundPlayer {
  private static audio: HTMLAudioElement | null = null;

  static initialize() {
    if (!this.audio) {
      this.audio = new Audio('/mixkit-message-pop-alert-2354.mp3');
      this.audio.loop = false;
    }
  }

  static play() {
    this.initialize();
    this.audio?.play().catch(error => {
      console.error('Error playing message sound:', error);
    });
  }
}