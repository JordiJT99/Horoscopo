

"use client";

import { useState, useMemo, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { Dictionary, Locale } from '@/lib/dictionaries';
import type { OnboardingFormData, Gender, RelationshipStatus, EmploymentStatus } from '@/types';
import SectionTitle from '@/components/shared/SectionTitle';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es, enUS, de, fr } from 'date-fns/locale';
import { CalendarIcon, User, VenetianMask, Edit, ChevronRight, ChevronLeft, Sparkles, Clock, Building, Users2, Briefcase, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { useCosmicEnergy } from '@/hooks/use-cosmic-energy';

const dateFnsLocalesMap: Record<Locale, typeof es | typeof enUS | typeof de | typeof fr> = {
  es,
  en: enUS,
  de,
  fr,
};

const TOTAL_STEPS = 8;

const mysticalPhrasesKeys = [
  "OnboardingPage.mysticalPhrase1",
  "OnboardingPage.mysticalPhrase2",
  "OnboardingPage.mysticalPhrase3",
  "OnboardingPage.mysticalPhrase4",
  "OnboardingPage.mysticalPhrase5"
];

interface OnboardingClientContentProps {
  dictionary: Dictionary;
  locale: Locale;
}

export default function OnboardingClientContent({ dictionary, locale }: OnboardingClientContentProps) {
  const router = useRouter();
  const { user, isLoading: authLoading, markOnboardingAsComplete } = useAuth();
  const { toast } = useToast();
  const { addEnergyPoints } = useCosmicEnergy();

  const [currentStep, setCurrentStep] = useState(1);
  const initialDateOfBirth = new Date(1995, 5, 15);
  const [formData, setFormData] = useState<OnboardingFormData>({
    name: '',
    gender: '',
    dateOfBirth: initialDateOfBirth,
    timeOfBirth: '',
    cityOfBirth: '',
    relationshipStatus: '',
    employmentStatus: '',
    personalizedAdsConsent: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentMysticalPhrase, setCurrentMysticalPhrase] = useState('');
  const [isClient, setIsClient] = useState(false);

  const currentDfnLocale = dateFnsLocalesMap[locale] || enUS;
  const currentYearForCalendar = useMemo(() => new Date().getFullYear(), []);

  useEffect(() => {
    setIsClient(true); // Component has mounted
  }, []);

  useEffect(() => {
    if (!isClient) return; // Only run client-side logic after mount
    if (!authLoading && !user) {
      router.push(`/${locale}/login`);
    }
  }, [user, authLoading, router, locale, isClient]);

  useEffect(() => {
    if (!isClient) return;
    let phraseInterval: NodeJS.Timeout;
    if (isSubmitting) {
      let phraseIndex = 0;
      setCurrentMysticalPhrase(dictionary[mysticalPhrasesKeys[phraseIndex]] || "Analizando...");
      phraseInterval = setInterval(() => {
        phraseIndex = (phraseIndex + 1) % mysticalPhrasesKeys.length;
        setCurrentMysticalPhrase(dictionary[mysticalPhrasesKeys[phraseIndex]] || "Consultando...");
      }, 2500);
    }
    return () => clearInterval(phraseInterval);
  }, [isSubmitting, dictionary, isClient]);

  const validateStep = useCallback((): boolean => {
    let isValid = true;
    let errorKey = '';

    switch (currentStep) {
      case 1:
        if (!formData.name.trim()) {
          isValid = false;
          errorKey = 'OnboardingPage.errorNameRequired';
        }
        break;
      case 2:
        if (!formData.gender) {
          isValid = false;
          errorKey = 'OnboardingPage.errorGenderRequired';
        }
        break;
      case 3:
        if (!formData.dateOfBirth) {
          isValid = false;
          errorKey = 'OnboardingPage.errorDobRequired';
        }
        break;
      case 6:
        if (!formData.relationshipStatus) {
           isValid = false;
           errorKey = 'OnboardingPage.errorRelationshipStatusRequired';
        }
        break;
      case 7:
        if (!formData.employmentStatus) {
           isValid = false;
           errorKey = 'OnboardingPage.errorEmploymentStatusRequired';
        }
        break;
    }

    if (!isValid && errorKey) {
      toast({ 
        title: dictionary['Error.genericTitle'] || "Error", 
        description: dictionary[errorKey] || "Please complete the required field.", 
        variant: 'destructive' 
      });
    }
    return isValid;
  }, [currentStep, formData, toast, dictionary]);

  const handleNext = () => {
    if (!validateStep()) {
      return;
    }
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(prev => prev + 1);
    } else {
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
    if (!validateStep()) {
      return;
    }
    setIsSubmitting(true);
    
    console.log("Onboarding data to be 'analyzed' and saved:", formData);

    await new Promise(resolve => setTimeout(resolve, mysticalPhrasesKeys.length * 2500 + 1000));

    if (user) {
      markOnboardingAsComplete();
      localStorage.setItem(`onboardingData_${user.uid}`, JSON.stringify(formData));
      const energyResult = addEnergyPoints('complete_profile', 50); // Award points for completing profile
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

    toast({
      title: dictionary['OnboardingPage.submissionSuccessTitle'] || "Onboarding Complete!",
      description: dictionary['OnboardingPage.submissionSuccessMessagePersonalized'] || "Your cosmic profile is set! Prepare for personalized insights.",
    });
    setIsSubmitting(false);
    router.push(`/${locale}/profile`);
  };

  const genderOptions: { value: Gender; labelKey: string }[] = [
    { value: "female", labelKey: "OnboardingPage.genderFemale" },
    { value: "male", labelKey: "OnboardingPage.genderMale" },
    { value: "non-binary", labelKey: "OnboardingPage.genderNonBinary" },
    { value: "other", labelKey: "OnboardingPage.genderOther" },
    { value: "prefer-not-to-say", labelKey: "OnboardingPage.genderPreferNotToSay" },
  ];

  const relationshipStatusOptions: { value: RelationshipStatus; labelKey: string }[] = [
    { value: "single", labelKey: "OnboardingPage.relationshipSingle" },
    { value: "in-relationship", labelKey: "OnboardingPage.relationshipInRelationship" },
    { value: "engaged", labelKey: "OnboardingPage.relationshipEngaged" },
    { value: "married", labelKey: "OnboardingPage.relationshipMarried" },
    { value: "divorced", labelKey: "OnboardingPage.relationshipDivorced" },
    { value: "widowed", labelKey: "OnboardingPage.relationshipWidowed" },
    { value: "complicated", labelKey: "OnboardingPage.relationshipComplicated" },
  ];

  const employmentStatusOptions: { value: EmploymentStatus; labelKey: string }[] = [
    { value: "employed-full-time", labelKey: "OnboardingPage.employmentFullTime" },
    { value: "employed-part-time", labelKey: "OnboardingPage.employmentPartTime" },
    { value: "self-employed", labelKey: "OnboardingPage.employmentSelfEmployed" },
    { value: "unemployed", labelKey: "OnboardingPage.employmentUnemployed" },
    { value: "student", labelKey: "OnboardingPage.employmentStudent" },
    { value: "retired", labelKey: "OnboardingPage.employmentRetired" },
    { value: "homemaker", labelKey: "OnboardingPage.employmentHomemaker" },
  ];

  if (!isClient || Object.keys(dictionary).length === 0) {
    return (
      <div className="flex-grow container mx-auto px-4 py-8 md:py-12 text-center">
        <LoadingSpinner className="h-12 w-12 text-primary" />
        <p className="mt-4 font-body">{dictionary['OnboardingPage.loadingOnboarding'] || "Loading onboarding..."}</p>
      </div>
    );
  }
  
  if (authLoading || (!user && !authLoading && isClient)) {
    return (
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12 flex items-center justify-center">
        <LoadingSpinner className="h-12 w-12 text-primary" />
      </main>
    );
  }

  const stepDetails: Record<number, { titleKey: string, icon: React.ElementType, descriptionKey?: string }> = {
    1: { titleKey: 'OnboardingPage.step1Title', icon: User, descriptionKey: 'OnboardingPage.step1Description' },
    2: { titleKey: 'OnboardingPage.step2Title', icon: VenetianMask, descriptionKey: 'OnboardingPage.step2Description' },
    3: { titleKey: 'OnboardingPage.step3Title', icon: CalendarIcon, descriptionKey: 'OnboardingPage.step3Description' },
    4: { titleKey: 'OnboardingPage.step4Title', icon: Clock, descriptionKey: 'OnboardingPage.step4Description' },
    5: { titleKey: 'OnboardingPage.step5Title', icon: Building, descriptionKey: 'OnboardingPage.step5Description' },
    6: { titleKey: 'OnboardingPage.step6Title', icon: Users2, descriptionKey: 'OnboardingPage.step6Description' },
    7: { titleKey: 'OnboardingPage.step7Title', icon: Briefcase, descriptionKey: 'OnboardingPage.step7Description' },
    8: { titleKey: 'OnboardingPage.step8Title', icon: ShieldCheck, descriptionKey: 'OnboardingPage.step8Description' },
  };

  const CurrentStepIcon = stepDetails[currentStep]?.icon || Edit;
  const currentStepTitleKey = stepDetails[currentStep]?.titleKey || 'OnboardingPage.stepComingSoonTitle';
  const currentStepDescriptionKey = stepDetails[currentStep]?.descriptionKey;

  return (
    <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
      <SectionTitle
        title={dictionary['OnboardingPage.title'] || "Welcome to AstroMística!"}
        subtitle={(dictionary['OnboardingPage.subtitleStep'] || "Step {currentStep} of {totalSteps}: Let's get to know you").replace('{currentStep}', currentStep.toString()).replace('{totalSteps}', TOTAL_STEPS.toString())}
        icon={Edit}
        className="mb-8"
      />
      <Card className="w-full max-w-lg mx-auto shadow-xl">
        <CardHeader className="px-4 py-4 md:px-6 md:py-5">
           <CardTitle className="font-headline text-lg md:text-xl text-primary text-center flex items-center justify-center gap-2">
            <CurrentStepIcon className="w-5 h-5 md:w-6 md:h-6" />
            {dictionary[currentStepTitleKey] || `Step ${currentStep}`}
          </CardTitle>
          {currentStepDescriptionKey && (
            <CardDescription className="text-center font-body text-xs md:text-sm mt-1">
              {dictionary[currentStepDescriptionKey]}
            </CardDescription>
          )}
          <div className="w-full bg-muted rounded-full h-2 md:h-2.5 mt-2">
            <div className="bg-primary h-2 md:h-2.5 rounded-full transition-all duration-300 ease-out" style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}></div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 md:space-y-6 min-h-[250px] md:min-h-[280px] flex flex-col justify-center px-4 pb-4 md:px-6 md:pb-6 pt-0">
          {isSubmitting ? (
            <div className="text-center space-y-4 py-8">
              <Sparkles className="h-12 w-12 md:h-16 md:w-16 text-primary mx-auto animate-pulse" />
              <p className="font-headline text-lg md:text-xl text-accent-foreground">{currentMysticalPhrase}</p>
              <p className="font-body text-sm md:text-base text-muted-foreground">{dictionary['OnboardingPage.finalizingProfile']}</p>
            </div>
          ) : (
            <>
              {currentStep === 1 && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="font-body text-sm md:text-base">{dictionary['OnboardingPage.nameLabel'] || "What's your name?"}</Label>
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
                  <Label className="font-body text-sm md:text-base">{dictionary['OnboardingPage.genderLabel'] || "How do you identify?"}</Label>
                  <RadioGroup
                    value={formData.gender}
                    onValueChange={(value) => handleChange('gender', value as Gender)}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 sm:gap-x-4 gap-y-1 sm:gap-y-2"
                  >
                    {genderOptions.map(opt => (
                      <div key={opt.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={opt.value} id={`gender-${opt.value}`} />
                        <Label htmlFor={`gender-${opt.value}`} className="font-body font-normal text-sm md:text-base">{dictionary[opt.labelKey] || opt.value}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}

              {currentStep === 3 && (
                 <div className="space-y-2">
                  <Label htmlFor="dateOfBirth" className="font-body text-sm md:text-base">{dictionary['OnboardingPage.dobLabel'] || "When were you born?"}</Label>
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
                        <CalendarComponent
                          mode="single"
                          selected={formData.dateOfBirth}
                          onSelect={(date) => handleChange('dateOfBirth', date)}
                          defaultMonth={formData.dateOfBirth || new Date(currentYearForCalendar - 25, 0, 1)}
                          locale={currentDfnLocale}
                          fromDate={new Date(1900, 0, 1)}
                          toDate={new Date(currentYearForCalendar, 11, 31)}
                          captionLayout="dropdown-buttons"
                          fromYear={1900}
                          toYear={currentYearForCalendar}
                          classNames={{ caption_dropdowns: "flex gap-1 py-1", dropdown_month: "text-sm", dropdown_year: "text-sm" }}
                          className="rounded-md border shadow"
                        />
                    </PopoverContent>
                  </Popover>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-2">
                  <Label htmlFor="timeOfBirth" className="font-body text-sm md:text-base">{dictionary['OnboardingPage.timeOfBirthLabel'] || "Time of Birth (Optional)"}</Label>
                  <Input
                    id="timeOfBirth"
                    type="time"
                    value={formData.timeOfBirth}
                    onChange={(e) => handleChange('timeOfBirth', e.target.value)}
                    className="font-body"
                  />
                  <p className="text-xs text-muted-foreground">{dictionary['OnboardingPage.timeOfBirthHelper'] || "Knowing your birth time helps in more accurate astrological calculations like your rising sign."}</p>
                </div>
              )}

              {currentStep === 5 && (
                <div className="space-y-2">
                  <Label htmlFor="cityOfBirth" className="font-body text-sm md:text-base">{dictionary['OnboardingPage.cityOfBirthLabel'] || "City of Birth (Optional)"}</Label>
                  <Input
                    id="cityOfBirth"
                    value={formData.cityOfBirth}
                    onChange={(e) => handleChange('cityOfBirth', e.target.value)}
                    placeholder={dictionary['OnboardingPage.cityOfBirthPlaceholder'] || "e.g., London, New York"}
                    className="font-body"
                    maxLength={100}
                  />
                   <p className="text-xs text-muted-foreground">{dictionary['OnboardingPage.cityOfBirthHelper'] || "Your birth city can also refine astrological details."}</p>
                </div>
              )}

              {currentStep === 6 && (
                <div className="space-y-2">
                  <Label className="font-body text-sm md:text-base">{dictionary['OnboardingPage.relationshipStatusLabel'] || "Relationship Status"}</Label>
                  <RadioGroup
                    value={formData.relationshipStatus}
                    onValueChange={(value) => handleChange('relationshipStatus', value as RelationshipStatus)}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 sm:gap-x-4 gap-y-1 sm:gap-y-2"
                  >
                    {relationshipStatusOptions.map(opt => (
                      <div key={opt.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={opt.value} id={`rel-${opt.value}`} />
                        <Label htmlFor={`rel-${opt.value}`} className="font-body font-normal text-sm md:text-base">{dictionary[opt.labelKey] || opt.value}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}

              {currentStep === 7 && (
                <div className="space-y-2">
                  <Label className="font-body text-sm md:text-base">{dictionary['OnboardingPage.employmentStatusLabel'] || "Employment Status"}</Label>
                   <RadioGroup
                    value={formData.employmentStatus}
                    onValueChange={(value) => handleChange('employmentStatus', value as EmploymentStatus)}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 sm:gap-x-4 gap-y-1 sm:gap-y-2"
                  >
                    {employmentStatusOptions.map(opt => (
                      <div key={opt.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={opt.value} id={`emp-${opt.value}`} />
                        <Label htmlFor={`emp-${opt.value}`} className="font-body font-normal text-sm md:text-base">{dictionary[opt.labelKey] || opt.value}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}

              {currentStep === 8 && (
                <div className="space-y-4">
                    <div className="items-top flex space-x-2">
                      <Checkbox
                        id="personalizedAdsConsent"
                        checked={formData.personalizedAdsConsent}
                        onCheckedChange={(checked) => handleChange('personalizedAdsConsent', Boolean(checked))}
                        aria-labelledby="ads-consent-label"
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label htmlFor="personalizedAdsConsent" id="ads-consent-label" className="font-body text-sm md:text-base">
                          {dictionary['OnboardingPage.adsConsentLabel'] || "Allow Personalized Ads"}
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          {dictionary['OnboardingPage.adsConsentDescription'] || "Allow us to use your information to show you more relevant ads and content. You can change this in settings later."}
                        </p>
                      </div>
                    </div>
                   <div className="pt-4 text-center">
                    <p className="font-body text-sm md:text-base text-muted-foreground">
                      {dictionary['OnboardingPage.reviewAndFinishPrompt'] || "Please review your choices and click 'Finish' to complete your profile."}
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>

        {!isSubmitting && (
          <CardFooter className="flex justify-between pt-4 md:pt-6 px-4 pb-4 md:px-6 md:pb-6">
            <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1 || isSubmitting} className="font-body text-xs md:text-sm">
              <ChevronLeft className="mr-1 md:mr-2 h-4 w-4" />
              {dictionary['OnboardingPage.previousButton'] || "Previous"}
            </Button>
            <Button onClick={handleNext} disabled={isSubmitting} className="font-body text-xs md:text-sm">
              {currentStep === TOTAL_STEPS ? (
                dictionary['OnboardingPage.finishButton'] || "Finish"
              ) : (
                dictionary['OnboardingPage.nextButton'] || "Next"
              )}
               {currentStep < TOTAL_STEPS && <ChevronRight className="ml-1 md:ml-2 h-4 w-4" />}
            </Button>
          </CardFooter>
        )}
      </Card>
      <p className="text-center text-xs text-muted-foreground mt-6 md:mt-8 font-body px-2">
        {dictionary['OnboardingPage.dataUsageNote'] || "Your information helps us tailor your astrological experience. We respect your privacy."}
      </p>
    </main>
  );
}
