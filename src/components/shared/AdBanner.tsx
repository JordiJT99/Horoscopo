'use client';


import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { useAutoShowBanner } from '@/hooks/use-admob-ads';
import { BannerAdPosition } from '@capacitor-community/admob';


declare global {
  interface Window {
    adsbygoogle?: { [key: string]: unknown }[];
  }
}

interface AdBannerProps {

  dictionary?: Dictionary;
  position?: BannerAdPosition;
}

const AdBanner = ({ dictionary, position = BannerAdPosition.BOTTOM_CENTER }: AdBannerProps) => {
  const [isNative, setIsNative] = useState(false);

  // Para apps móviles nativas, usar AdMob
  const { isBannerVisible } = useAutoShowBanner(position);

  useEffect(() => {
    setIsNative(Capacitor.isNativePlatform());

  }, []);

  // AdSense para web (cuando no es nativo)
  useEffect(() => {
    if (!isNative) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        console.error('AdSense error:', err);
      }
    }
  }, [isNative]);

  // Si es nativo (móvil), AdMob maneja los banners automáticamente
  if (isNative) {
    return (
      <div className="w-full text-center my-4">
        {isBannerVisible ? (
          <div className="text-sm text-muted-foreground">
            {dictionary?.['Ads.bannerLoaded'] || 'Ad loaded'}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">
            {dictionary?.['Ads.loadingAd'] || 'Loading ad...'}
          </div>
        )}
      </div>
    );
  }

  // Para web, usar AdSense
  return (
    <div className="w-full text-center my-4 p-2 bg-muted/30 rounded-lg border border-border/50">
        <p className="text-xs text-muted-foreground mb-2">{dictionary['AdBanner.placeholderText'] || 'Advertisement'}</p>
        <ins
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || ''}
            data-ad-slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_ID || ''}
            data-ad-format="auto"
            data-full-width-responsive="true"
        ></ins>
    </div>
  );
};

export default AdBanner;
