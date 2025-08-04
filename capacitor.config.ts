import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.astromistica.horoscopo',
  appName: 'AstroMística : Tarot, Horóscopo y Carta Natal',
  webDir: 'out',
  server: {
    // Para desarrollo y testing - usar IP local
    url: 'http://192.168.1.166:9002',
    cleartext: true,
    // hostname: 'astromistica.org',
    // androidScheme: 'https',
    // iosScheme: 'https',
    allowNavigation: [
      'localhost:*',
      '127.0.0.1:*',
      '192.168.1.166:*',
      '*.astromistica.org',
      'astromistica.org'
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
      testMode: true  // Cambiar a true para testing
    }
  }
};

export default config;
