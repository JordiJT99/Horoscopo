import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCosmicEnergy } from './use-cosmic-energy';
import { usePremiumSync } from './use-premium-sync';

export interface PremiumFeatures {
  natalChart: boolean;
  tomorrowHoroscope: boolean;
  dailyStardust: boolean;
  noAds: boolean;
}

export interface UsePremiumReturn {
  isPremium: boolean;
  premiumFeatures: PremiumFeatures;
  checkDailyLogin: () => Promise<void>;
  loading: boolean;
  togglePremiumForTesting: () => void; // Función para pruebas
}

export function usePremium(): UsePremiumReturn {
  const { user } = useAuth();
  const { awardPremiumDailyBonus } = useCosmicEnergy();
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  // Use server-verified premium status when available
  const { premiumStatus, isLoading: syncLoading } = usePremiumSync();

  // Lógica premium: prefer server-verified premium status; fallback to false when unknown
  useEffect(() => {
    if (premiumStatus && typeof premiumStatus.isPremium !== 'undefined') {
      setIsPremium(!!premiumStatus.isPremium);
    } else if (user) {
      // If there's a logged user but no premiumStatus yet, keep false until verification
      setIsPremium(false);
    } else {
      setIsPremium(false);
    }
    setLoading(syncLoading ? true : false);
  }, [user, premiumStatus, syncLoading]);

  const premiumFeatures: PremiumFeatures = {
    natalChart: isPremium,
    tomorrowHoroscope: isPremium,
    dailyStardust: isPremium,
    noAds: isPremium,
  };

  const checkDailyLogin = useCallback(async () => {
    if (!user || !isPremium) return;

    try {
      // Otorgar 2 polvos estelares por login diario premium
      const awarded = await awardPremiumDailyBonus();
      
      if (awarded) {
        console.log('✨ Premium daily login bonus: 2 stardust awarded');
      }
    } catch (error) {
      console.error('Error al otorgar bonus diario premium:', error);
    }
  }, [user, isPremium, awardPremiumDailyBonus]);

  // Función para cambiar el estado premium durante las pruebas
  const togglePremiumForTesting = useCallback(() => {
    setIsPremium(prev => !prev);
    console.log(`🔄 Premium status toggled to: ${!isPremium}`);
  }, [isPremium]);

  return {
    isPremium,
    premiumFeatures,
    checkDailyLogin,
    loading,
    togglePremiumForTesting,
  };
}
