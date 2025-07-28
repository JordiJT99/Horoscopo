"use client";

import { BannerAdPosition } from '@capacitor-community/admob';
import { useAdMob } from '@/hooks/use-admob-ads';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Smartphone, Tv, Gift, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

export default function AdMobTestComponent() {
  const {
    isInitialized,
    isLoading,
    error,
    isSupported,
    showBanner,
    hideBanner,
    showInterstitial,
    showRewardedAd,
    getAdInfo,
    clearError
  } = useAdMob();

  const adInfo = getAdInfo();

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            AdMob Test Center
            {adInfo.isTesting && (
              <Badge variant="secondary" className="ml-2">
                TEST MODE
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Estado de AdMob */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              {isSupported ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-500" />
              )}
              <span>Platform: {isSupported ? 'Supported' : 'Not Supported'}</span>
            </div>
            <div className="flex items-center gap-2">
              {isInitialized ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-yellow-500" />
              )}
              <span>Status: {isInitialized ? 'Initialized' : 'Not Initialized'}</span>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-red-700">{error}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearError}
                  className="text-red-600 hover:text-red-800"
                >
                  ×
                </Button>
              </div>
            </div>
          )}

          {/* Test Buttons */}
          <div className="space-y-3">
            <div className="flex gap-2">
              <Button
                onClick={() => showBanner(BannerAdPosition.TOP_CENTER)}
                disabled={!isSupported || isLoading}
                variant="outline"
                className="flex-1"
              >
                <Eye className="h-4 w-4 mr-2" />
                Show Banner (Top)
              </Button>
              <Button
                onClick={() => showBanner(BannerAdPosition.BOTTOM_CENTER)}
                disabled={!isSupported || isLoading}
                variant="outline"
                className="flex-1"
              >
                <Eye className="h-4 w-4 mr-2" />
                Show Banner (Bottom)
              </Button>
            </div>

            <Button
              onClick={hideBanner}
              disabled={!isSupported || isLoading}
              variant="outline"
              className="w-full"
            >
              <EyeOff className="h-4 w-4 mr-2" />
              Hide Banner
            </Button>

            <Button
              onClick={showInterstitial}
              disabled={!isSupported || isLoading}
              variant="default"
              className="w-full"
            >
              <Tv className="h-4 w-4 mr-2" />
              {isLoading ? 'Loading...' : 'Show Interstitial Ad'}
            </Button>

            <Button
              onClick={showRewardedAd}
              disabled={!isSupported || isLoading}
              variant="default"
              className="w-full"
            >
              <Gift className="h-4 w-4 mr-2" />
              {isLoading ? 'Loading...' : 'Show Rewarded Ad'}
            </Button>
          </div>

          {/* Ad Configuration Info */}
          <div className="mt-6 p-3 bg-gray-50 rounded-md">
            <h4 className="font-medium text-sm mb-2">Current Configuration:</h4>
            <div className="text-xs text-gray-600 space-y-1">
              <div>Mode: {adInfo.isTesting ? 'Test Ads' : 'Production Ads'}</div>
              <div>Banner ID: {adInfo.config.AD_UNITS.banner.android}</div>
              <div>Interstitial ID: {adInfo.config.AD_UNITS.interstitial.android}</div>
              <div>Rewarded ID: {adInfo.config.AD_UNITS.rewarded.android}</div>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <h4 className="font-medium text-sm text-blue-800 mb-1">Testing Instructions:</h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Los anuncios solo funcionan en dispositivos físicos</li>
              <li>• En modo TEST verás anuncios de prueba de Google</li>
              <li>• Los banners aparecen en la parte superior o inferior</li>
              <li>• Los intersticiales son pantalla completa</li>
              <li>• Los rewarded dan recompensas al completarse</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
