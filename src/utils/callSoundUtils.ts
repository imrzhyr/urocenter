// Create audio elements for call sounds with absolute path
const callingSound = new Audio(`${window.location.origin}/calling-sound.mp3`);
callingSound.loop = true; // Loop the calling sound
callingSound.preload = 'auto';

const callSound = new Audio(`${window.location.origin}/call-sound.mp3`);
callSound.preload = 'auto';

export const callSoundUtils = {
  startCallingSound: () => {
    try {
      callingSound.currentTime = 0;
      callingSound.play();
    } catch (error) {
      console.error('Error playing calling sound:', error);
    }
  },
  stopCallingSound: () => {
    try {
      callingSound.pause();
      callingSound.currentTime = 0;
    } catch (error) {
      console.error('Error stopping calling sound:', error);
    }
  },
  playCallSound: async () => {
    try {
      callSound.currentTime = 0;
      await callSound.play();
    } catch (error) {
      console.error('Error playing call sound:', error);
    }
  }
};