

"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Dictionary, Locale } from '@/lib/dictionaries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Share2, Sparkles } from 'lucide-react';
import { getCrystalBallRevelation, type CrystalBallRevelationInput, type CrystalBallRevelationOutput } from '@/ai/flows/crystal-ball-flow';
import { useToast } from "@/hooks/use-toast";
import Image from 'next/image';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { useAuth } from '@/context/AuthContext';
import type { OnboardingFormData } from '@/types';
import { useCosmicEnergy } from '@/hooks/use-cosmic-energy';

interface CrystalBallClientContentProps {
  dictionary: Dictionary;
  locale: Locale;
}

const STARDUST_COST = 10;

export default function CrystalBallClientContent({ dictionary, locale }: CrystalBallClientContentProps) {
  const router = useRouter();
  const [revelation, setRevelation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isShowingAd, setIsShowingAd] = useState(false);
  const { toast } = useToast();

  const { user } = useAuth();
  const { addEnergyPoints, lastGained, spendStardust, stardust } = useCosmicEnergy();
  const isPremium = true; // All users have premium access now
  const [onboardingData, setOnboardingData] = useState<OnboardingFormData | null>(null);

  useEffect(() => {
    if (user?.uid) {
      const storedData = localStorage.getItem(`onboardingData_${user.uid}`);
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData) as OnboardingFormData;
          if (parsedData.dateOfBirth && typeof parsedData.dateOfBirth === 'string') {
            parsedData.dateOfBirth = new Date(parsedData.dateOfBirth);
          }
          setOnboardingData(parsedData);
        } catch (e) {
          console.error("Failed to parse onboarding data:", e);
          setOnboardingData(null);
        }
      }
    } else {
        setOnboardingData(null);
    }
  }, [user]);
  
  const performRevelation = async (isFirstUse: boolean) => {
    setIsLoading(true);
    setRevelation(null);
    try {
      const input: CrystalBallRevelationInput = { 
        locale,
        userName: onboardingData?.name || user?.displayName || undefined,
      };
      const result: CrystalBallRevelationOutput = await getCrystalBallRevelation(input);
      setRevelation(result.revelation);
      if (isFirstUse) {
        const energyResult = addEnergyPoints('use_crystal_ball', 10);
        if (energyResult.pointsAdded > 0) {
          toast({
              title: `✨ ${dictionary['CosmicEnergy.pointsEarnedTitle'] || 'Cosmic Energy Gained!'}`,
              description: `${dictionary['CosmicEnergy.pointsEarnedDescription'] || 'You earned'} +${energyResult.pointsAdded} EC!`,
          });
           if (energyResult.leveledUp) {
              setTimeout(() => {
                  toast({
                      title: `🎉 ${dictionary['CosmicEnergy.levelUpTitle'] || 'Level Up!'}`,
                      description: `${(dictionary['CosmicEnergy.levelUpDescription'] || 'You have reached Level {level}!').replace('{level}', energyResult.newLevel.toString())}`,
                  });
              }, 500);
          }
        }
      }
    } catch (err) {
      console.error("Error consulting crystal ball:", err);
      toast({
        title: dictionary['Error.genericTitle'] || "Error",
        description: dictionary['CrystalBallPage.errorFetching'] || "The mists are unclear... Could not get an answer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const hasUsedToday = lastGained.use_crystal_ball === today;

  const handleGetRevelation = async () => {
    if (!hasUsedToday) { // First use of the day
        if (isPremium) {
            performRevelation(true);
        } else {
            setIsShowingAd(true);
            toast({
                title: dictionary['Toast.adRequiredTitle'] || "Ad Required",
                description: dictionary['Toast.adRequiredDescription'] || "Watching a short ad for your first use of the day.",
            });
            setTimeout(() => {
                setIsShowingAd(false);
                performRevelation(true); 
            }, 2500);
        }
    } else { // Subsequent use
      if (stardust < STARDUST_COST) {
        toast({
          title: dictionary['Toast.notEnoughStardustTitle'] || "Not Enough Stardust",
          description: (dictionary['Toast.notEnoughStardustDescription'] || "You need {cost} Stardust to use this again today. Get more from the 'More' section.").replace('{cost}', STARDUST_COST.toString()),
          variant: "destructive",
        });
        return;
      }
      spendStardust(STARDUST_COST);
      toast({
        title: dictionary['Toast.stardustSpent'] || "Stardust Spent",
        description: (dictionary['Toast.stardustSpentDescription'] || "{cost} Stardust has been used for this reading.").replace('{cost}', STARDUST_COST.toString()),
      });
      performRevelation(false);
    }
  };

  const handleShare = async () => {
    if (!revelation) return;

    const shareTitle = dictionary['Share.crystalBallTitle'] || "A Crystal Ball Revelation from AstroVibes";
    const shareText = `${shareTitle}\n\n"${revelation}"`;
    const shareUrl = window.location.href; // Share the clean URL

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
        toast({
          title: dictionary['Share.copiedTitle'] || "Copied!",
          description: dictionary['Share.copiedLinkMessage'] || "The revelation has been copied to your clipboard.",
        });
      } catch (copyError) {
        toast({
          title: dictionary['Share.errorTitle'] || "Sharing Error",
          description: dictionary['Share.errorMessageClipboard'] || "Could not copy. Please try sharing manually.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Card className="w-full max-w-xl mx-auto shadow-xl bg-card/70 backdrop-blur-sm border border-white/20 flex flex-col">
      <CardHeader className="px-4 py-4 md:px-6 md:py-5 text-center">
        {revelation && !isLoading ? (
          <CardTitle className="font-headline text-xl md:text-2xl text-primary">
            {dictionary['CrystalBallPage.revelationTitle'] || "The Universe Whispers..."}
          </CardTitle>
        ) : (
          <CardTitle className="font-headline text-xl md:text-2xl text-primary">
            {dictionary['CrystalBallPage.title'] || "Crystal Ball"}
          </CardTitle>
        )}
      </CardHeader>
      <CardContent className="space-y-4 md:space-y-6 px-4 pb-4 md:px-6 md:pb-6 flex-grow flex flex-col items-center justify-center">

        <div className="flex justify-center my-6 md:my-8">
          <div className="dynamic-orb-halo w-36 h-36 sm:w-44 sm:h-44">
            <div className="w-full h-full rounded-full overflow-hidden shadow-inner bg-background">
              <Image
                src="/custom_assets/crystal_ball_animation.gif"
                alt={dictionary['CrystalBallPage.title'] || "Crystal Ball"}
                width={180}
                height={180}
                className="object-cover w-full h-full"
                unoptimized={true}
                data-ai-hint="crystal ball animation"
              />
            </div>
          </div>
        </div>
        
        {isLoading && !isShowingAd && (
          <div className="text-center min-h-[80px]">
            <LoadingSpinner className="h-10 w-10 text-primary" />
          </div>
        )}
        
        {isShowingAd && (
          <div className="text-center min-h-[80px]">
            <LoadingSpinner className="h-10 w-10 text-primary" />
            <p className="mt-2 text-sm text-muted-foreground">{dictionary['Toast.watchingAd'] || 'Watching ad...'}</p>
          </div>
        )}

        {!isLoading && !isShowingAd && revelation && (
          <Card className="w-full bg-secondary/30 p-4 rounded-lg shadow text-center min-h-[80px]">
            <p className="font-body leading-relaxed text-card-foreground text-base whitespace-pre-line">
              {revelation}
            </p>
          </Card>
        )}

        {!revelation && !isLoading && !isShowingAd && (
          <div className="text-center min-h-[80px]">
             <Button onClick={handleGetRevelation} className="w-full max-w-xs font-body text-base" size="lg" disabled={isShowingAd || isLoading}>
              <Sparkles className="mr-2 h-5 w-5" />
              {dictionary['CrystalBallPage.getRevelationButton'] || "Get Today's Revelation"}
            </Button>
          </div>
        )}

        {revelation && !isLoading && !isShowingAd && (
          <div className="flex flex-col sm:flex-row gap-2 mt-4 w-full max-w-xs">
            <Button onClick={handleGetRevelation} variant="outline" className="flex-1 font-body" disabled={isShowingAd || isLoading}>
              {dictionary['CrystalBallPage.lookAgainButton'] || "Look Again"} {hasUsedToday && `(${STARDUST_COST} 💫)`}
            </Button>
            <Button onClick={handleShare} className="flex-1 font-body">
              <Share2 className="mr-2 h-4 w-4" />
              {dictionary['Share.buttonLabelRevelationLinkContent'] || "Share This Revelation"}
            </Button>
          </div>
        )}

      </CardContent>
    </Card>
  );
}
