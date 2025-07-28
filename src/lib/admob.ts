import { AdMob, BannerAdOptions, BannerAdSize, BannerAdPosition, RewardAdOptions } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

// IDs de AdMob - CAMBIAR por tus IDs reales de Google AdMob
export const ADMOB_CONFIG = {
  // IDs de test para desarrollo
  TEST_BANNER_ID: 'ca-app-pub-3940256099942544/6300978111',
  TEST_INTERSTITIAL_ID: 'ca-app-pub-3940256099942544/1033173712',
  TEST_REWARDED_ID: 'ca-app-pub-3940256099942544/5224354917',
  
  // IDs de producción - REEMPLAZAR con tus IDs reales
  PRODUCTION_BANNER_ID: 'ca-app-pub-1601092077557933/1500472200', // CAMBIAR por tu Banner ID real
  PRODUCTION_INTERSTITIAL_ID: 'ca-app-pub-1601092077557933/7954199917', // CAMBIAR por tu Interstitial ID real
  PRODUCTION_REWARDED_ID: 'ca-app-pub-1601092077557933/9187390537', // CAMBIAR por tu Rewarded ID real
  
  // Tu Application ID de AdMob (ya está correcto en AndroidManifest)
  APPLICATION_ID: 'ca-app-pub-1601092077557933~3273742971',
};

// Usar IDs de test en desarrollo, producción en release
const isProduction = process.env.NODE_ENV === 'production';

export const getBannerAdId = () => 
  isProduction ? ADMOB_CONFIG.PRODUCTION_BANNER_ID : ADMOB_CONFIG.TEST_BANNER_ID;

export const getInterstitialAdId = () => 
  isProduction ? ADMOB_CONFIG.PRODUCTION_INTERSTITIAL_ID : ADMOB_CONFIG.TEST_INTERSTITIAL_ID;

export const getRewardedAdId = () => 
  isProduction ? ADMOB_CONFIG.PRODUCTION_REWARDED_ID : ADMOB_CONFIG.TEST_REWARDED_ID;

export class AdMobService {
  private static initialized = false;

  static async initialize() {
    if (!Capacitor.isNativePlatform()) {
      console.log('AdMob: Not on native platform, skipping initialization');
      return;
    }

    if (this.initialized) {
      console.log('AdMob: Already initialized');
      return;
    }

    try {
      await AdMob.initialize({
        testingDevices: ['YOUR_DEVICE_ID'], // Agregar el ID de tu dispositivo de test
        initializeForTesting: !isProduction,
      });
      
      this.initialized = true;
      console.log('AdMob: Successfully initialized');
    } catch (error) {
      console.error('AdMob: Failed to initialize', error);
      throw error;
    }
  }

  static async showBanner(position: BannerAdPosition = BannerAdPosition.BOTTOM_CENTER) {
    if (!Capacitor.isNativePlatform()) {
      console.log('AdMob: Banner not shown (not native platform)');
      return;
    }

    try {
      await this.initialize();
      
      const options: BannerAdOptions = {
        adId: getBannerAdId(),
        adSize: BannerAdSize.BANNER,
        position: position,
        margin: 0,
        isTesting: !isProduction,
      };

      await AdMob.showBanner(options);
      console.log('AdMob: Banner shown successfully');
    } catch (error) {
      console.error('AdMob: Failed to show banner', error);
    }
  }

  static async hideBanner() {
    if (!Capacitor.isNativePlatform()) return;

    try {
      await AdMob.hideBanner();
      console.log('AdMob: Banner hidden');
    } catch (error) {
      console.error('AdMob: Failed to hide banner', error);
    }
  }

  static async showInterstitial(): Promise<boolean> {
    if (!Capacitor.isNativePlatform()) {
      console.log('AdMob: Interstitial not shown (not native platform)');
      return false;
    }

    try {
      await this.initialize();

      const options = {
        adId: getInterstitialAdId(),
        isTesting: !isProduction,
      };

      await AdMob.prepareInterstitial(options);
      await AdMob.showInterstitial();
      console.log('AdMob: Interstitial shown successfully');
      return true;
    } catch (error) {
      console.error('AdMob: Failed to show interstitial', error);
      return false;
    }
  }

  static async showRewardedAd(): Promise<boolean> {
    if (!Capacitor.isNativePlatform()) {
      console.log('AdMob: Rewarded ad not shown (not native platform)');
      return false;
    }

    try {
      await this.initialize();

      const options: RewardAdOptions = {
        adId: getRewardedAdId(),
        isTesting: !isProduction,
      };

      await AdMob.prepareRewardVideoAd(options);
      const result = await AdMob.showRewardVideoAd();
      
      if (result) {
        console.log('AdMob: Rewarded ad completed, user earned reward');
        return true;
      } else {
        console.log('AdMob: Rewarded ad dismissed without reward');
        return false;
      }
    } catch (error) {
      console.error('AdMob: Failed to show rewarded ad', error);
      return false;
    }
  }
}
