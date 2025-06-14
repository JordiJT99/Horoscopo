
"use client";

import { useEffect, useState, useMemo, use } from 'react';
import type { Locale, Dictionary } from '@/lib/dictionaries';
import { getDictionary } from '@/lib/dictionaries';
import { useAuth } from '@/context/AuthContext';
import type { OnboardingFormData, ZodiacSign, HoroscopeDetail } from '@/types';
import { getSunSignFromDate, ZODIAC_SIGNS, WorkIcon } from '@/lib/constants';
import { getHoroscopeFlow, type HoroscopeFlowInput } from '@/ai/flows/horoscope-flow';

import SectionTitle from '@/components/shared/SectionTitle';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, LogIn, UserPlus, Heart, CircleDollarSign, Activity, Leaf, Edit3, Moon, Sunrise, UserCircle, Sun } from 'lucide-react'; // Added Sun for Sun Sign icon

interface AstroVibesHomePageProps {
  params: { locale: Locale };
}

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
          // Ensure dateOfBirth is a Date object
          parsedData.dateOfBirth = new Date(parsedData.dateOfBirth);
        }
        setOnboardingData(parsedData);
        if (parsedData.dateOfBirth) {
          setUserSunSign(getSunSignFromDate(parsedData.dateOfBirth));
        }
      } else {
        setUserSunSign(null); // No onboarding data
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
          // For now, always fetch daily. "Yesterday" and "Tomorrow" are placeholders.
          const result = await getHoroscopeFlow(input);
          setHoroscopeDetails(result.daily); 
        } catch (error) {
          console.error("Error fetching horoscope:", error);
          setHoroscopeDetails(null); // Or set an error state
        } finally {
          setIsHoroscopeLoading(false);
        }
      } else {
        // Fetch for a default sign if no user or no sun sign
        setIsHoroscopeLoading(true);
        try {
            const defaultSign = ZODIAC_SIGNS.find(s => s.name === "Aries")!;
            const input: HoroscopeFlowInput = { sign: defaultSign.name, locale };
            const result = await getHoroscopeFlow(input);
            setHoroscopeDetails(result.daily);
            setUserSunSign(defaultSign); // Set a default sun sign for display purposes
        } catch (error) {
            console.error("Error fetching default horoscope:", error);
            setHoroscopeDetails(null);
        } finally {
            setIsHoroscopeLoading(false);
        }
      }
    };

    if (!authLoading) { // Only fetch once auth state is resolved
        fetchHoroscope();
    }
  }, [userSunSign, locale, authLoading]);

  const UserZodiacDetailCard = () => {
    if (authLoading) {
        return <Skeleton className="h-[280px] w-full rounded-lg" />;
    }
    if (!user || !onboardingData || !userSunSign) {
      return (
        <Card className="shadow-xl bg-card/80 backdrop-blur-sm border-primary/30 text-center p-6">
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-primary">{dictionary['HomePage.welcomeGuestTitle'] || "Welcome to AstroVibes!"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="font-body">{dictionary['HomePage.guestPrompt'] || "Log in or complete your profile for personalized cosmic forecasts."}</p>
            <div className="flex gap-4 justify-center">
              <Button asChild>
                <Link href={`/${locale}/login`}><LogIn className="mr-2"/>{dictionary['Auth.loginButton'] || "Login"}</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/${locale}/onboarding`}><UserPlus className="mr-2"/>{dictionary['Auth.signupButton'] || "Sign Up"}</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }
    
    const ZodiacIcon = userSunSign.icon || Sun;

    return (
      <Card className="shadow-xl bg-card/80 backdrop-blur-sm border-primary/30 overflow-hidden">
        <CardHeader className="text-center p-4 md:p-6">
          <CardTitle className="font-headline text-2xl md:text-3xl text-primary">
            {(dictionary['HomePage.userForecastTitle'] || "{userName}'s Cosmic Forecast").replace('{userName}', onboardingData.name || user.displayName || 'Your')}
          </CardTitle>
          <CardDescription className="font-body text-sm text-muted-foreground">
            {dictionary['Zodiac.sunSign'] || "Sun Sign"}: {dictionary[userSunSign.name] || userSunSign.name}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div className="md:col-span-1 flex flex-col items-center md:items-start space-y-2">
              <div className="flex items-center gap-2">
                <Sun className="w-5 h-5 text-amber-400" />
                <span className="font-body text-sm">{dictionary['Zodiac.sunSign'] || "Sun Sign"}: <strong className="text-foreground">{dictionary[userSunSign.name] || userSunSign.name}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Moon className="w-5 h-5 text-slate-400" />
                <span className="font-body text-sm">{dictionary['Zodiac.moonSign'] || "Moon Sign"}: <em className="text-muted-foreground">{dictionary['HomePage.comingSoon'] || "Coming Soon"}</em></span>
              </div>
              <div className="flex items-center gap-2">
                <Sunrise className="w-5 h-5 text-orange-400" />
                <span className="font-body text-sm">{dictionary['Zodiac.risingSign'] || "Rising Sign"}: <em className="text-muted-foreground">{dictionary['HomePage.comingSoon'] || "Coming Soon"}</em></span>
              </div>
            </div>
            
            <div className="md:col-span-1 flex justify-center my-4 md:my-0">
              <Avatar className="w-32 h-32 md:w-36 md:h-36 border-4 border-primary shadow-lg">
                <AvatarImage src={`https://placehold.co/150x150.png`} alt={userSunSign.name} data-ai-hint={`${userSunSign.name} zodiac symbol illustration`} />
                <AvatarFallback><ZodiacIcon className="w-16 h-16" /></AvatarFallback>
              </Avatar>
            </div>

            <div className="md:col-span-1 flex flex-col items-center md:items-end space-y-2 text-right">
              <span className="font-body text-sm">{dictionary['Zodiac.element'] || "Element"}: <strong className="text-foreground">{dictionary[userSunSign.element] || userSunSign.element}</strong></span>
              <span className="font-body text-sm">{dictionary['Zodiac.polarity'] || "Polarity"}: <strong className="text-foreground">{dictionary[userSunSign.polarity] || userSunSign.polarity}</strong></span>
              <span className="font-body text-sm">{dictionary['Zodiac.modality'] || "Modality"}: <strong className="text-foreground">{dictionary[userSunSign.modality] || userSunSign.modality}</strong></span>
            </div>
          </div>
           <Button variant="outline" className="w-full mt-6" asChild>
             <Link href={`/${locale}/profile`}><Edit3 className="mr-2 h-4 w-4" /> {dictionary['ProfilePage.editProfileButton'] || "View/Edit Profile Details"}</Link>
           </Button>
        </CardContent>
      </Card>
    );
  };

  const HoroscopeCategoryCard = ({ title, icon: Icon, content, isLoading }: { title: string, icon: React.ElementType, content: string | undefined | null, isLoading: boolean }) => (
    <Card className="shadow-lg bg-secondary/30 hover:shadow-primary/30 transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium font-body text-accent-foreground">{title}</CardTitle>
        <Icon className="h-5 w-5 text-primary" />
      </CardHeader>
      <CardContent>
        {isLoading ? <Skeleton className="h-16 w-full" /> : <p className="text-xs md:text-sm font-body text-card-foreground leading-relaxed line-clamp-4">{content || (dictionary['HoroscopeSection.noData'] || "No data available.")}</p>}
      </CardContent>
    </Card>
  );

  const categories = [
    { id: "love", titleKey: "HoroscopeSection.loveTitle", icon: Heart, content: horoscopeDetails?.love },
    { id: "money", titleKey: "HoroscopeSection.moneyTitle", icon: CircleDollarSign, content: horoscopeDetails?.money },
    { id: "health", titleKey: "HoroscopeSection.healthTitle", icon: Activity, content: horoscopeDetails?.health },
    { id: "work", titleKey: "HomePage.workCategory", icon: WorkIcon, content: horoscopeDetails?.main }, // Using main for "Work/General" for now
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
          <Tabs value={currentTab} onValueChange={(value) => setCurrentTab(value as "today" | "yesterday" | "tomorrow")} className="w-full max-w-md mx-auto">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="yesterday" className="font-body">{dictionary['HomePage.yesterdayTab'] || "Yesterday"}</TabsTrigger>
              <TabsTrigger value="today" className="font-body">{dictionary['HomePage.todayTab'] || "Today"}</TabsTrigger>
              <TabsTrigger value="tomorrow" className="font-body">{dictionary['HomePage.tomorrowTab'] || "Tomorrow"}</TabsTrigger>
            </TabsList>
            {/* Content for tabs - For now, all will show 'today's' data */}
            {(["yesterday", "today", "tomorrow"] as const).map(tabValue => (
              <TabsContent key={tabValue} value={tabValue} className="mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
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
       {/* Ad Placeholder */}
      <div className="mt-12 p-6 bg-muted/20 border-2 border-dashed border-muted-foreground/30 rounded-lg text-center text-muted-foreground font-body">
        <p className="text-sm">{dictionary['HomePage.adPlaceholderText'] || "Advertisement Placeholder - Your ad could be here!"}</p>
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
