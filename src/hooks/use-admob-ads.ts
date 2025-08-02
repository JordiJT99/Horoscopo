
"use client";

import { useState, useEffect, useCallback } from 'react';
import { BannerAdPosition, AdMobRewardItem } from '@capacitor-community/admob';
import { AdMobService } from '@/lib/admob';

export function useAdMob() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize AdMob on mount
  useEffect(() => {
    const initializeAdMob = async () => {
      if (!AdMobService.isSupported()) {
        console.log('AdMob not supported on this platform');
        return;
      }
      try {
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
  const showBanner = useCallback(async (position: BannerAdPosition = BannerAdPosition.BOTTOM_CENTER) => {
    try {
      setError(null);
      await AdMobService.showBanner(position);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to show banner';
      setError(errorMsg);
      console.error('Banner error:', err);
      throw err;
    }
  }, []);

  const hideBanner = useCallback(async () => {
    try {
      setError(null);
      await AdMobService.hideBanner();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to hide banner';
      setError(errorMsg);
      console.error('Hide banner error:', err);
    }
  }, []);

  const showInterstitial = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);
      await AdMobService.showInterstitial();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to show interstitial';
      setError(errorMsg);
      console.error('Interstitial error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const showRewardedAd = useCallback(async (): Promise<AdMobRewardItem | null> => {
    try {
      setError(null);
      setIsLoading(true);
      const reward = await AdMobService.showRewardedAd();
      return reward;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to show rewarded ad';
      setError(errorMsg);
      console.error('Rewarded ad error:', err);
      throw err; // Re-throw so callers can handle the failure
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getAdInfo = useCallback(() => {
    return AdMobService.getAdModeInfo();
  }, []);

  return {
    isInitialized,
    isLoading,
    error,
    isSupported: AdMobService.isSupported(),

    showBanner,
    hideBanner,
    showInterstitial,
    showRewardedAd,

    getAdInfo,
    clearError: () => setError(null)
  };
}

export function useAutoShowBanner(position: BannerAdPosition) {
  const { isInitialized, isSupported, showBanner, hideBanner } = useAdMob();
  const [isBannerVisible, setIsBannerVisible] = useState(false);

  useEffect(() => {
    if (isInitialized && isSupported) {
      const showAdBanner = async () => {
        try {
          await showBanner(position);
          setIsBannerVisible(true);
        } catch (error) {
          console.error('Failed to auto-show banner:', error);
        }
      };
      
      showAdBanner();

      // Cleanup on component unmount
      return () => {
        hideBanner().catch(err => console.error("Failed to hide banner on unmount:", err));
      };
    }
  }, [isInitialized, isSupported, position, showBanner, hideBanner]);

  return { isBannerVisible };
}
