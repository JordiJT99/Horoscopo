import { useState, useEffect } from 'react';
import { GooglePlayBilling, type Product, type Subscription, type Purchase } from '@/plugins/billing';
import { useCapacitor } from './use-capacitor';
import { usePremiumSync } from './use-premium-sync';
import { toast } from './use-toast';

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

// IDs de productos y suscripciones de tu app
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

  const initialize = async () => {
    // Solo intentar conectar en plataformas móviles
    if (!isCapacitor) {
      console.log('Billing not available on web platform - using mock data');
      setIsInitialized(true);
      // En web, simular suscripciones para mostrar la interfaz
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
      return;
    }

    setIsLoading(true);
    try {
      const result = await GooglePlayBilling.initialize();
      if (result.success) {
        setIsInitialized(true);
        console.log('Google Play Billing initialized successfully');
        
        // Cargar productos y suscripciones automáticamente
        await Promise.all([
          loadProducts(Object.values(PRODUCT_IDS)),
          loadSubscriptions(Object.values(SUBSCRIPTION_IDS)),
          loadPurchases(),
          loadActiveSubscriptions()
        ]);
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
  };

  const loadProducts = async (productIds: string[]) => {
    if (!isInitialized) return;
    
    try {
      const result = await GooglePlayBilling.getProducts({ productIds });
      setProducts(result.products);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const loadSubscriptions = async (subscriptionIds: string[]) => {
    if (!isInitialized) return;
    
    try {
      const result = await GooglePlayBilling.getSubscriptions({ subscriptionIds });
      setSubscriptions(result.subscriptions);
    } catch (error) {
      console.error('Error loading subscriptions:', error);
    }
  };

  const purchaseProduct = async (productId: string): Promise<boolean> => {
    if (!isCapacitor) {
      toast({
        title: 'Función no disponible',
        description: 'Las compras solo están disponibles en la aplicación móvil',
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
      const result = await GooglePlayBilling.purchaseProduct({ productId });
      
      if (result.success && result.purchase) {
        // Verificar la compra con el servidor
        const verified = await verifyPurchase({
          purchaseToken: result.purchase.purchaseToken,
          productId: result.purchase.productId,
          originalJson: result.purchase.originalJson,
          signature: result.purchase.signature,
        });

        if (verified) {
          // Recargar compras locales
          await loadPurchases();
          return true;
        } else {
          toast({
            title: 'Error de Verificación',
            description: 'La compra no pudo ser verificada en el servidor',
            variant: 'destructive',
          });
          return false;
        }
      } else {
        if (result.message !== 'Purchase canceled by user') {
          toast({
            title: 'Error en la Compra',
            description: result.message || 'No se pudo completar la compra',
            variant: 'destructive',
          });
        }
        return false;
      }
    } catch (error) {
      console.error('Error purchasing product:', error);
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
      const result = await GooglePlayBilling.purchaseSubscription({ subscriptionId });
      
      if (result.success && result.purchase) {
        // Verificar la suscripción con el servidor
        const verified = await verifySubscription({
          purchaseToken: result.purchase.purchaseToken,
          subscriptionId: result.purchase.productId,
          originalJson: result.purchase.originalJson,
          signature: result.purchase.signature,
        });

        if (verified) {
          // Recargar suscripciones locales
          await loadActiveSubscriptions();
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
        if (result.message !== 'Purchase canceled by user') {
          toast({
            title: 'Error en la Suscripción',
            description: result.message || 'No se pudo activar la suscripción',
            variant: 'destructive',
          });
        }
        return false;
      }
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

  const loadPurchases = async () => {
    if (!isInitialized) return;
    
    try {
      const result = await GooglePlayBilling.getPurchases();
      setPurchases(result.purchases);
    } catch (error) {
      console.error('Error loading purchases:', error);
    }
  };

  const loadActiveSubscriptions = async () => {
    if (!isInitialized) return;
    
    try {
      const result = await GooglePlayBilling.getActiveSubscriptions();
      setActiveSubscriptions(result.subscriptions);
      setHasActiveSubscription(result.subscriptions.length > 0);
    } catch (error) {
      console.error('Error loading active subscriptions:', error);
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

  // Auto-inicializar cuando está en capacitor
  useEffect(() => {
    if (isCapacitor && !isInitialized && !isLoading) {
      initialize();
    }
  }, [isCapacitor, isInitialized, isLoading]);

  // Sincronizar el estado de suscripción con el servidor
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
