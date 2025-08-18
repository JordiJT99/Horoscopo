// src/app/api/billing/verify-subscription/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { googlePlayAPI } from '@/lib/google-play-api';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

interface VerifySubscriptionRequest {
  purchaseToken: string;
  subscriptionId: string;
  originalJson: string;
  signature: string;
  userId?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: VerifySubscriptionRequest = await request.json();
    const { purchaseToken, subscriptionId, originalJson, signature, userId } = body;

    // Validar que tenemos todos los datos necesarios
    if (!purchaseToken || !subscriptionId || !originalJson || !signature) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields',
      }, { status: 400 });
    }

    // Verificar la autenticación del usuario si se proporciona
    let userUid: string | null = null;
    if (userId) {
      try {
        const authHeader = request.headers.get('authorization');
        if (authHeader && authHeader.startsWith('Bearer ')) {
          const idToken = authHeader.substring(7);
          const decodedToken = await adminAuth.verifyIdToken(idToken);
          userUid = decodedToken.uid;
          
          if (userUid !== userId) {
            return NextResponse.json({
              success: false,
              error: 'User authentication mismatch',
            }, { status: 403 });
          }
        }
      } catch (authError) {
        console.error('Auth verification failed:', authError);
        return NextResponse.json({
          success: false,
          error: 'Invalid authentication',
        }, { status: 401 });
      }
    }

    // TODO: Verificar la signatura de Google Play (opcional pero recomendado)
    // Este paso requiere configurar la clave pública de Google Play
    
    // Verificar la suscripción con Google Play Developer API
    const verificationResult = await googlePlayAPI.verifySubscription(
      subscriptionId,
      purchaseToken
    );

    if (!verificationResult.isValid) {
      return NextResponse.json({
        success: false,
        error: verificationResult.error || 'Invalid subscription',
        isActive: false,
      });
    }

    // Preparar los datos de la suscripción
    const subscriptionData = {
      subscriptionId,
      purchaseToken,
      isActive: verificationResult.isActive,
      expiryTime: verificationResult.expiryTime,
      autoRenewing: verificationResult.autoRenewing,
      lastVerified: Date.now(),
      originalJson,
      signature,
    };

    // Si tenemos un usuario autenticado, actualizar su estado premium en Firestore
    if (userUid) {
      try {
        // Actualizar el documento del usuario
        await adminDb.collection('users').doc(userUid).update({
          subscription: subscriptionData,
          isPremium: verificationResult.isActive,
          premiumType: subscriptionId.includes('vip') ? 'vip' : 'premium',
          lastSubscriptionCheck: Date.now(),
        });

        // Registrar la verificación en el historial
        await adminDb.collection('subscription_verifications').add({
          userId: userUid,
          subscriptionId,
          purchaseToken,
          verificationResult,
          timestamp: Date.now(),
          isActive: verificationResult.isActive,
        });

        console.log(`Subscription verified and updated for user ${userUid}`);
      } catch (dbError) {
        console.error('Error updating user subscription data:', dbError);
        // No fallar la respuesta por un error de base de datos
      }
    }

    // Acknowledge la suscripción si es necesario
    if (verificationResult.details?.acknowledgementState === 0) {
      try {
        await googlePlayAPI.acknowledgeSubscription(subscriptionId, purchaseToken);
        console.log('Subscription acknowledged successfully');
      } catch (ackError) {
        console.error('Failed to acknowledge subscription:', ackError);
        // No fallar por un error de acknowledgment
      }
    }

    return NextResponse.json({
      success: true,
      isActive: verificationResult.isActive,
      expiryTime: verificationResult.expiryTime,
      autoRenewing: verificationResult.autoRenewing,
      subscriptionData,
    });

  } catch (error) {
    console.error('Error in verify-subscription API:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}

// Método GET para verificar el estado actual de una suscripción
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const subscriptionId = searchParams.get('subscriptionId');

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required',
      }, { status: 400 });
    }

    // Verificar autenticación
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        error: 'Authorization header required',
      }, { status: 401 });
    }

    const idToken = authHeader.substring(7);
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    
    if (decodedToken.uid !== userId) {
      return NextResponse.json({
        success: false,
        error: 'User authentication mismatch',
      }, { status: 403 });
    }

    // Obtener los datos del usuario desde Firestore
    const userDoc = await adminDb.collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      return NextResponse.json({
        success: false,
        error: 'User not found',
      }, { status: 404 });
    }

    const userData = userDoc.data();
    const subscription = userData?.subscription;

    if (!subscription) {
      return NextResponse.json({
        success: true,
        isActive: false,
        isPremium: false,
      });
    }

    // Verificar si necesitamos revalidar la suscripción
    const timeSinceLastCheck = Date.now() - (userData?.lastSubscriptionCheck || 0);
    const shouldRevalidate = timeSinceLastCheck > 24 * 60 * 60 * 1000; // 24 horas

    if (shouldRevalidate && subscription.purchaseToken) {
      // Revalidar con Google Play API
      const verificationResult = await googlePlayAPI.verifySubscription(
        subscription.subscriptionId,
        subscription.purchaseToken
      );

      // Actualizar el estado en Firestore
      await adminDb.collection('users').doc(userId).update({
        'subscription.isActive': verificationResult.isActive,
        'subscription.expiryTime': verificationResult.expiryTime,
        'subscription.autoRenewing': verificationResult.autoRenewing,
        'subscription.lastVerified': Date.now(),
        isPremium: verificationResult.isActive,
        lastSubscriptionCheck: Date.now(),
      });

      return NextResponse.json({
        success: true,
        isActive: verificationResult.isActive,
        isPremium: verificationResult.isActive,
        expiryTime: verificationResult.expiryTime,
        autoRenewing: verificationResult.autoRenewing,
        premiumType: userData?.premiumType || 'premium',
      });
    }

    // Retornar datos existentes si no necesita revalidación
    return NextResponse.json({
      success: true,
      isActive: subscription.isActive || false,
      isPremium: userData?.isPremium || false,
      expiryTime: subscription.expiryTime || 0,
      autoRenewing: subscription.autoRenewing || false,
      premiumType: userData?.premiumType || 'premium',
      lastVerified: subscription.lastVerified || 0,
    });

  } catch (error) {
    console.error('Error in GET verify-subscription API:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}
