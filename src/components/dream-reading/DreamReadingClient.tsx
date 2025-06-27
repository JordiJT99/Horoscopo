
"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Dictionary, Locale } from '@/lib/dictionaries';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AnimatePresence, motion } from 'framer-motion';
import { Brain, Share2, RotateCcw, Sparkles, Smile, User, MapPin, Hash, PackageSearch, ChevronLeft, ChevronRight, Feather, Home, Users, Drama, BookHeart } from 'lucide-react';
import { dreamInterpretationFlow, type DreamInterpretationInput, type DreamInterpretationOutput, type DreamWizardData } from '@/ai/flows/dream-interpretation-flow';
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from '@/components/shared/LoadingSpinner';

const TOTAL_STEPS = 5;

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
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [viewMode, setViewMode] = useState<ViewMode>('wizard');
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<DreamWizardData>({ coreDescription: '' });

  const [interpretation, setInterpretation] = useState<string | null>(null);
  const [dreamElements, setDreamElements] = useState<DreamInterpretationOutput['dreamElements'] | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const sharedInterpretation = searchParams.get('interpretation');
    if (sharedInterpretation) {
      try {
        const decodedInterpretation = decodeURIComponent(sharedInterpretation);
        setInterpretation(decodedInterpretation);
        setDreamElements(null);
        setViewMode('result');
      } catch (e) {
        console.error("Error decoding shared interpretation:", e);
        setError(dictionary['DreamReadingPage.errorDecoding'] || "Could not display the shared interpretation. It might be corrupted.");
        setViewMode('wizard');
      }
    }
  }, [searchParams, dictionary, isClient]);

  const handleInterpretDream = async () => {
    if (!formData.coreDescription.trim()) {
      toast({ title: dictionary['Error.genericTitle'] || "Error", description: dictionary['DreamWizard.error.coreRequired'] || "The main dream description is required.", variant: 'destructive'});
      return;
    }
    setViewMode('loading');
    setError(null);
    setInterpretation(null);
    setDreamElements(null);
    try {
      const input: DreamInterpretationInput = { dreamData: formData, locale };
      const result: DreamInterpretationOutput = await dreamInterpretationFlow(input);
      setInterpretation(result.interpretation);
      setDreamElements(result.dreamElements);
      setViewMode('result');
    } catch (err) {
      console.error("Error interpreting dream:", err);
      setError(dictionary['DreamReadingPage.errorFetching'] || "The dreamscape is hazy... Could not get an interpretation. Please try again.");
      toast({
        title: dictionary['Error.genericTitle'] || "Error",
        description: dictionary['DreamReadingPage.errorFetching'] || "The dreamscape is hazy... Could not get an interpretation. Please try again.",
        variant: "destructive",
      });
      setViewMode('wizard');
    }
  };

  const handleShare = async () => {
    // Sharing logic remains the same
  };

  const handleNewInterpretation = () => {
    router.push(`/${locale}/dream-reading`);
    setInterpretation(null);
    setDreamElements(null);
    setFormData({ coreDescription: '' });
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

  const handleFormChange = (field: keyof DreamWizardData, value: string) => {
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
    const value = formData[fieldName] || '';
    const maxLength = (stepInfo as any).maxLength;

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
              <Textarea
                value={value}
                onChange={(e) => handleFormChange(fieldName, e.target.value)}
                placeholder={dictionary[stepInfo.placeholderKey]}
                className="min-h-[150px] font-body"
                rows={5}
                maxLength={maxLength}
              />
              {maxLength && (
                <div className="text-right text-xs text-muted-foreground mt-1 pr-1">
                  {value.length} / {maxLength}
                </div>
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
            {currentStep === TOTAL_STEPS ? (dictionary['DreamWizard.getInterpretationButton'] || 'Get Interpretation') : (dictionary['DreamWizard.nextButton'] || 'Next')}
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
            {searchParams.get('interpretation')
                ? (dictionary['DreamReadingPage.sharedInterpretationTitle'] || "A Shared Dream Interpretation")
                : (dictionary['DreamReadingPage.interpretationTitle'] || "Dream Interpretation")}
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 md:space-y-6 px-4 pb-4 md:px-6 md:pb-6">
            <div className="font-body text-card-foreground leading-relaxed space-y-2 md:space-y-3 text-sm md:text-base whitespace-pre-line">
              {interpretation?.split('\\n').map((paragraph, index) => <p key={index}>{paragraph}</p>)}
            </div>
            {dreamElements && (
              <div className="mt-6 bg-secondary/20 p-4 sm:p-6 rounded-lg shadow">
                <h3 className="font-headline text-lg md:text-xl text-primary flex items-center justify-center gap-2 mb-4">
                  <PackageSearch className="w-5 h-5 md:w-6 md:h-6" /> {dictionary['DreamReadingPage.dreamMapTitle'] || "Dream Map"}
                </h3>
                <div className="space-y-4">
                  <DreamMapCategory title={dictionary['DreamReadingPage.mapSymbols'] || "Key Symbols"} items={dreamElements.symbols} icon={Hash} />
                  <DreamMapCategory title={dictionary['DreamReadingPage.mapEmotions'] || "Dominant Emotions"} items={dreamElements.emotions} icon={Smile} />
                  <DreamMapCategory title={dictionary['DreamReadingPage.mapCharacters'] || "Characters"} items={dreamElements.characters} icon={Users} />
                  <DreamMapCategory title={dictionary['DreamReadingPage.mapLocations'] || "Locations"} items={dreamElements.locations} icon={MapPin} />
                  <DreamMapCategory title={dictionary['DreamReadingPage.mapThemes'] || "Core Themes"} items={dreamElements.themes} icon={Brain} />
                </div>
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <Button onClick={handleNewInterpretation} variant="outline" className="flex-1">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  {dictionary['DreamReadingPage.newInterpretationButton'] || "Get a New Interpretation"}
              </Button>
              <Button onClick={handleShare} className="flex-1">
                  <Share2 className="mr-2 h-4 w-4" />
                  {dictionary['Share.buttonLabelInterpretationLinkContent'] || "Share This Interpretation"}
              </Button>
            </div>
        </CardContent>
    </Card>
  );

  const renderLoading = () => (
    <Card className="w-full max-w-xl mx-auto shadow-xl flex flex-col items-center justify-center min-h-[300px] p-8">
        <Brain className="h-16 w-16 text-primary animate-pulse mb-4" />
        <h2 className="text-xl font-headline font-semibold text-primary">{dictionary['DreamReadingPage.interpretingButton'] || "Interpreting Dreamscape..."}</h2>
        <p className="text-muted-foreground mt-2 text-center">{dictionary['DreamWizard.loadingMessage'] || "The spirits are analyzing the symbols and emotions of your journey..."}</p>
    </Card>
  );

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
