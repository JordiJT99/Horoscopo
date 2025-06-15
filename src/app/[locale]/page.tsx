
"use client";

import { useEffect, useState, useMemo, use } from 'react';
import { useRouter } from 'next/navigation';
import type { Locale, Dictionary } from '@/lib/dictionaries';
import { getDictionary } from '@/lib/dictionaries';
import { useAuth } from '@/context/AuthContext';
import type { OnboardingFormData, ZodiacSign, HoroscopeDetail, SelectedProfileType } from '@/types';
import { getSunSignFromDate, ZODIAC_SIGNS, WorkIcon } from '@/lib/constants';
import { getHoroscopeFlow, type HoroscopeFlowInput, type HoroscopeFlowOutput } from '@/ai/flows/horoscope-flow';
import { format, subDays, addDays } from 'date-fns';

import SubHeaderTabs, { type HoroscopePeriod } from '@/components/shared/SubHeaderTabs';
import ProfileSelector from '@/components/shared/ProfileSelector';
import UserZodiacDetailCard from '@/components/shared/UserZodiacDetailCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Sparkles, CalendarDays, Heart, CircleDollarSign, Activity
} from 'lucide-react';

interface AstroVibesHomePageProps {
  params: { locale: Locale };
}

function AstroVibesHomePageContent({ dictionary, locale }: { dictionary: Dictionary, locale: Locale }) {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [onboardingData, setOnboardingData] = useState<OnboardingFormData | null>(null);
  const [userSunSign, setUserSunSign] = useState<ZodiacSign | null>(null);
  const [fullHoroscopeData, setFullHoroscopeData] = useState<HoroscopeFlowOutput | null>(null);
  const [currentDisplayHoroscope, setCurrentDisplayHoroscope] = useState<HoroscopeDetail | null>(null);
  const [isHoroscopeLoading, setIsHoroscopeLoading] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<HoroscopePeriod>('today');
  const [selectedProfile, setSelectedProfile] = useState<SelectedProfileType>('user');

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
        if (selectedProfile === 'user') setSelectedProfile('generic'); // Default to generic if no user data
      }
    } else {
      setOnboardingData(null);
      setUserSunSign(null);
      setSelectedProfile('generic'); 
    }
  }, [user, selectedProfile]);

  useEffect(() => {
    const fetchHoroscope = async () => {
      let signToFetch: ZodiacSignName | null = null;
      if (selectedProfile === 'user' && userSunSign) {
        signToFetch = userSunSign.name;
      } else if (selectedProfile === 'generic') {
        signToFetch = ZODIAC_SIGNS[0].name; // Default to Aries for generic
      }

      if (!signToFetch) {
        setCurrentDisplayHoroscope(null);
        setFullHoroscopeData(null);
        setIsHoroscopeLoading(false);
        return;
      }

      setIsHoroscopeLoading(true);
      try {
        let targetDateStr: string | undefined = undefined;
        const today = new Date();
        if (activeSubTab === 'yesterday') {
          targetDateStr = format(subDays(today, 1), 'yyyy-MM-dd');
        } else if (activeSubTab === 'tomorrow') {
          // For "tomorrow", API still fetches "today" as per current horoscope-flow limitations
          // UI will reflect "Tomorrow", but data is for today.
          targetDateStr = format(today, 'yyyy-MM-dd'); 
        } else if (activeSubTab === 'today') {
          targetDateStr = format(today, 'yyyy-MM-dd');
        }
        // For weekly/monthly, targetDate is not sent, flow defaults to current week/month

        const input: HoroscopeFlowInput = { 
          sign: signToFetch, 
          locale, 
          targetDate: targetDateStr 
        };
        const result = await getHoroscopeFlow(input);
        setFullHoroscopeData(result);
        
        if (activeSubTab === 'weekly') {
          setCurrentDisplayHoroscope(result.weekly);
        } else if (activeSubTab === 'monthly') {
          setCurrentDisplayHoroscope(result.monthly);
        } else { // yesterday, today, tomorrow
          setCurrentDisplayHoroscope(result.daily);
        }

      } catch (error) {
        console.error("Error fetching horoscope:", error);
        setFullHoroscopeData(null);
        setCurrentDisplayHoroscope(null);
      } finally {
        setIsHoroscopeLoading(false);
      }
    };

    if (!authLoading) {
        fetchHoroscope();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProfile, userSunSign, locale, authLoading, activeSubTab]);


  const handleSubHeaderTabSelect = (tab: HoroscopePeriod) => {
    if (tab === 'weekly') {
      router.push(`/${locale}/weekly-horoscope`);
    } else if (tab === 'monthly') {
      router.push(`/${locale}/monthly-horoscope`);
    } else if (tab === 'yesterday') {
      router.push(`/${locale}/yesterday-horoscope`);
    } else { // today, tomorrow
      setActiveSubTab(tab); // This will trigger useEffect to re-fetch data
    }
  };

  const getDateDescriptor = () => {
    const today = new Date();
    let dateToShow = today;
    if (activeSubTab === 'tomorrow') {
        dateToShow = addDays(today,1);
    } else if (activeSubTab === 'yesterday') {
        dateToShow = subDays(today,1);
    }
    
    if (activeSubTab === 'monthly' && fullHoroscopeData) {
      return today.toLocaleDateString(locale, { month: 'long', year: 'numeric' });
    }
    // For daily views (today, tomorrow, yesterday)
    return dateToShow.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const getHoroscopeTitle = () => {
    if (activeSubTab === 'monthly') return dictionary['HomePage.horoscopeTitleMonthly'] || "Horóscopo Mensual";
    if (activeSubTab === 'weekly') return dictionary['HomePage.horoscopeTitleWeekly'] || "Horóscopo Semanal";
    if (activeSubTab === 'tomorrow') return dictionary['HomePage.horoscopeTitleTomorrow'] || "Horóscopo para Mañana";
    if (activeSubTab === 'yesterday') return dictionary['HomePage.horoscopeTitleYesterday'] || "Horóscopo de Ayer";
    return dictionary['HomePage.horoscopeTitleToday'] || "Horóscopo de Hoy";
  }

  const getHoroscopeAspectTitle = () => {
    // This replicates "Horóscopo del Amor - Junio 2025" from the image for monthly
    // For other periods, we might use a generic title or main aspect
    const dateStr = getDateDescriptor();
    if (activeSubTab === 'monthly') {
      return (dictionary['HomePage.horoscopeLoveTitleMonth'] || "Horóscopo del Amor - {date}").replace('{date}', dateStr);
    }
    return (dictionary['HomePage.horoscopeMainTitlePeriod'] || "Perspectiva Principal - {date}").replace('{date}', dateStr);
  }

  const horoscopeContentToDisplay = () => {
    if (!currentDisplayHoroscope) return dictionary['HoroscopeSection.noData'] || "No data available.";
    if (activeSubTab === 'monthly') return currentDisplayHoroscope.love; // As per image example
    return currentDisplayHoroscope.main; // Default to main aspect for daily/weekly
  }

  return (
    <div className="flex flex-col min-h-screen">
      <SubHeaderTabs dictionary={dictionary} activeTab={activeSubTab} onTabChange={handleSubHeaderTabSelect} />
      
      <main className="flex-grow container mx-auto px-3 sm:px-4 py-3 sm:py-4 space-y-4 sm:space-y-6">
        <ProfileSelector
          dictionary={dictionary}
          locale={locale}
          selectedProfile={selectedProfile}
          setSelectedProfile={setSelectedProfile}
          user={user}
          onboardingData={onboardingData}
        />
        
        <UserZodiacDetailCard
          dictionary={dictionary}
          locale={locale}
          selectedProfile={selectedProfile}
          userSunSign={userSunSign}
          onboardingData={onboardingData}
          user={user}
          authLoading={authLoading}
          activeHoroscopePeriod={activeSubTab === 'monthly' ? 'monthly' : (activeSubTab === 'weekly' ? 'weekly' : 'daily')}
        />

        {isHoroscopeLoading ? (
            <Card className="shadow-lg bg-card/80 backdrop-blur-sm p-4 sm:p-6 rounded-xl">
                <Skeleton className="h-8 w-3/4 mb-4" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-20 w-full" />
            </Card>
        ) : currentDisplayHoroscope ? (
            <Card className="shadow-lg bg-card/80 backdrop-blur-sm p-4 sm:p-6 rounded-xl">
                <CardHeader className="p-0 mb-3">
                    <CardTitle className="text-xl sm:text-2xl font-headline text-primary">{getHoroscopeAspectTitle()}</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <p className="font-body text-sm sm:text-base text-card-foreground leading-relaxed whitespace-pre-line">
                        {horoscopeContentToDisplay()}
                    </p>
                </CardContent>
            </Card>
        ) : (
           <Card className="shadow-lg bg-card/80 backdrop-blur-sm p-6 rounded-xl text-center">
             <p className="font-body text-muted-foreground">{dictionary['HoroscopeSection.noData'] || "No data available for the selected period."}</p>
           </Card>
        )}
       
        <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-card/50 border-2 border-dashed border-muted-foreground/20 rounded-lg text-center text-muted-foreground font-body">
          <p className="text-xs sm:text-sm">{dictionary['HomePage.adPlaceholderText'] || "Advertisement Placeholder - Your ad could be here!"}</p>
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
        {Object.keys(dictionary).length > 0 && <p className="mt-4 font-body text-muted-foreground">{dictionary['HomePage.loadingDashboard'] || "Loading Cosmic Dashboard..."}</p>}
      </div>
    );
  }
  return <AstroVibesHomePageContent dictionary={dictionary} locale={params.locale} />;
}
