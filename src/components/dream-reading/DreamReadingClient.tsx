

"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Dictionary, Locale } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { AnimatePresence, motion } from 'framer-motion';
import { Brain, Share2, RotateCcw, Sparkles, Smile, User, MapPin, Hash, PackageSearch, ChevronLeft, ChevronRight, Feather, Home, Users, Drama, BookHeart, BarChart3, MessageCircle } from 'lucide-react';
import { dreamInterpretationFlow, type DreamInterpretationInput, type DreamInterpretationOutput, type DreamWizardData } from '@/ai/flows/dream-interpretation-flow';
import type { StoredDream, ZodiacSignName, NewPostData } from '@/types';
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import DreamTrends from './DreamTrends';
import { useAuth } from '@/context/AuthContext';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getSunSignFromDate } from '@/lib/constants';
import { useCosmicEnergy } from '@/hooks/use-cosmic-energy';


const TOTAL_STEPS = 6;
const STARDUST_COST = 10;

type ViewMode = 'wizard' | 'loading' | 'result';

interface DreamReadingClientProps {
  dictionary: Dictionary;
  locale: Locale;
}

const wizardSteps = [
  { step: 1, field: 'coreDescription', titleKey: 'DreamWizard.step1.title', descKey: 'DreamWizard.step1.description', placeholderKey: 'DreamWizard.step1.placeholder', icon: Feather },
  { step: 2, field: 'characters', titleKey: 'DreamWizard.step2.title', descKey: 'DreamWizard.step2.description', placeholderKey: 'DreamWizard.step2.placeholder', icon: Users, maxLength: 50 },
  { step: 3, field: 'locations', titleKey: 'DreamWizard.step3.title', descKey: 'DreamWizard.step3.description', placeholderKey: 'DreamWizard.step3.placeholder', icon: Home, maxLength: 50 },
  { step: 4, field: 'emotions', titleKey: 'DreamWizard.step4.title', descKey: 'DreamWizard.step4.description', placeholderKey: 'DreamWizard.step4.placeholder', icon: Drama, maxLength: 50 },
  { step: 5, field: 'symbols', titleKey: 'DreamWizard.step5.title', descKey: 'DreamWizard.step5.description', placeholderKey: 'DreamWizard.step5.placeholder', icon: BookHeart, maxLength: 50 },
  { step: 6, field: 'vividness', titleKey: 'DreamWizard.step6.title', descKey: 'DreamWizard.step6.description', icon: BarChart3 },
];

const DreamMapCategory = ({ title, items, icon: Icon }: { title: string, items: string[], icon: React.ElementType }) => {
  if (!items || items.length === 0) return null;
  return (
    <div>
      <h4 className="font-headline text-base font-semibold text-accent-foreground mb-2 flex items-center gap-2">
        <Icon className="w-4 h-4 text-primary" />
        {title}
      </h4>
      <div className="flex flex-wrap gap-2">
        {items.map((item, index) => (
          <Badge key={index} variant="secondary" className="text-sm font-normal">{item}</Badge>
        ))}
      </div>
    </div>
  );
};


export default function DreamReadingClient({ dictionary, locale }: DreamReadingClientProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const { level: userLevel, stardust, spendStardust, lastGained, addEnergyPoints } = useCosmicEnergy();
  const isPremium = true; // All users have premium access now

  const [viewMode, setViewMode] = useState<ViewMode>('wizard');
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<DreamWizardData>({ 
    coreDescription: '',
    vividness: 3,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isShowingAd, setIsShowingAd] = useState(false);
  const [interpretationResult, setInterpretationResult] = useState<DreamInterpretationOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [newDreamTrigger, setNewDreamTrigger] = useState(0);
  
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const performInterpretation = async (isFirstUse: boolean) => {
    setViewMode('loading');
    setError(null);
    setInterpretationResult(null);
    try {
      const input: DreamInterpretationInput = { dreamData: formData, locale };
      const result: DreamInterpretationOutput = await dreamInterpretationFlow(input);
      setInterpretationResult(result);
      
      if (isFirstUse) {
        addEnergyPoints('use_dream_reading', 20);
      }

      try {
        const newDreamRecord: StoredDream = {
            id: new Date().toISOString(),
            timestamp: new Date().toISOString(),
            interpretation: result,
            vividness: formData.vividness || 3,
        };
        const storedDreamsRaw = localStorage.getItem('dreamJournal');
        const storedDreams: StoredDream[] = storedDreamsRaw ? JSON.parse(storedDreamsRaw) : [];
        const updatedDreams = [newDreamRecord, ...storedDreams].slice(0, 20);
        localStorage.setItem('dreamJournal', JSON.stringify(updatedDreams));
        setNewDreamTrigger(Date.now());
      } catch(e) {
        console.error("Could not save dream to journal (likely quota exceeded):", e);
      }

      setViewMode('result');
    } catch (err) {
      console.error("Error interpreting dream:", err);
      const errorMessage = dictionary['DreamReadingPage.errorFetching'] || "The dreamscape is hazy... Could not get an interpretation. Please try again.";
      setError(errorMessage);
      toast({
        title: dictionary['Error.genericTitle'] || "Error",
        description: errorMessage,
        variant: "destructive",
      });
      setViewMode('wizard');
    }
  };
  
  const today = new Date().toISOString().split('T')[0];
  const hasUsedToday = lastGained.use_dream_reading === today;

  const handleInterpretDream = async () => {
    if (!formData.coreDescription.trim()) {
      toast({ title: dictionary['Error.genericTitle'] || "Error", description: dictionary['DreamWizard.error.coreRequired'] || "The main dream description is required.", variant: 'destructive'});
      return;
    }
    
    if (!hasUsedToday) { // First use of the day
      if (isPremium) {
        performInterpretation(true);
      } else {
        setIsShowingAd(true);
        toast({
            title: dictionary['Toast.adRequiredTitle'] || "Ad Required",
            description: dictionary['Toast.adRequiredDescription'] || "Watching a short ad for your first use of the day.",
        });
        setTimeout(() => {
            setIsShowingAd(false);
            performInterpretation(true); 
        }, 2500);
      }
    } else { // Subsequent use
      if (stardust < STARDUST_COST) {
        toast({
          title: dictionary['Toast.notEnoughStardustTitle'] || "Not Enough Stardust",
          description: (dictionary['Toast.notEnoughStardustDescription'] || "You need {cost} Stardust for another reading today. Get more from the 'More' section.").replace('{cost}', STARDUST_COST.toString()),
          variant: "destructive",
        });
        return;
      }
      spendStardust(STARDUST_COST);
      toast({
        title: dictionary['Toast.stardustSpent'] || "Stardust Spent",
        description: (dictionary['Toast.stardustSpentDescription'] || "{cost} Stardust has been used for this reading.").replace('{cost}', STARDUST_COST.toString()),
      });
      performInterpretation(false);
    }
  };

  const handleShareToCommunity = async () => {
    if (!user || !db) {
      toast({ title: dictionary['Auth.notLoggedInTitle'], description: dictionary['CommunityPage.loginToPost'], variant: 'destructive' });
      return;
    }
    if (!interpretationResult) {
        toast({ title: "Error", description: "No interpretation data to share.", variant: 'destructive' });
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
        } catch(e) {
          console.error("Could not parse onboarding data to get zodiac sign.", e)
        }
      }
    }
    
    const postData: NewPostData = {
      authorId: user.uid,
      authorName: user.displayName || 'Anonymous Astro-Fan',
      authorAvatarUrl: user.photoURL || `https://placehold.co/64x64/7c3aed/ffffff.png?text=${(user.displayName || 'A').charAt(0)}`,
      authorZodiacSign: authorZodiacSign,
      authorLevel: userLevel,
      postType: 'dream' as const,
      dreamData: interpretationResult
    };

    try {
      await addDoc(collection(db, 'community-posts'), {
        ...postData,
        timestamp: serverTimestamp(),
      });
      toast({ title: dictionary['CommunityPage.shareSuccessTitle'] || "Success!", description: dictionary['CommunityPage.shareDreamSuccess'] || "Your dream has been shared with the community." });
      router.push(`/${locale}/community`);
    } catch (error) {
      toast({ title: dictionary['Error.genericTitle'] || "Error", description: (error as Error).message || "Could not share your dream.", variant: 'destructive' });
    } finally {
        setIsSubmitting(false);
    }
  }

  const handleNewInterpretation = () => {
    router.push(`/${locale}/dream-reading`);
    setInterpretationResult(null);
    setFormData({ coreDescription: '', vividness: 3 });
    setCurrentStep(1);
    setError(null);
    setViewMode('wizard');
  };

  const handleNextStep = () => {
    if (currentStep === 1 && !formData.coreDescription.trim()) {
      toast({ title: dictionary['Error.genericTitle'] || "Error", description: dictionary['DreamWizard.error.coreRequired'] || "The main dream description is required.", variant: 'destructive'});
      return;
    }
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(s => s + 1);
    } else {
      handleInterpretDream();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(s => s - 1);
    }
  };

  const handleFormChange = (field: keyof DreamWizardData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isClient || Object.keys(dictionary).length === 0) {
    return (
      <div className="text-center">
        <LoadingSpinner className="h-12 w-12 text-primary" />
      </div>
    );
  }

  const renderWizard = () => {
    const stepInfo = wizardSteps.find(s => s.step === currentStep);
    if (!stepInfo) return null;
    const Icon = stepInfo.icon;
    const fieldName = stepInfo.field as keyof DreamWizardData;
    const value = formData[fieldName];
    const maxLength = (stepInfo as any).maxLength;

    const getInterpretationButtonText = () => {
      const baseText = dictionary['DreamWizard.getInterpretationButton'] || 'Get Interpretation';
      if (hasUsedToday && !isPremium) {
        return `${baseText} (${STARDUST_COST} 💫)`;
      }
      return baseText;
    };

    return (
      <Card className="w-full max-w-xl mx-auto shadow-xl">
        <CardHeader className="px-4 py-4 md:px-6 md:py-5">
          <Progress value={(currentStep / TOTAL_STEPS) * 100} className="mb-4" />
          <CardTitle className="font-headline text-lg md:text-xl text-primary text-center flex items-center justify-center gap-2">
            <Icon className="w-5 h-5 md:w-6 md:h-6" />
            {dictionary[stepInfo.titleKey]}
          </CardTitle>
          <CardDescription className="text-center font-body text-xs md:text-sm mt-1">
            {dictionary[stepInfo.descKey]}
          </CardDescription>
        </CardHeader>
        <CardContent className="min-h-[180px] md:min-h-[200px] flex flex-col justify-center px-4 pb-0 md:px-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              {stepInfo.field === 'vividness' ? (
                <div className='py-8 px-2'>
                  <Slider
                    defaultValue={[3]}
                    value={[Number(value) || 3]}
                    onValueChange={(val) => handleFormChange(fieldName, val[0])}
                    max={5}
                    min={1}
                    step={1}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>{dictionary['DreamWizard.step6.labelLow'] || 'Vague'}</span>
                    <span>{dictionary['DreamWizard.step6.labelHigh'] || 'Vivid'}</span>
                  </div>
                </div>
              ) : (
                <>
                <Textarea
                  value={String(value || '')}
                  onChange={(e) => handleFormChange(fieldName, e.target.value)}
                  placeholder={dictionary[stepInfo.placeholderKey]}
                  className="min-h-[150px] font-body"
                  rows={5}
                  maxLength={maxLength}
                />
                {maxLength && (
                  <div className="text-right text-xs text-muted-foreground mt-1 pr-1">
                    {String(value || '').length} / {maxLength}
                  </div>
                )}
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </CardContent>
        <CardFooter className="flex justify-between pt-4 md:pt-6 px-4 pb-4 md:px-6 md:pb-6">
          <Button variant="outline" onClick={handlePrevStep} disabled={currentStep === 1}>
            <ChevronLeft className="mr-1 h-4 w-4" />
            {dictionary['DreamWizard.prevButton'] || 'Previous'}
          </Button>
          <Button onClick={handleNextStep}>
            {currentStep === TOTAL_STEPS ? getInterpretationButtonText() : (dictionary['DreamWizard.nextButton'] || 'Next')}
            {currentStep < TOTAL_STEPS && <ChevronRight className="ml-1 h-4 w-4" />}
          </Button>
        </CardFooter>
      </Card>
    );
  };
  
  const renderResult = () => (
    <Card className="w-full max-w-xl mx-auto shadow-xl">
        <CardHeader className="px-4 py-4 md:px-6 md:py-5">
            <CardTitle className="font-headline text-xl md:text-2xl text-primary text-center">
                {dictionary['DreamReadingPage.interpretationTitle'] || "Dream Interpretation"}
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 md:space-y-6 px-4 pb-4 md:px-6 md:pb-6">
            <div className="font-body text-card-foreground leading-relaxed space-y-2 md:space-y-3 text-sm md:text-base whitespace-pre-line">
              {interpretationResult?.interpretation?.split('\\n').map((paragraph, index) => <p key={index}>{paragraph}</p>)}
            </div>

            <div className="mt-6 bg-secondary/20 p-4 sm:p-6 rounded-lg shadow">
                <h3 className="font-headline text-lg md:text-xl text-primary flex items-center justify-center gap-2 mb-4">
                  <BarChart3 className="w-5 h-5 md:w-6 md:h-6" /> {dictionary['DreamReadingPage.dreamEnergyTitle'] || "Dream Energy Level"}
                </h3>
                <Progress value={(formData.vividness || 0) * 20} className="h-3" />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{dictionary['DreamWizard.step6.labelLow'] || "Vague"}</span>
                  <span>{dictionary['DreamWizard.step6.labelHigh'] || "Vivid"}</span>
                </div>
            </div>

            {interpretationResult?.dreamElements && (
              <div className="mt-6 bg-secondary/20 p-4 sm:p-6 rounded-lg shadow">
                <h3 className="font-headline text-lg md:text-xl text-primary flex items-center justify-center gap-2 mb-4">
                  <PackageSearch className="w-5 h-5 md:w-6 md:h-6" /> {dictionary['DreamReadingPage.dreamMapTitle'] || "Dream Map"}
                </h3>
                <div className="space-y-4">
                  <DreamMapCategory title={dictionary['DreamReadingPage.mapSymbols'] || "Key Symbols"} items={interpretationResult.dreamElements.symbols} icon={Hash} />
                  <DreamMapCategory title={dictionary['DreamReadingPage.mapEmotions'] || "Dominant Emotions"} items={interpretationResult.dreamElements.emotions} icon={Smile} />
                  <DreamMapCategory title={dictionary['DreamReadingPage.mapCharacters'] || "Characters"} items={interpretationResult.dreamElements.characters} icon={Users} />
                  <DreamMapCategory title={dictionary['DreamReadingPage.mapLocations'] || "Locations"} items={interpretationResult.dreamElements.locations} icon={MapPin} />
                  <DreamMapCategory title={dictionary['DreamReadingPage.mapThemes'] || "Core Themes"} items={interpretationResult.dreamElements.themes} icon={Brain} />
                </div>
              </div>
            )}
            
            <DreamTrends dictionary={dictionary} newDreamTrigger={newDreamTrigger} />

            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <Button onClick={handleNewInterpretation} variant="outline" className="flex-1">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  {dictionary['DreamReadingPage.newInterpretationButton'] || "Get a New Interpretation"} {!isPremium && `(${STARDUST_COST} 💫)`}
              </Button>
               <Button onClick={handleShareToCommunity} disabled={isSubmitting} className="flex-1">
                 {isSubmitting ? <LoadingSpinner className="h-4 w-4 mr-2" /> : <MessageCircle className="mr-2 h-4 w-4" />}
                 {dictionary['CommunityPage.shareToCommunity'] || "Share to Community"}
              </Button>
            </div>
        </CardContent>
    </Card>
  );

  const renderLoading = () => {
    if (isShowingAd) {
      return (
        <Card className="w-full max-w-xl mx-auto shadow-xl flex flex-col items-center justify-center min-h-[300px] p-8">
            <LoadingSpinner className="h-16 w-16 text-primary animate-pulse mb-4" />
            <h2 className="text-xl font-headline font-semibold text-primary">{dictionary['Toast.watchingAd'] || "Watching ad..."}</h2>
        </Card>
      )
    }
    return (
      <Card className="w-full max-w-xl mx-auto shadow-xl flex flex-col items-center justify-center min-h-[300px] p-8">
          <Brain className="h-16 w-16 text-primary animate-pulse mb-4" />
          <h2 className="text-xl font-headline font-semibold text-primary">{dictionary['DreamReadingPage.interpretingButton'] || "Interpreting Dreamscape..."}</h2>
          <p className="text-muted-foreground mt-2 text-center">{dictionary['DreamWizard.loadingMessage'] || "The spirits are analyzing the symbols and emotions of your journey..."}</p>
      </Card>
    );
  }

  if (error) {
    return <p className="text-destructive text-center font-body text-sm md:text-base">{error}</p>;
  }
  
  switch(viewMode) {
    case 'wizard':
      return renderWizard();
    case 'loading':
      return renderLoading();
    case 'result':
      return renderResult();
  }
}
