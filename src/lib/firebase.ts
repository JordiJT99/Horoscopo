
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

// --- Robust Key Validation ---
const requiredConfigKeys: (keyof FirebaseOptions)[] = ['apiKey', 'authDomain', 'projectId', 'messagingSenderId', 'appId'];
let isConfigValid = true;
let missingOrInvalidKeys: string[] = [];

for (const key of requiredConfigKeys) {
    const value = firebaseConfig[key];
    if (!value || value.startsWith('YOUR_') || value.includes('HERE')) {
        isConfigValid = false;
        missingOrInvalidKeys.push(key);
    }
}
// --- End Validation ---


if (!isConfigValid) {
    console.error(
      "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n" +
      "!! FIREBASE CONFIGURATION IS INCOMPLETE OR USES PLACEHOLDER VALUES              !!\n" +
      "!!                                                                                !!\n" +
      `!! Please update the following keys in your .env file: ${missingOrInvalidKeys.join(', ')}    !!\n` +
      "!!                                                                                !!\n" +
      "!! You can find these values in your Firebase project settings.                   !!\n" +
      "!! Firebase will NOT be initialized. App features will be disabled.               !!\n" +
      "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
    );
} else {
    if (!getApps().length) {
        try {
            app = initializeApp(firebaseConfig);
            
            const firestoreSettings: any = {
                cacheSizeBytes: CACHE_SIZE_UNLIMITED,
            };
            
            if (isCapacitorEnv) {
                firestoreSettings.experimentalAutoDetectLongPolling = true;
                firestoreSettings.useFetchStreams = false;
                firestoreSettings.experimentalForceLongPolling = true;
                console.log("🔧 Firebase configurado para Capacitor con long polling forzado");
            } else {
                console.log("🌐 Firebase configurado para entorno web estándar");
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
        db = getFirestore(app);
        appInitializedSuccessfully = true;
    }
}

if (appInitializedSuccessfully && app) {
  try {
    authInstance = getAuth(app);
    // Re-get Firestore instance from the initialized app to ensure consistency
    db = getFirestore(app);
    if (typeof window !== "undefined") {
      // Analytics solo en web normal (no en Capacitor/WebView)
      if (!isCapacitorEnv && firebaseConfig.measurementId) {
        analyticsInstance = getAnalytics(app);
      } else if (isCapacitorEnv) {
        console.log("🔧 Firebase Analytics deshabilitado en Capacitor");
      }
      
      if (!isCapacitorEnv && firebaseConfig.vapidKey) {
        try {
          messagingInstance = getMessaging(app);
        } catch (messagingError) {
          console.warn("⚠️ Firebase Messaging no disponible:", messagingError);
          messagingInstance = null;
        }
      } else {
        if(isCapacitorEnv) console.log("🔧 Firebase Messaging deshabilitado en Capacitor");
        if(!firebaseConfig.vapidKey) console.warn("🔧 Firebase Messaging deshabilitado, NEXT_PUBLIC_FIREBASE_VAPID_KEY no está configurada.");
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
    isConfigValid,
    appInitializedSuccessfully,
    hasApp: !!app,
    hasAuth: !!authInstance,
    hasDb: !!db,
    isCapacitorEnv,
    timestamp: new Date().toISOString()
  });
}
