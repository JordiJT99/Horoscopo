

"use client"; // THIS IS THE NEW CLIENT COMPONENT

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Dictionary, Locale } from '@/lib/dictionaries';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Wand, Sparkles, Share2, RotateCcw, MessageCircle } from 'lucide-react'; 
import { tarotReadingFlow, type TarotReadingInput, type TarotReadingOutput } from '@/ai/flows/tarot-reading-flow';
import { useToast } from "@/hooks/use-toast";
import Image from 'next/image';
import { cn } from '@/lib/utils';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { useAuth } from '@/context/AuthContext';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { NewPostData, ZodiacSignName } from '@/types';
import { getSunSignFromDate } from '@/lib/constants';
import { useCosmicEnergy } from '@/hooks/use-cosmic-energy';
import { useAdMob } from '@/hooks/use-admob-ads';

interface TarotReadingClientProps {
  dictionary: Dictionary;
  locale: Locale;
}

const STARDUST_COST = 1;

export default function TarotReadingClient({ dictionary, locale }: TarotReadingClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [question, setQuestion] = useState('');
  const [reading, setReading] = useState<TarotReadingOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const { addEnergyPoints, level: userLevel, stardust, spendStardust, lastGained } = useCosmicEnergy();
  const { showInterstitial, showRewardedAd } = useAdMob();

  const [isShowingSharedContent, setIsShowingSharedContent] = useState(false);
  const [isShowingAd, setIsShowingAd] = useState(false);
  
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const hasUsedToday = lastGained.draw_tarot_card === today;

  const performReading = async (isFirstUse: boolean) => {
    setIsLoading(true);
    try {
      const input: TarotReadingInput = { question, locale };
      const result: TarotReadingOutput = await tarotReadingFlow(input);
      setReading(result);
      if (isFirstUse) {
        addEnergyPoints('draw_tarot_card', 15);
      }
    } catch (err) {
      console.error("Error getting tarot reading:", err);
      setError(dictionary['TarotReadingPage.errorFetching'] || "The spirits are clouded... Could not get a reading. Please try again.");
      toast({
        title: dictionary['Error.genericTitle'] || "Error",
        description: dictionary['TarotReadingPage.errorFetching'] || "The spirits are clouded... Could not get a reading. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrawCard = async () => {
    if (!question.trim()) {
      setError(dictionary['TarotReadingPage.enterQuestionPrompt'] || "Please enter a question for your reading.");
      return;
    }
    
    setError(null);
    setReading(null);
    setIsShowingSharedContent(false);

    if (!hasUsedToday) { // First use of the day
      setIsShowingAd(true);
      try {
        await showInterstitial();
        performReading(true);
      } catch (adError) {
        console.log('Ad not shown:', adError);
        // If ad fails, let them proceed anyway as it's their first use
        performReading(true);
      } finally {
        setIsShowingAd(false);
      }
    } else { // Subsequent use
      if (stardust < STARDUST_COST) {
        toast({
          title: dictionary['Toast.notEnoughStardustTitle'] || "Not Enough Stardust",
          description: (dictionary['Toast.notEnoughStardustDescription'] || "You need {cost} Stardust to use this again today.").replace('{cost}', STARDUST_COST.toString()),
          variant: "destructive",
        });
        return;
      }
      if (spendStardust(STARDUST_COST, 'draw_tarot_card')) {
        toast({
          title: dictionary['Toast.stardustSpent'] || "Stardust Spent",
          description: (dictionary['Toast.stardustSpentDescription'] || "{cost} Stardust has been used for this reading.").replace('{cost}', STARDUST_COST.toString()),
        });
        performReading(false);
      }
    }
  };

  const handleShareToCommunity = async () => {
    if (!user || !db) {
      toast({ title: dictionary['Auth.notLoggedInTitle'], description: dictionary['CommunityPage.loginToPost'], variant: 'destructive' });
      return;
    }
    if (!reading) {
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
      postType: 'tarot_reading' as const,
      tarotReadingData: reading,
    };

    try {
      await addDoc(collection(db, 'community-posts'), {
        ...postData,
        timestamp: serverTimestamp(),
      });
      toast({ title: dictionary['CommunityPage.shareSuccessTitle'] || "Success!", description: dictionary['CommunityPage.shareTarotSuccess'] || "Your tarot reading has been shared." });
      router.push(`/${locale}/community`);
    } catch (error) {
      toast({ title: dictionary['Error.genericTitle'], description: (error as Error).message || "Could not share your reading.", variant: 'destructive' });
    } finally {
        setIsSubmitting(false);
    }
  }

  const handleNewReading = () => {
    const newPath = `/${locale}/tarot-reading`;
    if (typeof router.push === 'function') {
       router.push(newPath, { scroll: false }); 
    } else {
       window.location.href = newPath;
    }
    setReading(null);
    setQuestion('');
    setError(null);
    setIsShowingSharedContent(false);
  };

  if (!isClient || Object.keys(dictionary).length === 0) {
    return (
      <div className="text-center py-10">
        <LoadingSpinner className="h-12 w-12 text-primary" />
        <p className="mt-4 font-body">Loading Tarot Reading experience...</p>
      </div>
    );
  }

  return (
      <Card className="w-full max-w-xl mx-auto shadow-xl bg-card/70 backdrop-blur-sm border border-white/10">
        <CardHeader className="px-4 py-4 md:px-6 md:py-5">
          <CardTitle className="font-headline text-xl md:text-2xl text-primary text-center">
            {isShowingSharedContent
              ? (dictionary['TarotReadingPage.sharedReadingTitle'] || "A Shared Tarot Reading")
              : (dictionary['TarotReadingPage.askTitle'] || "Ask Your Question")}
          </CardTitle>
          {!isShowingSharedContent && (
            <CardDescription className="text-center font-body text-sm md:text-base">
              {dictionary['TarotReadingPage.askDescription'] || "Focus on your question and let the cards guide you. Draw one card for insight."}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-4 md:space-y-6 px-4 pb-4 md:px-6 md:pb-6 relative">
          <div className="tarot-question-area-bg-container">
            <Image
              src="/custom_assets/tarot-card-back.png" 
              alt={dictionary['TarotReadingPage.tarotTableAlt'] || "Mystical tarot reading table background"}
              layout="fill"
              className="tarot-question-area-bg"
              data-ai-hint="tarot card back illustration ornate"
            />
          </div>
          {!reading && !isLoading && (
            <>
              <div className="relative z-10"> 
                <Textarea
                  id="tarot-question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder={dictionary['TarotReadingPage.questionPlaceholder'] || "Type your question here..."}
                  className="min-h-[100px] font-body bg-input/80 border-border/50"
                  aria-label={dictionary['TarotReadingPage.questionLabel'] || "Your question for the tarot reading"}
                />
              </div>

              <Button 
                onClick={handleDrawCard} 
                disabled={isLoading || isShowingAd} 
                className={cn("w-full font-body text-sm md:text-base relative z-10 tarot-cta-button")}
              >
                {isLoading || isShowingAd ? (
                  <>
                    <LoadingSpinner className="mr-2 h-4 w-4" />
                    {dictionary['TarotReadingPage.drawingCardButton'] || "Drawing Card..."}
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    {dictionary['TarotReadingPage.drawCardButton'] || "Draw a Card"}
                  </>
                )}
              </Button>
            </>
          )}

          {error && 
            <p className="text-destructive text-center font-body text-sm md:text-base relative z-10">
              {error}
            </p>
          }
          
          {isLoading && (
            <div className="text-center py-10">
                <LoadingSpinner className="h-12 w-12 text-primary" />
                <p className="mt-4 font-body">{dictionary['TarotReadingPage.drawingCardButton']}</p>
            </div>
          )}

          {reading && !isLoading && (
            <Card className="mt-6 bg-secondary/30 p-4 md:p-6 rounded-lg shadow relative z-10">
              <CardHeader className="p-0 pb-3 md:pb-4 text-center">
                 <CardTitle className="font-headline text-lg md:text-xl text-accent-foreground">
                    {reading.cardName}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-3 md:space-y-4">
                <div className="flex justify-center mb-3 md:mb-4">
                  <div className="tarot-card-aura rounded-lg">
                    <Image 
                      src={reading.imagePlaceholderUrl} 
                      alt={reading.cardName} 
                      width={150}  
                      height={262} 
                      className="rounded-md shadow-lg border-2 border-primary/50 sm:w-[180px] sm:h-[315px]"
                      data-ai-hint={`${reading.cardName.toLowerCase().replace(/\s+/g, '_')} tarot`}
                      unoptimized={reading.imagePlaceholderUrl.startsWith("https://placehold.co")}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null; 
                        target.src = "https://placehold.co/180x315.png?text=Error";
                        target.setAttribute("data-ai-hint", "tarot placeholder error");
                      }}
                    />
                  </div>
                </div>
                <div>
                  <h4 className="font-headline text-md md:text-lg font-semibold text-primary mb-1">
                    {dictionary['TarotReadingPage.meaningTitle'] || "Meaning:"}
                  </h4>
                  <p className="font-body text-card-foreground leading-relaxed text-xs sm:text-sm">
                    {reading.cardMeaning}
                  </p>
                </div>
                <div>
                  <h4 className="font-headline text-md md:text-lg font-semibold text-primary mb-1">
                    {dictionary['TarotReadingPage.adviceTitle'] || "Advice for Your Question:"}
                  </h4>
                  <p className="font-body text-card-foreground leading-relaxed text-xs sm:text-sm">
                    {reading.advice}
                  </p>
                </div>
                 <div className="flex flex-col sm:flex-row gap-2 mt-4">
                  <Button onClick={handleNewReading} variant="outline" className="w-full font-body text-xs md:text-sm flex-1">
                    <RotateCcw className="mr-2 h-4 w-4" />
                    {dictionary['TarotReadingPage.newReadingButton'] || "Get a New Reading"}
                  </Button>
                  <Button onClick={handleShareToCommunity} disabled={isSubmitting} className="w-full font-body text-xs md:text-sm flex-1">
                    {isSubmitting ? <LoadingSpinner className="h-4 w-4 mr-2" /> : <MessageCircle className="mr-2 h-4 w-4" />}
                    {dictionary['CommunityPage.shareToCommunity'] || "Share to Community"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

        </CardContent>
      </Card>
  );
}
