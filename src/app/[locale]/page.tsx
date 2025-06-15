
"use client";

import { useEffect, useState, useMemo, use } from 'react';
import type { Locale, Dictionary } from '@/lib/dictionaries';
import { getDictionary } from '@/lib/dictionaries';
import { useAuth } from '@/context/AuthContext';
import type { OnboardingFormData, ZodiacSign, HoroscopeDetail, AstrologicalElement, AstrologicalModality, AstrologicalPolarity } from '@/types';
import { getSunSignFromDate, ZODIAC_SIGNS, WorkIcon } from '@/lib/constants';
import { getHoroscopeFlow, type HoroscopeFlowInput } from '@/ai/flows/horoscope-flow';
import { cn } from '@/lib/utils'; // Added missing import

import SubHeaderTabs from '@/components/shared/SubHeaderTabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import Link from 'next/link';
import {
  Sparkles, LogIn, UserPlus, Heart, CircleDollarSign, Activity, Edit3, UserCircle,
  Flame, Mountain, Wind, Droplets, Layers, Anchor, RefreshCw, Sun, Moon, Orbit, Shield, CalendarDays, Upload, UserRoundPlus, Users
} from 'lucide-react';
import ZodiacSignIcon from '@/components/shared/ZodiacSignIcon';

interface AstroVibesHomePageProps {
  params: { locale: Locale };
}

const getElementIcon = (element: AstrologicalElement, className?: string) => {
  const props = { className: className || "w-4 h-4" };
  if (element === "Fire") return <Flame {...props} />;
  if (element === "Earth") return <Mountain {...props} />;
  if (element === "Air") return <Wind {...props} />;
  if (element === "Water") return <Droplets {...props} />;
  return <Sparkles {...props} />;
};

const getModalityIcon = (modality: AstrologicalModality, className?: string) => {
  const props = { className: className || "w-4 h-4" };
  if (modality === "Cardinal") return <Layers {...props} />;
  if (modality === "Fixed") return <Anchor {...props} />;
  if (modality === "Mutable") return <RefreshCw {...props} />;
  return <Sparkles {...props} />;
};

const getPolarityIcon = (polarity: AstrologicalPolarity, className?: string) => {
  const props = { className: className || "w-4 h-4" };
  if (polarity === "Masculine") return <Sun {...props} />;
  if (polarity === "Feminine") return <Shield {...props} />;
  return <Sparkles {...props} />;
};

function AstroVibesHomePageContent({ dictionary, locale }: { dictionary: Dictionary, locale: Locale }) {
  const { user, isLoading: authLoading } = useAuth();
  const [onboardingData, setOnboardingData] = useState<OnboardingFormData | null>(null);
  const [userSunSign, setUserSunSign] = useState<ZodiacSign | null>(null);
  const [horoscopeDetails, setHoroscopeDetails] = useState<HoroscopeDetail | null>(null);
  const [isHoroscopeLoading, setIsHoroscopeLoading] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'yesterday' | 'today' | 'tomorrow'>('today');
  const [selectedProfile, setSelectedProfile] = useState<'user' | 'generic'>('user');

  useEffect(() => {
    if (user?.uid) {
      const storedData = localStorage.getItem(`onboardingData_${user.uid}`);
      if (storedData) {
        const parsedData = JSON.parse(storedData) as OnboardingFormData;
        if (parsedData.dateOfBirth) {
          parsedData.dateOfBirth = new Date(parsedData.dateOfBirth);
        }
        setOnboardingData(parsedData);
        if (parsedData.dateOfBirth) {
          setUserSunSign(getSunSignFromDate(parsedData.dateOfBirth));
          setSelectedProfile('user');
        } else {
          setSelectedProfile('generic'); // User exists but no DOB
        }
      } else {
        setUserSunSign(null);
        setSelectedProfile('generic'); // User exists but no onboarding data
      }
    } else {
      setOnboardingData(null);
      setUserSunSign(null);
      setSelectedProfile('generic'); // No user
    }
  }, [user]);

  useEffect(() => {
    const fetchHoroscope = async () => {
      let signToFetch: ZodiacSign | null = null;
      if (selectedProfile === 'user' && userSunSign) {
        signToFetch = userSunSign;
      } else {
        signToFetch = ZODIAC_SIGNS.find(s => s.name === "Aries")!; // Default to Aries for generic
      }

      if (signToFetch) {
        setIsHoroscopeLoading(true);
        try {
          const input: HoroscopeFlowInput = { sign: signToFetch.name, locale };
          const result = await getHoroscopeFlow(input);
          // For now, all tabs show daily. Could be expanded.
          setHoroscopeDetails(result.daily);
        } catch (error) {
          console.error("Error fetching horoscope:", error);
          setHoroscopeDetails(null);
        } finally {
          setIsHoroscopeLoading(false);
        }
      }
    };

    if (!authLoading) {
        fetchHoroscope();
    }
  }, [selectedProfile, userSunSign, locale, authLoading, activeSubTab]);


  const UserZodiacDetailCard = () => {
    const displaySign = selectedProfile === 'user' && userSunSign ? userSunSign : ZODIAC_SIGNS.find(s => s.name === "Aries")!;
    const displayName = selectedProfile === 'user' && onboardingData?.name ? onboardingData.name : (dictionary['HomePage.genericProfile'] || "Horóscopos");
    
    if (authLoading && selectedProfile === 'user') {
        return <Skeleton className="h-[300px] w-full rounded-lg max-w-md mx-auto my-6 bg-card/50" />;
    }

    if (selectedProfile === 'user' && user && !onboardingData?.dateOfBirth) {
      return (
        <Card className="bg-card/80 backdrop-blur-sm border-primary/30 text-center p-4 sm:p-6 max-w-md mx-auto my-6">
          <CardHeader>
            <CardTitle className="font-headline text-xl md:text-2xl text-primary">{onboardingData?.name || (dictionary['HomePage.welcomeUser'] || "Welcome")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="font-body text-sm">{dictionary['HomePage.completeProfilePrompt'] || "Please complete your profile to see your personalized zodiac details."}</p>
            <Button asChild className="w-full sm:w-auto">
              <Link href={`/${locale}/onboarding`}><Edit3 className="mr-2 h-4 w-4"/>{dictionary['ProfilePage.editProfileButton'] || "Complete Profile"}</Link>
            </Button>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="bg-card/80 backdrop-blur-sm border-primary/30 text-center p-4 sm:p-6 max-w-md mx-auto my-6 overflow-hidden">
        <CardHeader className="pb-3 pt-2">
          <CardTitle className="text-xl font-bold font-headline text-foreground">
            {displayName}
          </CardTitle>
          {selectedProfile === 'user' && user && !onboardingData?.dateOfBirth &&
            <p className="text-xs text-muted-foreground">{dictionary['HomePage.promptPersonalInfo'] || "Por favor, ingresa tu información personal."}</p>
          }
        </CardHeader>

        <CardContent className="pt-2 space-y-3">
          <div className="grid grid-cols-3 items-center gap-2">
            <div className="text-left space-y-1.5">
              <div>
                <p className="text-xs font-medium uppercase text-muted-foreground">{dictionary['Zodiac.sunSignShort'] || "Sol"}</p>
                <p className="text-sm font-semibold text-foreground flex items-center">{dictionary[displaySign.name] || displaySign.name} <ZodiacSignIcon signName={displaySign.name} className="w-3 h-3 ml-1 text-primary"/></p>
              </div>
               <div>
                <p className="text-xs font-medium uppercase text-muted-foreground">{dictionary['Zodiac.moonSignShort'] || "Luna"}</p>
                <p className="text-sm text-muted-foreground">{dictionary['HomePage.comingSoon'] || "Próximamente"}</p>
              </div>
               <div>
                <p className="text-xs font-medium uppercase text-muted-foreground">{dictionary['Zodiac.risingSignShort'] || "Asc"}</p>
                <Button variant="link" size="sm" className="text-xs p-0 h-auto text-primary hover:text-primary/80" asChild>
                    <Link href={`/${locale}/lunar-ascendant`}>{dictionary['HomePage.discoverButton'] || "Descubrir"}</Link>
                </Button>
              </div>
            </div>
            
            <div className="flex justify-center">
              <Avatar className="w-24 h-24 sm:w-28 sm:h-28 border-2 border-primary shadow-md">
                <AvatarImage 
                  src={`https://placehold.co/120x120.png`} 
                  alt={displaySign.name} 
                  data-ai-hint={`${displaySign.name} zodiac sign symbol illustration vibrant cosmic`} 
                />
                <AvatarFallback><ZodiacSignIcon signName={displaySign.name} className="w-12 h-12" /></AvatarFallback>
              </Avatar>
            </div>

            <div className="text-right space-y-1.5">
              <div>
                <p className="text-xs font-medium uppercase text-muted-foreground">{dictionary['Zodiac.elementShort'] || "Elem"}</p>
                <p className="text-sm font-semibold text-foreground flex items-center justify-end">{getElementIcon(displaySign.element, "w-3 h-3 mr-1 text-primary")} {dictionary[displaySign.element] || displaySign.element}</p>
              </div>
               <div>
                <p className="text-xs font-medium uppercase text-muted-foreground">{dictionary['Zodiac.polarityShort'] || "Pol"}</p>
                <p className="text-sm font-semibold text-foreground flex items-center justify-end">{getPolarityIcon(displaySign.polarity, "w-3 h-3 mr-1 text-primary")} {dictionary[displaySign.polarity] || displaySign.polarity}</p>
              </div>
               <div>
                <p className="text-xs font-medium uppercase text-muted-foreground">{dictionary['Zodiac.modalityShort'] || "Mod"}</p>
                <p className="text-sm font-semibold text-foreground flex items-center justify-end">{getModalityIcon(displaySign.modality, "w-3 h-3 mr-1 text-primary")} {dictionary[displaySign.modality] || displaySign.modality}</p>
              </div>
            </div>
          </div>

          <Button variant="default" size="sm" className="w-full sm:w-auto mt-3 bg-primary/80 hover:bg-primary text-primary-foreground text-xs" asChild>
            <Link href={`/${locale}/profile`}>{dictionary['HomePage.moreDetailsButton'] || "Más Detalles"}</Link>
          </Button>
        </CardContent>
      </Card>
    );
  };

  const HoroscopeCategoryCard = ({ titleKey, icon: Icon, content, progressValue, isLoading }: { titleKey: string, icon: React.ElementType, content: string | undefined | null, progressValue: number, isLoading: boolean }) => (
    <Card className="shadow-lg bg-card/80 hover:shadow-primary/30 transition-shadow duration-300 backdrop-blur-sm">
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-center mb-1.5 sm:mb-2">
          <div className="bg-primary/20 p-1.5 rounded-full mr-2 sm:mr-3">
            <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          </div>
          <CardTitle className="text-base sm:text-lg font-semibold font-headline text-foreground">{dictionary[titleKey]}</CardTitle>
        </div>
        {isLoading ? <Skeleton className="h-4 w-1/4 mb-1.5" /> : <Progress value={progressValue} className="h-1.5 sm:h-2 w-full mb-1.5 sm:mb-2 bg-muted" indicatorClassName="bg-primary" />}
        {isLoading ? <Skeleton className="h-12 w-full" /> : <p className="text-xs sm:text-sm font-body text-card-foreground/80 leading-relaxed line-clamp-3">{content || (dictionary['HoroscopeSection.noData'] || "No data available.")}</p>}
      </CardContent>
    </Card>
  );

  const horoscopeCategories = [
    { id: "work", titleKey: "HomePage.workCategory", icon: WorkIcon, content: horoscopeDetails?.main, progress: 71 },
    { id: "love", titleKey: "HoroscopeSection.loveTitle", icon: Heart, content: horoscopeDetails?.love, progress: 85 },
    { id: "money", titleKey: "HoroscopeSection.moneyTitle", icon: CircleDollarSign, content: horoscopeDetails?.money, progress: 60 },
    { id: "health", titleKey: "HoroscopeSection.healthTitle", icon: Activity, content: horoscopeDetails?.health, progress: 90 },
  ];

  const currentDate = new Date().toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric', weekday: 'short' });

  return (
    <div className="flex flex-col min-h-screen">
      <SubHeaderTabs dictionary={dictionary} activeTab={activeSubTab} onTabChange={setActiveSubTab} />
      
      <main className="flex-grow container mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Profile/Horoscope Avatar Selection */}
        <div className="flex justify-around items-center py-2">
          <Button variant="ghost" onClick={() => setSelectedProfile('generic')} className={cn("flex flex-col items-center h-auto p-1.5", selectedProfile === 'generic' && "text-primary")}>
            <Avatar className={cn("w-12 h-12 sm:w-14 sm:h-14 mb-1 border-2", selectedProfile === 'generic' ? "border-primary" : "border-border")}>
              <AvatarImage src="https://placehold.co/64x64.png" alt="Generic Horoscopes" data-ai-hint="galaxy stars icon" />
              <AvatarFallback><Sparkles /></AvatarFallback>
            </Avatar>
            <span className="text-xs sm:text-sm font-medium">{dictionary['HomePage.genericProfile'] || "Horóscopos"}</span>
          </Button>

          {user && (
            <Button variant="ghost" onClick={() => setSelectedProfile('user')} className={cn("flex flex-col items-center h-auto p-1.5", selectedProfile === 'user' && "text-primary")}>
              <Avatar className={cn("w-12 h-12 sm:w-14 sm:h-14 mb-1 border-2", selectedProfile === 'user' ? "border-primary" : "border-border")}>
                <AvatarImage src={user.photoURL || `https://placehold.co/64x64.png`} alt={onboardingData?.name || user.displayName || "User"} data-ai-hint="abstract user avatar" />
                <AvatarFallback>{onboardingData?.name?.charAt(0) || user.displayName?.charAt(0) || <UserCircle/>}</AvatarFallback>
              </Avatar>
              <span className="text-xs sm:text-sm font-medium">{onboardingData?.name || user.displayName || (dictionary['Auth.userLabel'] || "User")}</span>
            </Button>
          )}
          
          <Button variant="ghost" asChild className="flex flex-col items-center h-auto p-1.5 text-muted-foreground hover:text-primary">
             <Link href={user ? `/${locale}/profile` : `/${locale}/onboarding`}> {/* Adjust link based on auth state */}
                <div className={cn("w-12 h-12 sm:w-14 sm:h-14 mb-1 border-2 border-dashed border-border rounded-full flex items-center justify-center bg-card/50 hover:border-primary")}>
                    <UserRoundPlus className="w-6 h-6 sm:w-7 sm:h-7"/>
                </div>
                <span className="text-xs sm:text-sm font-medium">{dictionary['HomePage.addProfileButton'] || "Agregar Perfil"}</span>
            </Link>
          </Button>
        </div>
        
        <UserZodiacDetailCard />

        <div>
          <div className="flex justify-between items-center mb-2 sm:mb-3">
            <h2 className="text-lg sm:text-xl font-semibold font-headline text-foreground flex items-center">
              <CalendarDays className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-muted-foreground" />
              {dictionary['HomePage.yourHoroscopeToday'] || "Tu horóscopo de hoy"} - <span className="text-xs sm:text-sm text-muted-foreground ml-1">{currentDate}</span>
            </h2>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
              <Upload className="w-4 h-4 sm:w-5 sm:w-5"/>
              <span className="sr-only">{dictionary['HomePage.shareHoroscope'] || "Share Horoscope"}</span>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {horoscopeCategories.map(cat => (
              <HoroscopeCategoryCard
                key={cat.id}
                titleKey={cat.titleKey}
                icon={cat.icon}
                content={cat.content}
                progressValue={cat.progress}
                isLoading={isHoroscopeLoading}
              />
            ))}
          </div>
        </div>
       
        <div className="mt-8 p-3 sm:p-4 bg-card/50 border-2 border-dashed border-muted-foreground/20 rounded-lg text-center text-muted-foreground font-body">
          <p className="text-xs sm:text-sm">{dictionary['HomePage.adPlaceholderText'] || "Espacio Publicitario - ¡Tu anuncio podría estar aquí!"}</p>
        </div>
      </main>
    </div>
  );
}

export default function AstroVibesHomePageWrapper({ params: paramsPromise }: AstroVibesHomePageProps) {
  const params = use(paramsPromise);
  const dictionaryPromise = useMemo(() => getDictionary(params.locale), [params.locale]);
  const dictionary = use(dictionaryPromise);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || Object.keys(dictionary).length === 0 || !params) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-screen bg-background text-foreground">
        <Sparkles className="h-12 w-12 animate-pulse text-primary mx-auto" />
        <p className="mt-4 font-body text-muted-foreground">Cargando Tablero Cósmico...</p>
      </div>
    );
  }
  return <AstroVibesHomePageContent dictionary={dictionary} locale={params.locale} />;
}
