// src/hooks/use-premium-sync.ts
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { toast } from './use-toast';

interface PremiumStatus {
  isActive: boolean;
  isPremium: boolean;
  expiryTime: number;
  autoRenewing: boolean;
  premiumType: 'premium' | 'vip';
  lastVerified: number;
}

interface PurchaseStatus {
  purchases: any[];
  hasRemovedAds: boolean;
  stardust: number;
}

interface UsePremiumSyncReturn {
  premiumStatus: PremiumStatus | null;
  purchaseStatus: PurchaseStatus | null;
  isLoading: boolean;
  isVerifying: boolean;
  verifySubscription: (purchaseData: any) => Promise<boolean>;
  verifyPurchase: (purchaseData: any) => Promise<boolean>;
  checkPremiumStatus: () => Promise<void>;
  checkPurchases: () => Promise<void>;
  syncAllData: () => Promise<void>;
}

export function usePremiumSync(): UsePremiumSyncReturn {
  const [premiumStatus, setPremiumStatus] = useState<PremiumStatus | null>(null);
  const [purchaseStatus, setPurchaseStatus] = useState<PurchaseStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  
  const { user } = useAuth();

  /**
   * Obtener token de autenticación para las APIs
   */
  const getAuthHeaders = useCallback(async () => {
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Usar directamente Firebase Auth para obtener el token
    const { auth } = await import('@/lib/firebase');
    if (!auth?.currentUser) {
      throw new Error('Firebase user not available');
    }
    
    const idToken = await auth.currentUser.getIdToken();
    return {
      'Authorization': `Bearer ${idToken}`,
      'Content-Type': 'application/json',
    };
  }, [user]);

  /**
   * Verificar una suscripción con el servidor
   */
  const verifySubscription = useCallback(async (purchaseData: {
    purchaseToken: string;
    subscriptionId: string;
    originalJson: string;
    signature: string;
  }): Promise<boolean> => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'Usuario no autenticado',
        variant: 'destructive',
      });
      return false;
    }

    setIsVerifying(true);
    try {
      const headers = await getAuthHeaders();
      
      const response = await fetch('/api/billing/verify-subscription', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          ...purchaseData,
          userId: user.uid,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setPremiumStatus({
          isActive: result.isActive,
          isPremium: result.isActive,
          expiryTime: result.expiryTime,
          autoRenewing: result.autoRenewing,
          premiumType: purchaseData.subscriptionId.includes('vip') ? 'vip' : 'premium',
          lastVerified: Date.now(),
        });

        if (result.isActive) {
          toast({
            title: 'Suscripción Verificada',
            description: 'Tu suscripción premium está activa',
          });
        } else {
          toast({
            title: 'Suscripción Inactiva',
            description: 'Tu suscripción ha expirado o fue cancelada',
            variant: 'destructive',
          });
        }

        return result.isActive;
      } else {
        toast({
          title: 'Error de Verificación',
          description: result.error || 'No se pudo verificar la suscripción',
          variant: 'destructive',
        });
        return false;
      }
    } catch (error) {
      console.error('Error verifying subscription:', error);
      toast({
        title: 'Error de Conexión',
        description: 'No se pudo conectar con el servidor',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsVerifying(false);
    }
  }, [user, getAuthHeaders]);

  /**
   * Verificar una compra con el servidor
   */
  const verifyPurchase = useCallback(async (purchaseData: {
    purchaseToken: string;
    productId: string;
    originalJson: string;
    signature: string;
  }): Promise<boolean> => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'Usuario no autenticado',
        variant: 'destructive',
      });
      return false;
    }

    setIsVerifying(true);
    try {
      const headers = await getAuthHeaders();
      
      const response = await fetch('/api/billing/verify-purchase', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          ...purchaseData,
          userId: user.uid,
        }),
      });

      const result = await response.json();

      if (result.success && result.isValid) {
        toast({
          title: 'Compra Verificada',
          description: 'Tu compra se ha procesado correctamente',
        });

        // Recargar el estado de compras
        await checkPurchases();
        return true;
      } else {
        toast({
          title: 'Error de Verificación',
          description: result.error || 'No se pudo verificar la compra',
          variant: 'destructive',
        });
        return false;
      }
    } catch (error) {
      console.error('Error verifying purchase:', error);
      toast({
        title: 'Error de Conexión',
        description: 'No se pudo conectar con el servidor',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsVerifying(false);
    }
  }, [user, getAuthHeaders]);

  /**
   * Verificar el estado premium actual del usuario
   */
  const checkPremiumStatus = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const headers = await getAuthHeaders();
      
      const response = await fetch(
        `/api/billing/verify-subscription?userId=${user.uid}`,
        { headers }
      );

      const result = await response.json();

      if (result.success) {
        setPremiumStatus({
          isActive: result.isActive,
          isPremium: result.isPremium,
          expiryTime: result.expiryTime || 0,
          autoRenewing: result.autoRenewing || false,
          premiumType: result.premiumType || 'premium',
          lastVerified: result.lastVerified || Date.now(),
        });
      }
    } catch (error) {
      console.error('Error checking premium status:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user, getAuthHeaders]);

  /**
   * Verificar las compras del usuario
   */
  const checkPurchases = useCallback(async () => {
    if (!user) return;

    try {
      const headers = await getAuthHeaders();
      
      const response = await fetch(
        `/api/billing/verify-purchase?userId=${user.uid}`,
        { headers }
      );

      const result = await response.json();

      if (result.success) {
        setPurchaseStatus({
          purchases: result.purchases || [],
          hasRemovedAds: result.hasRemovedAds || false,
          stardust: result.stardust || 0,
        });
      }
    } catch (error) {
      console.error('Error checking purchases:', error);
    }
  }, [user, getAuthHeaders]);

  /**
   * Sincronizar todos los datos
   */
  const syncAllData = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      await Promise.all([
        checkPremiumStatus(),
        checkPurchases(),
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [checkPremiumStatus, checkPurchases, user]);

  // Auto-sincronizar cuando el usuario cambia
  useEffect(() => {
    if (user) {
      syncAllData();
    } else {
      setPremiumStatus(null);
      setPurchaseStatus(null);
    }
  }, [user, syncAllData]);

  // Sincronizar periódicamente (cada 30 minutos)
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      syncAllData();
    }, 30 * 60 * 1000); // 30 minutos

    return () => clearInterval(interval);
  }, [user, syncAllData]);

  return {
    premiumStatus,
    purchaseStatus,
    isLoading,
    isVerifying,
    verifySubscription,
    verifyPurchase,
    checkPremiumStatus,
    checkPurchases,
    syncAllData,
  };
}
