
"use client";

import { useEffect, useState, useMemo, use } from 'react';
import type { Locale, Dictionary } from '@/lib/dictionaries';
import { getDictionary } from '@/lib/dictionaries';
import { useAuth } from '@/context/AuthContext';
import type { OnboardingFormData, ZodiacSign, HoroscopeDetail, AstrologicalElement, AstrologicalModality, AstrologicalPolarity } from '@/types';
import { getSunSignFromDate, ZODIAC_SIGNS, WorkIcon } from '@/lib/constants';
import { getHoroscopeFlow, type HoroscopeFlowInput } from '@/ai/flows/horoscope-flow';

import SectionTitle from '@/components/shared/SectionTitle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import Link from 'next/link';
import {
  Sparkles, LogIn, UserPlus, Heart, CircleDollarSign, Activity, Edit3, UserCircle,
  Flame, Mountain, Wind, Droplets, Layers, Anchor, RefreshCw, Sun, Moon, Orbit, Shield // Added new icons
} from 'lucide-react';
import ZodiacSignIcon from '@/components/shared/ZodiacSignIcon'; // For Avatar Fallback

interface AstroVibesHomePageProps {
  params: { locale: Locale };
}

// Helper to get Element Icon
const getElementIcon = (element: AstrologicalElement, className?: string) => {
  const props = { className: className || "w-4 h-4 mr-2" };
  if (element === "Fire") return <Flame {...props} />;
  if (element === "Earth") return <Mountain {...props} />;
  if (element === "Air") return <Wind {...props} />;
  if (element === "Water") return <Droplets {...props} />;
  return <Sparkles {...props} />; // Fallback
};

// Helper to get Modality Icon
const getModalityIcon = (modality: AstrologicalModality, className?: string) => {
  const props = { className: className || "w-4 h-4 mr-2" };
  if (modality === "Cardinal") return <Layers {...props} />;
  if (modality === "Fixed") return <Anchor {...props} />;
  if (modality === "Mutable") return <RefreshCw {...props} />;
  return <Sparkles {...props} />; // Fallback
};

// Helper to get Polarity Icon
const getPolarityIcon = (polarity: AstrologicalPolarity, className?: string) => {
  const props = { className: className || "w-4 h-4 mr-2" };
  if (polarity === "Masculine") return <Sun {...props} />;
  if (polarity === "Feminine") return <Shield {...props} />; // Using Shield for Feminine
  return <Sparkles {...props} />; // Fallback
};


function AstroVibesHomePageContent({ dictionary, locale }: { dictionary: Dictionary, locale: Locale }) {
  const { user, isLoading: authLoading } = useAuth();
  const [onboardingData, setOnboardingData] = useState<OnboardingFormData | null>(null);
  const [userSunSign, setUserSunSign] = useState<ZodiacSign | null>(null);
  const [horoscopeDetails, setHoroscopeDetails] = useState<HoroscopeDetail | null>(null);
  const [isHoroscopeLoading, setIsHoroscopeLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState<"today" | "yesterday" | "tomorrow">("today");

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
        }
      } else {
        setUserSunSign(null); 
      }
    } else {
      setOnboardingData(null);
      setUserSunSign(null);
    }
  }, [user]);

  useEffect(() => {
    const fetchHoroscope = async () => {
      if (userSunSign) {
        setIsHoroscopeLoading(true);
        try {
          const input: HoroscopeFlowInput = { sign: userSunSign.name, locale };
          const result = await getHoroscopeFlow(input);
          setHoroscopeDetails(result.daily);
        } catch (error) {
          console.error("Error fetching horoscope:", error);
          setHoroscopeDetails(null);
        } finally {
          setIsHoroscopeLoading(false);
        }
      } else {
        setIsHoroscopeLoading(true);
        try {
            const defaultSign = ZODIAC_SIGNS.find(s => s.name === "Aries")!;
            const input: HoroscopeFlowInput = { sign: defaultSign.name, locale };
            const result = await getHoroscopeFlow(input);
            setHoroscopeDetails(result.daily);
            setUserSunSign(defaultSign);
        } catch (error) {
            console.error("Error fetching default horoscope:", error);
            setHoroscopeDetails(null);
        } finally {
            setIsHoroscopeLoading(false);
        }
      }
    };

    if (!authLoading) {
        fetchHoroscope();
    }
  }, [userSunSign, locale, authLoading]);

  const UserZodiacDetailCard = () => {
    if (authLoading) {
        return <Skeleton className="h-[480px] w-full rounded-lg max-w-sm mx-auto" />;
    }
    if (!user || !onboardingData || !userSunSign) {
      return (
        <Card className="shadow-xl bg-card/80 backdrop-blur-sm border-primary/30 text-center p-6 max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="font-headline text-xl md:text-2xl text-primary">{dictionary['HomePage.welcomeGuestTitle'] || "Welcome to AstroVibes!"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="font-body text-sm md:text-base">{dictionary['HomePage.guestPrompt'] || "Log in or complete your profile for personalized cosmic forecasts."}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="w-full sm:w-auto">
                <Link href={`/${locale}/login`}><LogIn className="mr-2"/>{dictionary['Auth.loginButton'] || "Login"}</Link>
              </Button>
              <Button variant="outline" asChild className="w-full sm:w-auto">
                <Link href={`/${locale}/onboarding`}><UserPlus className="mr-2"/>{dictionary['Auth.signupButton'] || "Sign Up"}</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }
    
    return (
      <Card className="shadow-xl bg-card/80 backdrop-blur-sm border-primary/30 text-center p-4 md:p-6 max-w-sm mx-auto">
        <CardHeader className="pb-3 pt-2">
          <CardTitle className="text-3xl md:text-4xl font-bold font-headline text-primary">
            {dictionary[userSunSign.name] || userSunSign.name}
          </CardTitle>
          <div className="mt-2 space-y-1 text-sm md:text-base text-muted-foreground">
            <p className="flex items-center justify-center">
              {getElementIcon(userSunSign.element, "w-4 h-4 mr-2 text-primary")}
              {dictionary['Zodiac.element'] || "Element"}: {dictionary[userSunSign.element] || userSunSign.element}
            </p>
            <p className="flex items-center justify-center">
              {getModalityIcon(userSunSign.modality, "w-4 h-4 mr-2 text-primary")}
              {dictionary['Zodiac.modality'] || "Modality"}: {dictionary[userSunSign.modality] || userSunSign.modality}
            </p>
            <p className="flex items-center justify-center">
              {getPolarityIcon(userSunSign.polarity, "w-4 h-4 mr-2 text-primary")}
              {dictionary['Zodiac.polarity'] || "Polarity"}: {dictionary[userSunSign.polarity] || userSunSign.polarity}
            </p>
          </div>
        </CardHeader>

        <CardContent className="pt-4 space-y-4 md:space-y-6">
          <div className="flex justify-center my-3">
            <Avatar className="w-36 h-36 md:w-40 md:h-40 border-4 border-primary shadow-lg">
              <AvatarImage 
                src={`https://placehold.co/150x150.png`} 
                alt={userSunSign.name} 
                data-ai-hint={`${userSunSign.name.toLowerCase()} zodiac symbol illustration`} 
              />
              <AvatarFallback><ZodiacSignIcon signName={userSunSign.name} className="w-20 h-20" /></AvatarFallback>
            </Avatar>
          </div>

          <div className="space-y-2 text-base md:text-lg">
            <p className="flex items-center justify-center font-medium">
              <Sun className="w-5 h-5 mr-2 text-amber-400" /> 
              {dictionary['Zodiac.sunSign'] || "Sun Sign"}: <strong className="ml-1.5 text-foreground">{dictionary[userSunSign.name] || userSunSign.name}</strong>
            </p>
            <p className="flex items-center justify-center text-muted-foreground">
              <Moon className="w-5 h-5 mr-2 text-slate-400" /> 
              {dictionary['Zodiac.moonSign'] || "Moon Sign"}: <em className="ml-1.5">{dictionary['HomePage.comingSoon'] || "Coming Soon"}</em>
            </p>
            <p className="flex items-center justify-center text-muted-foreground">
              <Orbit className="w-5 h-5 mr-2 text-purple-400" /> 
              {dictionary['Zodiac.risingSign'] || "Rising Sign"}: <em className="ml-1.5">{dictionary['HomePage.comingSoon'] || "Coming Soon"}</em>
            </p>
          </div>

          <Button variant="outline" className="w-full sm:w-auto text-sm md:text-base" asChild>
            <Link href={`/${locale}/profile`}><Edit3 className="mr-2 h-4 w-4" /> {dictionary['ProfilePage.editProfileButton'] || "View/Edit Profile Details"}</Link>
          </Button>
        </CardContent>
      </Card>
    );
  };

  const HoroscopeCategoryCard = ({ title, icon: Icon, content, isLoading }: { title: string, icon: React.ElementType, content: string | undefined | null, isLoading: boolean }) => (
    <Card className="shadow-lg bg-secondary/30 hover:shadow-primary/30 transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4 px-4">
        <CardTitle className="text-base sm:text-lg font-medium font-body text-accent-foreground">{title}</CardTitle>
        <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-0">
        {isLoading ? <Skeleton className="h-20 w-full" /> : <p className="text-sm font-body text-card-foreground leading-relaxed line-clamp-4 md:line-clamp-5">{content || (dictionary['HoroscopeSection.noData'] || "No data available.")}</p>}
      </CardContent>
    </Card>
  );

  const categories = [
    { id: "love", titleKey: "HoroscopeSection.loveTitle", icon: Heart, content: horoscopeDetails?.love },
    { id: "money", titleKey: "HoroscopeSection.moneyTitle", icon: CircleDollarSign, content: horoscopeDetails?.money },
    { id: "health", titleKey: "HoroscopeSection.healthTitle", icon: Activity, content: horoscopeDetails?.health },
    { id: "work", titleKey: "HomePage.workCategory", icon: WorkIcon, content: horoscopeDetails?.main },
  ];


  return (
    <main className="flex-grow container mx-auto px-4 py-8 md:py-12 space-y-8 md:space-y-12">
      <SectionTitle
        title={dictionary['HomePage.personalizedForecastsTitle'] || "Personalized Cosmic Forecasts"}
        subtitle={user && onboardingData ? (dictionary['HomePage.personalizedForecastsSubtitleUser'] || "Your celestial dashboard for today's energies.").replace('{userName}', onboardingData.name || user.displayName || 'Explorer') : (dictionary['HomePage.personalizedForecastsSubtitleGuest'] || "Unlock your personal insights by logging in.")}
        icon={UserCircle}
      />

      <UserZodiacDetailCard />

      { (user && onboardingData && userSunSign) && (
        <>
          <Tabs value={currentTab} onValueChange={(value) => setCurrentTab(value as "today" | "yesterday" | "tomorrow")} className="w-full max-w-xl mx-auto">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="yesterday" className="font-body text-xs sm:text-sm">{dictionary['HomePage.yesterdayTab'] || "Yesterday"}</TabsTrigger>
              <TabsTrigger value="today" className="font-body text-xs sm:text-sm">{dictionary['HomePage.todayTab'] || "Today"}</TabsTrigger>
              <TabsTrigger value="tomorrow" className="font-body text-xs sm:text-sm">{dictionary['HomePage.tomorrowTab'] || "Tomorrow"}</TabsTrigger>
            </TabsList>
            {(["yesterday", "today", "tomorrow"] as const).map(tabValue => (
              <TabsContent key={tabValue} value={tabValue} className="mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {categories.map(cat => (
                    <HoroscopeCategoryCard
                      key={cat.id}
                      title={dictionary[cat.titleKey] || cat.id.charAt(0).toUpperCase() + cat.id.slice(1)}
                      icon={cat.icon}
                      content={cat.content}
                      isLoading={isHoroscopeLoading}
                    />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </>
      )}
       
      <div className="mt-12 p-4 md:p-6 bg-muted/20 border-2 border-dashed border-muted-foreground/30 rounded-lg text-center text-muted-foreground font-body">
        <p className="text-xs md:text-sm">{dictionary['HomePage.adPlaceholderText'] || "Advertisement Placeholder - Your ad could be here!"}</p>
      </div>
    </main>
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
      <div className="flex-grow container mx-auto px-4 py-8 md:py-12 text-center">
        <Sparkles className="h-12 w-12 animate-pulse text-primary mx-auto" />
        <p className="mt-4 font-body text-muted-foreground">Loading Cosmic Dashboard...</p>
      </div>
    );
  }
  return <AstroVibesHomePageContent dictionary={dictionary} locale={params.locale} />;
}

    