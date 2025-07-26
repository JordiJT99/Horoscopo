import { AdMob, BannerAdOptions, BannerAdSize, BannerAdPosition, RewardInterstitialAdOptions, RewardAdOptions, AdmobConsentStatus, AdmobConsentDebugGeography } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

// Detectar si estamos en modo desarrollo
const __DEV__ = process.env.NODE_ENV === 'development';

// IDs de AdMob - Usando tu App ID real
export const ADMOB_CONFIG = {
  appId: __DEV__ || !Capacitor.isNativePlatform()
    ? 'ca-app-pub-3940256099942544~3347511713' // Test App ID
    : 'ca-app-pub-1601092077557933~3273742971', // Tu App ID real

  bannerAdUnitId: __DEV__ || !Capacitor.isNativePlatform()
    ? 'ca-app-pub-3940256099942544/6300978111' // Test Banner ID
    : 'ca-app-pub-1601092077557933/1500472200', // Reemplaza con tu Banner ID real

  interstitialAdUnitId: __DEV__ || !Capacitor.isNativePlatform()
    ? 'ca-app-pub-3940256099942544/1033173712' // Test Interstitial ID
    : 'ca-app-pub-1601092077557933/7954199917', // Reemplaza con tu Interstitial ID real

  rewardedAdUnitId: __DEV__ || !Capacitor.isNativePlatform()
    ? 'ca-app-pub-3940256099942544/5224354917' // Test Rewarded ID
    : 'ca-app-pub-1601092077557933/9187390537', // Reemplaza con tu Rewarded ID real
};

// Clase para manejar AdMob
export class AdMobManager {
  private static instance: AdMobManager;
  private isInitialized = false;
  private bannerVisible = false;
  private interstitialLoaded = false;
  private rewardedLoaded = false;

  private constructor() {}

  static getInstance(): AdMobManager {
    if (!AdMobManager.instance) {
      AdMobManager.instance = new AdMobManager();
    }
    return AdMobManager.instance;
  }

  // Inicializar AdMob
  async initialize(): Promise<void> {
    if (this.isInitialized || !Capacitor.isNativePlatform()) {
      return;
    }

    try {
      await AdMob.initialize({
        testingDevices: __DEV__ ? ['YOUR_TESTING_DEVICE_ID'] : [],
        initializeForTesting: __DEV__,
      });

      // Solicitar consentimiento para GDPR (Europa)
      const consentInfo = await AdMob.requestConsentInfo();
      
      if (consentInfo.isConsentFormAvailable && consentInfo.status === AdmobConsentStatus.REQUIRED) {
        await AdMob.showConsentForm();
      }

      this.isInitialized = true;
      console.log('AdMob initialized successfully');
    } catch (error) {
      console.error('Error initializing AdMob:', error);
      throw error;
    }
  }

  // Mostrar banner
  async showBanner(position: BannerAdPosition = BannerAdPosition.BOTTOM_CENTER): Promise<void> {
    if (!this.isInitialized || this.bannerVisible || !Capacitor.isNativePlatform()) {
      return;
    }

    try {
      const options: BannerAdOptions = {
        adId: ADMOB_CONFIG.bannerAdUnitId,
        adSize: BannerAdSize.ADAPTIVE_BANNER,
        position: position,
        margin: 0,
        isTesting: __DEV__,
      };

      await AdMob.showBanner(options);
      this.bannerVisible = true;
      console.log('Banner ad shown');
    } catch (error) {
      console.error('Error showing banner:', error);
    }
  }

  // Ocultar banner
  async hideBanner(): Promise<void> {
    if (!this.bannerVisible || !Capacitor.isNativePlatform()) {
      return;
    }

    try {
      await AdMob.hideBanner();
      this.bannerVisible = false;
      console.log('Banner ad hidden');
    } catch (error) {
      console.error('Error hiding banner:', error);
    }
  }

  // Cargar anuncio intersticial
  async loadInterstitial(): Promise<void> {
    if (!this.isInitialized || !Capacitor.isNativePlatform()) {
      return;
    }

    try {
      const options: RewardInterstitialAdOptions = {
        adId: ADMOB_CONFIG.interstitialAdUnitId,
        isTesting: __DEV__,
      };

      await AdMob.prepareInterstitial(options);
      this.interstitialLoaded = true;
      console.log('Interstitial ad loaded');
    } catch (error) {
      console.error('Error loading interstitial:', error);
    }
  }

  // Mostrar anuncio intersticial
  async showInterstitial(): Promise<boolean> {
    if (!this.interstitialLoaded || !Capacitor.isNativePlatform()) {
      return false;
    }

    try {
      await AdMob.showInterstitial();
      this.interstitialLoaded = false;
      console.log('Interstitial ad shown');
      
      // Cargar el siguiente anuncio
      setTimeout(() => this.loadInterstitial(), 1000);
      
      return true;
    } catch (error) {
      console.error('Error showing interstitial:', error);
      return false;
    }
  }

  // Cargar anuncio de recompensa
  async loadRewarded(): Promise<void> {
    if (!this.isInitialized || !Capacitor.isNativePlatform()) {
      return;
    }

    try {
      const options: RewardAdOptions = {
        adId: ADMOB_CONFIG.rewardedAdUnitId,
        isTesting: __DEV__,
      };

      await AdMob.prepareRewardVideoAd(options);
      this.rewardedLoaded = true;
      console.log('Rewarded ad loaded');
    } catch (error) {
      console.error('Error loading rewarded ad:', error);
    }
  }

  // Mostrar anuncio de recompensa
  async showRewarded(): Promise<{ watched: boolean; reward?: any }> {
    if (!this.rewardedLoaded || !Capacitor.isNativePlatform()) {
      return { watched: false };
    }

    try {
      const result = await AdMob.showRewardVideoAd();
      this.rewardedLoaded = false;
      console.log('Rewarded ad shown:', result);
      
      // Cargar el siguiente anuncio
      setTimeout(() => this.loadRewarded(), 1000);
      
      return { watched: true, reward: result };
    } catch (error) {
      console.error('Error showing rewarded ad:', error);
      return { watched: false };
    }
  }

  // Verificar si los anuncios están disponibles
  isAvailable(): boolean {
    return this.isInitialized && Capacitor.isNativePlatform();
  }

  isBannerVisible(): boolean {
    return this.bannerVisible;
  }

  isInterstitialReady(): boolean {
    return this.interstitialLoaded;
  }

  isRewardedReady(): boolean {
    return this.rewardedLoaded;
  }
}

// Instancia singleton
export const adMobManager = AdMobManager.getInstance();

// Hook de React para usar AdMob
export const useAdMob = () => {
  return {
    showBanner: (position?: BannerAdPosition) => adMobManager.showBanner(position),
    hideBanner: () => adMobManager.hideBanner(),
    showInterstitial: () => adMobManager.showInterstitial(),
    showRewarded: () => adMobManager.showRewarded(),
    loadInterstitial: () => adMobManager.loadInterstitial(),
    loadRewarded: () => adMobManager.loadRewarded(),
    isAvailable: () => adMobManager.isAvailable(),
    isBannerVisible: () => adMobManager.isBannerVisible(),
    isInterstitialReady: () => adMobManager.isInterstitialReady(),
    isRewardedReady: () => adMobManager.isRewardedReady(),
  };
};
