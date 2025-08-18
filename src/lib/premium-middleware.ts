// src/lib/premium-middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

interface PremiumCheckResult {
  isPremium: boolean;
  userId?: string;
  premiumType?: 'premium' | 'vip';
  expiryTime?: number;
  error?: string;
}

/**
 * Middleware para verificar si un usuario tiene acceso premium
 * Usado en APIs que requieren suscripción activa
 */
export async function checkPremiumAccess(request: NextRequest): Promise<PremiumCheckResult> {
  try {
    // Verificar que Firebase Admin esté disponible
    if (!adminAuth || !adminDb) {
      return {
        isPremium: false,
        error: 'Firebase Admin not available',
      };
    }

    // Obtener token de autorización
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        isPremium: false,
        error: 'Authorization header required',
      };
    }

    const idToken = authHeader.substring(7);
    
    // Verificar token con Firebase Admin
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    // Obtener datos del usuario desde Firestore
    const userDoc = await adminDb.collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      return {
        isPremium: false,
        userId,
        error: 'User not found',
      };
    }

    const userData = userDoc.data();
    const subscription = userData?.subscription;
    const isPremium = userData?.isPremium || false;

    // Verificación básica
    if (!isPremium || !subscription) {
      return {
        isPremium: false,
        userId,
        error: 'No premium subscription found',
      };
    }

    // Verificar si la suscripción ha expirado
    const now = Date.now();
    const expiryTime = subscription.expiryTime || 0;
    
    if (expiryTime > 0 && expiryTime < now) {
      // Marcar como no premium si ha expirado
      await adminDb.collection('users').doc(userId).update({
        isPremium: false,
        'subscription.isActive': false,
      });

      return {
        isPremium: false,
        userId,
        error: 'Subscription expired',
      };
    }

    return {
      isPremium: true,
      userId,
      premiumType: userData?.premiumType || 'premium',
      expiryTime,
    };

  } catch (error) {
    console.error('Error checking premium access:', error);
    return {
      isPremium: false,
      error: 'Internal error verifying premium status',
    };
  }
}

/**
 * Wrapper para APIs que requieren acceso premium
 */
export function withPremiumAccess(handler: (request: NextRequest, premiumInfo: PremiumCheckResult) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    const premiumCheck = await checkPremiumAccess(request);
    
    if (!premiumCheck.isPremium) {
      return NextResponse.json({
        success: false,
        error: premiumCheck.error || 'Premium subscription required',
        requiresPremium: true,
      }, { status: 403 });
    }

    return handler(request, premiumCheck);
  };
}

/**
 * Verificar acceso a funciones específicas basadas en tipo de suscripción
 */
export function checkFeatureAccess(premiumType: string, feature: string): boolean {
  const featureMap = {
    premium: [
      'advanced_horoscopes',
      'natal_chart',
      'unlimited_psychic_chat',
      'no_ads',
      'tomorrow_horoscope',
    ],
    vip: [
      'advanced_horoscopes',
      'natal_chart',
      'unlimited_psychic_chat',
      'no_ads',
      'tomorrow_horoscope',
      'exclusive_psychics',
      'priority_support',
      'advanced_tarot',
    ],
  };

  const allowedFeatures = featureMap[premiumType as keyof typeof featureMap] || [];
  return allowedFeatures.includes(feature);
}

/**
 * Middleware para funciones específicas
 */
export function withFeatureAccess(feature: string) {
  return function(handler: (request: NextRequest, premiumInfo: PremiumCheckResult) => Promise<NextResponse>) {
    return async (request: NextRequest) => {
      const premiumCheck = await checkPremiumAccess(request);
      
      if (!premiumCheck.isPremium) {
        return NextResponse.json({
          success: false,
          error: 'Premium subscription required',
          requiresPremium: true,
          feature,
        }, { status: 403 });
      }

      if (!checkFeatureAccess(premiumCheck.premiumType || 'premium', feature)) {
        return NextResponse.json({
          success: false,
          error: `Feature "${feature}" not available in your subscription plan`,
          requiresUpgrade: true,
          currentPlan: premiumCheck.premiumType,
          feature,
        }, { status: 403 });
      }

      return handler(request, premiumCheck);
    };
  };
}
