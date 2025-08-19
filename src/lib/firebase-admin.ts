

import * as admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { resolve } from 'path';

let app: admin.app.App | null = null;

if (admin.apps.length === 0) {
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (serviceAccountPath) {
    try {
      // Si el valor parece ser un path a un archivo (comienza con ./ o /)
      if (serviceAccountPath.startsWith('./') || serviceAccountPath.startsWith('/')) {
        const absolutePath = resolve(process.cwd(), serviceAccountPath);
        const serviceAccount = JSON.parse(readFileSync(absolutePath, 'utf8'));
        app = admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
        console.log('Firebase Admin SDK initialized successfully from file:', absolutePath);
      } else {
        // Si no, asumimos que es el JSON directo (para compatibilidad)
        const serviceAccount = JSON.parse(serviceAccountPath);
        app = admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
        console.log('Firebase Admin SDK initialized successfully from environment variable.');
      }
    } catch (error: any) {
      console.error('Firebase Admin SDK initialization error:', error.message);
      if (error.message.includes('ENOENT')) {
        console.error(
          `Service account file not found at path: ${serviceAccountPath}. Please check the file exists.`
        );
      } else if (error.message.includes('Failed to parse service account')) {
        console.error(
          'The service account data is not valid JSON. Please check your configuration.'
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
