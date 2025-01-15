// Create an audio element for message sounds
const audio = new Audio('/message-sound.mp3');
audio.preload = 'auto';

// Export the message sound player
export const messageSound = {
  play: async () => {
    try {
      // Reset the audio to the start
      audio.currentTime = 0;
      await audio.play();
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  }
};

// Format time in MM:SS format
export const formatTime = (seconds: number): string => {
  if (!isFinite(seconds) || seconds < 0) return '0:00';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};