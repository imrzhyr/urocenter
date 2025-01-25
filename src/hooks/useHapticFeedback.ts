import { useCallback } from 'react';

type HapticIntensity = 'light' | 'medium' | 'heavy';

export const useHapticFeedback = () => {
  const triggerHaptic = useCallback((intensity: HapticIntensity = 'medium') => {
    if (!window.navigator.vibrate) return;

    // Telegram-like haptic patterns (in milliseconds)
    const patterns = {
      light: [10],
      medium: [15],
      heavy: [20]
    };

    window.navigator.vibrate(patterns[intensity]);
  }, []);

  return { triggerHaptic };
}; 