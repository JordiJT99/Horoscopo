import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.astromistica.horoscopo',
  appName: 'AstroMística : Tarot, Horóscopo y Carta Natal',
  webDir: 'out',
  server: {
    // Configuración para desarrollo y debugging - permitir contenido local
    androidScheme: 'https',
    iosScheme: 'https',
    allowNavigation: [
      '*.astromistica-org.web.app',
      'astromistica-org.web.app',
      '*.web.app',
      '*.googleapis.com',
      '*.google.com',
      '*.firebaseapp.com'
    ]
  },
  android: {
    minWebViewVersion: 125,
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: true,  // Habilitar para debugging
    backgroundColor: '#1A142B'
  },
  ios: {
    allowsLinkPreview: false,
    backgroundColor: '#1A142B',
    scrollEnabled: true
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
      testMode: false  // Producción: false para anuncios reales
    }
  }
};

export default config;
