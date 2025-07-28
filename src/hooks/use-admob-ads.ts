import { useEffect, useState } from 'react';
import { AdMobService } from '@/lib/admob';
import { Capacitor } from '@capacitor/core';
import { BannerAdPosition } from '@capacitor-community/admob';

export const useAdMobAds = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isBannerVisible, setIsBannerVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Inicializar AdMob cuando se monta el componente
  useEffect(() => {
    const initializeAdMob = async () => {
      if (!Capacitor.isNativePlatform()) {
        console.log('AdMob: Not on native platform');
        return;
      }

      try {
        setIsLoading(true);
        await AdMobService.initialize();
        setIsInitialized(true);
        console.log('AdMob: Hook initialized successfully');
      } catch (error) {
        console.error('AdMob: Hook initialization failed', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAdMob();
  }, []);

  const showBanner = async (position: BannerAdPosition = BannerAdPosition.BOTTOM_CENTER) => {
    try {
      await AdMobService.showBanner(position);
      setIsBannerVisible(true);
    } catch (error) {
      console.error('AdMob: Failed to show banner in hook', error);
    }
  };

  const hideBanner = async () => {
    try {
      await AdMobService.hideBanner();
      setIsBannerVisible(false);
    } catch (error) {
      console.error('AdMob: Failed to hide banner in hook', error);
    }
  };

  const showInterstitial = async (): Promise<boolean> => {
    try {
      return await AdMobService.showInterstitial();
    } catch (error) {
      console.error('AdMob: Failed to show interstitial in hook', error);
      return false;
    }
  };

  const showRewardedAd = async (): Promise<boolean> => {
    try {
      return await AdMobService.showRewardedAd();
    } catch (error) {
      console.error('AdMob: Failed to show rewarded ad in hook', error);
      return false;
    }
  };

  return {
    isInitialized,
    isBannerVisible,
    isLoading,
    showBanner,
    hideBanner,
    showInterstitial,
    showRewardedAd,
  };
};

// Hook específico para mostrar banner automáticamente
export const useAutoShowBanner = (position: BannerAdPosition = BannerAdPosition.BOTTOM_CENTER) => {
  const { isInitialized, showBanner, hideBanner, isBannerVisible } = useAdMobAds();

  useEffect(() => {
    if (isInitialized && !isBannerVisible) {
      showBanner(position);
    }

    // Limpiar banner al desmontar
    return () => {
      if (isBannerVisible) {
        hideBanner();
      }
    };
  }, [isInitialized, position]);

  return { isBannerVisible, hideBanner };
};
