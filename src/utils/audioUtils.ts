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

// Format time in MM:SS format
export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};