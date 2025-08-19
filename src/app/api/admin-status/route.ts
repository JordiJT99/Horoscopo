import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

export async function GET() {
  try {
    const status = {
      firebaseAdminAuth: !!adminAuth,
      firebaseAdminDb: !!adminDb,
      environment: process.env.NODE_ENV,
      serviceAccountPath: process.env.FIREBASE_SERVICE_ACCOUNT_KEY,
      timestamp: new Date().toISOString()
    };

    console.log('Admin status check:', status);

    return NextResponse.json({
      success: true,
      status
    });
  } catch (error: any) {
    console.error('Error checking admin status:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
