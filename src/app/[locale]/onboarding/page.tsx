
"use client";

import { useState, use, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Dictionary, Locale } from '@/lib/dictionaries';
import { getDictionary } from '@/lib/dictionaries';
import type { OnboardingFormData, Gender } from '@/types';
import SectionTitle from '@/components/shared/SectionTitle';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es, enUS, de, fr } from 'date-fns/locale';
import { CalendarIcon, User, VenetianMask, Edit, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react'; // Added User, VenetianMask, Edit
import { useAuth } from '@/context/AuthContext';
import { useToast } from "@/hooks/use-toast";

const dateFnsLocalesMap: Record<Locale, typeof enUS> = {
  es,
  en: enUS,
  de,
  fr,
};

const TOTAL_STEPS = 8; // Will adjust as we add more steps

interface OnboardingPageProps {
  params: { locale: Locale };
}

function OnboardingContent({ dictionary, locale }: { dictionary: Dictionary, locale: Locale }) {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingFormData>({
    name: '',
    gender: '',
    dateOfBirth: undefined,
    timeOfBirth: '',
    cityOfBirth: '',
    relationshipStatus: '',
    employmentStatus: '',
    personalizedAdsConsent: false,
  });
  const [isLoading, setIsLoading] = useState(false); // For form submission simulation
  
  const currentDfnLocale = dateFnsLocalesMap[locale] || enUS;
  const currentYearForCalendar = new Date().getFullYear();

  useEffect(() => {
    // If user is not logged in and not loading, redirect to login
    // This is a basic check. A more robust solution would be needed for production.
    if (!authLoading && !user) {
      router.push(`/${locale}/login`);
      toast({
        title: dictionary['Error.genericTitle'] || "Error",
        description: dictionary['OnboardingPage.mustBeLoggedIn'] || "You must be logged in to complete onboarding.",
        variant: "destructive",
      });
    }
  }, [user, authLoading, router, locale, dictionary, toast]);

  const handleNext = () => {
    // Basic validation for current step
    if (currentStep === 1 && !formData.name.trim()) {
      toast({ title: dictionary['Error.genericTitle'], description: dictionary['OnboardingPage.errorNameRequired'], variant: 'destructive' });
      return;
    }
    if (currentStep === 2 && !formData.gender) {
      toast({ title: dictionary['Error.genericTitle'], description: dictionary['OnboardingPage.errorGenderRequired'], variant: 'destructive' });
      return;
    }
    if (currentStep === 3 && !formData.dateOfBirth) {
      toast({ title: dictionary['Error.genericTitle'], description: dictionary['OnboardingPage.errorDobRequired'], variant: 'destructive' });
      return;
    }

    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Handle final submission
      handleSubmitOnboarding();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleChange = (field: keyof OnboardingFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitOnboarding = async () => {
    setIsLoading(true);
    console.log("Onboarding data submitted:", formData);
    // Here, you would typically save the formData to Firestore
    // For now, we'll simulate a delay and then redirect or show a message.
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Example: Set a flag in localStorage to simulate completion for this session
    localStorage.setItem('onboardingComplete_temp', 'true');

    toast({
      title: dictionary['OnboardingPage.submissionSuccessTitle'] || "Onboarding Complete!",
      description: dictionary['OnboardingPage.submissionSuccessMessage'] || "Your information has been (simulated) saved. Welcome!",
    });
    setIsLoading(false);
    router.push(`/${locale}/profile`); // Redirect to profile after onboarding
  };
  
  const genderOptions: { value: Gender; labelKey: string }[] = [
    { value: "female", labelKey: "OnboardingPage.genderFemale" },
    { value: "male", labelKey: "OnboardingPage.genderMale" },
    { value: "non-binary", labelKey: "OnboardingPage.genderNonBinary" },
    { value: "other", labelKey: "OnboardingPage.genderOther" },
    { value: "prefer-not-to-say", labelKey: "OnboardingPage.genderPreferNotToSay" },
  ];


  if (authLoading) {
    return (
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </main>
    );
  }

  return (
    <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
      <SectionTitle
        title={dictionary['OnboardingPage.title'] || "Welcome to AstroVibes!"}
        subtitle={(dictionary['OnboardingPage.subtitleStep'] || "Step {currentStep} of {totalSteps}: Let's get to know you").replace('{currentStep}', currentStep.toString()).replace('{totalSteps}', TOTAL_STEPS.toString())}
        icon={Edit}
        className="mb-8"
      />
      <Card className="w-full max-w-lg mx-auto shadow-xl">
        <CardHeader>
          {currentStep === 1 && <CardTitle className="font-headline text-xl text-primary text-center flex items-center justify-center gap-2"><User className="w-6 h-6" />{dictionary['OnboardingPage.step1Title'] || "Your Name"}</CardTitle>}
          {currentStep === 2 && <CardTitle className="font-headline text-xl text-primary text-center flex items-center justify-center gap-2"><VenetianMask className="w-6 h-6" />{dictionary['OnboardingPage.step2Title'] || "Your Gender"}</CardTitle>}
          {currentStep === 3 && <CardTitle className="font-headline text-xl text-primary text-center flex items-center justify-center gap-2"><CalendarIcon className="w-6 h-6" />{dictionary['OnboardingPage.step3Title'] || "Date of Birth"}</CardTitle>}
          {/* Titles for other steps will be added here */}
          {currentStep > 3 && currentStep <= TOTAL_STEPS && <CardTitle className="font-headline text-xl text-primary text-center">{dictionary['OnboardingPage.stepComingSoonTitle'] || "More About You"}</CardTitle>}

          <div className="w-full bg-muted rounded-full h-2.5 mt-2">
            <div className="bg-primary h-2.5 rounded-full" style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}></div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 min-h-[200px]">
          {currentStep === 1 && (
            <div className="space-y-2">
              <Label htmlFor="name" className="font-body">{dictionary['OnboardingPage.nameLabel'] || "What's your name?"}</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder={dictionary['OnboardingPage.namePlaceholder'] || "Enter your full name"}
                className="font-body"
                maxLength={100}
              />
              <p className="text-xs text-muted-foreground">{dictionary['OnboardingPage.nameHelper'] || "This will be your display name in the app."}</p>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-2">
              <Label className="font-body">{dictionary['OnboardingPage.genderLabel'] || "How do you identify?"}</Label>
              <RadioGroup
                value={formData.gender}
                onValueChange={(value) => handleChange('gender', value as Gender)}
                className="space-y-1"
              >
                {genderOptions.map(opt => (
                  <div key={opt.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={opt.value} id={`gender-${opt.value}`} />
                    <Label htmlFor={`gender-${opt.value}`} className="font-body">{dictionary[opt.labelKey] || opt.labelKey.split('.').pop()}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}
          
          {currentStep === 3 && (
             <div className="space-y-2">
              <Label htmlFor="dateOfBirth" className="font-body">{dictionary['OnboardingPage.dobLabel'] || "When were you born?"}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="dateOfBirth"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal font-body",
                      !formData.dateOfBirth && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.dateOfBirth ? format(formData.dateOfBirth, "PPP", { locale: currentDfnLocale }) : <span>{dictionary['OnboardingPage.pickDatePlaceholder'] || "Select a date"}</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.dateOfBirth}
                      onSelect={(date) => handleChange('dateOfBirth', date)}
                      disabled={(date: Date) => date > new Date() || date < new Date("1900-01-01")}
                      initialFocus
                      locale={currentDfnLocale}
                      captionLayout="dropdown-buttons"
                      fromYear={1900}
                      toYear={currentYearForCalendar}
                    />
                </PopoverContent>
              </Popover>
            </div>
          )}

          {currentStep > 3 && currentStep <= TOTAL_STEPS && (
            <div className="text-center py-8">
              <p className="text-muted-foreground font-body">{dictionary['OnboardingPage.stepContentComingSoon'] || "Content for this step is coming soon!"}</p>
              <p className="text-xs text-muted-foreground mt-1">({dictionary['OnboardingPage.stepTypePlaceholder'] || `Placeholder for: Step ${currentStep} Form Fields`})</p>
            </div>
          )}

        </CardContent>

        <CardFooter className="flex justify-between pt-6">
          <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1 || isLoading} className="font-body">
            <ChevronLeft className="mr-2 h-4 w-4" />
            {dictionary['OnboardingPage.previousButton'] || "Previous"}
          </Button>
          <Button onClick={handleNext} disabled={isLoading} className="font-body">
            {isLoading ? (
              <>
                <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
                {dictionary['OnboardingPage.submittingButton'] || "Processing..."}
              </>
            ) : currentStep === TOTAL_STEPS ? (
              dictionary['OnboardingPage.finishButton'] || "Finish"
            ) : (
              dictionary['OnboardingPage.nextButton'] || "Next"
            )}
             {currentStep < TOTAL_STEPS && <ChevronRight className="ml-2 h-4 w-4" />}
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}


export default function OnboardingPage({ params: paramsPromise }: OnboardingPageProps) {
  const params = use(paramsPromise);
  const dictionaryPromise = useMemo(() => getDictionary(params.locale), [params.locale]);
  const dictionary = use(dictionaryPromise);

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || Object.keys(dictionary).length === 0) {
    return (
      <div className="flex-grow container mx-auto px-4 py-8 md:py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4">Loading onboarding...</p>
      </div>
    );
  }

  return <OnboardingContent dictionary={dictionary} locale={params.locale} />;
}
