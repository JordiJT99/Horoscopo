
"use client";

import { useState, use, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Dictionary, Locale } from '@/lib/dictionaries';
import { getDictionary } from '@/lib/dictionaries';
import type { OnboardingFormData, Gender, RelationshipStatus, EmploymentStatus } from '@/types';
import SectionTitle from '@/components/shared/SectionTitle';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es, enUS, de, fr } from 'date-fns/locale';
import { CalendarIcon, User, VenetianMask, Edit, ChevronRight, ChevronLeft, Sparkles, Clock, Building, Users2, Briefcase, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from "@/hooks/use-toast";

const dateFnsLocalesMap: Record<Locale, typeof es | typeof enUS | typeof de | typeof fr> = {
  es,
  en: enUS,
  de,
  fr,
};

const TOTAL_STEPS = 8;

interface OnboardingPageProps {
  params: Promise<{ locale: Locale }>;
}

interface OnboardingContentProps {
  dictionary: Dictionary;
  locale: Locale;
}

function OnboardingContent({ dictionary, locale }: OnboardingContentProps) {
  const router = useRouter();
  const { user, isLoading: authLoading, markOnboardingAsComplete } = useAuth();
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingFormData>({
    name: '',
    gender: '',
    dateOfBirth: new Date(1995, 5, 15), // Initial valid date
    timeOfBirth: '',
    cityOfBirth: '',
    relationshipStatus: '',
    employmentStatus: '',
    personalizedAdsConsent: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentDfnLocale = dateFnsLocalesMap[locale] || enUS;
  const currentYearForCalendar = new Date().getFullYear();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/${locale}/login`);
    }
  }, [user, authLoading, router, locale]);

  const validateStep = (): boolean => {
    switch (currentStep) {
      case 1:
        if (!formData.name.trim()) {
          toast({ title: dictionary['Error.genericTitle'], description: dictionary['OnboardingPage.errorNameRequired'], variant: 'destructive' });
          return false;
        }
        break;
      case 2:
        if (!formData.gender) {
          toast({ title: dictionary['Error.genericTitle'], description: dictionary['OnboardingPage.errorGenderRequired'], variant: 'destructive' });
          return false;
        }
        break;
      case 3:
        if (!formData.dateOfBirth) {
          toast({ title: dictionary['Error.genericTitle'], description: dictionary['OnboardingPage.errorDobRequired'], variant: 'destructive' });
          return false;
        }
        break;
      case 6:
        if (!formData.relationshipStatus) {
           toast({ title: dictionary['Error.genericTitle'], description: dictionary['OnboardingPage.errorRelationshipStatusRequired'], variant: 'destructive' });
           return false;
        }
        break;
      case 7:
        if (!formData.employmentStatus) {
           toast({ title: dictionary['Error.genericTitle'], description: dictionary['OnboardingPage.errorEmploymentStatusRequired'], variant: 'destructive' });
           return false;
        }
        break;
      default:
        return true;
    }
    return true;
  };


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
    console.log("Onboarding data submitted:", formData);
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (user) {
      markOnboardingAsComplete();
    }

    toast({
      title: dictionary['OnboardingPage.submissionSuccessTitle'] || "Onboarding Complete!",
      description: dictionary['OnboardingPage.submissionSuccessMessage'] || "Your information has been (simulated) saved. Welcome!",
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

  if (authLoading || (!user && !authLoading)) {
    return (
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </main>
    );
  }

  const stepTitles: Record<number, { titleKey: string, icon: React.ElementType }> = {
    1: { titleKey: 'OnboardingPage.step1Title', icon: User },
    2: { titleKey: 'OnboardingPage.step2Title', icon: VenetianMask },
    3: { titleKey: 'OnboardingPage.step3Title', icon: CalendarIcon },
    4: { titleKey: 'OnboardingPage.step4Title', icon: Clock },
    5: { titleKey: 'OnboardingPage.step5Title', icon: Building },
    6: { titleKey: 'OnboardingPage.step6Title', icon: Users2 },
    7: { titleKey: 'OnboardingPage.step7Title', icon: Briefcase },
    8: { titleKey: 'OnboardingPage.step8Title', icon: ShieldCheck },
  };

  const CurrentStepIcon = stepTitles[currentStep]?.icon || Edit;
  const currentStepTitleKey = stepTitles[currentStep]?.titleKey || 'OnboardingPage.stepComingSoonTitle';


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
           <CardTitle className="font-headline text-xl text-primary text-center flex items-center justify-center gap-2">
            <CurrentStepIcon className="w-6 h-6" />
            {dictionary[currentStepTitleKey] || `Step ${currentStep}`}
          </CardTitle>
          <div className="w-full bg-muted rounded-full h-2.5 mt-2">
            <div className="bg-primary h-2.5 rounded-full" style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}></div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 min-h-[250px]">
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
                className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2"
              >
                {genderOptions.map(opt => (
                  <div key={opt.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={opt.value} id={`gender-${opt.value}`} />
                    <Label htmlFor={`gender-${opt.value}`} className="font-body font-normal">{dictionary[opt.labelKey] || opt.labelKey.split('.').pop()}</Label>
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
                      defaultMonth={formData.dateOfBirth || new Date(currentYearForCalendar - 30, 0, 1)}
                      locale={currentDfnLocale}
                      fromDate={new Date(1900, 0, 1)}
                      toDate={new Date()}
                      captionLayout="dropdown" // This is important for DayPicker to use our custom caption
                      className="rounded-md border shadow"
                    />
                </PopoverContent>
              </Popover>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-2">
              <Label htmlFor="timeOfBirth" className="font-body">{dictionary['OnboardingPage.timeOfBirthLabel'] || "Time of Birth (Optional)"}</Label>
              <Input
                id="timeOfBirth"
                type="time"
                value={formData.timeOfBirth}
                onChange={(e) => handleChange('timeOfBirth', e.target.value)}
                className="font-body"
              />
              <p className="text-xs text-muted-foreground">{dictionary['OnboardingPage.timeOfBirthHelper'] || "Knowing your birth time helps in more accurate astrological calculations like your ascendant sign."}</p>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-2">
              <Label htmlFor="cityOfBirth" className="font-body">{dictionary['OnboardingPage.cityOfBirthLabel'] || "City of Birth (Optional)"}</Label>
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
              <Label className="font-body">{dictionary['OnboardingPage.relationshipStatusLabel'] || "Relationship Status"}</Label>
              <RadioGroup
                value={formData.relationshipStatus}
                onValueChange={(value) => handleChange('relationshipStatus', value as RelationshipStatus)}
                className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2"
              >
                {relationshipStatusOptions.map(opt => (
                  <div key={opt.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={opt.value} id={`rel-${opt.value}`} />
                    <Label htmlFor={`rel-${opt.value}`} className="font-body font-normal">{dictionary[opt.labelKey] || opt.value}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {currentStep === 7 && (
            <div className="space-y-2">
              <Label className="font-body">{dictionary['OnboardingPage.employmentStatusLabel'] || "Employment Status"}</Label>
               <RadioGroup
                value={formData.employmentStatus}
                onValueChange={(value) => handleChange('employmentStatus', value as EmploymentStatus)}
                className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2"
              >
                {employmentStatusOptions.map(opt => (
                  <div key={opt.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={opt.value} id={`emp-${opt.value}`} />
                    <Label htmlFor={`emp-${opt.value}`} className="font-body font-normal">{dictionary[opt.labelKey] || opt.value}</Label>
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
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor="personalizedAdsConsent" className="font-body">
                      {dictionary['OnboardingPage.adsConsentLabel'] || "Allow Personalized Ads"}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {dictionary['OnboardingPage.adsConsentDescription'] || "Allow us to use your information to show you more relevant ads and content. You can change this in settings later."}
                    </p>
                  </div>
                </div>

                {isSubmitting && (
                  <div className="pt-4 text-center">
                      <Sparkles className="h-10 w-10 text-primary mx-auto mb-2 animate-spin" />
                      <p className="font-body text-muted-foreground">{dictionary['OnboardingPage.finalizingProfile'] || "Finalizing your cosmic profile..."}</p>
                  </div>
                )}
                {!isSubmitting && (
                   <div className="pt-4 text-center">
                    <p className="font-body text-muted-foreground">
                      {dictionary['OnboardingPage.reviewAndFinishPrompt'] || "Please review your choices and click 'Finish' to complete your profile."}
                    </p>
                  </div>
                )}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between pt-6">
          <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1 || isSubmitting} className="font-body">
            <ChevronLeft className="mr-2 h-4 w-4" />
            {dictionary['OnboardingPage.previousButton'] || "Previous"}
          </Button>
          <Button onClick={handleNext} disabled={isSubmitting} className="font-body">
            {isSubmitting ? (
              <>
                <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                {dictionary['OnboardingPage.submittingButton'] || "Processing..."}
              </>
            ) : currentStep === TOTAL_STEPS ? (
              dictionary['OnboardingPage.finishButton'] || "Finish"
            ) : (
              dictionary['OnboardingPage.nextButton'] || "Next"
            )}
             {currentStep < TOTAL_STEPS && !isSubmitting && <ChevronRight className="ml-2 h-4 w-4" />}
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
