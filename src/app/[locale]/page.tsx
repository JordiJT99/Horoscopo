
"use client";

import { useEffect, useState, useMemo, use } from 'react';
import { useRouter } from 'next/navigation';
import type { Locale, Dictionary } from '@/lib/dictionaries';
import { getDictionary } from '@/lib/dictionaries';
import { useAuth } from '@/context/AuthContext';
import type { OnboardingFormData, ZodiacSign, HoroscopeDetail, SelectedProfileType, ZodiacSignName } from '@/types';
import { getSunSignFromDate, ZODIAC_SIGNS, WorkIcon } from '@/lib/constants';
import { getHoroscopeFlow, type HoroscopeFlowInput, type HoroscopeFlowOutput } from '@/ai/flows/horoscope-flow';
import { format, subDays, addDays } from 'date-fns';

import SubHeaderTabs, { type HoroscopePeriod } from '@/components/shared/SubHeaderTabs';
import ProfileSelector from '@/components/shared/ProfileSelector';
import UserZodiacDetailCard from '@/components/shared/UserZodiacDetailCard';
import HoroscopeCategoryCard from '@/components/shared/HoroscopeCategoryCard'; // Import shared component
import { Button } from '@/components/ui/button';
import {
  Sparkles, CalendarDays, Heart, CircleDollarSign, Activity, Upload
} from 'lucide-react';
import { cn } from '@/lib/utils';

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
        if (selectedProfile === 'user') setSelectedProfile('generic'); 
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
        signToFetch = ZODIAC_SIGNS[0].name; 
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
        if (activeSubTab === 'yesterday') { // This case will be handled by navigation now
          targetDateStr = format(subDays(today, 1), 'yyyy-MM-dd');
        } else if (activeSubTab === 'tomorrow') {
          targetDateStr = format(today, 'yyyy-MM-dd'); 
        } else if (activeSubTab === 'today') {
          targetDateStr = format(today, 'yyyy-MM-dd');
        }
        // For weekly/monthly, targetDate is not sent in this page's context, handled by navigation

        const input: HoroscopeFlowInput = { 
          sign: signToFetch, 
          locale, 
          targetDate: targetDateStr 
        };
        const result = await getHoroscopeFlow(input);
        setFullHoroscopeData(result);
        
        // For 'today' and 'tomorrow', we always display the daily horoscope.
        // Weekly and Monthly are handled by different pages.
        setCurrentDisplayHoroscope(result.daily);

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
    } else { 
      setActiveSubTab(tab); 
    }
  };

  const horoscopeCategories = [
    { id: "main", titleKey: "HomePage.workCategory", icon: WorkIcon, content: currentDisplayHoroscope?.main, progress: 65 },
    { id: "love", titleKey: "HoroscopeSection.loveTitle", icon: Heart, content: currentDisplayHoroscope?.love, progress: 70 },
    { id: "money", titleKey: "HoroscopeSection.moneyTitle", icon: CircleDollarSign, content: currentDisplayHoroscope?.money, progress: 50 },
    { id: "health", titleKey: "HoroscopeSection.healthTitle", icon: Activity, content: currentDisplayHoroscope?.health, progress: 80 },
  ];

  const getHoroscopeTitle = () => {
    if (activeSubTab === 'tomorrow') return dictionary['HomePage.yourHoroscopeTomorrow'] || "Your Horoscope for Tomorrow";
    return dictionary['HomePage.yourHoroscopeToday'] || "Your Horoscope for Today";
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
          activeHoroscopePeriod={'daily'} // Today/Tomorrow are daily views
        />

        <div>
          <div className="flex justify-between items-center mb-2 sm:mb-3 px-1">
            <h2 className="text-base sm:text-lg font-semibold font-headline text-foreground flex items-center">
              <CalendarDays className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 text-muted-foreground" />
              {getHoroscopeTitle()}
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
                dictionary={dictionary}
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
