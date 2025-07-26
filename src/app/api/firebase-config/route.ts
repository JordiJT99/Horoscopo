
import { NextResponse } from 'next/server';

// Configure for static export
export const dynamic = 'force-static';

export async function GET() {
  // These variables are safe to be public.
  // The service worker needs them to initialize.
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };

  const responseBody = `self.firebaseConfig = ${JSON.stringify(firebaseConfig)};`;

  return new NextResponse(responseBody, {
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
    },
  });
}
