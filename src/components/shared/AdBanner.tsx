'use client';

import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { useAutoShowBanner } from '@/hooks/use-admob-ads';
import { BannerAdPosition } from '@capacitor-community/admob';
import type { Dictionary } from '@/lib/dictionaries';

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
    <div className="w-full text-center my-4">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-1601092077557933" // Tu ID de editor
        data-ad-slot="1234567890" // ¡IMPORTANTE! Reemplaza esto con tu ID de bloque de anuncio
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
};

export default AdBanner;
