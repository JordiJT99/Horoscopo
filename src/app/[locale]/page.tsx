
"use client";

import { useEffect, useState, useMemo, use } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import type { Locale, Dictionary } from '@/lib/dictionaries';
import { getDictionary } from '@/lib/dictionaries';
import { useAuth } from '@/context/AuthContext';
import type { OnboardingFormData, ZodiacSign, HoroscopeDetail, AstrologicalElement, AstrologicalModality, AstrologicalPolarity } from '@/types';
import { getSunSignFromDate, ZODIAC_SIGNS, WorkIcon } from '@/lib/constants';
import { getHoroscopeFlow, type HoroscopeFlowInput, type HoroscopeFlowOutput } from '@/ai/flows/horoscope-flow';
import { cn } from '@/lib/utils';

import SubHeaderTabs, { type HoroscopePeriod } from '@/components/shared/SubHeaderTabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import Link from 'next/link';
import {
  Sparkles, LogIn, UserPlus, Heart, CircleDollarSign, Activity, Edit3, UserCircle,
  Flame, Mountain, Wind, Droplets, Layers, Anchor, RefreshCw, Sun, Moon, Orbit, Shield, CalendarDays, Upload, UserRoundPlus, Users, Brain, AlignJustify
} from 'lucide-react';
import ZodiacSignIcon from '@/components/shared/ZodiacSignIcon';

interface AstroVibesHomePageProps {
  params: { locale: Locale };
}

const getElementIcon = (element: AstrologicalElement, className?: string) => {
  const props = { className: cn("w-3.5 h-3.5 sm:w-4 sm:h-4", className) };
  if (element === "Fire") return <Flame {...props} />;
  if (element === "Earth") return <Mountain {...props} />;
  if (element === "Air") return <Wind {...props} />;
  if (element === "Water") return <Droplets {...props} />;
  return <Sparkles {...props} />;
};

const getModalityIcon = (modality: AstrologicalModality, className?: string) => {
  const props = { className: cn("w-3.5 h-3.5 sm:w-4 sm:h-4", className) };
  if (modality === "Cardinal") return <Layers {...props} />;
  if (modality === "Fixed") return <Anchor {...props} />;
  if (modality === "Mutable") return <RefreshCw {...props} />;
  return <Sparkles {...props} />;
};

const getPolarityIcon = (polarity: AstrologicalPolarity, className?: string) => {
  const props = { className: cn("w-3.5 h-3.5 sm:w-4 sm:h-4", className) };
  if (polarity === "Masculine") return <Sun {...props} />;
  if (polarity === "Feminine") return <Shield {...props} />;
  return <Sparkles {...props} />;
};

function AstroVibesHomePageContent({ dictionary, locale }: { dictionary: Dictionary, locale: Locale }) {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter(); // Initialize useRouter
  const [onboardingData, setOnboardingData] = useState<OnboardingFormData | null>(null);
  const [userSunSign, setUserSunSign] = useState<ZodiacSign | null>(null);
  const [fullHoroscopeData, setFullHoroscopeData] = useState<HoroscopeFlowOutput | null>(null);
  const [currentDailyHoroscope, setCurrentDailyHoroscope] = useState<HoroscopeDetail | null>(null);
  const [isHoroscopeLoading, setIsHoroscopeLoading] = useState(false);
  const [activeDailyPeriod, setActiveDailyPeriod] = useState<HoroscopePeriod>('today'); // Manages 'yesterday', 'today', 'tomorrow' for this page
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
          setSelectedProfile('generic');
        }
      } else {
        setUserSunSign(null);
        setSelectedProfile('generic');
      }
    } else {
      setOnboardingData(null);
      setUserSunSign(null);
      setSelectedProfile('generic');
    }
  }, [user]);

  useEffect(() => {
    const fetchHoroscope = async () => {
      let signToFetch: ZodiacSign | null = null;
      if (selectedProfile === 'user' && userSunSign) {
        signToFetch = userSunSign;
      } else {
        signToFetch = ZODIAC_SIGNS.find(s => s.name === "Aries")!;
      }

      if (signToFetch) {
        setIsHoroscopeLoading(true);
        try {
          const input: HoroscopeFlowInput = { sign: signToFetch.name, locale };
          const result = await getHoroscopeFlow(input);
          setFullHoroscopeData(result);
        } catch (error) {
          console.error("Error fetching horoscope:", error);
          setFullHoroscopeData(null);
        } finally {
          setIsHoroscopeLoading(false);
        }
      }
    };

    if (!authLoading) {
        fetchHoroscope();
    }
  }, [selectedProfile, userSunSign, locale, authLoading]);

  useEffect(() => {
    if (fullHoroscopeData) {
      // 'yesterday', 'today', 'tomorrow' currently all show daily data.
      // This can be expanded if specific data for yesterday/tomorrow becomes available.
      setCurrentDailyHoroscope(fullHoroscopeData.daily);
    } else {
      setCurrentDailyHoroscope(null);
    }
  }, [activeDailyPeriod, fullHoroscopeData]);


  const handleSubHeaderTabSelect = (tab: HoroscopePeriod) => {
    if (tab === 'weekly') {
      router.push(`/${locale}/weekly-horoscope`);
    } else if (tab === 'monthly') {
      router.push(`/${locale}/monthly-horoscope`);
    } else {
      setActiveDailyPeriod(tab); // For 'yesterday', 'today', 'tomorrow'
    }
  };


  const UserZodiacDetailCard = () => {
    const displaySign = selectedProfile === 'user' && userSunSign ? userSunSign : ZODIAC_SIGNS.find(s => s.name === "Aries")!;
    // const displayName = selectedProfile === 'user' && onboardingData?.name ? onboardingData.name : (dictionary['HomePage.genericProfile'] || "Horóscopos");
    
    if (authLoading && selectedProfile === 'user') {
        return <Skeleton className="h-[380px] w-full rounded-lg max-w-md mx-auto my-4 bg-card/50" />;
    }

    if (selectedProfile === 'user' && user && !onboardingData?.dateOfBirth) {
      return (
        <Card className="bg-card/80 backdrop-blur-sm border-primary/30 text-center p-4 sm:p-6 max-w-md mx-auto my-4">
          <CardHeader className="p-2">
            <CardTitle className="font-headline text-lg md:text-xl text-primary">{onboardingData?.name || (dictionary['HomePage.welcomeUser'] || "Bienvenido/a")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-2">
            <p className="font-body text-xs sm:text-sm">{dictionary['HomePage.completeProfilePrompt'] || "Por favor completa tu perfil para ver tus detalles zodiacales personalizados."}</p>
            <Button asChild className="w-full sm:w-auto text-xs sm:text-sm" size="sm">
              <Link href={`/${locale}/onboarding`}><Edit3 className="mr-2 h-4 w-4"/>{dictionary['ProfilePage.editProfileButton'] || "Completar Perfil"}</Link>
            </Button>
          </CardContent>
        </Card>
      );
    }
    
    const cardTitle = selectedProfile === 'user' 
        ? (onboardingData?.name ? (dictionary['HomePage.userForecastTitle'] || "{userName}'s Cosmic Forecast").replace('{userName}', onboardingData.name) : (dictionary['HomePage.userForecastTitle'] || "{userName}'s Cosmic Forecast").replace('{userName}', user?.displayName || 'Usuario'))
        : (dictionary['HomePage.genericProfile'] || "Horóscopos");


    return (
      <Card className="bg-card/80 backdrop-blur-sm border-primary/30 text-center p-3 sm:p-4 max-w-md mx-auto my-4 overflow-hidden rounded-xl shadow-xl">
        <CardHeader className="p-2 space-y-1">
           <CardTitle className="text-xl sm:text-2xl font-bold font-headline text-foreground">
            {cardTitle}
          </CardTitle>
          <div className="text-center mt-1 mb-2">
            <p className="text-2xl font-headline font-semibold text-primary">{dictionary[displaySign.name] || displaySign.name}</p>
            <div className="flex justify-center items-center space-x-3 text-xs sm:text-sm text-muted-foreground mt-1">
                <span className="flex items-center gap-1">{getElementIcon(displaySign.element, "text-primary")} {dictionary['Zodiac.elementShort'] || 'Elem'}: {dictionary[displaySign.element] || displaySign.element}</span>
                <span className="flex items-center gap-1">{getModalityIcon(displaySign.modality, "text-primary")} {dictionary['Zodiac.modalityShort'] || 'Mod'}: {dictionary[displaySign.modality] || displaySign.modality}</span>
                <span className="flex items-center gap-1">{getPolarityIcon(displaySign.polarity, "text-primary")} {dictionary['Zodiac.polarityShort'] || 'Pol'}: {dictionary[displaySign.polarity] || displaySign.polarity}</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-2 space-y-2 sm:space-y-3">
          <div className="flex justify-center my-2 sm:my-3">
            <Avatar className="w-28 h-28 sm:w-36 sm:h-36 border-2 border-primary shadow-lg">
              <AvatarImage 
                src={`https://placehold.co/150x150.png`} 
                alt={displaySign.name} 
                data-ai-hint={`${displaySign.name} zodiac sign symbol illustration vibrant cosmic glow`} 
              />
              <AvatarFallback><ZodiacSignIcon signName={displaySign.name} className="w-16 h-16 sm:w-20 sm:h-20" /></AvatarFallback>
            </Avatar>
          </div>
          
          <div className="space-y-1.5 text-sm sm:text-base">
            <p className="flex items-center justify-center gap-1.5"><Sun className="w-4 h-4 text-yellow-400"/> {dictionary['Zodiac.sunSign'] || "Signo Solar"}: <span className="font-semibold">{dictionary[displaySign.name] || displaySign.name}</span></p>
            <p className="flex items-center justify-center gap-1.5"><Moon className="w-4 h-4 text-slate-400"/> {dictionary['Zodiac.moonSign'] || "Signo Lunar"}: <span className="text-muted-foreground">{dictionary['HomePage.comingSoon'] || "Próximamente"}</span></p>
            <div className="flex items-center justify-center gap-1.5">
                <Orbit className="w-4 h-4 text-purple-400"/> {dictionary['Zodiac.risingSign'] || "Ascendente"}:
                <Button variant="link" size="sm" className="text-xs sm:text-sm p-0 h-auto text-primary hover:text-primary/80 -ml-1" asChild>
                    <Link href={`/${locale}/lunar-ascendant`}>{dictionary['HomePage.discoverButton'] || "Descubrir"}</Link>
                </Button>
            </div>
          </div>
           {selectedProfile === 'user' && user && (
            <Button variant="outline" size="sm" className="w-full sm:w-auto mt-2 sm:mt-3 border-primary/50 text-primary hover:bg-primary/10 hover:text-primary text-xs" asChild>
                <Link href={`/${locale}/profile`}><Edit3 className="mr-1.5 h-3.5 w-3.5"/>{dictionary['HomePage.editProfileButton'] || "Editar Perfil"}</Link>
            </Button>
           )}
           {selectedProfile === 'generic' && (
             <Button variant="outline" size="sm" className="w-full sm:w-auto mt-2 sm:mt-3 border-primary/50 text-primary hover:bg-primary/10 hover:text-primary text-xs" asChild>
                <Link href={`/${locale}/more`}><AlignJustify className="mr-1.5 h-3.5 w-3.5"/>{dictionary['HomePage.moreDetailsButton'] || "Más Detalles"}</Link>
            </Button>
           )}
        </CardContent>
      </Card>
    );
  };

  const HoroscopeCategoryCard = ({ titleKey, icon: Icon, content, progressValue, isLoading }: { titleKey: string, icon: React.ElementType, content: string | undefined | null, progressValue: number, isLoading: boolean }) => (
    <Card className="shadow-lg bg-card/80 hover:shadow-primary/30 transition-shadow duration-300 backdrop-blur-sm rounded-xl">
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-center mb-1.5 sm:mb-2">
          <div className="bg-primary/10 p-1.5 rounded-full mr-2 sm:mr-3">
            <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          </div>
          <CardTitle className="text-sm sm:text-base font-semibold font-headline text-foreground">{dictionary[titleKey]}</CardTitle>
        </div>
        {isLoading ? <Skeleton className="h-1.5 w-1/4 mb-1.5" /> : <Progress value={progressValue} className="h-1.5 sm:h-2 w-full mb-1.5 sm:mb-2 bg-muted/50" indicatorClassName="bg-gradient-to-r from-primary to-purple-500" />}
        {isLoading ? <Skeleton className="h-10 w-full" /> : <p className="text-xs sm:text-sm font-body text-card-foreground/80 leading-relaxed line-clamp-3">{content || (dictionary['HoroscopeSection.noData'] || "No hay datos disponibles.")}</p>}
      </CardContent>
    </Card>
  );

  const horoscopeCategories = [
    { id: "main", titleKey: "HomePage.workCategory", icon: WorkIcon, content: currentDailyHoroscope?.main, progress: 71 },
    { id: "love", titleKey: "HoroscopeSection.loveTitle", icon: Heart, content: currentDailyHoroscope?.love, progress: 85 },
    { id: "money", titleKey: "HoroscopeSection.moneyTitle", icon: CircleDollarSign, content: currentDailyHoroscope?.money, progress: 60 },
    { id: "health", titleKey: "HoroscopeSection.healthTitle", icon: Activity, content: currentDailyHoroscope?.health, progress: 90 },
  ];

  const currentDate = new Date().toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric', weekday: 'short' });

  return (
    <div className="flex flex-col min-h-screen">
      <SubHeaderTabs dictionary={dictionary} activeTab={activeDailyPeriod} onTabChange={handleSubHeaderTabSelect} />
      
      <main className="flex-grow container mx-auto px-3 sm:px-4 py-3 sm:py-4 space-y-4 sm:space-y-6">
        <div className="flex justify-around items-center py-1 sm:py-2">
          <Button variant="ghost" onClick={() => setSelectedProfile('generic')} className={cn("flex flex-col items-center h-auto p-1 sm:p-1.5", selectedProfile === 'generic' && "text-primary")}>
            <Avatar className={cn("w-10 h-10 sm:w-12 sm:h-12 mb-0.5 border-2", selectedProfile === 'generic' ? "border-primary" : "border-border")}>
              <AvatarImage src="https://placehold.co/64x64.png" alt="Generic Horoscopes" data-ai-hint="galaxy stars icon" />
              <AvatarFallback><Sparkles className="w-5 h-5 sm:w-6 sm:w-6"/></AvatarFallback>
            </Avatar>
            <span className="text-[0.6rem] sm:text-xs font-medium">{dictionary['HomePage.genericProfile'] || "Horóscopos"}</span>
          </Button>

          {user && (
            <Button variant="ghost" onClick={() => setSelectedProfile('user')} className={cn("flex flex-col items-center h-auto p-1 sm:p-1.5", selectedProfile === 'user' && "text-primary")}>
              <Avatar className={cn("w-10 h-10 sm:w-12 sm:h-12 mb-0.5 border-2", selectedProfile === 'user' ? "border-primary" : "border-border")}>
                <AvatarImage src={user.photoURL || `https://placehold.co/64x64.png`} alt={onboardingData?.name || user.displayName || "User"} data-ai-hint="abstract user avatar gradient" />
                <AvatarFallback className="text-sm sm:text-base">{(onboardingData?.name?.charAt(0) || user.displayName?.charAt(0) || <UserCircle/>).toString().toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="text-[0.6rem] sm:text-xs font-medium truncate max-w-[60px] sm:max-w-[80px]">{onboardingData?.name || user.displayName || (dictionary['Auth.userLabel'] || "Usuario")}</span>
            </Button>
          )}
          
          <Button variant="ghost" asChild className="flex flex-col items-center h-auto p-1 sm:p-1.5 text-muted-foreground hover:text-primary">
             <Link href={user ? `/${locale}/profile` : `/${locale}/onboarding`}>
                <div className={cn("w-10 h-10 sm:w-12 sm:h-12 mb-0.5 border-2 border-dashed border-border rounded-full flex items-center justify-center bg-card/50 hover:border-primary")}>
                    <UserRoundPlus className="w-5 h-5 sm:w-6 sm:w-6"/>
                </div>
                <span className="text-[0.6rem] sm:text-xs font-medium">{user ? (dictionary['Header.profile'] || "Perfil") : (dictionary['HomePage.addProfileButton'] || "Agregar")}</span>
            </Link>
          </Button>
        </div>
        
        <UserZodiacDetailCard />

        <div>
          <div className="flex justify-between items-center mb-2 sm:mb-3 px-1">
            <h2 className="text-base sm:text-lg font-semibold font-headline text-foreground flex items-center">
              <CalendarDays className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 text-muted-foreground" />
              {dictionary['HomePage.yourHoroscopeToday'] || "Tu horóscopo de hoy"} 
              <span className="text-[0.65rem] sm:text-xs text-muted-foreground ml-1.5 sm:ml-2 hidden sm:inline">({currentDate})</span>
            </h2>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary h-7 w-7 sm:h-8 sm:w-8">
              <Upload className="w-3.5 h-3.5 sm:w-4 sm:w-4"/>
              <span className="sr-only">{dictionary['HomePage.shareHoroscope'] || "Compartir Horóscopo"}</span>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3.5">
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
       
        <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-card/50 border-2 border-dashed border-muted-foreground/20 rounded-lg text-center text-muted-foreground font-body">
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
        <p className="mt-4 font-body text-muted-foreground">{dictionary['HomePage.loadingDashboard'] || "Cargando Tablero Cósmico..."}</p>
      </div>
    );
  }
  return <AstroVibesHomePageContent dictionary={dictionary} locale={params.locale} />;
}

