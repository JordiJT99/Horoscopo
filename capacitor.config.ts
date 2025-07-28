import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.astromistica.horoscopo',
  appName: 'AstroMística : Tarot, Horóscopo y Carta Natal',
  webDir: '.next',
  server: {
    url: 'https://astromistica.org',
    cleartext: false,
    androidScheme: 'https'
  },
  android: {
    minWebViewVersion: 125,
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false
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
    },
    CapacitorHttp: {
      enabled: true
    },
    AdMob: {
      appId: 'ca-app-pub-1601092077557933~3927093480',
      testMode: false
    }
  }
};

export default config;
