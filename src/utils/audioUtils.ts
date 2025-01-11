// Create an audio element for message sounds
const audio = new Audio('/message-sound.mp3');

// Export the message sound player
export const messageSound = {
  play: async () => {
    try {
      await audio.play();
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  }
};