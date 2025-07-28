"use client";

import { useEffect, useState } from 'react';
import { BannerAdPosition } from '@capacitor-community/admob';
import { useAdMob } from '@/hooks/use-admob-ads';

interface AdMobBannerProps {
  position?: BannerAdPosition;
  autoShow?: boolean;
  className?: string;
}

export default function AdMobBanner({ 
  position = BannerAdPosition.BOTTOM_CENTER, 
  autoShow = true,
  className = ""
}: AdMobBannerProps) {
  const { isInitialized, isSupported, showBanner, hideBanner } = useAdMob();
  const [isShowing, setIsShowing] = useState(false);

  useEffect(() => {
    if (autoShow && isInitialized && isSupported && !isShowing) {
      const showAdBanner = async () => {
        try {
          await showBanner(position);
          setIsShowing(true);
        } catch (error) {
          console.error('Failed to show AdMob banner:', error);
        }
      };
      
      showAdBanner();
    }

    // Cleanup: hide banner when component unmounts
    return () => {
      if (isShowing) {
        hideBanner().catch(console.error);
      }
    };
  }, [isInitialized, isSupported, autoShow, position, showBanner, hideBanner, isShowing]);

  // Solo renderiza en plataformas soportadas
  if (!isSupported) {
    return null;
  }

  // Placeholder visual para desarrollo (solo se ve en web)
  return (
    <div className={`admob-banner-placeholder ${className}`}>
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded p-2 text-center text-xs text-gray-500">
          AdMob Banner 
          <br />
          <span className="text-xs">
            ({position === BannerAdPosition.TOP_CENTER ? 'Top' : 'Bottom'})
          </span>
          <br />
          <span className="text-xs text-green-600">TEST MODE</span>
        </div>
      )}
    </div>
  );
}
