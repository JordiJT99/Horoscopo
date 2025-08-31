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

export async function POST(request: NextRequest) {
  try {
    const body: VerifySubscriptionRequest = await request.json();
    const { purchaseToken, subscriptionId, originalJson, signature, userId } = body;

    // Validación básica
    if (!purchaseToken || !subscriptionId || !originalJson || !signature) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // Verificar autenticación del usuario (si se proporciona userId)
    let userUid: string | null = null;
    if (userId) {
      try {
        const authHeader = request.headers.get('authorization');
        if (authHeader && authHeader.startsWith('Bearer ')) {
          const idToken = authHeader.substring(7);
          const decodedToken = await adminAuth.verifyIdToken(idToken);
          userUid = decodedToken.uid;

          if (userUid !== userId) {
            return NextResponse.json({ success: false, error: 'User authentication mismatch' }, { status: 403 });
          }
        } else {
          return NextResponse.json({ success: false, error: 'Authorization header required' }, { status: 401 });
        }
      } catch (authError) {
        console.error('Auth verification failed:', authError);
        return NextResponse.json({ success: false, error: 'Invalid authentication' }, { status: 401 });
      }
    }

    // TODO: Validar la firma 'signature' con la clave pública de Google Play (opcional pero recomendado)

    // Verificar suscripción con la Google Play Developer API (vía tu wrapper)
    const verificationResult = await googlePlayAPI.verifySubscription(subscriptionId, purchaseToken);

    // Normalizar campos esperados (tolerante a wrappers en "modo dev")
    const expiryTimeRaw =
      (verificationResult as any).expiryTime ??
      (verificationResult as any).expiryTimeMillis ??
      0;

    const expiryTime = toNumberSafe(expiryTimeRaw);
    const autoRenewing = !!(verificationResult as any).autoRenewing;
    const acknowledged =
      (verificationResult as any).details?.acknowledgementState ??
      (verificationResult as any).acknowledgementState;

    // Si el wrapper trae isActive inconsistente, lo corregimos por expiryTime
    let isActive =
      typeof (verificationResult as any).isActive === 'boolean'
        ? (verificationResult as any).isActive
        : computeIsActive(expiryTime);

    // Si expiry está en el futuro, consideramos activa aunque el stub diga false
    if (!isActive && computeIsActive(expiryTime)) {
      isActive = true;
    }

    if (!(verificationResult as any).isValid || expiryTime <= 0) {
      return NextResponse.json({
        success: false,
        error: (verificationResult as any).error || 'Invalid subscription',
        isActive: false,
      });
    }

    const orderId = (verificationResult as any).orderId ?? null;

    // Marcar posible modo dev para depuración
    const devMode =
      typeof orderId === 'string' && orderId.startsWith('dev_') ||
      typeof purchaseToken === 'string' && purchaseToken.startsWith('dev_') ||
      /development mode/i.test(String((verificationResult as any).message ?? ''));

    // Datos a persistir
    const subscriptionData = {
      subscriptionId,
      purchaseToken,
      isActive,
      expiryTime,               // en ms
      autoRenewing,
      orderId,
      acknowledgementState: typeof acknowledged === 'number' ? acknowledged : 1,
      lastVerified: Date.now(),
      originalJson,
      signature,
    };

    // Persistencia en Firestore (solo si el usuario está autenticado)
    if (userUid && adminDb) {
      try {
        // Upsert con merge para evitar fallar si el doc no existe aún
        await adminDb.collection('users').doc(userUid).set(
          {
            subscription: subscriptionData,
            isPremium: isActive,
            premiumType: subscriptionId.includes('vip') ? 'vip' : 'premium',
            lastSubscriptionCheck: Date.now(),
          },
          { merge: true }
        );

        // Historial de verificaciones
        await adminDb.collection('subscription_verifications').add({
          userId: userUid,
          subscriptionId,
          purchaseToken,
          verificationResult,
          timestamp: Date.now(),
          isActive,
          devMode,
        });

        console.log(`Subscription verified and updated for user ${userUid}`);
      } catch (dbError) {
        console.error('Error updating user subscription data:', dbError);
        // No tiramos el endpoint si falla la BD; el cliente puede reintentar
      }
    }

    // Acknowledge si hace falta (solo si Play reporta 0)
    try {
      const ackState =
        (verificationResult as any).details?.acknowledgementState ??
        (verificationResult as any).acknowledgementState;

      if (ackState === 0) {
        await googlePlayAPI.acknowledgeSubscription(subscriptionId, purchaseToken);
        console.log('Subscription acknowledged successfully');
      }
    } catch (ackError) {
      // 409 si ya estaba acknowledged; lo ignoramos
      console.error('Failed to acknowledge subscription:', ackError);
    }

    return NextResponse.json({
      success: true,
      isActive,
      expiryTime,
      autoRenewing,
      orderId,
      devMode,
      subscriptionData,
    });
  } catch (error) {
    console.error('Error in verify-subscription API:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

// Método GET para verificar el estado actual de una suscripción
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 });
    }

    if (!adminAuth) {
      console.error('Firebase Admin SDK not configured - cannot verify subscription for userId:', userId);
      return NextResponse.json({
        success: false,
        error: 'Server misconfigured: Firebase Admin not available',
      }, { status: 500 });
    }

    // Verificar autenticación
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, error: 'Authorization header required' }, { status: 401 });
    }

    const idToken = authHeader.substring(7);
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    if (decodedToken.uid !== userId) {
      return NextResponse.json({ success: false, error: 'User authentication mismatch' }, { status: 403 });
    }

    if (!adminDb) {
      return NextResponse.json({ success: false, error: 'Database not available' }, { status: 500 });
    }

    const userDoc = await adminDb.collection('users').doc(userId).get();

    if (!userDoc.exists) {
      console.log(`User document not found for ${userId} - returning default non-premium response.`);
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

    // Revalidar cada 24h
    const timeSinceLastCheck = Date.now() - toNumberSafe(userData.lastSubscriptionCheck);
    const shouldRevalidate = timeSinceLastCheck > 24 * 60 * 60 * 1000 && !!subscription.purchaseToken;

    if (shouldRevalidate) {
      try {
        const result = await googlePlayAPI.verifySubscription(subscription.subscriptionId, subscription.purchaseToken);

        // Normalizar
        const expiry =
          toNumberSafe((result as any).expiryTime ?? (result as any).expiryTimeMillis ?? 0);
        const isActiveRemote =
          typeof (result as any).isActive === 'boolean'
            ? (result as any).isActive
            : computeIsActive(expiry);

        const autoRenewing = !!(result as any).autoRenewing;

        // Persistir
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
                subscription.acknowledgementState ??
                1,
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
        // En caso de error remoto, devolvemos el estado local calculado
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

    // Sin revalidar: devolver cálculo local (más consistente si ya expiró)
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
    console.error('Error in GET verify-subscription API:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
