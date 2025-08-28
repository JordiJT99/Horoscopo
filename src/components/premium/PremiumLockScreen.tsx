'use client';

import { Lock, Crown, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import type { Dictionary, Locale } from '@/types';

interface PremiumLockScreenProps {
  dictionary: Dictionary;
  locale: Locale;
  featureTitle?: string;
}

export default function PremiumLockScreen({ dictionary, locale, featureTitle }: PremiumLockScreenProps) {
  const router = useRouter();

  const handleUpgradeClick = () => {
    // Redirigir a la página de suscripción premium
    router.push(`/${locale}/premium`);
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="flex justify-center items-center min-h-[60vh]">
        <Card className="w-full max-w-md mx-auto text-center border-2 border-primary/20 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Crown className="h-12 w-12 text-primary" />
                <Lock className="h-6 w-6 text-muted-foreground absolute -bottom-1 -right-1 bg-background rounded-full p-1" />
              </div>
            </div>
            <CardTitle className="text-xl md:text-2xl font-bold text-primary flex items-center justify-center gap-2">
              <Sparkles className="h-5 w-5" />
              {dictionary['Premium.title'] || 'Premium Feature'}
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              {dictionary['Premium.subtitle'] || 'Unlock exclusive features with Premium'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-foreground/80">
              {featureTitle && (
                <>
                  <strong>{featureTitle}</strong> {dictionary['Premium.featureRequiresPremium'] || 'requires Premium access.'}
                </>
              )}
              {!featureTitle && (dictionary['Premium.genericMessage'] || 'This feature is available for Premium users only.')}
            </p>
            
            <div className="space-y-2 text-left">
              <p className="text-sm font-semibold text-primary">
                {dictionary['Premium.benefitsTitle'] || 'Premium Benefits:'}
              </p>
              <ul className="text-xs text-muted-foreground space-y-1 pl-4">
                <li>• {dictionary['Premium.benefit1'] || 'Access to Natal Chart'}</li>
                <li>• {dictionary['Premium.benefit2'] || "Tomorrow's Horoscope"}</li>
                <li>• {dictionary['Premium.benefit3'] || '2 Daily Stardust Bonus'}</li>
                <li>• {dictionary['Premium.benefit4'] || 'Ad-free Experience'}</li>
              </ul>
            </div>

            <Button className="w-full" size="lg" onClick={handleUpgradeClick}>
              {dictionary['Premium.upgradeButton'] || 'Upgrade to Premium'}
            </Button>
            
            <p className="text-xs text-muted-foreground">
              {dictionary['Premium.footerText'] || 'Start your premium journey today'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
