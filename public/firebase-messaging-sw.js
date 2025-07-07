
// Import the Firebase app and messaging services
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

// **IMPORTANT**: You must copy your Firebase config object here.
// This cannot be done with environment variables as this script runs in the browser's service worker context.
const firebaseConfig = {
  apiKey: "RAIzaSyAFcU4zO3c1blID2o5325izATM2n24pFgQ",
  authDomain: "astrovibes-xv2f4.firebaseapp.com",
  projectId: "astrovibes-xv2f4",
  storageBucket: "astrovibes-xv2f4.firebasestorage.app",
  messagingSenderId: "987225861422D",
  appId: "1:987225861422:web:db77b5ad6fa16aa74e1ebf",
  measurementId: "G-N4QJT0HS39"
};


// Initialize the Firebase app in the service worker
firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );

  if (!payload.notification) {
    return;
  }

  // Customize the notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon || "/custom_assets/logo_192.png", // A default icon
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
