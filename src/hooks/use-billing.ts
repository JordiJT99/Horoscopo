

import { useState, useEffect, useCallback } from 'react';
import { GooglePlayBilling, type Product, type Subscription, type Purchase } from '@/plugins/billing';
import { useCapacitor } from './use-capacitor';
import { usePremiumSync } from './use-premium-sync';
import { toast } from './use-toast';
import { Capacitor } from '@capacitor/core';

interface UseBillingReturn {
  isInitialized: boolean;
  isLoading: boolean;
  products: Product[];
  subscriptions: Subscription[];
  purchases: Purchase[];
  activeSubscriptions: Purchase[];
  hasActiveSubscription: boolean;
  initialize: () => Promise<void>;
  loadProducts: (productIds: string[]) => Promise<void>;
  loadSubscriptions: (subscriptionIds: string[]) => Promise<void>;
  purchaseProduct: (productId: string) => Promise<boolean>;
  purchaseSubscription: (subscriptionId: string) => Promise<boolean>;
  loadPurchases: () => Promise<void>;
  loadActiveSubscriptions: () => Promise<void>;
  checkActiveSubscription: (subscriptionId?: string) => Promise<boolean>;
  disconnect: () => Promise<void>;
}

// IDs de productos y suscripciones de tu app (deben coincidir exactamente con Google Play Console)
export const SUBSCRIPTION_IDS = {
  PREMIUM_MONTHLY: 'astromistica_premium_monthly',
  PREMIUM_YEARLY: 'astromistica_premium_yearly',
  VIP_MONTHLY: 'astromistica_vip_monthly',
  VIP_YEARLY: 'astromistica_vip_yearly',
} as const;

export const PRODUCT_IDS = {
  STARDUST_SMALL: 'stardust_pack_small',
  STARDUST_MEDIUM: 'stardust_pack_medium',
  STARDUST_LARGE: 'stardust_pack_large',
  REMOVE_ADS: 'remove_ads_forever',
} as const;

export function useBilling(): UseBillingReturn {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [activeSubscriptions, setActiveSubscriptions] = useState<Purchase[]>([]);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  
  const { isCapacitor } = useCapacitor();
  const { verifySubscription, verifyPurchase, premiumStatus } = usePremiumSync();

  const loadProducts = useCallback(async (productIds: string[]) => {
    if (!isInitialized) {
      console.log('[BILLING] Billing not initialized, skipping loadProducts');
      return;
    }
    try {
      const result = await GooglePlayBilling.getProducts({ productIds });
      setProducts(result.products);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  }, [isInitialized]);

  const loadSubscriptions = useCallback(async (subscriptionIds: string[]) => {
    if (!isInitialized) {
      console.log('[BILLING] Billing not initialized, skipping loadSubscriptions');
      return;
    }
    try {
      const result = await GooglePlayBilling.getSubscriptions({ subscriptionIds });
      setSubscriptions(result.subscriptions);
    } catch (error) {
      console.error('[BILLING] Error loading subscriptions:', error);
    }
  }, [isInitialized]);
  
  const loadPurchases = useCallback(async () => {
    if (!isInitialized) return;
    try {
      const result = await GooglePlayBilling.getPurchases();
      setPurchases(result.purchases);
    } catch (error) {
      console.error('Error loading purchases:', error);
    }
  }, [isInitialized]);

  const loadActiveSubscriptions = useCallback(async () => {
    if (!isInitialized) return;
    try {
      const result = await GooglePlayBilling.getActiveSubscriptions();
      const subs = (result as any).activeSubscriptions || [];
      setActiveSubscriptions(subs);
      setHasActiveSubscription(subs.length > 0);
    } catch (error) {
      console.error('Error loading active subscriptions:', error);
    }
  }, [isInitialized]);


  const initialize = useCallback(async () => {
    console.log('[BILLING] Iniciando inicialización...');
    console.log('[BILLING] isCapacitor:', isCapacitor);
    
    if (!isCapacitor) {
      console.log('Billing not available on web platform - using mock data');
      const mockSubscriptions = Object.values(SUBSCRIPTION_IDS).map(id => ({
        subscriptionId: id,
        title: id === SUBSCRIPTION_IDS.PREMIUM_MONTHLY ? 'Suscripción Premium Mensual' : 'Suscripción Premium Anual',
        description: id === SUBSCRIPTION_IDS.PREMIUM_MONTHLY ? 'Acceso completo por 1 mes' : 'Acceso completo por 1 año',
        price: id === SUBSCRIPTION_IDS.PREMIUM_MONTHLY ? '€4,99' : '€49,99',
        priceAmountMicros: id === SUBSCRIPTION_IDS.PREMIUM_MONTHLY ? 4990000 : 49990000,
        priceCurrencyCode: 'EUR',
        billingPeriod: id === SUBSCRIPTION_IDS.PREMIUM_MONTHLY ? 'P1M' : 'P1Y',
        freeTrialPeriod: 'P7D'
      }));
      setSubscriptions(mockSubscriptions);
      setIsInitialized(true); // Set initialized for web mock
      return;
    }

    setIsLoading(true);
    try {
      console.log('[BILLING] Intentando conectar con Google Play Billing...');
      const result = await GooglePlayBilling.initialize();
      console.log('[BILLING] Resultado de inicialización:', result);
      
      if (result.success) {
        setIsInitialized(true);
        console.log('Google Play Billing initialized successfully');
      } else {
        console.error('Failed to initialize billing:', result.message);
        toast({
          title: 'Error de Facturación',
          description: 'No se pudo inicializar el sistema de pagos',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error initializing billing:', error);
      toast({
        title: 'Error de Facturación',
        description: 'Error al conectar con Google Play',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [isCapacitor]);

  // useEffect to load data once initialization is complete.
  useEffect(() => {
    if (isInitialized && isCapacitor) {
      console.log('[BILLING] Initialized. Loading products and subscriptions...');
      Promise.all([
        loadProducts(Object.values(PRODUCT_IDS)),
        loadSubscriptions(Object.values(SUBSCRIPTION_IDS)),
        loadPurchases(),
        loadActiveSubscriptions()
      ]);
    }
  }, [isInitialized, isCapacitor, loadProducts, loadSubscriptions, loadPurchases, loadActiveSubscriptions]);


  const purchaseProduct = async (productId: string): Promise<boolean> => {
    console.log('[BILLING] purchaseProduct called with productId:', productId);
    
    if (!isCapacitor) {
      console.log('[BILLING] Not on Capacitor platform');
      toast({
        title: 'Función no disponible',
        description: 'Las compras solo están disponibles en la aplicación móvil',
        variant: 'destructive',
      });
      return false;
    }

    if (!isInitialized) {
      console.log('[BILLING] Billing not initialized');
      toast({
        title: 'Error',
        description: 'Sistema de pagos no inicializado',
        variant: 'destructive',
      });
      return false;
    }

    setIsLoading(true);
    try {
      console.log('[BILLING] Calling GooglePlayBilling.purchaseProduct...');
      const result = await GooglePlayBilling.purchaseProduct({ productId });
      
      console.log('[BILLING] purchaseProduct result:', {
        success: result.success,
        hasPurchase: !!result.purchase,
        message: result.message
      });
      
      // Si la compra se inició pero no tenemos el objeto purchase aún
      if (result.success && !result.purchase) {
        console.log('[BILLING] Purchase flow started, waiting for completion...');
        
        // Hacer polling durante 3 minutos (180 segundos)
        const maxAttempts = 36; // 36 intentos x 5 segundos = 180 segundos (3 minutos)
        const pollInterval = 5000; // 5 segundos entre intentos
        let attempts = 0;
        let newPurchase = null;
        
        while (attempts < maxAttempts && !newPurchase) {
          attempts++;
          console.log(`[BILLING] Polling attempt ${attempts}/${maxAttempts}...`);
          
          // Esperar antes de consultar
          await new Promise(resolve => setTimeout(resolve, pollInterval));
          
          // Consultar las compras
          const purchasesResult = await GooglePlayBilling.getPurchases();
          console.log('[BILLING] Found purchases:', purchasesResult.purchases.length);
          
          // Buscar la compra del producto que acabamos de intentar comprar
          newPurchase = purchasesResult.purchases.find(p => p.productId === productId);
          
          if (newPurchase) {
            console.log(`[BILLING] Purchase found after ${attempts} attempts!`);
            break;
          }
        }
        
        if (newPurchase) {
          console.log('[BILLING] New purchase found:', {
            purchaseToken: newPurchase.purchaseToken?.substring(0, 20) + '...',
            productId: newPurchase.productId,
            purchaseTime: new Date(newPurchase.purchaseTime).toISOString()
          });
          
          console.log('[BILLING] Full purchase object:', newPurchase);
          console.log('[BILLING] Purchase fields check:', {
            hasPurchaseToken: !!newPurchase.purchaseToken,
            hasProductId: !!newPurchase.productId,
            hasOriginalJson: !!newPurchase.originalJson,
            hasSignature: !!newPurchase.signature,
          });
          
          console.log('[BILLING] Verifying purchase with server...');
          const verified = await verifyPurchase({
            purchaseToken: newPurchase.purchaseToken,
            productId: newPurchase.productId,
            originalJson: newPurchase.originalJson,
            signature: newPurchase.signature,
          });

          console.log('[BILLING] Verification result:', verified);

          if (verified) {
            console.log('[BILLING] Purchase verified successfully');
            
            // Consumir el producto para permitir futuras compras
            try {
              console.log('[BILLING] Consuming purchase...');
              const consumeResult = await GooglePlayBilling.consumePurchase({ 
                purchaseToken: newPurchase.purchaseToken 
              });
              console.log('[BILLING] Consume result:', consumeResult);
              
              if (consumeResult.success) {
                console.log('[BILLING] Purchase consumed successfully');
              } else {
                console.warn('[BILLING] Failed to consume purchase:', consumeResult.message);
              }
            } catch (consumeError) {
              console.error('[BILLING] Error consuming purchase:', consumeError);
              // No bloquear si falla el consumo, la compra ya está verificada
            }
            
            console.log('[BILLING] Reloading purchases...');
            await loadPurchases();
            
            toast({
              title: 'Compra Exitosa',
              description: 'Tu compra ha sido procesada correctamente',
            });
            setIsLoading(false);
            return true;
          } else {
            console.error('[BILLING] Purchase verification failed');
            toast({
              title: 'Error de Verificación',
              description: 'La compra no pudo ser verificada en el servidor',
              variant: 'destructive',
            });
            setIsLoading(false);
            return false;
          }
        } else {
          console.log(`[BILLING] No purchase found after ${attempts} attempts (${attempts * 5} seconds)`);
          console.log('[BILLING] Purchase may have been cancelled or there was an error');
          toast({
            title: 'Compra No Completada',
            description: 'La compra no se completó. Si el cargo se realizó, se reembolsará automáticamente.',
            variant: 'destructive',
          });
          setIsLoading(false);
          return false;
        }
      }
      
      // Si ya tenemos el purchase en la respuesta (caso original)
      if (result.success && result.purchase) {
        console.log('[BILLING] Purchase received immediately:', {
          purchaseToken: result.purchase.purchaseToken?.substring(0, 20) + '...',
          productId: result.purchase.productId,
          hasOriginalJson: !!result.purchase.originalJson,
          hasSignature: !!result.purchase.signature
        });
        
        console.log('[BILLING] Verifying purchase with server...');
        const verified = await verifyPurchase({
          purchaseToken: result.purchase.purchaseToken,
          productId: result.purchase.productId,
          originalJson: result.purchase.originalJson,
          signature: result.purchase.signature,
        });

        console.log('[BILLING] Verification result:', verified);

        if (verified) {
          console.log('[BILLING] Purchase verified successfully, reloading purchases...');
          await loadPurchases();
          toast({
            title: 'Compra Exitosa',
            description: 'Tu compra ha sido procesada correctamente',
          });
          return true;
        } else {
          console.error('[BILLING] Purchase verification failed');
          toast({
            title: 'Error de Verificación',
            description: 'La compra no pudo ser verificada en el servidor',
            variant: 'destructive',
          });
          return false;
        }
      } else {
        console.log('[BILLING] Purchase flow did not succeed');
        if (result.message && !result.message.includes('canceled') && !result.message.includes('cancelled')) {
          toast({
            title: 'Error en la Compra',
            description: result.message || 'No se pudo completar la compra',
            variant: 'destructive',
          });
        }
        return false;
      }
    } catch (error) {
      console.error('[BILLING] Error purchasing product:', error);
      toast({
        title: 'Error en la Compra',
        description: 'Ocurrió un error durante la compra',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const purchaseSubscription = async (subscriptionId: string): Promise<boolean> => {
    if (!isCapacitor) {
      toast({
        title: 'Función no disponible',
        description: 'Las suscripciones solo están disponibles en la aplicación móvil. Descarga la app desde Google Play Store.',
        variant: 'destructive',
      });
      return false;
    }

    if (!isInitialized) {
      toast({
        title: 'Error',
        description: 'Sistema de pagos no inicializado',
        variant: 'destructive',
      });
      return false;
    }

    setIsLoading(true);
    try {
      console.log('[BILLING] Starting purchaseSubscription for:', subscriptionId);
      
      // Obtener compras existentes antes del flujo
      const existingPurchases = await GooglePlayBilling.getActiveSubscriptions();
      const existingTokens = new Set(
        (existingPurchases.subscriptions || []).map((p: any) => p.purchaseToken)
      );
      
      console.log('[BILLING] Existing purchases before flow:', existingTokens.size);
      
      // Iniciar el flujo de compra
      const result = await GooglePlayBilling.purchaseSubscription({ subscriptionId });
      
      console.log('[BILLING] purchaseSubscription result:', {
        success: result.success,
        hasPurchase: !!result.purchase,
        message: result.message,
      });
      
      if (!result.success) {
        console.log('[BILLING] Purchase flow failed to start:', result.message);
        if (result.message && !result.message.includes('canceled') && !result.message.includes('cancelled')) {
          toast({
            title: 'Error en la Suscripción',
            description: result.message || 'No se pudo iniciar el proceso de suscripción',
            variant: 'destructive',
          });
        }
        return false;
      }

      // Si el resultado inmediato incluye una compra, procesarla
      if (result.purchase) {
        console.log('[BILLING] Immediate purchase received:', result.purchase);
        return await processPurchase(result.purchase, 'subscription');
      }

      // Si no hay compra inmediata, esperar y buscar nuevas compras
      console.log('[BILLING] No immediate purchase, waiting for completion...');
      
      // Esperar un poco para que el usuario complete la compra
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Verificar si hay nuevas compras
      for (let attempt = 0; attempt < 10; attempt++) {
        console.log(`[BILLING] Checking for new purchases (attempt ${attempt + 1}/10)...`);
        
        const currentPurchases = await GooglePlayBilling.getActiveSubscriptions();
        const currentTokens = (currentPurchases.subscriptions || []).map((p: any) => p.purchaseToken);
        
        // Buscar compras nuevas
        const newPurchases = (currentPurchases.subscriptions || []).filter((p: any) => 
          !existingTokens.has(p.purchaseToken) && p.productId === subscriptionId
        );
        
        if (newPurchases.length > 0) {
          console.log('[BILLING] Found new purchase:', newPurchases[0]);
          return await processPurchase(newPurchases[0], 'subscription');
        }
        
        // Esperar antes del siguiente intento
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      console.log('[BILLING] No new purchases found after timeout');
      return false;
      
    } catch (error) {
      console.error('Error purchasing subscription:', error);
      toast({
        title: 'Error en la Suscripción',
        description: 'Ocurrió un error durante la suscripción',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Función auxiliar para procesar una compra
  const processPurchase = async (purchase: any, type: 'subscription' | 'product'): Promise<boolean> => {
    console.log(`[BILLING] Processing ${type}:`, purchase);
    
    try {
      if (type === 'subscription') {
        const verified = await verifySubscription({
          purchaseToken: purchase.purchaseToken,
          subscriptionId: purchase.productId,
          originalJson: purchase.originalJson,
          signature: purchase.signature,
        });

        console.log('[BILLING] Subscription verification result:', verified);

        if (verified) {
          await loadActiveSubscriptions();
          toast({
            title: 'Suscripción Activada',
            description: '¡Tu suscripción premium ha sido activada exitosamente!',
            variant: 'default',
          });
          return true;
        } else {
          toast({
            title: 'Error de Verificación',
            description: 'La suscripción no pudo ser verificada en el servidor',
            variant: 'destructive',
          });
          return false;
        }
      } else {
        const verified = await verifyPurchase({
          purchaseToken: purchase.purchaseToken,
          productId: purchase.productId,
          originalJson: purchase.originalJson,
          signature: purchase.signature,
        });

        if (verified) {
          await loadPurchases();
          return true;
        } else {
          return false;
        }
      }
    } catch (error) {
      console.error(`[BILLING] Error processing ${type}:`, error);
      return false;
    }
  };

  const checkActiveSubscription = async (subscriptionId?: string): Promise<boolean> => {
    if (!isInitialized) return false;
    
    try {
      const result = await GooglePlayBilling.hasActiveSubscription({ subscriptionId });
      setHasActiveSubscription(result.hasSubscription);
      return result.hasSubscription;
    } catch (error) {
      console.error('Error checking active subscription:', error);
      return false;
    }
  };

  const disconnect = async () => {
    try {
      await GooglePlayBilling.disconnect();
      setIsInitialized(false);
      setProducts([]);
      setSubscriptions([]);
      setPurchases([]);
      setActiveSubscriptions([]);
      setHasActiveSubscription(false);
    } catch (error) {
      console.error('Error disconnecting billing:', error);
    }
  };

  useEffect(() => {
    if (isCapacitor && !isInitialized && !isLoading) {
      initialize();
    }
  }, [isCapacitor, isInitialized, isLoading, initialize]);

  useEffect(() => {
    if (premiumStatus) {
      setHasActiveSubscription(premiumStatus.isActive);
    }
  }, [premiumStatus]);

  return {
    isInitialized,
    isLoading,
    products,
    subscriptions,
    purchases,
    activeSubscriptions,
    hasActiveSubscription: premiumStatus?.isActive || hasActiveSubscription,
    initialize,
    loadProducts,
    loadSubscriptions,
    purchaseProduct,
    purchaseSubscription,
    loadPurchases,
    loadActiveSubscriptions,
    checkActiveSubscription,
    disconnect,
  };
}
