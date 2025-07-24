'use client';

import { useEffect } from 'react';
import type { Dictionary } from '@/lib/dictionaries';

declare global {
  interface Window {
    adsbygoogle?: { [key: string]: unknown }[];
  }
}

interface AdBannerProps {
  dictionary: Dictionary;
}

const AdBanner = ({ dictionary }: AdBannerProps) => {
  useEffect(() => {
    try {
      if (window.adsbygoogle) {
        window.adsbygoogle.push({});
      }
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

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
