
import { initializeApp, getApps, getApp, type FirebaseOptions } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth"; // Import Auth type
import { getFirestore } from "firebase/firestore"; // Import Firestore

const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

let app: ReturnType<typeof initializeApp> | null = null;
let authInstance: Auth | null = null;
let db: ReturnType<typeof getFirestore> | null = null; // Add db instance
let appInitializedSuccessfully = false;

if (!apiKey || apiKey === "YOUR_API_KEY_HERE" || apiKey.trim() === "" || apiKey === "YOUR_AUTH_DOMAIN_HERE" /* common copy-paste error */) {
  console.error(
    "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n" +
    "!! FIREBASE API KEY IS MISSING, A PLACEHOLDER, OR CLEARLY INVALID                   !!\n" +
    "!!                                                                                !!\n" +
    "!! Please set NEXT_PUBLIC_FIREBASE_API_KEY in your .env file (in the project root)  !!\n" +
    "!! with your actual Firebase project API key.                                       !!\n" +
    "!!                                                                                !!\n" +
    "!! Firebase will NOT be initialized. Authentication features will be disabled.      !!\n" +
    "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
  );
  // Do not attempt to initialize Firebase if the key is clearly bad.
  // app and authInstance will remain null.
} else {
  const firebaseConfig: FirebaseOptions = {
    apiKey: apiKey,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Optional
  };

  if (!getApps().length) {
    try {
      app = initializeApp(firebaseConfig);
      appInitializedSuccessfully = true;
    } catch (error) {
      console.error("Firebase initialization error (initializeApp failed):", error);
      // app remains null, appInitializedSuccessfully remains false
    }
  } else {
    app = getApp(); // If already initialized (e.g., HMR), get the existing app
    appInitializedSuccessfully = true; // Assume if getApp() succeeds, it was initialized properly before
  }

  if (appInitializedSuccessfully && app) {
    try {
      authInstance = getAuth(app);
      db = getFirestore(app); // Initialize Firestore here
    } catch (error) {
      console.error("Firebase getAuth/getFirestore error:", error);
      authInstance = null;
      db = null; // Ensure db is null on error
      appInitializedSuccessfully = false; // Mark as not successfully initialized fully
    }
  } else if (appInitializedSuccessfully && !app) {
    // This case should ideally not happen if getApps().length was 0 and initializeApp failed.
    // Or if getApps().length > 0 but getApp() failed.
    console.error("Firebase app was expected to be initialized but is null.");
    appInitializedSuccessfully = false;
  }
}

// Export authInstance directly as auth
export { app, authInstance as auth, db, appInitializedSuccessfully };
