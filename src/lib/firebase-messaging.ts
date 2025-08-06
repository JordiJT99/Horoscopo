
'use client';

import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { doc, setDoc, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { db, app, appInitializedSuccessfully, messaging } from './firebase';

const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

// --- Client-side functions ---

export const getFCMToken = async (userId: string): Promise<string | null> => {
  if (!appInitializedSuccessfully || !messaging) {
    console.warn('Firebase Messaging not initialized.');
    return null;
  }
  if (!VAPID_KEY || VAPID_KEY === 'YOUR_VAPID_KEY_HERE') {
    console.warn('VAPID key is missing in .env file. Cannot get FCM token.');
    return null;
  }


  try {
    const token = await getToken(messaging, { vapidKey: VAPID_KEY });
    if (token) {
      console.log('FCM Token:', token);
      // Save the token to Firestore
      const tokenDocRef = doc(db, 'fcmTokens', token);
      await setDoc(tokenDocRef, {
        userId: userId,
        token: token,
        createdAt: serverTimestamp(),
        platform: 'web'
      }, { merge: true }); // Use merge to avoid overwriting if the doc already exists
    } else {
      console.log('No registration token available. Request permission to generate one.');
    }
    return token;
  } catch (error) {
    console.error('An error occurred while retrieving token. ', error);
    return null;
  }
};

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    alert('This browser does not support desktop notification');
    return false;
  }

  const permission = await Notification.requestPermission();
  return permission === 'granted';
};

export const deleteCurrentToken = async (userId: string) => {
    if (!appInitializedSuccessfully || !messaging) return;
    // This is a simplified approach. A robust implementation would need to
    // get the current token and then delete its specific document from Firestore.
    // For now, we'll assume disabling on one device is sufficient for the user's intent.
    // The logic in NotificationSettingsCard will handle the UI state.
    console.log("User has disabled notifications. In a full implementation, we would delete the specific FCM token from Firestore.");
};

// Listener for foreground messages (when the app is open and active)
if (typeof window !== 'undefined' && appInitializedSuccessfully && messaging) {
  onMessage(messaging, (payload) => {
    console.log('Message received. ', payload);
    // Customize notification handling here.
    // For example, show a custom toast notification instead of the browser's default.
    const notificationTitle = payload.notification?.title || 'New Message';
    const notificationOptions = {
      body: payload.notification?.body || '',
      icon: payload.notification?.icon || '/custom_assets/logo_512.png',
    };
    new Notification(notificationTitle, notificationOptions);
  });
}
