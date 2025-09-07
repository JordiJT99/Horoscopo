

import * as admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { resolve } from 'path';

let app: admin.app.App | null = null;

function initializeFirebaseAdmin() {
  if (admin.apps.length > 0) {
    console.log('[Firebase Admin] Already initialized, using existing app');
    return admin.app();
  }

  let serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  
  // Fallback: if env var is not set, try plain file in repo root
  if (!serviceAccountPath) {
    const fallbackPath = resolve(process.cwd(), 'firebase-service-account.json');        
    try {
      // quick existence check
      readFileSync(fallbackPath, 'utf8');
      serviceAccountPath = fallbackPath;
      console.log('[Firebase Admin] FIREBASE_SERVICE_ACCOUNT_KEY not set, falling back to', fallbackPath);
    } catch (err) {
      console.warn('[Firebase Admin] No service account found at', fallbackPath);
      // keep serviceAccountPath undefined and let subsequent logic warn
    }
  }

  if (serviceAccountPath) {
    try {
      let serviceAccount;
      
      // Si el valor parece ser un path a un archivo (comienza con ./ o /)
      if (serviceAccountPath.startsWith('./') || serviceAccountPath.startsWith('/') || serviceAccountPath.includes('firebase-service-account.json')) {   
        const absolutePath = resolve(process.cwd(), serviceAccountPath);
        console.log('[Firebase Admin] Loading service account from file:', absolutePath);
        serviceAccount = JSON.parse(readFileSync(absolutePath, 'utf8'));
      } else {
        // Si no, asumimos que es el JSON directo (para compatibilidad)
        console.log('[Firebase Admin] Loading service account from environment variable');
        serviceAccount = JSON.parse(serviceAccountPath);
      }
      
      app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      
      console.log('[Firebase Admin] Firebase Admin SDK initialized successfully');
      return app;
    } catch (error: any) {
      console.error('[Firebase Admin] Firebase Admin SDK initialization error:', error.message);
      if (error.message.includes('ENOENT')) {
        console.error(
          `[Firebase Admin] Service account file not found at path: ${serviceAccountPath}. Please check the file exists.`
        );
      } else if (error.message.includes('Failed to parse service account')) {
        console.error(
          '[Firebase Admin] The service account data is not valid JSON. Please check your configuration.' 
        );
      }
      app = null;
      return null;
    }
  } else {
    console.warn("[Firebase Admin] FIREBASE_SERVICE_ACCOUNT_KEY is not set. Firebase Admin features will be disabled.");
    app = null;
    return null;
  }
}

// Initialize on import
try {
  app = initializeFirebaseAdmin();
} catch (error) {
  console.error('[Firebase Admin] Failed to initialize on import:', error);
  app = null;
}

export const adminAuth = app?.auth();
export const adminDb = app?.firestore();
export const adminMessaging = app?.messaging();