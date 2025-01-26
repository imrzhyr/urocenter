import { registerSW } from 'virtual:pwa-register';

export function registerPWA() {
  if ('serviceWorker' in navigator) {
    registerSW({
      onRegistered(registration) {
        if (registration) {
          console.log('Service Worker registered');
        }
      },
      onRegisterError(error) {
        console.error('Service Worker registration failed:', error);
      }
    });
  }
} 