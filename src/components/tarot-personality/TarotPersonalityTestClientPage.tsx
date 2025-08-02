

"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Dictionary, Locale } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RotateCcw, MessageCircle } from 'lucide-react';
import { tarotPersonalityFlow, type TarotPersonalityInput, type TarotPersonalityOutput } from '@/ai/flows/tarot-personality-flow';
import { useToast } from "@/hooks/use-toast";
import Image from 'next/image';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { useAuth } from '@/context/AuthContext';
import type { OnboardingFormData, ZodiacSignName, NewPostData } from '@/types';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getSunSignFromDate } from '@/lib/constants';
import { useCosmicEnergy } from '@/hooks/use-cosmic-energy';
import { useAdMob } from '@/hooks/use-admob-ads';


interface TarotPersonalityTestClientPageProps {
  dictionary: Dictionary;
  locale: Locale;
}

const STARDUST_COST = 1;

export default function TarotPersonalityTestClientPage({ dictionary, locale }: TarotPersonalityTestClientPageProps) {
  const router = useRouter();
  const [result, setResult] = useState<TarotPersonalityOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { addEnergyPoints, level: userLevel, stardust, spendStardust, lastGained } = useCosmicEnergy();
  const { showRewardedAd } = useAdMob();
  const [onboardingData, setOnboardingData] = useState<OnboardingFormData | null>(null);
  const [isShowingAd, setIsShowingAd] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      const storedData = localStorage.getItem(`onboardingData_${user.uid}`);
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData) as OnboardingFormData;
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

  const today = new Date().toISOString().split('T')[0];
  const hasUsedToday = lastGained.draw_personality_card === today;

  const performReading = async (isFirstUse: boolean) => {
    setIsLoading(true);
    try {
        const input: TarotPersonalityInput = {
            locale,
            userName: onboardingData?.name || user?.displayName || undefined,
        };
        const flowResult: TarotPersonalityOutput = await tarotPersonalityFlow(input);
        setResult(flowResult);
        if (isFirstUse) {
            addEnergyPoints('draw_personality_card', 15);
        }
        setIsFlipped(true); // Trigger the flip animation
    } catch (err) {
        console.error("Error getting daily tarot card:", err);
        toast({
            title: dictionary['Error.genericTitle'] || "Error",
            description: dictionary['TarotDailyReading.errorFetching'] || "The spirits are pondering... Could not determine your card. Please try again.",
            variant: "destructive",
        });
    } finally {
        setIsLoading(false);
    }
  };

  const handleGetDailyCard = async () => {
    if (isLoading || isFlipped) return;

    if(!hasUsedToday) {
      setIsShowingAd(true);
      try {
        await showRewardedAd();
        // The user has interacted with the ad, proceed regardless of reward.
        // This handles cases where the ad is closed before completion.
        performReading(true);
      } catch (err) {
        console.error("Rewarded ad failed:", err);
        // If ad fails to load, let the user proceed for a better experience on first use.
        toast({ title: "Ad Error", description: "Could not load ad. Reading card anyway...", variant: "destructive"});
        performReading(true);
      } finally {
        setIsShowingAd(false);
      }
    } else {
        if(stardust < STARDUST_COST) {
            toast({
                title: dictionary['Toast.notEnoughStardustTitle'] || "Not Enough Stardust",
                description: (dictionary['Toast.notEnoughStardustDescription'] || "You need {cost} Stardust to use this again today.").replace('{cost}', STARDUST_COST.toString()),
                variant: "destructive",
            });
            return;
        }
        if(spendStardust(STARDUST_COST, 'draw_personality_card')) {
            toast({
                title: dictionary['Toast.stardustSpent'] || "Stardust Spent",
                description: (dictionary['Toast.stardustSpentDescription'] || "{cost} Stardust has been used for this reading.").replace('{cost}', STARDUST_COST.toString()),
            });
            performReading(false);
        }
    }
  };

  const handleTryAgain = () => {
    setIsFlipped(false);
    // Reset result after the flip-back animation completes
    setTimeout(() => {
      setResult(null);
    }, 300); 
  };
  
  const handleShareToCommunity = async () => {
    if (!user || !db) {
      toast({ title: dictionary['Auth.notLoggedInTitle'], description: dictionary['CommunityPage.loginToPost'], variant: 'destructive' });
      return;
    }
    if (!result) {
        toast({ title: "Error", description: "No reading data to share.", variant: 'destructive' });
        return;
    }

    setIsSubmitting(true);
    
    let authorZodiacSign: ZodiacSignName = 'Aries'; 
    if (user?.uid) {
      const storedDataRaw = localStorage.getItem(`onboardingData_${user.uid}`);
      if (storedDataRaw) {
        try {
          const storedData = JSON.parse(storedDataRaw);
          if (storedData.dateOfBirth) {
            const sign = getSunSignFromDate(new Date(storedData.dateOfBirth));
            if (sign) {
              authorZodiacSign = sign.name;
            }
          }
        } catch(e) { console.error("Could not get zodiac sign.", e) }
      }
    }
    
    const postData: NewPostData = {
      authorId: user.uid,
      authorName: user.displayName || 'Anonymous Astro-Fan',
      authorAvatarUrl: user.photoURL || `https://placehold.co/64x64.png?text=${(user.displayName || 'A').charAt(0)}`,
      authorZodiacSign: authorZodiacSign,
      authorLevel: userLevel,
      postType: 'tarot_personality' as const,
      tarotPersonalityData: result,
    };

    try {
      await addDoc(collection(db, 'community-posts'), {
        ...postData,
        timestamp: serverTimestamp(),
      });
      toast({ title: dictionary['CommunityPage.shareSuccessTitle'] || "Success!", description: dictionary['CommunityPage.shareTarotSuccess'] || "Your tarot card has been shared." });
      router.push(`/${locale}/community`);
    } catch (error) {
      toast({ title: dictionary['Error.genericTitle'], description: (error as Error).message || "Could not share your card.", variant: 'destructive' });
    } finally {
        setIsSubmitting(false);
    }
  }

  const cardBackPath = "/custom_assets/tarot-card-back.png";

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-xl mx-auto">
      
      <div className="perspective-1000 w-[180px] h-[315px] sm:w-[220px] sm:h-[385px] mb-6">
        <motion.div
          className="relative w-full h-full transform-style-preserve-3d"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {/* Card Back */}
          <div
            className={cn(
                "absolute w-full h-full backface-hidden rounded-lg overflow-hidden shadow-lg border-2 border-primary/20",
                !isFlipped && "cursor-pointer hover:shadow-primary/40 hover:scale-105 transition-all duration-300",
                isLoading && "cursor-wait animate-pulse"
            )}
            onClick={handleGetDailyCard}
            onKeyDown={(e) => { if(e.key === 'Enter' || e.key === ' ') handleGetDailyCard() }}
            tabIndex={!isFlipped && !isLoading ? 0 : -1}
            role="button"
            aria-label={dictionary['TarotDailyReading.revealButton'] || "Reveal My Daily Card"}
          >
            <Image
              src={cardBackPath}
              alt={dictionary['TarotDailyReading.cardBackAlt'] || "Back of a tarot card"}
              layout="fill"
              objectFit="cover"
              quality={100}
              priority
              data-ai-hint="tarot card back illustration ornate"
            />
          </div>

          {/* Card Front */}
          <div className="absolute w-full h-full backface-hidden [transform:rotateY(180deg)] rounded-lg overflow-hidden shadow-lg border-2 border-primary/50 tarot-card-aura">
            {result && (
              <motion.div
                className="w-full h-full"
                animate={{ rotate: result.isReversed ? 180 : 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Image
                  src={result.cardImagePlaceholderUrl}
                  alt={result.cardName}
                  layout="fill"
                  objectFit="cover"
                  quality={100}
                  unoptimized={result.cardImagePlaceholderUrl.startsWith("https://placehold.co")}
                  data-ai-hint={`${result.cardName.toLowerCase().replace(/\s+/g, '_')} tarot`}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = "https://placehold.co/220x385.png?text=Error";
                    target.setAttribute("data-ai-hint", "tarot placeholder error");
                  }}
                />
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      {(isLoading || isShowingAd) && (
          <div className="text-center my-4">
              <LoadingSpinner className="h-8 w-8 text-primary" />
              {isShowingAd && <p className="text-sm mt-2 text-muted-foreground">{dictionary['Toast.watchingAd']}</p>}
          </div>
      )}

      <div className="w-full transition-opacity duration-500" style={{ opacity: isFlipped && !isLoading ? 1 : 0 }}>
        {isFlipped && !isLoading && result && (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
            >
                <Card className="w-full bg-secondary/30 p-4 md:p-6 rounded-lg shadow mt-4">
                    <CardHeader className="p-0 pb-3 md:pb-4 text-center">
                        <CardTitle className="font-headline text-2xl text-accent-foreground">
                            {result.cardName} {result.isReversed && `(${dictionary['Tarot.reversed'] || 'Reversed'})`}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 space-y-3 md:space-y-4">
                        <div>
                            <h4 className="font-headline text-md md:text-lg font-semibold text-primary mb-1">{dictionary['TarotDailyReading.readingTitle'] || "Today's Message:"}</h4>
                            <div className="font-body text-card-foreground leading-relaxed space-y-2 md:space-y-3 text-sm sm:text-base whitespace-pre-line">
                                {result.reading}
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 mt-4">
                          <Button onClick={handleTryAgain} variant="outline" className="w-full font-body text-xs md:text-sm flex-1">
                              <RotateCcw className="mr-2 h-4 w-4" />
                              {dictionary['TarotDailyReading.drawAgainButton'] || "Draw Another Card"} {hasUsedToday && `(${STARDUST_COST} 💫)`}
                          </Button>
                          <Button onClick={handleShareToCommunity} disabled={isSubmitting} className="w-full font-body text-xs md:text-sm flex-1">
                             {isSubmitting ? <LoadingSpinner className="h-4 w-4 mr-2" /> : <MessageCircle className="mr-2 h-4 w-4" />}
                             {dictionary['CommunityPage.shareToCommunity'] || "Share to Community"}
                          </Button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        )}
      </div>

    </div>
  );
}

