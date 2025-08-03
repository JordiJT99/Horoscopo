import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.astromistica.horoscopo',
  appName: 'AstroMística : Tarot, Horóscopo y Carta Natal',
  webDir: '.next',
  // La URL del servidor se debe usar solo para desarrollo.
  // Para producción (builds de la app), esta sección se debe eliminar
  // para que la app cargue los archivos desde el paquete local.
  server: {
    url: 'http://localhost:3000',
    cleartext: true,
  },
  android: {
    minWebViewVersion: 125,
    allowMixedContent: true, // Permitir contenido mixto para APIs
    captureInput: true,
    webContentsDebuggingEnabled: true, // Habilitar debug para desarrollo
    backgroundColor: '#1A142B',
    // Configuraciones adicionales para APIs y Firestore
    clearTextTrafficPermitted: true,
    usesCleartextTraffic: true
  },
  ios: {
    // Configuraciones para iOS
    allowsLinkPreview: false,
    backgroundColor: '#1A142B',
    scrollEnabled: true,
    // Permitir requests HTTP para desarrollo
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
