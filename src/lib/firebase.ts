
import { initializeApp, getApps, getApp, type FirebaseOptions } from "firebase/app";
import { getAnalytics, type Analytics } from "firebase/analytics";
import { getAuth, type Auth } from "firebase/auth"; 
import { getFirestore } from "firebase/firestore";
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

// Check for missing configuration and log a clear error
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
      appInitializedSuccessfully = true;
    } catch (error) {
      console.error("Firebase initialization error (initializeApp failed):", error);
      appInitializedSuccessfully = false;
    }
  } else {
    app = getApp();
    appInitializedSuccessfully = true;
  }
}

if (appInitializedSuccessfully && app) {
  try {
    authInstance = getAuth(app);
    db = getFirestore(app);
    // Initialize Analytics and Messaging only in the browser
    if (typeof window !== "undefined") {
      analyticsInstance = getAnalytics(app);
      messagingInstance = getMessaging(app);
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
