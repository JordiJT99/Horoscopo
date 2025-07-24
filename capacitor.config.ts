import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.astromistica.app',
  appName: 'AstroMística',
  webDir: 'out',
  server: {
    url: 'https://astromistica.org',
    cleartext: true,
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#1A142B",
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "large",
      spinnerColor: "#E11D48",
      showSpinner: true
    }
  }
};

export default config;
