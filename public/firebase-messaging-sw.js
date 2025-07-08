
// This file must be in the public folder.

// Dynamically import the Firebase config from an API route
// This keeps credentials out of the source code.
try {
  self.importScripts('/api/firebase-config');
} catch (e) {
  console.error('Could not import firebase-config.js. Firebase messaging might not work.', e);
}

// Check if firebaseConfig was loaded successfully
if (self.firebaseConfig) {
  // Import and configure the Firebase SDK (using compat libraries for service worker context)
  self.importScripts('https://www.gstatic.com/firebasejs/9.15.0/firebase-app-compat.js');
  self.importScripts('https://www.gstatic.com/firebasejs/9.15.0/firebase-messaging-compat.js');

  // Initialize Firebase
  firebase.initializeApp(self.firebaseConfig);
  const messaging = firebase.messaging();

  // Handle background messages
  messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);

    if (payload.notification) {
        const notificationTitle = payload.notification.title || 'New Message';
        const notificationOptions = {
            body: payload.notification.body || '',
            icon: payload.notification.icon || '/custom_assets/logo_192.png'
        };

        self.registration.showNotification(notificationTitle, notificationOptions);
    }
  });
} else {
  console.error("firebaseConfig is not defined. Firebase messaging cannot be initialized in the service worker.");
}
