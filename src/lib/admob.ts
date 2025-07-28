import { AdMob, BannerAdOptions, BannerAdSize, BannerAdPosition, RewardAdOptions, AdMobRewardItem } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

// ⚡ MODO DE PRUEBA ACTIVADO ⚡
// Usando IDs de prueba de Google AdMob para testing
// Cuando confirmes que funciona, cambia estos por tus IDs de producción

// IDs de AdMob para PRUEBAS (Google Test IDs oficiales)
export const AD_CONFIG = {
  APPLICATION_ID: {
    android: 'ca-app-pub-3940256099942544~3347511713', // Test App ID para Android
    ios: 'ca-app-pub-3940256099942544~1458002511'     // Test App ID para iOS
  },
  AD_UNITS: {
    banner: {
      android: 'ca-app-pub-3940256099942544/6300978111', // Test Banner ID para Android
      ios: 'ca-app-pub-3940256099942544/2934735716'      // Test Banner ID para iOS
    },
    interstitial: {
      android: 'ca-app-pub-3940256099942544/1033173712', // Test Interstitial ID para Android
      ios: 'ca-app-pub-3940256099942544/4411468910'      // Test Interstitial ID para iOS
    },
    rewarded: {
      android: 'ca-app-pub-3940256099942544/5224354917', // Test Rewarded ID para Android
      ios: 'ca-app-pub-3940256099942544/1712485313'      // Test Rewarded ID para iOS
    }
  }
};

// 📝 PARA CAMBIAR A PRODUCCIÓN:
// Reemplaza los IDs de arriba con tus IDs reales:
// App ID: ca-app-pub-1601092077557933~3273742971
// Banner: ca-app-pub-1601092077557933/1500472200
// Interstitial: ca-app-pub-1601092077557933/7954199917
// Rewarded: ca-app-pub-1601092077557933/9187390537

export class AdMobService {
  private static isInitialized = false;
  private static currentBannerId: string | null = null;

  // Inicializar AdMob
  static async initialize(): Promise<void> {
    if (this.isInitialized || !Capacitor.isNativePlatform()) {
      return;
    }

    try {
      const platform = Capacitor.getPlatform();
      const appId = platform === 'android' 
        ? AD_CONFIG.APPLICATION_ID.android 
        : AD_CONFIG.APPLICATION_ID.ios;

      await AdMob.initialize({
        testingDevices: ['YOUR_DEVICE_ID_HERE'], // Opcional: agrega tu device ID para testing
        initializeForTesting: true
      });

      this.isInitialized = true;
      console.log('AdMob initialized successfully in TEST mode');
      console.log(`Using App ID: ${appId}`);
    } catch (error) {
      console.error('Failed to initialize AdMob:', error);
      throw error;
    }
  }

  // Obtener información del modo actual
  static getAdModeInfo(): { isTesting: boolean; config: typeof AD_CONFIG } {
    return {
      isTesting: true,
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
        isTesting: true // Modo de prueba activado
      };

      await AdMob.showBanner(options);
      this.currentBannerId = adUnitId;
      console.log('Banner ad shown successfully (TEST mode)');
      console.log(`Banner ID: ${adUnitId}`);
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

    try {
      const platform = Capacitor.getPlatform();
      const adUnitId = platform === 'android' 
        ? AD_CONFIG.AD_UNITS.interstitial.android 
        : AD_CONFIG.AD_UNITS.interstitial.ios;

      const options = {
        adId: adUnitId,
        isTesting: true
      };

      // Preparar el anuncio
      await AdMob.prepareInterstitial(options);
      
      // Mostrar el anuncio
      await AdMob.showInterstitial();
      console.log('Interstitial ad shown successfully (TEST mode)');
      console.log(`Interstitial ID: ${adUnitId}`);
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
        isTesting: true
      };

      // Preparar el anuncio
      await AdMob.prepareRewardVideoAd(options);
      
      // Mostrar el anuncio y esperar la recompensa
      const result = await AdMob.showRewardVideoAd();
      console.log('Rewarded ad completed (TEST mode):', result);
      console.log(`Rewarded ID: ${adUnitId}`);
      
      return result;
    } catch (error) {
      console.error('Failed to show rewarded ad:', error);
      throw error;
    }
  }

  // Verificar si una plataforma es compatible
  static isSupported(): boolean {
    return Capacitor.isNativePlatform();
  }

  // Verificar si está inicializado
  static getInitializationStatus(): boolean {
    return this.isInitialized;
  }
}

// Exportar funciones convenientes
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
