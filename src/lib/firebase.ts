
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

if (typeof window !== "undefined" && isConfigIncomplete) {
  console.error(
    "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n" +
    "!! FIREBASE CONFIGURATION IS INCOMPLETE                                           !!\n" +
    "!!                                                                                !!\n" +
    "!! Please set all NEXT_PUBLIC_FIREBASE_* variables in your .env file.             !!\n" +
    "!!                                                                                !!\n" +
    "!! Firebase will NOT be initialized. App features may be disabled.                !!\n" +
    "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
  );
}

if (!isConfigIncomplete) {
  if (!getApps().length) {
    try {
      app = initializeApp(firebaseConfig);
      
      const firestoreSettings: any = {
        cacheSizeBytes: CACHE_SIZE_UNLIMITED,
        ...(isCapacitorEnv
          ? {
              experimentalForceLongPolling: true,
              experimentalAutoDetectLongPolling: false, // Desactivar explícitamente
              useFetchStreams: false,
            }
          : {
              experimentalAutoDetectLongPolling: true, // web normal
            }),
      };
      
      if (isCapacitorEnv) {
        firestoreSettings.experimentalAutoDetectLongPolling = true;
        firestoreSettings.useFetchStreams = false;
        firestoreSettings.experimentalForceLongPolling = true;
        console.log("🔧 Firebase configurado para Capacitor con long polling forzado");
      } else {
        console.log("🌐 Firebase configurado para entorno web estándar con auto-detect");
      }
      
      db = initializeFirestore(app, firestoreSettings);
      
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
    // No reasignar db aquí, ya está inicializada con initializeFirestore
    if (!db) {
      db = getFirestore(app);
    }
    appInitializedSuccessfully = true;
  }
}

if (appInitializedSuccessfully && app) {
  try {
    authInstance = getAuth(app);
    // No reasignar db aquí, ya está configurada con initializeFirestore
    if (typeof window !== "undefined") {
      // Analytics solo en web normal (no en Capacitor/WebView)
      if (!isCapacitorEnv && firebaseConfig.measurementId) {
        analyticsInstance = getAnalytics(app);
      } else if (isCapacitorEnv) {
        console.log("🔧 Firebase Analytics deshabilitado en Capacitor");
      }
      
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
