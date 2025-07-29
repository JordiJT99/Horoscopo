
"use client";

import { useState, useEffect, useMemo } from 'react';
import type { Dictionary, Locale } from '@/lib/dictionaries';
import { ALL_TAROT_CARDS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { tarotSpreadFlow } from '@/ai/flows/tarot-spread-flow';
import type { TarotSpreadInput, TarotSpreadOutput } from '@/types';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { useAuth } from '@/context/AuthContext';
import { useCosmicEnergy } from '@/hooks/use-cosmic-energy';
import { useAdMob } from '@/hooks/use-admob-ads';
import { Sparkles, RotateCcw } from 'lucide-react';

interface TarotSpreadClientProps {
  dictionary: Dictionary;
  locale: Locale;
}

interface CardState {
  name: string;
  isReversed: boolean;
}

// Helper to shuffle an array
const shuffleArray = (array: string[]): string[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export default function TarotSpreadClient({ dictionary, locale }: TarotSpreadClientProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const { stardust, spendStardust, lastGained, addEnergyPoints } = useCosmicEnergy();
  const { showRewardedAd, showInterstitial } = useAdMob();
  const isPremium = true; // All users have premium access now

  const [shuffledCards, setShuffledCards] = useState<string[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [selectedCards, setSelectedCards] = useState<CardState[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [reading, setReading] = useState<TarotSpreadOutput | null>(null);

  const cardBackPath = "/custom_assets/tarot-card-back.png";

  useEffect(() => {
    setShuffledCards(shuffleArray(ALL_TAROT_CARDS));
  }, []);
  

  const today = new Date().toISOString().split('T')[0];
  const hasUsedToday = lastGained.draw_tarot_card === today;


  const handleCardClick = (index: number) => {
    if (selectedIndices.length >= 2 || selectedIndices.includes(index) || isLoading || reading) {
      return;
    }
    const newIndices = [...selectedIndices, index];
    setSelectedIndices(newIndices);

    const cardState: CardState = {
      name: shuffledCards[index],
      isReversed: Math.random() < 0.3, // 30% chance of being reversed
    };
    setSelectedCards(prev => [...prev, cardState]);
  };

  const handleGetReading = async () => {
    if (selectedCards.length !== 2 || isLoading) return;


    const performReading = async (isFirstUse: boolean) => {
      setIsLoading(true);
      try {
        const input: TarotSpreadInput = {
          card1Name: selectedCards[0].name,
          card1Reversed: selectedCards[0].isReversed,
          card2Name: selectedCards[1].name,
          card2Reversed: selectedCards[1].isReversed,
          locale: locale,
          userName: user?.displayName || undefined
        };
        const result = await tarotSpreadFlow(input);
        setReading(result);
        if (isFirstUse) {
          addEnergyPoints('draw_tarot_card', 25);
        }
      } catch (error) {
        console.error("Error fetching tarot spread reading:", error);
        toast({
          title: dictionary['Error.genericTitle'] || "Error",
          description: dictionary['TarotSpreadPage.errorFetching'] || "The cards are shrouded in mist... Could not get a reading. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);

      }
    };
    
    if (!hasUsedToday) {
      // Primera vez del día - acceso gratuito
      performReading(true);
    } else {
      // Usos posteriores - ofrecer anuncio con recompensa para bonificación extra
      setIsShowingAd(true);
      try {
        const reward = await showRewardedAd();
        if (reward) {
          // Si vio el anuncio, dar lectura + energía bonus
          performReading(false);
          addEnergyPoints('draw_tarot_card', 10); // Energía bonus por ver anuncio
          toast({
            title: "¡Recompensa!",
            description: "+10 energía cósmica por ver el anuncio",
          });
        } else {
          // Si no vio el anuncio, dar lectura normal
          performReading(false);
        }
      } catch (adError) {
        console.log('Rewarded ad not available:', adError);
        // Si el anuncio no está disponible, dar lectura normal
        performReading(false);
      } finally {
        setIsShowingAd(false);
      }
    }
  };

  const handleReset = () => {
    setShuffledCards(shuffleArray(ALL_TAROT_CARDS));
    setSelectedIndices([]);
    setSelectedCards([]);
    setReading(null);
    setIsLoading(false);
  };

  const getCardImagePath = (cardName: string) => `/custom_assets/tarot_cards/${cardName.toLowerCase().replace(/\s+/g, '_')}.png`;

  return (
    <div className="w-full">
      {!reading ? (
        <>
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-primary">{dictionary['TarotSpreadPage.selectTwoCards']?.replace('{count}', '2') || 'Select 2 cards'}</h3>
            <div className="flex justify-center items-center gap-2 mt-2">
              <div className={cn("w-8 h-12 border-2 rounded", selectedIndices.length >= 1 ? 'bg-primary border-primary' : 'bg-muted border-dashed')} />
              <div className={cn("w-8 h-12 border-2 rounded", selectedIndices.length >= 2 ? 'bg-primary border-primary' : 'bg-muted border-dashed')} />
            </div>
          </div>
          <div className="grid grid-cols-6 sm:grid-cols-7 md:grid-cols-9 gap-2 sm:gap-4 justify-center">
            {shuffledCards.map((cardName, index) => (
              <div key={index} className="perspective-1000">
                <motion.div
                  className="relative w-full aspect-[2/3] transform-style-preserve-3d"
                  animate={{ rotateY: selectedIndices.includes(index) ? 180 : 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div
                    className={cn(
                      "absolute w-full h-full backface-hidden rounded-md overflow-hidden shadow-lg border-2 border-primary/20",
                      selectedIndices.length < 2 && !selectedIndices.includes(index) && "cursor-pointer hover:shadow-primary/40 hover:scale-105 transition-all duration-300",
                    )}
                    onClick={() => handleCardClick(index)}
                  >
                    <Image src={cardBackPath} alt={dictionary['TarotDailyReading.cardBackAlt']} layout="fill" objectFit="cover" />
                  </div>
                  <div className="absolute w-full h-full backface-hidden [transform:rotateY(180deg)] rounded-md overflow-hidden shadow-lg border-2 border-primary/50">
                    {selectedCards.find(c => c.name === cardName) && (
                      <motion.div
                        className="w-full h-full"
                        animate={{ rotate: selectedCards.find(c => c.name === cardName)?.isReversed ? 180 : 0 }}
                      >
                         <Image src={getCardImagePath(cardName)} alt={cardName} layout="fill" objectFit="cover" />
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button onClick={handleGetReading} disabled={selectedIndices.length !== 2 || isLoading} size="lg">
              {isLoading ? <LoadingSpinner className="mr-2 h-5 w-5" /> : <Sparkles className="mr-2 h-5 w-5" />}
              {isLoading ? (dictionary['TarotReadingPage.drawingCardButton'] || "Drawing Card...") : (dictionary['TarotSpreadPage.getReadingButton'] || 'Reveal Reading')}
              {!isPremium && hasUsedToday && ` (Free)`}
            </Button>
          </div>
        </>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-card/70 backdrop-blur-sm border-white/10 shadow-xl">
              <CardHeader className="text-center">
                <CardTitle className="font-headline text-2xl text-primary">{dictionary['TarotSpreadPage.readingTitle'] || "Your Tarot Spread Reading"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-center gap-4 sm:gap-8">
                  {[reading.card1, reading.card2].map((card, i) => (
                    <div key={i} className="flex flex-col items-center gap-2">
                       <motion.div
                          className="w-[100px] h-[175px] sm:w-[140px] sm:h-[245px] rounded-lg shadow-lg border-2 border-primary/50"
                          initial={{ rotate: card.isReversed ? 180 : 0 }}
                       >
                         <Image src={card.imagePlaceholderUrl} alt={card.cardName} width={140} height={245} className="w-full h-full rounded-md object-cover" />
                       </motion.div>
                       <p className="font-semibold text-center text-sm">{card.cardName} {card.isReversed && `(${dictionary['Tarot.reversed'] || 'Reversed'})`}</p>
                    </div>
                  ))}
                </div>
                <div className="p-4 bg-background/30 rounded-lg">
                  <p className="whitespace-pre-line text-card-foreground leading-relaxed">{reading.reading}</p>
                </div>
                <div className="text-center">
                   <Button onClick={handleReset} variant="outline" size="lg">
                     <RotateCcw className="mr-2 h-5 w-5" />
                     {dictionary['TarotSpreadPage.drawAgainButton'] || "Draw Again"}
                     {!isPremium && ` (Free)`}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
