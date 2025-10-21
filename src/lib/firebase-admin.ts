

import * as admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { resolve } from 'path';

let app: admin.app.App | null = null;

function initializeFirebaseAdmin() {
  if (admin.apps.length > 0) {
    console.log('[Firebase Admin] Already initialized, using existing app');
    return admin.app();
  }

  // Opción 1: Variable de entorno con JSON completo
  let serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  
  // Opción 2: Archivo local (para desarrollo)
  if (!serviceAccountPath) {
    const fallbackPath = resolve(process.cwd(), 'firebase-service-account.json');        
    try {
      readFileSync(fallbackPath, 'utf8');
      serviceAccountPath = fallbackPath;
      console.log('[Firebase Admin] FIREBASE_SERVICE_ACCOUNT_KEY not set, falling back to', fallbackPath);
    } catch (err) {
      // Archivo no encontrado, intentar credenciales por defecto
      console.log('[Firebase Admin] No service account file found, trying default credentials');
    }
  }

  // Opción 3: Credenciales por defecto (funciona en Firebase Hosting y Google Cloud)
  if (!serviceAccountPath) {
    try {
      console.log('[Firebase Admin] Initializing with default credentials (Firebase Hosting / Google Cloud)');
      app = admin.initializeApp({
        credential: admin.credential.applicationDefault(),
      });
      
      console.log('[Firebase Admin] Firebase Admin SDK initialized successfully with default credentials');
      return app;
    } catch (error: any) {
      console.error('[Firebase Admin] Failed to initialize with default credentials:', error.message);
      
      // Si falla con credenciales por defecto, intentar sin credenciales (solo para entorno de desarrollo)
      try {
        console.log('[Firebase Admin] Attempting initialization without explicit credentials');
        app = admin.initializeApp();
        console.log('[Firebase Admin] Firebase Admin SDK initialized successfully without explicit credentials');
        return app;
      } catch (finalError: any) {
        console.error('[Firebase Admin] All initialization methods failed:', finalError.message);
        app = null;
        return null;
      }
    }
  }

  // Si tenemos serviceAccountPath, usarlo
  if (serviceAccountPath) {
    try {
      let serviceAccount;
      
      if (serviceAccountPath.startsWith('./') || serviceAccountPath.startsWith('/') || serviceAccountPath.includes('firebase-service-account.json')) {   
        const absolutePath = resolve(process.cwd(), serviceAccountPath);
        console.log('[Firebase Admin] Loading service account from file:', absolutePath);
        serviceAccount = JSON.parse(readFileSync(absolutePath, 'utf8'));
      } else {
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
  }
  
  return null;
}

// Initialize on import
try {
  app = initializeFirebaseAdmin();
} catch (error) {
  console.error('[Firebase Admin] Failed to initialize on import:', error);
  app = null;
}

// Lazy getters to ensure Firebase is initialized when accessed
export function getAdminAuth() {
  if (!app) {
    app = initializeFirebaseAdmin();
  }
  return app?.auth() || null;
}

export function getAdminDb() {
  if (!app) {
    app = initializeFirebaseAdmin();
  }
  return app?.firestore() || null;
}

export function getAdminMessaging() {
  if (!app) {
    app = initializeFirebaseAdmin();
  }
  return app?.messaging() || null;
}

// Export legacy direct access (will be undefined if init failed)
export const adminAuth = app?.auth();
export const adminDb = app?.firestore();
export const adminMessaging = app?.messaging();