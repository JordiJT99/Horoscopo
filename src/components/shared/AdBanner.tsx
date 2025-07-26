'use client';

import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import type { Dictionary } from '@/lib/dictionaries';
import { useAdMob } from '@/lib/admob';

interface AdBannerProps {
  dictionary: Dictionary;
  showNative?: boolean; // Para controlar si mostrar el banner nativo o web
}

const AdBanner = ({ dictionary, showNative = true }: AdBannerProps) => {
  const [isNativeAd, setIsNativeAd] = useState(false);
  const { isAvailable } = useAdMob();

  useEffect(() => {
    // Determinar si usar anuncios nativos o web
    setIsNativeAd(Capacitor.isNativePlatform() && showNative && isAvailable());
  }, [showNative, isAvailable]);

  // Para aplicaciones nativas, mostramos un placeholder ya que el banner se maneja nativamente
  if (isNativeAd) {
    return (
      <div className="w-full text-center my-4 p-4 bg-muted/30 rounded-lg border border-border/50">
        <div className="h-12 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-md flex items-center justify-center">
          <p className="text-xs text-muted-foreground">
            {dictionary['AdBanner.nativeAdPlaceholder'] || '📱 Native Ad Space'}
          </p>
        </div>
      </div>
    );
  }

  // Para web, mantener AdSense como fallback
  return <WebAdBanner dictionary={dictionary} />;
};

// Componente separado para anuncios web (AdSense)
const WebAdBanner = ({ dictionary }: { dictionary: Dictionary }) => {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        window.adsbygoogle.push({});
      }
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  return (
    <div className="w-full text-center my-4 p-2 bg-muted/30 rounded-lg border border-border/50">
      <p className="text-xs text-muted-foreground mb-2">
        {dictionary['AdBanner.placeholderText'] || 'Advertisement'}
      </p>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || ''}
        data-ad-slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_ID || ''}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};

// Declaración global para AdSense
declare global {
  interface Window {
    adsbygoogle?: { [key: string]: unknown }[];
  }
}

export default AdBanner;
