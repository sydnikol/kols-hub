import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.kolhub.os',
  appName: 'KolHub OS',
  webDir: 'dist',
  bundledWebRuntime: false,
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      backgroundColor: "#0b0b0c",
      showSpinner: false
    }
  },
  server: {
    androidScheme: "https",
    iosScheme: "https"
  }
};

export default config;
