// src/app/api/billing/verify-subscription/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { googlePlayAPI } from '@/app/api/billing/google-play-api';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

interface VerifySubscriptionRequest {
  purchaseToken: string;
  subscriptionId: string;
  originalJson: string;
  signature: string;
  userId?: string;
}

function toNumberSafe(n: any): number {
  const num = typeof n === 'string' ? Number(n) : (typeof n === 'number' ? n : 0);
  return Number.isFinite(num) ? num : 0;
}
function computeIsActive(expiryTimeMs?: number): boolean {
  return typeof expiryTimeMs === 'number' && expiryTimeMs > Date.now();
}
function getBearerToken(headers: Headers): string | null {
  const h = headers.get('authorization') ?? headers.get('Authorization');
  if (!h) return null;
  const [scheme, token] = h.split(' ');
  if (!/^Bearer$/i.test(scheme) || !token) return null;
  return token;
}

export async function POST(request: NextRequest) {
  try {
    const body: VerifySubscriptionRequest = await request.json();
    const { purchaseToken, subscriptionId, originalJson, signature, userId } = body;

    if (!purchaseToken || !subscriptionId || !originalJson || !signature) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // Auth opcional, pero si viene userId lo validamos SIEMPRE
    let userUid: string | null = null;
    if (userId) {
      const token = getBearerToken(request.headers);
      if (!token) {
        return NextResponse.json({ success: false, error: 'Authorization header required' }, { status: 401 });
      }
      try {
        const decoded = await adminAuth.verifyIdToken(token);
        userUid = decoded.uid;
        if (userUid !== userId) {
          return NextResponse.json({ success: false, error: 'User authentication mismatch' }, { status: 403 });
        }
      } catch (e) {
        console.error('verifyIdToken failed (POST):', e);
        return NextResponse.json({ success: false, error: 'Invalid authentication' }, { status: 401 });
      }
    }

    const verificationResult = await googlePlayAPI.verifySubscription(subscriptionId, purchaseToken);

    const expiryTimeRaw =
      (verificationResult as any).expiryTime ??
      (verificationResult as any).expiryTimeMillis ?? 0;

    const expiryTime = toNumberSafe(expiryTimeRaw);
    let isActive =
      typeof (verificationResult as any).isActive === 'boolean'
        ? (verificationResult as any).isActive
        : computeIsActive(expiryTime);

    // Corrige stubs que devuelven false con expiry futuro
    if (!isActive && computeIsActive(expiryTime)) isActive = true;

    if (!(verificationResult as any).isValid || expiryTime <= 0) {
      return NextResponse.json({
        success: false,
        error: (verificationResult as any).error || 'Invalid subscription',
        isActive: false,
      });
    }

    const autoRenewing = !!(verificationResult as any).autoRenewing;
    const orderId = (verificationResult as any).orderId ?? null;
    const ackState =
      (verificationResult as any).details?.acknowledgementState ??
      (verificationResult as any).acknowledgementState ?? 1;

    const subscriptionData = {
      subscriptionId,
      purchaseToken,
      isActive,
      expiryTime, // ms
      autoRenewing,
      orderId,
      acknowledgementState: ackState,
      lastVerified: Date.now(),
      originalJson,
      signature,
    };

    if (userUid && adminDb) {
      try {
        await adminDb.collection('users').doc(userUid).set(
          {
            subscription: subscriptionData,
            isPremium: isActive,
            premiumType: subscriptionId.includes('vip') ? 'vip' : 'premium',
            lastSubscriptionCheck: Date.now(),
          },
          { merge: true }
        );
        await adminDb.collection('subscription_verifications').add({
          userId: userUid,
          subscriptionId,
          purchaseToken,
          verificationResult,
          timestamp: Date.now(),
          isActive,
        });
      } catch (dbError) {
        console.error('Firestore write failed:', dbError);
        // No rompemos la respuesta por esto
      }
    }

    if (ackState === 0) {
      try {
        await googlePlayAPI.acknowledgeSubscription(subscriptionId, purchaseToken);
      } catch (ackErr) {
        console.error('Acknowledge failed:', ackErr); // ignorable (409 si ya estaba)
      }
    }

    return NextResponse.json({
      success: true,
      isActive,
      expiryTime,
      autoRenewing,
      orderId,
      subscriptionData,
    });

  } catch (error) {
    console.error('Error in verify-subscription API (POST):', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 });
    }
    if (!adminAuth) {
      console.error('Firebase Admin SDK not configured');
      return NextResponse.json({ success: false, error: 'Server misconfigured: Firebase Admin not available' }, { status: 500 });
    }
    if (!adminDb) {
      return NextResponse.json({ success: false, error: 'Database not available' }, { status: 500 });
    }

    // Auth SIEMPRE en GET
    const token = getBearerToken(request.headers);
    if (!token) {
      return NextResponse.json({ success: false, error: 'Authorization header required' }, { status: 401 });
    }

    let uid: string;
    try {
      const decoded = await adminAuth.verifyIdToken(token);
      uid = decoded.uid;
    } catch (e) {
      console.error('verifyIdToken failed (GET):', e);
      return NextResponse.json({ success: false, error: 'Invalid authentication' }, { status: 401 });
    }
    if (uid !== userId) {
      return NextResponse.json({ success: false, error: 'User authentication mismatch' }, { status: 403 });
    }

    const userDoc = await adminDb.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return NextResponse.json({
        success: true,
        isActive: false,
        isPremium: false,
        expiryTime: 0,
        autoRenewing: false,
        premiumType: 'none',
        lastVerified: 0,
        message: 'User document not found - treated as non-premium',
      });
    }

    const userData = userDoc.data() || {};
    const subscription = userData.subscription || null;

    if (!subscription) {
      return NextResponse.json({ success: true, isActive: false, isPremium: false });
    }

    const storedExpiry = toNumberSafe(subscription.expiryTime);
    const localActive = computeIsActive(storedExpiry);

    // Revalidar cada 24h si hay token
    const timeSinceLastCheck = Date.now() - toNumberSafe(userData.lastSubscriptionCheck);
    const shouldRevalidate = timeSinceLastCheck > 24 * 60 * 60 * 1000 && !!subscription.purchaseToken;

    if (shouldRevalidate) {
      try {
        const result = await googlePlayAPI.verifySubscription(subscription.subscriptionId, subscription.purchaseToken);
        const expiry = toNumberSafe((result as any).expiryTime ?? (result as any).expiryTimeMillis ?? 0);
        const isActiveRemote =
          typeof (result as any).isActive === 'boolean' ? (result as any).isActive : computeIsActive(expiry);
        const autoRenewing = !!(result as any).autoRenewing;

        await adminDb.collection('users').doc(userId).set(
          {
            subscription: {
              ...subscription,
              expiryTime: expiry,
              isActive: isActiveRemote,
              autoRenewing,
              lastVerified: Date.now(),
              orderId: (result as any).orderId ?? subscription.orderId ?? null,
              acknowledgementState:
                (result as any).details?.acknowledgementState ??
                (result as any).acknowledgementState ??
                subscription.acknowledgementState ?? 1,
            },
            isPremium: isActiveRemote,
            lastSubscriptionCheck: Date.now(),
          },
          { merge: true }
        );

        return NextResponse.json({
          success: true,
          isActive: isActiveRemote,
          isPremium: isActiveRemote,
          expiryTime: expiry,
          autoRenewing,
          premiumType: userData?.premiumType || 'premium',
        });
      } catch (revalErr) {
        console.error('Revalidation failed:', revalErr);
        // Devolvemos estado local si Play falla
        return NextResponse.json({
          success: true,
          isActive: localActive,
          isPremium: localActive,
          expiryTime: storedExpiry,
          autoRenewing: !!subscription.autoRenewing,
          premiumType: userData?.premiumType || 'premium',
          stale: true,
        });
      }
    }

    // Sin revalidación: responde con cálculo local
    return NextResponse.json({
      success: true,
      isActive: localActive,
      isPremium: localActive,
      expiryTime: storedExpiry,
      autoRenewing: !!subscription.autoRenewing,
      premiumType: userData?.premiumType || 'premium',
      lastVerified: toNumberSafe(subscription.lastVerified),
    });

  } catch (error) {
    console.error('Error in verify-subscription API (GET):', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
