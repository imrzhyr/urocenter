// Create audio elements for call sounds with absolute path
const callingSound = new Audio(`${window.location.origin}/calling-sound.mp3`);
callingSound.loop = true; // Loop the calling sound
callingSound.preload = 'auto';

const callSound = new Audio(`${window.location.origin}/call-sound.mp3`);
callSound.loop = true; // Loop the call sound for incoming calls
callSound.preload = 'auto';

export const callSoundUtils = {
  startCallingSound: async () => {
    try {
      callingSound.currentTime = 0;
      // Wait for any pending pause operations to complete
      await new Promise(resolve => setTimeout(resolve, 0));
      await callingSound.play();
    } catch (error) {
      console.error('Error playing calling sound:', error);
    }
  },
  stopCallingSound: async () => {
    try {
      // Ensure we pause before resetting
      await callingSound.pause();
      callingSound.currentTime = 0;
    } catch (error) {
      console.error('Error stopping calling sound:', error);
    }
  },
  playCallSound: async () => {
    try {
      callSound.currentTime = 0;
      // Wait for any pending pause operations to complete
      await new Promise(resolve => setTimeout(resolve, 0));
      await callSound.play();
    } catch (error) {
      console.error('Error playing call sound:', error);
    }
  },
  stopCallSound: async () => {
    try {
      // Ensure we pause before resetting
      await callSound.pause();
      callSound.currentTime = 0;
    } catch (error) {
      console.error('Error stopping call sound:', error);
    }
  }
};