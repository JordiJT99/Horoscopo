
import { initializeApp, getApps, getApp, type FirebaseOptions } from "firebase/app";
import { getAnalytics, type Analytics } from "firebase/analytics";
import { getAuth, type Auth } from "firebase/auth"; 
import { getFirestore, initializeFirestore, CACHE_SIZE_UNLIMITED, enableIndexedDbPersistence } from "firebase/firestore";
import { getMessaging, type Messaging } from "firebase/messaging";
import { initializeAppCheck, ReCaptchaV3Provider, getToken, type AppCheck } from "firebase/app-check";
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
let appCheckInstance: AppCheck | null = null;
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
            // Para aplicaciones móviles nativas (Capacitor), App Check se maneja automáticamente
            // con Play Integrity en Android y DeviceCheck en iOS
            appCheckInstance = initializeAppCheck(app, {
              provider: new ReCaptchaV3Provider('6LeDwlcqAAAAAIhE9cNE0xJbL8iJk8OKdvIY7hIt'), // Placeholder, no se usa en móvil
              isTokenAutoRefreshEnabled: true
            });
            console.log("🛡️ App Check: Modo nativo (Play Integrity/DeviceCheck)");
          } else {
            // Para aplicaciones web, usar reCAPTCHA v3
            appCheckInstance = initializeAppCheck(app, {
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
        console.log("🔧 Firebase configurado para WebView con long polling");
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
 * Función para verificar el estado de App Check y obtener un token
 */
export async function verifyAppCheck(): Promise<{ success: boolean; token?: string; error?: string }> {
  try {
    if (!appCheckInstance) {
      return { success: false, error: 'App Check no inicializado' };
    }

    // Intentar obtener un token de App Check
    const appCheckToken = await getToken(appCheckInstance, /* forceRefresh */ false);
    
    if (appCheckToken.token) {
      console.log('✅ App Check token obtenido correctamente');
      return { success: true, token: appCheckToken.token };
    } else {
      return { success: false, error: 'No se pudo obtener el token de App Check' };
    }
  } catch (error) {
    console.error('❌ Error verificando App Check:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
  }
}
