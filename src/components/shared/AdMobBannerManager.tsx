import { useEffect, useState } from 'react';
import { useAdMob } from '@/lib/admob';
import { BannerAdPosition } from '@capacitor-community/admob';
import { useCosmicEnergy } from '@/hooks/use-cosmic-energy';

interface AdMobBannerManagerProps {
  showBannerOnMount?: boolean;
  position?: BannerAdPosition;
  hideOnPremium?: boolean;
}

export const AdMobBannerManager = ({ 
  showBannerOnMount = false,
  position = BannerAdPosition.BOTTOM_CENTER,
  hideOnPremium = true 
}: AdMobBannerManagerProps) => {
  const { showBanner, hideBanner, isAvailable, isBannerVisible } = useAdMob();
  const cosmicEnergy = useCosmicEnergy();
  // Replace this with the correct property or method from cosmicEnergy that indicates premium status
  // Example: if the property is 'isUserPremium', use that; otherwise, default to false
  const isPremium = (cosmicEnergy as any).isPremium ?? false;
  const [shouldShowBanner, setShouldShowBanner] = useState(false);

  useEffect(() => {
    // Determinar si debemos mostrar el banner
    const shouldShow = isAvailable() && showBannerOnMount && (!hideOnPremium || !isPremium);
    setShouldShowBanner(shouldShow);
  }, [isAvailable, showBannerOnMount, hideOnPremium, isPremium]);

  useEffect(() => {
    if (shouldShowBanner && !isBannerVisible()) {
      showBanner(position);
    } else if (!shouldShowBanner && isBannerVisible()) {
      hideBanner();
    }
  }, [shouldShowBanner, showBanner, hideBanner, position, isBannerVisible]);

  // Este componente no renderiza nada visible, solo maneja el banner nativo
  return null;
};

export default AdMobBannerManager;
