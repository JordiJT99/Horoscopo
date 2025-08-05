
import { initializeApp, getApps, getApp, type FirebaseOptions } from "firebase/app";
import { getAnalytics, type Analytics } from "firebase/analytics";
import { getAuth, type Auth } from "firebase/auth"; 
import { getFirestore, initializeFirestore, CACHE_SIZE_UNLIMITED, enableIndexedDbPersistence } from "firebase/firestore";
import { getMessaging, type Messaging } from "firebase/messaging";

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

// Detectar si estamos en un entorno Capacitor/WebView con múltiples indicadores
const isCapacitorEnv = typeof window !== "undefined" && (
  (window as any).Capacitor ||
  (window as any).AndroidInterface ||
  navigator.userAgent.includes('wv') ||
  navigator.userAgent.includes('WebView') ||
  (window as any).webkit?.messageHandlers ||
  document.URL.startsWith('capacitor://') ||
  document.URL.startsWith('ionic://') ||
  document.URL.startsWith('file://')
);

const requiredConfigKeys: (keyof FirebaseOptions)[] = ['apiKey', 'authDomain', 'projectId', 'messagingSenderId'];
const isConfigIncomplete = requiredConfigKeys.some(key => !firebaseConfig[key]);

// Solo log en el cliente para evitar spam durante el build
if (typeof window !== "undefined") {
  console.log("🔍 Firebase config check:", {
    apiKey: !!firebaseConfig.apiKey,
    authDomain: !!firebaseConfig.authDomain,
    projectId: !!firebaseConfig.projectId,
    messagingSenderId: !!firebaseConfig.messagingSenderId,
    isConfigIncomplete
  });
}

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
      
      // Configuración específica para Capacitor/WebView
      const firestoreSettings: any = {
        cacheSizeBytes: CACHE_SIZE_UNLIMITED,
      };
      
      if (isCapacitorEnv) {
        // Configuraciones específicas para Capacitor/WebView con mejor conectividad
        firestoreSettings.experimentalAutoDetectLongPolling = true;
        firestoreSettings.useFetchStreams = false;
        firestoreSettings.experimentalForceLongPolling = true;
        
        // Debug info para verificar que el debugging funciona
        console.log("🔧 Firebase configurado para Capacitor con long polling forzado");
        console.log("🔍 Debug habilitado - Capacitor detectado:", {
          userAgent: navigator.userAgent,
          isCapacitor: !!(window as any).Capacitor,
          docURL: document.URL,
          timestamp: new Date().toISOString()
        });
      } else {
        console.log("🌐 Firebase configurado para entorno web estándar");
      }
      
      // Initialize Firestore with WebView-specific settings
      db = initializeFirestore(app, firestoreSettings);
      
      // Intentar habilitar persistencia offline, pero capturar errores en WebView
      if (typeof window !== "undefined" && db) {
        enableIndexedDbPersistence(db).catch((err) => {
          if (err.code === 'failed-precondition') {
            console.warn("⚠️ Persistencia offline no disponible (múltiples pestañas abiertas)");
          } else if (err.code === 'unimplemented') {
            console.warn("⚠️ Persistencia offline no soportada en este Capacitor WebView");
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
      
      // Solo inicializar Firebase Messaging en entornos web (no en Capacitor)
      if (!isCapacitorEnv) {
        try {
          messagingInstance = getMessaging(app);
        } catch (messagingError) {
          console.warn("⚠️ Firebase Messaging no disponible:", messagingError);
          messagingInstance = null;
        }
      } else {
        console.log("🔧 Firebase Messaging deshabilitado en Capacitor");
        messagingInstance = null;
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

// Debug logging para diagnosticar problemas de inicialización (solo en cliente)
if (typeof window !== "undefined") {
  console.log("🔍 Firebase initialization status:", {
    appInitializedSuccessfully,
    hasApp: !!app,
    hasAuth: !!authInstance,
    hasDb: !!db,
    isCapacitorEnv,
    timestamp: new Date().toISOString()
  });
}
