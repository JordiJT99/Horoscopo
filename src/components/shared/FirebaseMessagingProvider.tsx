
'use client';

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getFCMToken } from '@/lib/firebase-messaging';

// This component's only job is to run the FCM logic on the client
// when the app loads and the user is authenticated.
export default function FirebaseMessagingProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  useEffect(() => {
    // Check if the user is logged in and notification permission has already been granted
    if (user && typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      console.log('User is logged in and permission is granted. Attempting to get FCM token.');
      getFCMToken(user.uid); // This will get the token and save it if it's new
    }
  }, [user]);

  // This provider doesn't render any UI, it just wraps the app
  return <>{children}</>;
}
