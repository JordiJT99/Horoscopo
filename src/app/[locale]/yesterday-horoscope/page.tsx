
"use client";

import { useEffect, useState, useMemo, use } from 'react';
import { useRouter } from 'next/navigation';
import type { Locale, Dictionary } from '@/lib/dictionaries';
import { getDictionary } from '@/lib/dictionaries';
import { useAuth } from '@/context/AuthContext';
import type { OnboardingFormData, ZodiacSign, HoroscopeDetail, SelectedProfileType } from '@/types';
import { getSunSignFromDate, ZODIAC_SIGNS, WorkIcon } from '@/lib/constants';
import { getHoroscopeFlow, type HoroscopeFlowInput, type HoroscopeFlowOutput } from '@/ai/flows/horoscope-flow';
import { format, subDays } from 'date-fns';

import SubHeaderTabs, { type HoroscopePeriod } from '@/components/shared/SubHeaderTabs';
import ProfileSelector from '@/components/shared/ProfileSelector';
import UserZodiacDetailCard from '@/components/shared/UserZodiacDetailCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Sparkles, Heart, CircleDollarSign, Activity, CalendarDays, Upload
} from 'lucide-react';

interface YesterdayHoroscopePageProps {
  params: { locale: Locale };
}

function YesterdayHoroscopeContent({ dictionary, locale }: { dictionary: Dictionary, locale: Locale }) {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [onboardingData, setOnboardingData] = useState<OnboardingFormData | null>(null);
  const [userSunSign, setUserSunSign] = useState<ZodiacSign | null>(null);
  const [yesterdayHoroscope, setYesterdayHoroscope] = useState<HoroscopeDetail | null>(null);
  const [isHoroscopeLoading, setIsHoroscopeLoading] = useState(false);
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
      }
    } else {
      setOnboardingData(null);
      setUserSunSign(null);
      setSelectedProfile('generic');
    }
  }, [user]);

  useEffect(() => {
    const fetchHoroscopeForYesterday = async () => {
      let signToFetch: ZodiacSign | null = null;
      if (selectedProfile === 'user' && userSunSign) {
        signToFetch = userSunSign;
      } else {
        signToFetch = ZODIAC_SIGNS.find(s => s.name === "Aries")!; // Default to Aries for generic
      }

      if (signToFetch) {
        setIsHoroscopeLoading(true);
        try {
          const yesterdayDate = subDays(new Date(), 1);
          const targetDateStr = format(yesterdayDate, 'yyyy-MM-dd');
          const input: HoroscopeFlowInput = { 
            sign: signToFetch.name, 
            locale, 
            targetDate: targetDateStr 
          };
          const result = await getHoroscopeFlow(input);
          setYesterdayHoroscope(result.daily);
        } catch (error) {
          console.error("Error fetching yesterday's horoscope:", error);
          setYesterdayHoroscope(null);
        } finally {
          setIsHoroscopeLoading(false);
        }
      } else {
         setYesterdayHoroscope(null);
      }
    };

    if (!authLoading) {
        fetchHoroscopeForYesterday();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProfile, userSunSign, locale, authLoading]);

  const handleSubHeaderTabSelect = (tab: HoroscopePeriod) => {
    if (tab === 'today' || tab === 'tomorrow') {
      router.push(`/${locale}`);
    } else if (tab === 'weekly') {
      router.push(`/${locale}/weekly-horoscope`);
    } else if (tab === 'monthly') {
      router.push(`/${locale}/monthly-horoscope`);
    }
    // If 'yesterday' is clicked, do nothing (already on the page)
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
        {isLoading ? <Skeleton className="h-10 w-full" /> : <p className="text-xs sm:text-sm font-body text-card-foreground/80 leading-relaxed line-clamp-3">{content || (dictionary['HoroscopeSection.noData'] || "No data available.")}</p>}
      </CardContent>
    </Card>
  );

  const horoscopeCategories = [
    { id: "main", titleKey: "HomePage.workCategory", icon: WorkIcon, content: yesterdayHoroscope?.main, progress: 65 },
    { id: "love", titleKey: "HoroscopeSection.loveTitle", icon: Heart, content: yesterdayHoroscope?.love, progress: 70 },
    { id: "money", titleKey: "HoroscopeSection.moneyTitle", icon: CircleDollarSign, content: yesterdayHoroscope?.money, progress: 50 },
    { id: "health", titleKey: "HoroscopeSection.healthTitle", icon: Activity, content: yesterdayHoroscope?.health, progress: 80 },
  ];
  
  const yesterdayDate = subDays(new Date(), 1);
  const dateDescriptor = yesterdayDate.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric', weekday: 'short' });

  return (
    <div className="flex flex-col min-h-screen">
      <SubHeaderTabs dictionary={dictionary} activeTab="yesterday" onTabChange={handleSubHeaderTabSelect} />
      
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
        />

        <div>
          <div className="flex justify-between items-center mb-2 sm:mb-3 px-1">
            <h2 className="text-base sm:text-lg font-semibold font-headline text-foreground flex items-center">
              <CalendarDays className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 text-muted-foreground" />
              {dictionary['HomePage.yourHoroscopeYesterday'] || "Your Horoscope for Yesterday"}
              <span className="text-[0.65rem] sm:text-xs text-muted-foreground ml-1.5 sm:ml-2 hidden sm:inline">({dateDescriptor})</span>
            </h2>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary h-7 w-7 sm:h-8 sm:w-8">
              <Upload className="w-3.5 h-3.5 sm:w-4 sm:w-4"/>
              <span className="sr-only">{dictionary['HomePage.shareHoroscope'] || "Share Horoscope"}</span>
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
          <p className="text-xs sm:text-sm">{dictionary['HomePage.adPlaceholderText'] || "Advertisement Placeholder - Your ad could be here!"}</p>
        </div>
      </main>
    </div>
  );
}

export default function YesterdayHoroscopePageWrapper({ params: paramsPromise }: YesterdayHoroscopePageProps) {
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
        <p className="mt-4 font-body text-muted-foreground">{dictionary['HomePage.loadingDashboard'] || "Loading Cosmic Dashboard..."}</p>
      </div>
    );
  }
  return <YesterdayHoroscopeContent dictionary={dictionary} locale={params.locale} />;
}
