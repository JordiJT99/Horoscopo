// src/lib/google-play-api.ts
import { google } from 'googleapis';

const GOOGLE_APPLICATION_CREDENTIALS = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const PACKAGE_NAME = 'com.astromistica.horoscopo';

interface SubscriptionPurchase {
  kind: string;
  startTimeMillis: string;
  expiryTimeMillis: string;
  autoRenewing: boolean;
  priceCurrencyCode: string;
  priceAmountMicros: string;
  countryCode: string;
  developerPayload: string;
  paymentState: number;
  cancelReason?: number;
  userCancellationTimeMillis?: string;
  cancelSurveyResult?: any;
  orderId: string;
  linkedPurchaseToken?: string;
  purchaseType?: number;
  priceChange?: any;
  profileName?: string;
  emailAddress?: string;
  givenName?: string;
  familyName?: string;
  profileId?: string;
  acknowledgementState: number;
  externalAccountId?: string;
}

interface ProductPurchase {
  kind: string;
  purchaseTimeMillis: string;
  purchaseState: number;
  consumptionState: number;
  developerPayload: string;
  orderId: string;
  purchaseType?: number;
  acknowledgementState: number;
  purchaseToken?: string;
  productId?: string;
  quantity?: number;
  obfuscatedExternalAccountId?: string;
  obfuscatedExternalProfileId?: string;
  regionCode?: string;
}

class GooglePlayAPI {
  private auth: any;
  private androidpublisher: any;

  constructor() {
    this.initializeAuth();
  }

  private async initializeAuth() {
    try {
      // Configurar autenticación con service account
      this.auth = new google.auth.GoogleAuth({
        keyFile: GOOGLE_APPLICATION_CREDENTIALS,
        scopes: ['https://www.googleapis.com/auth/androidpublisher'],
      });

      this.androidpublisher = google.androidpublisher({
        version: 'v3',
        auth: this.auth,
      });

      console.log('Google Play API initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Google Play API:', error);
      throw error;
    }
  }

  /**
   * Verificar una suscripción con Google Play Developer API
   */
  async verifySubscription(
    subscriptionId: string,
    purchaseToken: string
  ): Promise<{
    isValid: boolean;
    isActive: boolean;
    expiryTime: number;
    autoRenewing: boolean;
    details?: SubscriptionPurchase;
    error?: string;
  }> {
    try {
      const response = await this.androidpublisher.purchases.subscriptions.get({
        packageName: PACKAGE_NAME,
        subscriptionId: subscriptionId,
        token: purchaseToken,
      });

      const subscription: SubscriptionPurchase = response.data;
      const now = Date.now();
      const expiryTime = parseInt(subscription.expiryTimeMillis);
      const isActive = expiryTime > now && subscription.paymentState === 1;

      return {
        isValid: true,
        isActive,
        expiryTime,
        autoRenewing: subscription.autoRenewing,
        details: subscription,
      };
    } catch (error: any) {
      console.error('Error verifying subscription:', error);
      
      if (error.code === 410) {
        // Suscripción no encontrada o expirada
        return {
          isValid: false,
          isActive: false,
          expiryTime: 0,
          autoRenewing: false,
          error: 'Subscription not found or expired',
        };
      }

      return {
        isValid: false,
        isActive: false,
        expiryTime: 0,
        autoRenewing: false,
        error: error.message || 'Unknown error',
      };
    }
  }

  /**
   * Verificar una compra de producto con Google Play Developer API
   */
  async verifyProductPurchase(
    productId: string,
    purchaseToken: string
  ): Promise<{
    isValid: boolean;
    isConsumed: boolean;
    purchaseTime: number;
    orderId: string;
    details?: ProductPurchase;
    error?: string;
  }> {
    try {
      const response = await this.androidpublisher.purchases.products.get({
        packageName: PACKAGE_NAME,
        productId: productId,
        token: purchaseToken,
      });

      const purchase: ProductPurchase = response.data;
      const isValid = purchase.purchaseState === 1; // 1 = Purchased
      const isConsumed = purchase.consumptionState === 1; // 1 = Consumed

      return {
        isValid,
        isConsumed,
        purchaseTime: parseInt(purchase.purchaseTimeMillis),
        orderId: purchase.orderId,
        details: purchase,
      };
    } catch (error: any) {
      console.error('Error verifying product purchase:', error);
      
      return {
        isValid: false,
        isConsumed: false,
        purchaseTime: 0,
        orderId: '',
        error: error.message || 'Unknown error',
      };
    }
  }

  /**
   * Acknowledgment de una suscripción
   */
  async acknowledgeSubscription(
    subscriptionId: string,
    purchaseToken: string,
    developerPayload?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await this.androidpublisher.purchases.subscriptions.acknowledge({
        packageName: PACKAGE_NAME,
        subscriptionId: subscriptionId,
        token: purchaseToken,
        requestBody: {
          developerPayload: developerPayload || '',
        },
      });

      return { success: true };
    } catch (error: any) {
      console.error('Error acknowledging subscription:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Acknowledgment de una compra de producto
   */
  async acknowledgeProductPurchase(
    productId: string,
    purchaseToken: string,
    developerPayload?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await this.androidpublisher.purchases.products.acknowledge({
        packageName: PACKAGE_NAME,
        productId: productId,
        token: purchaseToken,
        requestBody: {
          developerPayload: developerPayload || '',
        },
      });

      return { success: true };
    } catch (error: any) {
      console.error('Error acknowledging product purchase:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Cancelar una suscripción
   */
  async cancelSubscription(
    subscriptionId: string,
    purchaseToken: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await this.androidpublisher.purchases.subscriptions.cancel({
        packageName: PACKAGE_NAME,
        subscriptionId: subscriptionId,
        token: purchaseToken,
      });

      return { success: true };
    } catch (error: any) {
      console.error('Error canceling subscription:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Obtener todas las suscripciones de un usuario (requiere configuración adicional)
   */
  async getUserSubscriptions(userId: string): Promise<{
    subscriptions: SubscriptionPurchase[];
    error?: string;
  }> {
    // Esta funcionalidad requiere configuración adicional con Real-time Developer Notifications
    // Por ahora retornamos un placeholder
    return {
      subscriptions: [],
      error: 'Feature requires Real-time Developer Notifications setup',
    };
  }
}

export const googlePlayAPI = new GooglePlayAPI();
export type { SubscriptionPurchase, ProductPurchase };
