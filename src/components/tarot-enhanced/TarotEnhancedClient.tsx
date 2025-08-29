/**
 * @fileOverview Cliente del Sistema de Tarot Mejorado
 * Sistema completo con categorías, modos y selección de cartas como tarot-spread
 */

"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Clock,
  Calendar,
  TrendingUp,
  RotateCcw,
  Briefcase,
  Smile,
  Target,
  Star,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import SectionTitle from "@/components/shared/SectionTitle";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { usePremium } from "@/hooks/use-premium";
import { useCosmicEnergy } from "@/hooks/use-cosmic-energy";
import { tarotSpreadFlow } from "@/ai/flows/tarot-spread-flow";
import { pastPresentFutureFlow } from "@/ai/flows/past-present-future-flow";
import { multiCardFlow } from "@/ai/flows/multi-card-flow";
import type { Dictionary, Locale } from "@/types";
import { ALL_TAROT_CARDS, getTarotCardImagePath } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface TarotEnhancedClientProps {
  dictionary: Dictionary;
  locale: Locale;
}

type TarotCategory = "love" | "work" | "wellness" | "general" | "past_present_future";
type TarotMode = "simple" | "standard" | "advanced";
type ReadingType = "standard" | "multi" | "past_present_future";

interface TarotConfiguration {
  category: TarotCategory;
  mode: TarotMode;
  readingType: ReadingType;
}

interface CardState {
  name: string;
  isReversed: boolean;
}

interface StandardReading {
  card1: CardState;
  card2: CardState;
  reading: string;
  timestamp: Date;
  category: TarotCategory;
  mode: TarotMode;
}

interface PastPresentFutureReading {
  pastCard: CardState;
  presentCard: CardState;
  futureCard: CardState;
  reading: string;
  tldr: string;
  timestamp: Date;
  category: TarotCategory;
  mode: TarotMode;
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function TarotEnhancedClient({ dictionary, locale }: TarotEnhancedClientProps) {
  const [step, setStep] = useState<"category" | "mode" | "shuffling" | "selecting" | "reading">("category");
  const [selectedCategory, setSelectedCategory] = useState<TarotCategory | null>(null);
  const [configuration, setConfiguration] = useState<TarotConfiguration | null>(null);
  const [shuffledCards, setShuffledCards] = useState<string[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [selectedCards, setSelectedCards] = useState<CardState[]>([]);
  const [reading, setReading] = useState<StandardReading | PastPresentFutureReading | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [showPremiumDialog, setShowPremiumDialog] = useState(false);

  const { isPremium } = usePremium();
  const { addEnergyPoints } = useCosmicEnergy();

  const cardBackPath = "/custom_assets/tarot-card-back.png";

  useEffect(() => {
    setShuffledCards(shuffleArray(ALL_TAROT_CARDS));
  }, []);

  const categories = [
    {
      id: "love" as TarotCategory,
      name: dictionary["TarotEnhanced.categories.love"] || "Love",
      icon: Briefcase,
      description: dictionary["TarotEnhanced.categories.loveDesc"] || "Relationships, romance and emotional connections",
      color: "from-pink-500 to-rose-500",
      gradient: "bg-gradient-to-br from-pink-50 to-rose-100 dark:from-pink-900/20 dark:to-rose-900/20",
    },
    {
      id: "work" as TarotCategory,
      name: dictionary["TarotEnhanced.categories.work"] || "Work",
      icon: Briefcase,
      description: dictionary["TarotEnhanced.categories.workDesc"] || "Career, finance and abundance",
      color: "from-green-500 to-emerald-500",
      gradient: "bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20",
    },
    {
      id: "wellness" as TarotCategory,
      name: dictionary["TarotEnhanced.categories.wellness"] || "Wellness",
      icon: Smile,
      description: dictionary["TarotEnhanced.categories.wellnessDesc"] || "Health, balance and personal growth",
      color: "from-blue-500 to-cyan-500",
      gradient: "bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20",
    },
    {
      id: "general" as TarotCategory,
      name: dictionary["TarotEnhanced.categories.general"] || "General",
      icon: Target,
      description: dictionary["TarotEnhanced.categories.generalDesc"] || "General guidance for your life",
      color: "from-purple-500 to-violet-500",
      gradient: "bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-900/20 dark:to-violet-900/20",
    },
    {
      id: "past_present_future" as TarotCategory,
      name: dictionary["TarotEnhanced.categories.ppf"] || "Past / Present / Future",
      icon: Clock,
      description:
        dictionary["TarotEnhanced.categories.ppfDesc"] || "Deep timeframe reading: Past / Present / Future (Premium)",
      color: "from-yellow-400 to-orange-400",
      gradient: "bg-gradient-to-br from-yellow-50 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20",
      premium: true,
    },
  ];

  const modes = [
    {
      id: "simple" as TarotMode,
      name: dictionary["TarotEnhanced.modes.simple"] || "Simple",
      cards: "2 cards",
      description: dictionary["TarotEnhanced.modes.simpleDesc"] || "Quick 2-card reading",
      premium: false,
      readingType: "standard" as ReadingType,
    },
    {
      id: "standard" as TarotMode,
      name: dictionary["TarotEnhanced.modes.standard"] || "Standard",
      cards: "3-4 cards",
      description: dictionary["TarotEnhanced.modes.standardDesc"] || "Deeper 3-4 card reading (Premium)",
      premium: true,
      readingType: "multi" as ReadingType,
    },
    {
      id: "advanced" as TarotMode,
      name: dictionary["TarotEnhanced.modes.advanced"] || "Advanced",
      cards: "5 cards",
      description: dictionary["TarotEnhanced.modes.advancedDesc"] || "Advanced detailed 5-card reading (Premium)",
      premium: true,
      readingType: "multi" as ReadingType,
    },
  ];

  const handleCategorySelect = (catId: TarotCategory) => {
    const catData = categories.find((c) => c.id === catId);
    if (!catData) return;

    if ((catData as any).premium && !isPremium) {
      setShowPremiumDialog(true);
      return;
    }

    if (catId === "past_present_future") {
      setSelectedCategory(catId);
      const config: TarotConfiguration = { category: catId, mode: "advanced", readingType: "past_present_future" };
      setConfiguration(config);
      setStep("shuffling");
      setIsShuffling(true);
      setTimeout(() => {
        setShuffledCards(shuffleArray(ALL_TAROT_CARDS));
        setIsShuffling(false);
        setStep("selecting");
      }, 800);
      return;
    }

    setSelectedCategory(catId);
    setStep("mode");
  };

  const handleModeSelect = (mode: TarotMode) => {
    const modeData = modes.find((m) => m.id === mode);
    if (!modeData || !selectedCategory) return;

    if (modeData.premium && !isPremium) {
      setShowPremiumDialog(true);
      return;
    }

    const config: TarotConfiguration = {
      category: selectedCategory,
      mode,
      readingType: selectedCategory === "past_present_future" ? "past_present_future" : modeData.readingType,
    };
    setConfiguration(config);
    setStep("shuffling");
    setIsShuffling(true);
    setTimeout(() => {
      setShuffledCards(shuffleArray(ALL_TAROT_CARDS));
      setIsShuffling(false);
      setStep("selecting");
    }, 800);
  };

  const handleCardClick = (index: number) => {
    if (!configuration) return;

    let maxAllowed = 2;
    if (configuration.readingType === "past_present_future") maxAllowed = 3;
    else if (configuration.readingType === "multi") maxAllowed = configuration.mode === "advanced" ? 5 : 4;

    if (selectedIndices.includes(index) || selectedIndices.length >= maxAllowed) return;

    setSelectedIndices((prev) => {
      const next = [...prev, index];
      if (next.length === maxAllowed) {
        try {
          const btn = document.getElementById("tarot-generate-btn");
          if (btn) btn.scrollIntoView({ behavior: "smooth", block: "center" });
        } catch {}
      }
      return next;
    });

    setSelectedCards((prev) => [...prev, { name: shuffledCards[index], isReversed: Math.random() < 0.3 }]);
  };

  const generateReading = async () => {
    if (!configuration || selectedCards.length === 0 || isLoading) return;
    setIsLoading(true);
    try {
      if (
        (configuration.mode === "standard" || configuration.mode === "advanced" || configuration.category === "past_present_future") &&
        !isPremium
      ) {
        setIsLoading(false);
        setShowPremiumDialog(true);
        return;
      }

      if (configuration.readingType === "past_present_future" && selectedCards.length === 3) {
        const result = await pastPresentFutureFlow({
          pastCardName: selectedCards[0].name,
          pastCardReversed: selectedCards[0].isReversed,
          presentCardName: selectedCards[1].name,
          presentCardReversed: selectedCards[1].isReversed,
          futureCardName: selectedCards[2].name,
          futureCardReversed: selectedCards[2].isReversed,
          locale,
        });
        setReading({
          pastCard: selectedCards[0],
          presentCard: selectedCards[1],
          futureCard: selectedCards[2],
          reading: result.reading,
          tldr: result.tldr,
          timestamp: new Date(),
          category: configuration.category,
          mode: configuration.mode,
        } as PastPresentFutureReading);
      } else if (configuration.readingType === "multi" && selectedCards.length >= 3 && selectedCards.length <= 5) {
        const result = await multiCardFlow({
          cards: selectedCards.map((c) => ({ name: c.name, isReversed: c.isReversed })),
          locale,
        });
        setReading({
          card1: selectedCards[0],
          card2: selectedCards[1],
          reading: result.reading,
          timestamp: new Date(),
          category: configuration.category,
          mode: configuration.mode,
        } as StandardReading);
      } else if (selectedCards.length === 2) {
        const result = await tarotSpreadFlow({
          card1Name: selectedCards[0].name,
          card1Reversed: selectedCards[0].isReversed,
          card2Name: selectedCards[1].name,
          card2Reversed: selectedCards[1].isReversed,
          locale,
        });
        setReading({
          card1: selectedCards[0],
          card2: selectedCards[1],
          reading: result.reading,
          timestamp: new Date(),
          category: configuration.category,
          mode: configuration.mode,
        } as StandardReading);
      }

      setStep("reading");
      try {
        addEnergyPoints?.("daily_horoscope_view" as any, 30 as any);
      } catch {}
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const resetReading = () => {
    setStep("category");
    setSelectedCategory(null);
    setConfiguration(null);
    setSelectedIndices([]);
    setSelectedCards([]);
    setReading(null);
    setIsLoading(false);
    setIsShuffling(false);
  };

  const goBack = () => {
    if (step === "mode") setStep("category");
    else if (step === "selecting" || step === "shuffling") setStep("mode");
    else if (step === "reading") setStep("selecting");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
      <div className="container mx-auto px-4 py-8">
        <SectionTitle
          title={dictionary["TarotEnhanced.pageTitle"] || "Enhanced Tarot"}
          subtitle={
            dictionary["TarotEnhanced.pageSubtitle"] ||
            "A complete reading experience with personalized configuration, tactile shuffling, conscious breathing and progressive revelation"
          }
          icon={Sparkles}
        />

        {/* Category step */}
        {step === "category" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-4">
                {dictionary["TarotEnhanced.selectCategory"] || "Choose an area"}
              </h2>
              <p className="text-muted-foreground">
                {dictionary["TarotEnhanced.categoryDesc"] || "Select the area of life you want guidance on"}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
              {categories.map((category) => {
                const Icon = (category as any).icon as any;
                return (
                  <motion.div key={category.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Card
                      className={cn(
                        "relative cursor-pointer transition-all duration-300 hover:shadow-lg",
                        (category as any).gradient,
                      )}
                      onClick={() => handleCategorySelect(category.id as TarotCategory)}
                    >
                      <CardContent className="p-6 text-center">
                        <div
                          className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center`}
                        >
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        {(category as any).premium && (
                          <Badge variant="default" className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-orange-500">
                            Premium
                          </Badge>
                        )}
                        <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
                        <ChevronRight className="w-5 h-5 text-muted-foreground mx-auto" />
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Premium dialog */}
        <Dialog open={showPremiumDialog} onOpenChange={setShowPremiumDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{dictionary["TarotEnhanced.premiumRequiredTitle"] || "Premium feature"}</DialogTitle>
            </DialogHeader>
            <div className="py-2 text-center">
              <p className="text-muted-foreground mb-4">
                {dictionary["TarotEnhanced.premiumRequiredDesc"] || "This reading is available for premium users only."}
              </p>
            </div>
            <DialogFooter>
              <Button onClick={() => setShowPremiumDialog(false)} className="w-full">
                {dictionary["TarotEnhanced.premiumRequiredClose"] || "Close"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Mode step */}
        {step === "mode" && selectedCategory && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex items-center mb-6">
              <Button onClick={goBack} variant="ghost" size="sm" className="mr-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {dictionary["TarotEnhanced.back"] || "Back"}
              </Button>
              <div className="flex items-center space-x-2">
                {(() => {
                  const cat = categories.find((c) => c.id === selectedCategory);
                  if (!cat) return null;
                  const Icon = (cat as any).icon as any;
                  return (
                    <div
                      key={cat.id}
                      className={`w-8 h-8 rounded-full bg-gradient-to-r ${cat.color} flex items-center justify-center`}
                    >
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                  );
                })()}
              </div>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-4">{dictionary["TarotEnhanced.selectMode"] || "Choose reading mode"}</h2>
              <p className="text-muted-foreground">{dictionary["TarotEnhanced.modeDesc"] || "Select depth and limits"}</p>
            </div>

            <div className="space-y-4 max-w-md mx-auto">
              {modes.map((mode) => (
                <motion.div key={mode.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Card
                    className={cn(
                      "cursor-pointer transition-all duration-300 hover:shadow-lg",
                      mode.premium && !isPremium && "opacity-60",
                    )}
                    onClick={() => handleModeSelect(mode.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            {mode.id === "simple" && <Sparkles className="w-5 h-5 text-primary" />}
                            {mode.id === "standard" && <Star className="w-5 h-5 text-primary" />}
                            {mode.id === "advanced" && <Clock className="w-5 h-5 text-primary" />}
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{mode.name}</h3>
                            <Badge variant="outline" className="text-xs">
                              {mode.cards}
                            </Badge>
                          </div>
                        </div>
                        {mode.premium && (
                          <Badge variant="default" className="bg-gradient-to-r from-yellow-400 to-orange-500">
                            Premium
                          </Badge>
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground mb-4">{mode.description}</p>
                      <ChevronRight className="w-5 h-5 text-muted-foreground ml-auto" />
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Shuffling step */}
        {step === "shuffling" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-8">
            <div className="space-y-4">
              <Button onClick={goBack} variant="ghost" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {dictionary["TarotEnhanced.back"] || "Back"}
              </Button>
              <h2 className="text-2xl font-bold">
                {dictionary["TarotSpreadPage.shufflingText"] || "Shuffling cards..."}
              </h2>

              {configuration && (
                <div className="flex items-center justify-center space-x-4 mb-6">
                  <Badge variant="outline" className="text-base px-4 py-2">
                    {categories.find((c) => c.id === configuration.category)?.name}
                  </Badge>
                  <Badge variant="outline" className="text-base px-4 py-2">
                    {modes.find((m) => m.id === configuration.mode)?.name}
                  </Badge>
                </div>
              )}
            </div>

            <div className="flex justify-center space-x-4">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="relative w-24 h-36 sm:w-32 sm:h-48"
                  animate={{ y: [0, -20, 0], rotateZ: [0, 10, -10, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                >
                  <Image src={cardBackPath} alt="Card back" fill style={{ objectFit: "cover" }} className="rounded-lg shadow-lg" />
                </motion.div>
              ))}
            </div>

            <p className="text-muted-foreground">
              {dictionary["TarotSpreadPage.concentrateText"] || "Concentrate on your question..."}
            </p>
          </motion.div>
        )}

        {/* Selecting step */}
        {step === "selecting" && configuration && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex items-center mb-6">
              <Button onClick={goBack} variant="ghost" size="sm" className="mr-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {dictionary["TarotEnhanced.back"] || "Back"}
              </Button>
              <div className="flex items-center space-x-4">
                <Badge variant="outline" className="text-sm px-3 py-1">
                  {categories.find((c) => c.id === configuration.category)?.name}
                </Badge>
                <Badge variant="outline" className="text-sm px-3 py-1">
                  {modes.find((m) => m.id === configuration.mode)?.name}
                </Badge>
              </div>
            </div>

            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-primary mb-4">
                {configuration.readingType === "past_present_future"
                  ? selectedIndices.length === 0
                    ? dictionary["TarotEnhanced.selectPastCard"] || "Select the Past card"
                    : selectedIndices.length === 1
                    ? dictionary["TarotEnhanced.selectPresentCard"] || "Now select the Present card"
                    : dictionary["TarotEnhanced.selectFutureCard"] || "Finally select the Future card"
                  : configuration.readingType === "multi"
                  ? dictionary["TarotEnhanced.selectMultiCards"] ||
                    `Select ${modes.find((m) => m.id === configuration.mode)?.cards}`
                  : (dictionary["TarotSpreadPage.selectTwoCards"]?.replace("{count}", "2") as string) || "Select 2 cards"}
              </h3>

              {configuration.readingType === "past_present_future" && (
                <p className="text-sm text-muted-foreground mb-4">
                  {dictionary["TarotEnhanced.ppfStepIndicator"] || `Step ${Math.min(selectedIndices.length + 1, 3)} of 3`}
                </p>
              )}

              <div className="flex justify-center items-center gap-2 mb-6">
                {(() => {
                  let displayCount = 2;
                  if (configuration.readingType === "past_present_future") displayCount = 3;
                  else if (configuration.readingType === "multi") displayCount = configuration.mode === "advanced" ? 5 : 4;
                  return Array.from({ length: displayCount }).map((_, idx) => (
                    <div key={idx} className={cn("w-8 h-1 rounded", idx < selectedIndices.length ? "bg-primary" : "bg-muted-foreground/30")} />
                  ));
                })()}
              </div>

              <div className="grid grid-cols-6 sm:grid-cols-7 md:grid-cols-9 gap-2 sm:gap-4 justify-center">
                {shuffledCards.map((cardName, index) => {
                  const isSelected = selectedIndices.includes(index);
                  const cardData = isSelected ? selectedCards.find((c) => c.name === cardName) : null;

                  let maxCards = 2;
                  if (configuration.readingType === "past_present_future") maxCards = 3;
                  else if (configuration.readingType === "multi") maxCards = configuration.mode === "advanced" ? 5 : 4;

                  return (
                    <div key={index} className="perspective-1000">
                      <motion.div
                        className="relative w-full aspect-[2/3] transform-style-preserve-3d"
                        animate={{ rotateY: isSelected ? 180 : 0 }}
                        transition={{ duration: 0.5 }}
                        onClick={() => handleCardClick(index)}
                      >
                        <div
                          className={cn(
                            "absolute w-full h-full backface-hidden rounded-md overflow-hidden shadow-lg border-2 border-primary/20",
                            !isSelected &&
                              selectedIndices.length < maxCards &&
                              "cursor-pointer hover:shadow-primary/40 hover:scale-105 transition-all duration-300",
                          )}
                        >
                          <Image src={cardBackPath} alt={dictionary["TarotDailyReading.cardBackAlt"] || "Card back"} fill style={{ objectFit: "cover" }} />
                        </div>

                        <div className="absolute w-full h-full backface-hidden [transform:rotateY(180deg)] rounded-md overflow-hidden shadow-lg border-2 border-primary/50">
                          {cardData && (
                            <motion.div className="w-full h-full" animate={{ rotate: cardData.isReversed ? 180 : 0 }}>
                              <Image src={getTarotCardImagePath(cardData.name)} alt={cardData.name} fill style={{ objectFit: "cover" }} />
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    </div>
                  );
                })}
              </div>

              <div className="text-center mt-8">
                <Button
                  id="tarot-generate-btn"
                  onClick={generateReading}
                  disabled={(() => {
                    if (!configuration) return true;
                    if (configuration.readingType === "past_present_future") return selectedIndices.length !== 3 || isLoading;
                    if (configuration.readingType === "multi") {
                      if (configuration.mode === "standard") return selectedIndices.length < 3 || selectedIndices.length > 4 || isLoading;
                      if (configuration.mode === "advanced") return selectedIndices.length !== 5 || isLoading;
                    }
                    return selectedIndices.length !== 2 || isLoading;
                  })()}
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  {isLoading ? <LoadingSpinner className="mr-2 h-5 w-5" /> : <Sparkles className="mr-2 h-5 w-5" />}
                  {isLoading
                    ? dictionary["TarotSpreadPage.generatingReading"] || "Generating reading..."
                    : dictionary["TarotSpreadPage.getReadingButton"] || "Generate Reading"}
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Reading step */}
        {step === "reading" && reading && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-4 mb-6">
                <Badge variant="outline" className="text-base px-4 py-2">
                  {categories.find((c) => c.id === configuration?.category)?.name}
                </Badge>
                <Badge variant="outline" className="text-base px-4 py-2">
                  {modes.find((m) => m.id === configuration?.mode)?.name}
                </Badge>
              </div>
              <h2 className="text-2xl font-bold">{dictionary["TarotSpreadPage.yourReading"] || "Your Reading"}</h2>
            </div>

            {"pastCard" in reading && (
              <div className="space-y-8">
                <Card className="max-w-4xl mx-auto">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Sparkles className="w-5 h-5 text-purple-600" />
                      <span>{dictionary["TarotEnhanced.tldr"] || "TL;DR"}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg text-muted-foreground">{(reading as PastPresentFutureReading).tldr}</p>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                  {[
                    { card: (reading as PastPresentFutureReading).pastCard, icon: Clock, label: dictionary["TarotEnhanced.past"] || "Past" },
                    { card: (reading as PastPresentFutureReading).presentCard, icon: Calendar, label: dictionary["TarotEnhanced.present"] || "Present" },
                    { card: (reading as PastPresentFutureReading).futureCard, icon: TrendingUp, label: dictionary["TarotEnhanced.future"] || "Future" },
                  ].map(({ card, icon: Icon, label }, index) => (
                    <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.2 }} className="text-center">
                      <div className="mb-4 flex items-center justify-center space-x-2">
                        <Icon className="w-5 h-5 text-purple-600" />
                        <Badge variant="outline" className="text-base px-3 py-1">
                          {label}
                        </Badge>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-40 h-60 mx-auto mb-4">
                          <img
                            src={getTarotCardImagePath(card.name)}
                            alt={card.name}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            className={cn("rounded-lg", card.isReversed && "rotate-180")}
                          />
                        </div>
                        <h3 className="font-semibold text-lg">{card.name}</h3>
                        {card.isReversed && <Badge variant="secondary" className="mt-2">{dictionary["TarotSpreadPage.reversed"] || "Reversed"}</Badge>}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {"card1" in reading && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {[(reading as StandardReading).card1, (reading as StandardReading).card2].map((card, index) => (
                  <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.2 }} className="text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-44 h-66 mx-auto mb-4">
                        <img
                          src={getTarotCardImagePath(card.name)}
                          alt={card.name}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          className={cn("rounded-lg", card.isReversed && "rotate-180")}
                        />
                      </div>
                      <h3 className="font-semibold text-lg">{card.name}</h3>
                      {card.isReversed && <Badge variant="secondary" className="mt-2">{dictionary["TarotSpreadPage.reversed"] || "Reversed"}</Badge>}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            <Card className="max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <span>{dictionary["TarotSpreadPage.interpretation"] || "Interpretation"}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-lg max-w-none dark:prose-invert">
                  <div className="whitespace-pre-wrap text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: reading.reading }} />
                </div>
              </CardContent>
            </Card>

            <Card className="max-w-4xl mx-auto">
              <CardContent className="p-6">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-4">
                    <span>{dictionary["TarotSpreadPage.readingTime"] || "Reading time:"} {reading.timestamp.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>+30 energy points</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <Button onClick={resetReading} size="lg" variant="outline" className="mr-4">
                <RotateCcw className="mr-2 h-5 w-5" />
                {dictionary["TarotSpreadPage.newReading"] || "New Reading"}
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
