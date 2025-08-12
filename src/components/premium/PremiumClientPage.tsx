
'use client';

import type { Dictionary, Locale } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCosmicEnergy } from '@/hooks/use-cosmic-energy';
import { Award, Sparkles, Star, Calendar, MessageCircle, BarChart3, Gem } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PremiumClientPageProps {
  dictionary: Dictionary;
  locale: Locale;
}

export default function PremiumClientPage({ dictionary, locale }: PremiumClientPageProps) {
  const { togglePremium } = useCosmicEnergy();
  const { toast } = useToast();

  const handleTogglePremium = () => {
    togglePremium();
    toast({
      title: 'Premium Status Changed (Dev)',
      description: `Premium features are now available for all users.`,
    });
  };

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <Card className="bg-card/70 backdrop-blur-sm border-primary/30 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-headline text-primary">
              {dictionary['PremiumPage.featuresTitle'] || 'Premium Features'}
            </CardTitle>
            <CardDescription className="text-lg">
              {dictionary['PremiumPage.featuresDesc'] || 'All premium features are now available for free!'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Gem className="h-6 w-6 text-cyan-400 mt-1" />
              <div>
                <h4 className="font-semibold">{dictionary['PremiumPage.dailyStardustTitle'] || '100 Daily Stardust'}</h4>
                <p className="text-sm text-muted-foreground">{dictionary['PremiumPage.dailyStardustDesc'] || 'Get a daily bonus to use on special features.'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <BarChart3 className="h-6 w-6 text-cyan-400 mt-1" />
              <div>
                <h4 className="font-semibold">{dictionary['PremiumPage.adFreeTitle'] || 'Enhanced Experience'}</h4>
                <p className="text-sm text-muted-foreground">{dictionary['PremiumPage.adFreeDesc'] || 'All features now available with AdMob monetization.'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Sparkles className="h-6 w-6 text-cyan-400 mt-1" />
              <div>
                <h4 className="font-semibold">{dictionary['PremiumPage.natalChartTitle'] || 'Full Natal Chart'}</h4>
                <p className="text-sm text-muted-foreground">{dictionary['PremiumPage.natalChartDesc'] || 'Unlock your complete astrological blueprint.'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="h-6 w-6 text-cyan-400 mt-1" />
              <div>
                <h4 className="font-semibold">{dictionary['PremiumPage.tomorrowHoroscopeTitle'] || "Tomorrow's Horoscope"}</h4>
                <p className="text-sm text-muted-foreground">{dictionary['PremiumPage.tomorrowHoroscopeDesc'] || 'Get a sneak peek at the energies of the next day.'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MessageCircle className="h-6 w-6 text-cyan-400 mt-1" />
              <div>
                <h4 className="font-semibold">{dictionary['PremiumPage.psychicChatTitle'] || 'Unlimited Psychic Chat'}</h4>
                <p className="text-sm text-muted-foreground">{dictionary['PremiumPage.psychicChatDesc'] || 'Unlimited conversations with AI psychics.'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="md:col-span-1">
        <Card className="bg-card/90 backdrop-blur-lg border-primary/50 shadow-2xl shadow-primary/20">
          <CardHeader className="text-center">
            <CardTitle>{dictionary['PremiumPage.upgradeTitle'] || 'All Features Available'}</CardTitle>
            <CardDescription className="text-2xl font-bold text-primary">Free with Ads</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center text-sm text-muted-foreground mb-4">
              <p>All premium features are now available for all users. We monetize through AdMob ads instead of subscriptions.</p>
            </div>
            <Button className="w-full" disabled>
              {dictionary['PremiumPage.allFeaturesAvailable'] || 'All Features Available'}
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-2">{dictionary['PremiumPage.adSupportedNote'] || 'Supported by ads - premium subscriptions coming soon.'}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
