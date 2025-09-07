// src/app/api/debug/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
  console.log('[DEBUG] Debug endpoint called');
  
  const debugInfo = {
    timestamp: new Date().toISOString(),
    hasAdminAuth: !!adminAuth,
    hasAdminDb: !!adminDb,
    nodeEnv: process.env.NODE_ENV,
    firebaseServiceAccountKey: !!process.env.FIREBASE_SERVICE_ACCOUNT_KEY,
    cwdPath: process.cwd(),
  };
  
  console.log('[DEBUG] Debug info:', debugInfo);
  
  return NextResponse.json(debugInfo);
}
