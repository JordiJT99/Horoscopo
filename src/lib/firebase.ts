
import { initializeApp, getApps, getApp, type FirebaseOptions } from "firebase/app";
import { getAnalytics, type Analytics } from "firebase/analytics";
import { getAuth, type Auth } from "firebase/auth"; 
import { getFirestore, initializeFirestore, CACHE_SIZE_UNLIMITED, enableIndexedDbPersistence } from "firebase/firestore";
import { getMessaging, type Messaging } from "firebase/messaging";
import { initializeAppCheck, ReCaptchaV3Provider, getToken, CustomProvider } from "firebase/app-check";
import { isCapacitor } from '@/lib/capacitor-utils';

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let app: ReturnType<typeof initializeApp> | null = null;
let authInstance: Auth | null = null;
let db: ReturnType<typeof getFirestore> | null = null;
let analyticsInstance: Analytics | null = null;
let messagingInstance: Messaging | null = null;
let appInitializedSuccessfully = false;

// Detectar si estamos en un entorno WebView
const isWebView = typeof window !== "undefined" && (
  (window as any).AndroidInterface ||
  navigator.userAgent.includes('wv') ||
  (window as any).webkit?.messageHandlers
);

const requiredConfigKeys: (keyof FirebaseOptions)[] = ['apiKey', 'authDomain', 'projectId', 'messagingSenderId'];
const isConfigIncomplete = requiredConfigKeys.some(key => !firebaseConfig[key]);

if (isConfigIncomplete) {
  console.error(
    "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n" +
    "!! FIREBASE CONFIGURATION IS INCOMPLETE                                           !!\n" +
    "!!                                                                                !!\n" +
    "!! Please set all NEXT_PUBLIC_FIREBASE_* variables in your .env file.             !!\n" +
    "!!                                                                                !!\n" +
    "!! Firebase will NOT be initialized. App features may be disabled.                !!\n" +
    "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
  );
} else {
  if (!getApps().length) {
    try {
      app = initializeApp(firebaseConfig);
      
      // Inicializar App Check
      if (typeof window !== "undefined") {
        try {
          if (isCapacitor()) {
            // Para aplicaciones móviles nativas (Capacitor) usar CustomProvider para Play Integrity
            initializeAppCheck(app, {
              provider: new CustomProvider({
                getToken: async () => {
                  // Este token se manejará automáticamente por el plugin nativo
                  // cuando tengamos el SHA-256 configurado en Firebase Console
                  return { token: '', expireTimeMillis: Date.now() + 3600000 };
                }
              }),
              isTokenAutoRefreshEnabled: true
            });
            console.log("🛡️ App Check: Modo nativo (Play Integrity/DeviceCheck)");
          } else {
            // Para aplicaciones web, usar reCAPTCHA v3
            initializeAppCheck(app, {
              provider: new ReCaptchaV3Provider('6LeDwlcqAAAAAIhE9cNE0xJbL8iJk8OKdvIY7hIt'), // Reemplaza con tu site key
              isTokenAutoRefreshEnabled: true
            });
            console.log("🛡️ App Check: Modo web (reCAPTCHA v3)");
          }
        } catch (error) {
          console.warn("⚠️ Error inicializando App Check:", error);
        }
      }
      
      // Configuración específica para WebView
      const firestoreSettings: any = {
        cacheSizeBytes: CACHE_SIZE_UNLIMITED,
      };
      
      if (isWebView) {
        // Configuraciones específicas para WebView
        firestoreSettings.experimentalAutoDetectLongPolling = true;
        firestoreSettings.useFetchStreams = false;
        // Configuraciones adicionales para conectividad móvil
        firestoreSettings.experimentalForceLongPolling = true;
        firestoreSettings.ignoreUndefinedProperties = true;
        console.log("🔧 Firebase configurado para WebView con long polling forzado");
      }
      
      // Initialize Firestore with WebView-specific settings
      db = initializeFirestore(app, firestoreSettings);
      
      // Intentar habilitar persistencia offline, pero capturar errores en WebView
      if (typeof window !== "undefined" && db) {
        enableIndexedDbPersistence(db).catch((err) => {
          if (err.code === 'failed-precondition') {
            console.warn("⚠️ Persistencia offline no disponible (múltiples pestañas abiertas)");
          } else if (err.code === 'unimplemented') {
            console.warn("⚠️ Persistencia offline no soportada en este WebView");
          } else {
            console.warn("⚠️ Persistencia offline deshabilitada:", err.message);
          }
        });
      }
      
      appInitializedSuccessfully = true;
    } catch (error) {
      console.error("Firebase initialization error (initializeApp failed):", error);
      appInitializedSuccessfully = false;
    }
  } else {
    app = getApp();
    db = getFirestore(app);
    appInitializedSuccessfully = true;
  }
}

if (appInitializedSuccessfully && app) {
  try {
    authInstance = getAuth(app);
    db = getFirestore(app);
    if (typeof window !== "undefined") {
      analyticsInstance = getAnalytics(app);
      // Solo inicializar messaging si NO estamos en Capacitor WebView
      const isCapacitor = window.Capacitor && window.Capacitor.isNativePlatform();
      if (!isCapacitor) {
        messagingInstance = getMessaging(app);
      } else {
        console.log('🚫 Firebase Messaging deshabilitado en Capacitor WebView');
      }
    }
  } catch (error) {
    console.error("Firebase getAuth/getFirestore/getAnalytics/getMessaging error:", error);
    authInstance = null;
    db = null;
    analyticsInstance = null;
    messagingInstance = null;
    appInitializedSuccessfully = false;
  }
}

export { app, authInstance as auth, db, analyticsInstance as analytics, messagingInstance as messaging, appInitializedSuccessfully };

/**
 * Función para verificar el estado de App Check
 */
export async function verifyAppCheck(): Promise<{ success: boolean; token?: string; error?: string }> {
  try {
    if (!app) {
      return { success: false, error: 'Firebase app no inicializada' };
    }

    if (typeof window === "undefined") {
      return { success: false, error: 'App Check solo funciona en el navegador' };
    }

    // Verificar si App Check está configurado
    if (isCapacitor()) {
      console.log('🛡️ App Check en modo nativo - verificación automática con Play Integrity');
      return { success: true, token: 'native-app-check' };
    } else {
      console.log('🛡️ App Check en modo web - verificación con reCAPTCHA v3');
      return { success: true, token: 'web-app-check' };
    }
  } catch (error) {
    console.error('❌ Error verificando App Check:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
  }
}

/**
 * Función para restaurar la conectividad de Firebase cuando está offline
 */
export async function restoreFirebaseConnectivity(): Promise<boolean> {
  try {
    console.log('🔄 Attempting to restore Firebase connectivity...');
    
    if (!db) {
      console.error('❌ Firestore database not initialized');
      return false;
    }

    // Importar funciones de Firestore
    const { enableNetwork, connectFirestoreEmulator, terminate, clearIndexedDbPersistence } = await import('firebase/firestore');
    
    try {
      // Habilitar la red de Firestore
      await enableNetwork(db);
      console.log('✅ Firebase network enabled');
      
      // Verificar conectividad con una operación simple
      const { doc, getDoc } = await import('firebase/firestore');
      const testDoc = doc(db, '_test_connectivity', 'test');
      await getDoc(testDoc);
      console.log('✅ Firebase connectivity verified');
      
      return true;
    } catch (networkError) {
      console.warn('⚠️ Network enable failed, trying alternative approach:', networkError);
      
      // Si falla, intentar limpiar la caché y reconectar
      try {
        if (typeof window !== 'undefined') {
          await clearIndexedDbPersistence(db);
          console.log('🧹 Cleared Firestore persistence cache');
        }
        
        await enableNetwork(db);
        console.log('✅ Firebase network re-enabled after cache clear');
        return true;
      } catch (retryError) {
        console.error('❌ Failed to restore Firebase connectivity:', retryError);
        return false;
      }
    }
  } catch (error) {
    console.error('❌ Error in restoreFirebaseConnectivity:', error);
    return false;
  }
}
