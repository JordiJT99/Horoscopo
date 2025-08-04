import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.astromistica.horoscopo',
  appName: 'AstroMística : Tarot, Horóscopo y Carta Natal',
  webDir: 'out',
  server: {
    hostname: 'astromistica.org',
    androidScheme: 'https',
    iosScheme: 'https',
    allowNavigation: [
      '*.astromistica.org', // Permitir todos los subdominios
      'astromistica.org'    // Permitir el dominio principal
    ]
  },
  android: {
    minWebViewVersion: 125,
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true,
    backgroundColor: '#1A142B',
    clearTextTrafficPermitted: true,
    usesCleartextTraffic: true
  },
  ios: {
    allowsLinkPreview: false,
    backgroundColor: '#1A142B',
    scrollEnabled: true,
    allowsInlineMediaPlayback: true
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
    CapacitorCookies: {
      enabled: true
    },
    AdMob: {
      appId: 'ca-app-pub-1601092077557933~3927093480',
      testMode: false
    }
  }
};

export default config;
