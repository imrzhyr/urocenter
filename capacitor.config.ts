import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.urocenter.app',
  appName: 'UroCenter',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config; 