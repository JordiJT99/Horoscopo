import { useEffect, useRef, useCallback } from 'react';
import { useAdMob } from '@/lib/admob';

interface UseInterstitialAdOptions {
  onAdShown?: () => void;
  onAdClosed?: () => void;
  onAdFailedToShow?: (error: any) => void;
  autoLoad?: boolean;
}

export const useInterstitialAd = (options: UseInterstitialAdOptions = {}) => {
  const { 
    onAdShown, 
    onAdClosed, 
    onAdFailedToShow, 
    autoLoad = true 
  } = options;
  
  const { 
    loadInterstitial, 
    showInterstitial, 
    isInterstitialReady, 
    isAvailable 
  } = useAdMob();
  
  const loadingRef = useRef(false);
  const lastLoadTime = useRef(0);
  const MIN_LOAD_INTERVAL = 30000; // 30 segundos entre cargas

  // Cargar anuncio intersticial
  const loadAd = useCallback(async () => {
    if (!isAvailable() || loadingRef.current) {
      return false;
    }

    const now = Date.now();
    if (now - lastLoadTime.current < MIN_LOAD_INTERVAL) {
      return false;
    }

    try {
      loadingRef.current = true;
      await loadInterstitial();
      lastLoadTime.current = now;
      return true;
    } catch (error) {
      console.error('Error loading interstitial ad:', error);
      return false;
    } finally {
      loadingRef.current = false;
    }
  }, [loadInterstitial, isAvailable]);

  // Mostrar anuncio intersticial
  const showAd = useCallback(async () => {
    if (!isAvailable() || !isInterstitialReady()) {
      console.log('Interstitial ad not ready or not available');
      return false;
    }

    try {
      onAdShown?.();
      const success = await showInterstitial();
      
      if (success) {
        onAdClosed?.();
        // Auto-cargar el siguiente anuncio si está habilitado
        if (autoLoad) {
          setTimeout(loadAd, 2000);
        }
      }
      
      return success;
    } catch (error) {
      console.error('Error showing interstitial ad:', error);
      onAdFailedToShow?.(error);
      return false;
    }
  }, [showInterstitial, isInterstitialReady, isAvailable, onAdShown, onAdClosed, onAdFailedToShow, autoLoad, loadAd]);

  // Cargar automáticamente al montar el componente
  useEffect(() => {
    if (autoLoad && isAvailable()) {
      loadAd();
    }
  }, [loadAd, autoLoad, isAvailable]);

  return {
    showAd,
    loadAd,
    isReady: isInterstitialReady(),
    isAvailable: isAvailable(),
  };
};

interface UseRewardedAdOptions {
  onAdShown?: () => void;
  onRewardEarned?: (reward: any) => void;
  onAdClosed?: () => void;
  onAdFailedToShow?: (error: any) => void;
  autoLoad?: boolean;
}

export const useRewardedAd = (options: UseRewardedAdOptions = {}) => {
  const { 
    onAdShown, 
    onRewardEarned, 
    onAdClosed, 
    onAdFailedToShow, 
    autoLoad = true 
  } = options;
  
  const { 
    loadRewarded, 
    showRewarded, 
    isRewardedReady, 
    isAvailable 
  } = useAdMob();
  
  const loadingRef = useRef(false);
  const lastLoadTime = useRef(0);
  const MIN_LOAD_INTERVAL = 30000; // 30 segundos entre cargas

  // Cargar anuncio de recompensa
  const loadAd = useCallback(async () => {
    if (!isAvailable() || loadingRef.current) {
      return false;
    }

    const now = Date.now();
    if (now - lastLoadTime.current < MIN_LOAD_INTERVAL) {
      return false;
    }

    try {
      loadingRef.current = true;
      await loadRewarded();
      lastLoadTime.current = now;
      return true;
    } catch (error) {
      console.error('Error loading rewarded ad:', error);
      return false;
    } finally {
      loadingRef.current = false;
    }
  }, [loadRewarded, isAvailable]);

  // Mostrar anuncio de recompensa
  const showAd = useCallback(async () => {
    if (!isAvailable() || !isRewardedReady()) {
      console.log('Rewarded ad not ready or not available');
      return { success: false, watched: false };
    }

    try {
      onAdShown?.();
      const result = await showRewarded();
      
      if (result.watched) {
        onRewardEarned?.(result.reward);
      }
      
      onAdClosed?.();
      
      // Auto-cargar el siguiente anuncio si está habilitado
      if (autoLoad) {
        setTimeout(loadAd, 2000);
      }
      
      return { success: true, watched: result.watched, reward: result.reward };
    } catch (error) {
      console.error('Error showing rewarded ad:', error);
      onAdFailedToShow?.(error);
      return { success: false, watched: false };
    }
  }, [showRewarded, isRewardedReady, isAvailable, onAdShown, onRewardEarned, onAdClosed, onAdFailedToShow, autoLoad, loadAd]);

  // Cargar automáticamente al montar el componente
  useEffect(() => {
    if (autoLoad && isAvailable()) {
      loadAd();
    }
  }, [loadAd, autoLoad, isAvailable]);

  return {
    showAd,
    loadAd,
    isReady: isRewardedReady(),
    isAvailable: isAvailable(),
  };
};
