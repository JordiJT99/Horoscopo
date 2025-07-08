

import * as admin from 'firebase-admin';

let app: admin.app.App | null = null;

if (admin.apps.length === 0) {
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (serviceAccountKey) {
    try {
      const serviceAccount = JSON.parse(serviceAccountKey);
      app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log('Firebase Admin SDK initialized successfully.');
    } catch (error: any) {
      console.error('Firebase Admin SDK initialization error:', error.message);
      if (error.message.includes('Failed to parse service account')) {
        console.error(
          'The FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set or is not a valid JSON string. Please check your .env file.'
        );
      }
      app = null;
    }
  } else {
    console.warn("FIREBASE_SERVICE_ACCOUNT_KEY is not set. Firebase Admin features will be disabled.");
  }
} else {
  app = admin.app();
}

export const adminAuth = app?.auth();
export const adminDb = app?.firestore();
export const adminMessaging = app?.messaging();
