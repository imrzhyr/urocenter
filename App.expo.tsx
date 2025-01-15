import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import App from './src/App.react-native';
import SplashScreen from './src/components/SplashScreen';

export default function ExpoApp() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <SafeAreaProvider>
      {isLoading ? (
        <SplashScreen onAnimationComplete={() => setIsLoading(false)} />
      ) : (
        <>
          <App />
          <StatusBar style="auto" />
        </>
      )}
    </SafeAreaProvider>
  );
}