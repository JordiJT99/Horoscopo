
"use client";

import { useState, useEffect } from 'react';
import { BannerAdPosition } from '@capacitor-community/admob';
import { AdMobService } from '@/lib/admob';

export function useAdMob() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Inicializar AdMob al montar el hook
  useEffect(() => {
    const initializeAdMob = async () => {
      if (!AdMobService.isSupported()) {
        console.log('AdMob not supported on this platform');

        return;
      }

      try {
        setIsLoading(true);
        await AdMobService.initialize();
        setIsInitialized(true);

        console.log('AdMob initialized successfully via hook');
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to initialize AdMob';
        setError(errorMsg);
        console.error('AdMob initialization error:', err);

      } finally {
        setIsLoading(false);
      }
    };

    initializeAdMob();
  }, []);


  // Función para mostrar banner
  const showBanner = async (position: BannerAdPosition = BannerAdPosition.BOTTOM_CENTER) => {
    try {
      setError(null);
      await AdMobService.showBanner(position);
      console.log('Banner shown via hook');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to show banner';
      setError(errorMsg);
      console.error('Banner error:', err);
    }
  };

  // Función para ocultar banner
  const hideBanner = async () => {
    try {
      setError(null);
      await AdMobService.hideBanner();
      console.log('Banner hidden via hook');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to hide banner';
      setError(errorMsg);
      console.error('Hide banner error:', err);
    }
  };

  // Función para mostrar intersticial
  const showInterstitial = async () => {
    try {
      setError(null);
      setIsLoading(true);
      await AdMobService.showInterstitial();
      console.log('Interstitial shown via hook');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to show interstitial';
      setError(errorMsg);
      console.error('Interstitial error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para mostrar anuncio con recompensa
  const showRewardedAd = async () => {
    try {
      setError(null);
      setIsLoading(true);
      const reward = await AdMobService.showRewardedAd();
      console.log('Rewarded ad completed via hook:', reward);
      return reward;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to show rewarded ad';
      setError(errorMsg);
      console.error('Rewarded ad error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Obtener información del modo
  const getAdInfo = () => {
    return AdMobService.getAdModeInfo();
  };

  return {
    // Estado
    isInitialized,
    isLoading,
    error,
    isSupported: AdMobService.isSupported(),
    
    // Funciones

    showBanner,
    hideBanner,
    showInterstitial,
    showRewardedAd,

    getAdInfo,
    
    // Limpiar error manualmente
    clearError: () => setError(null)
  };
}

