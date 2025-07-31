import { AdMob, BannerAdOptions, BannerAdSize, BannerAdPosition, RewardAdOptions, AdMobRewardItem, InterstitialAdPlugin } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

// ⚡ MODO DE PRODUCCIÓN ACTIVADO ⚡
// Usando tus IDs reales de AdMob para producción

// IDs de AdMob REALES de tu cuenta
export const AD_CONFIG = {
  APPLICATION_ID: {
    android: 'ca-app-pub-1601092077557933~3927093480', // Tu App ID real para Android
    ios: 'ca-app-pub-1601092077557933~3927093480'     // Tu App ID real para iOS
  },
  AD_UNITS: {
    banner: {
      android: 'ca-app-pub-1601092077557933/4647765323', // Tu Banner ID real para Android
      ios: 'ca-app-pub-1601092077557933/4647765323'      // Tu Banner ID real para iOS
    },
    interstitial: {
      android: 'ca-app-pub-1601092077557933/7377870444', // Tu Interstitial ID real para Android
      ios: 'ca-app-pub-1601092077557933/7377870444'      // Tu Interstitial ID real para iOS
    },
    rewarded: {
      android: 'ca-app-pub-1601092077557933/3438625437', // Tu Rewarded ID real para Android
      ios: 'ca-app-pub-1601092077557933/3438625437'      // Tu Rewarded ID real para iOS
    }
  }
};

export class AdMobService {
  private static isInitialized = false;
  private static currentBannerId: string | null = null;
  private static interstitial: InterstitialAdPlugin | null = null;


  // Inicializar AdMob
  static async initialize(): Promise<void> {
    if (this.isInitialized || !Capacitor.isNativePlatform()) {
      return;
    }

    try {
      await AdMob.initialize({
        testingDevices: [],
        initializeForTesting: false,
      });

      this.interstitial = AdMob.Interstitial;
      this.isInitialized = true;
      console.log('AdMob initialized successfully in PRODUCTION mode');
    } catch (error) {
      console.error('Failed to initialize AdMob:', error);
      throw error;
    }
  }

  // Obtener información del modo actual
  static getAdModeInfo(): { isTesting: boolean; config: typeof AD_CONFIG } {
    return {
      isTesting: false,
      config: AD_CONFIG
    };
  }

  // Mostrar banner
  static async showBanner(position: BannerAdPosition = BannerAdPosition.BOTTOM_CENTER): Promise<void> {
    if (!Capacitor.isNativePlatform()) {
      console.warn('AdMob banners only work on native platforms');
      return;
    }

    await this.initialize();

    try {
      const platform = Capacitor.getPlatform();
      const adUnitId = platform === 'android' 
        ? AD_CONFIG.AD_UNITS.banner.android 
        : AD_CONFIG.AD_UNITS.banner.ios;

      const options: BannerAdOptions = {
        adId: adUnitId,
        adSize: BannerAdSize.BANNER,
        position: position,
        margin: 0,
        isTesting: false
      };

      await AdMob.showBanner(options);
      this.currentBannerId = adUnitId;
      console.log('Banner ad shown successfully (PRODUCTION mode)');
    } catch (error) {
      console.error('Failed to show banner ad:', error);
      throw error;
    }
  }

  // Ocultar banner
  static async hideBanner(): Promise<void> {
    if (!Capacitor.isNativePlatform() || !this.currentBannerId) {
      return;
    }

    try {
      await AdMob.hideBanner();
      this.currentBannerId = null;
      console.log('Banner ad hidden successfully');
    } catch (error) {
      console.error('Failed to hide banner ad:', error);
    }
  }

  // Mostrar anuncio intersticial
  static async showInterstitial(): Promise<void> {
    if (!Capacitor.isNativePlatform()) {
      console.warn('AdMob interstitials only work on native platforms');
      return;
    }

    await this.initialize();
    if (!this.interstitial) {
        console.error("Interstitial plugin not available");
        return;
    }
    
    try {
      const platform = Capacitor.getPlatform();
      const adUnitId = platform === 'android' 
        ? AD_CONFIG.AD_UNITS.interstitial.android 
        : AD_CONFIG.AD_UNITS.interstitial.ios;

      const options = {
        adId: adUnitId,
        isTesting: false
      };

      await this.interstitial.prepare(options);
      await this.interstitial.show();
      console.log('Interstitial ad shown successfully (PRODUCTION mode)');
    } catch (error) {
      console.error('Failed to show interstitial ad:', error);
      throw error;
    }
  }

  // Mostrar anuncio con recompensa
  static async showRewardedAd(): Promise<AdMobRewardItem | null> {
    if (!Capacitor.isNativePlatform()) {
      console.warn('AdMob rewarded ads only work on native platforms');
      return null;
    }

    await this.initialize();

    try {
      const platform = Capacitor.getPlatform();
      const adUnitId = platform === 'android' 
        ? AD_CONFIG.AD_UNITS.rewarded.android 
        : AD_CONFIG.AD_UNITS.rewarded.ios;

      const options: RewardAdOptions = {
        adId: adUnitId,
        isTesting: false
      };

      await AdMob.prepareRewardVideoAd(options);
      const result = await AdMob.showRewardVideoAd();
      console.log('Rewarded ad completed (PRODUCTION mode):', result);
      return result;
    } catch (error) {
      console.error('Failed to show rewarded ad:', error);
      throw error;
    }
  }

  static isSupported(): boolean {
    return Capacitor.isNativePlatform();
  }

  static getInitializationStatus(): boolean {
    return this.isInitialized;
  }
}

export const {
  initialize,
  showBanner,
  hideBanner,
  showInterstitial,
  showRewardedAd,
  isSupported,
  getInitializationStatus,
  getAdModeInfo
} = AdMobService;