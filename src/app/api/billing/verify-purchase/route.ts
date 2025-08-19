// src/app/api/billing/verify-purchase/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { googlePlayAPI } from '@/app/api/billing/google-play-api';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

interface VerifyPurchaseRequest {
  purchaseToken: string;
  productId: string;
  originalJson: string;
  signature: string;
  userId?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: VerifyPurchaseRequest = await request.json();
    const { purchaseToken, productId, originalJson, signature, userId } = body;

    // Validar que tenemos todos los datos necesarios
    if (!purchaseToken || !productId || !originalJson || !signature) {
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

    // Verificar la compra con Google Play Developer API
    const verificationResult = await googlePlayAPI.verifyProductPurchase(
      productId,
      purchaseToken
    );

    if (!verificationResult.isValid) {
      return NextResponse.json({
        success: false,
        error: verificationResult.error || 'Invalid purchase',
        isValid: false,
      });
    }

    // Preparar los datos de la compra
    const purchaseData = {
      productId,
      purchaseToken,
      orderId: verificationResult.orderId,
      purchaseTime: verificationResult.purchaseTime,
      isValid: verificationResult.isValid,
      isConsumed: verificationResult.isConsumed,
      lastVerified: Date.now(),
      originalJson,
      signature,
    };

    // Si tenemos un usuario autenticado, actualizar su estado en Firestore
    if (userUid) {
      try {
        // Obtener datos actuales del usuario
        const userDoc = await adminDb.collection('users').doc(userUid).get();
        const userData = userDoc.data() || {};
        const currentPurchases = userData.purchases || [];

        // Verificar si ya existe esta compra
        const existingPurchaseIndex = currentPurchases.findIndex(
          (p: any) => p.orderId === verificationResult.orderId
        );

        if (existingPurchaseIndex === -1) {
          // Nueva compra, agregarla
          currentPurchases.push(purchaseData);
        } else {
          // Actualizar compra existente
          currentPurchases[existingPurchaseIndex] = purchaseData;
        }

        // Determinar qué beneficios otorga esta compra
        const updates: any = {
          purchases: currentPurchases,
          lastPurchaseCheck: Date.now(),
        };

        // Lógica específica por producto
        switch (productId) {
          case 'remove_ads_forever':
            updates.hasRemovedAds = true;
            break;
          case 'stardust_pack_small':
            updates.stardust = (userData.stardust || 0) + 100;
            break;
          case 'stardust_pack_medium':
            updates.stardust = (userData.stardust || 0) + 250;
            break;
          case 'stardust_pack_large':
            updates.stardust = (userData.stardust || 0) + 500;
            break;
        }

        // Actualizar el documento del usuario
        await adminDb.collection('users').doc(userUid).update(updates);

        // Registrar la verificación en el historial
        await adminDb.collection('purchase_verifications').add({
          userId: userUid,
          productId,
          purchaseToken,
          orderId: verificationResult.orderId,
          verificationResult,
          timestamp: Date.now(),
          isValid: verificationResult.isValid,
        });

        console.log(`Purchase verified and processed for user ${userUid}`);
      } catch (dbError) {
        console.error('Error updating user purchase data:', dbError);
        // No fallar la respuesta por un error de base de datos
      }
    }

    // Acknowledge la compra si es necesario
    if (verificationResult.details?.acknowledgementState === 0) {
      try {
        await googlePlayAPI.acknowledgeProductPurchase(productId, purchaseToken);
        console.log('Purchase acknowledged successfully');
      } catch (ackError) {
        console.error('Failed to acknowledge purchase:', ackError);
        // No fallar por un error de acknowledgment
      }
    }

    return NextResponse.json({
      success: true,
      isValid: verificationResult.isValid,
      isConsumed: verificationResult.isConsumed,
      orderId: verificationResult.orderId,
      purchaseTime: verificationResult.purchaseTime,
      purchaseData,
    });

  } catch (error) {
    console.error('Error in verify-purchase API:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}

// Método GET para obtener las compras del usuario
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required',
      }, { status: 400 });
    }

    // En desarrollo, si no hay Firebase Admin configurado, simular verificación exitosa
    if (!adminAuth) {
      console.log('🔧 Development mode: Simulating purchase verification for userId:', userId);
      return NextResponse.json({
        success: true,
        purchases: [], // Array vacío - no hay compras simuladas
        hasRemovedAds: false, // Usuario no tiene anuncios removidos
        stardust: 100, // Stardust base para desarrollo
        message: 'Purchases verified (development mode - no purchases)'
      });
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
    const userDoc = await adminDb!.collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      return NextResponse.json({
        success: false,
        error: 'User not found',
      }, { status: 404 });
    }

    const userData = userDoc.data();
    const purchases = userData?.purchases || [];

    return NextResponse.json({
      success: true,
      purchases,
      hasRemovedAds: userData?.hasRemovedAds || false,
      stardust: userData?.stardust || 0,
    });

  } catch (error) {
    console.error('Error in GET verify-purchase API:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}
