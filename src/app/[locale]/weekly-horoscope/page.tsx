
"use client"; 

import { use, useEffect, useMemo, useState } from 'react'; 
import { useRouter } from 'next/navigation'; 
import type { Locale, Dictionary } from '@/lib/dictionaries'; 
import { getDictionary } from '@/lib/dictionaries';
import { useAuth } from '@/context/AuthContext';
import type { OnboardingFormData, ZodiacSign, SelectedProfileType, HoroscopeDetail, ZodiacSignName } from '@/types';
import { getSunSignFromDate, ZODIAC_SIGNS, WorkIcon } from '@/lib/constants';
import { getHoroscopeFlow, type HoroscopeFlowInput, type HoroscopeFlowOutput } from '@/ai/flows/horoscope-flow';

import SectionTitle from '@/components/shared/SectionTitle';
import SubHeaderTabs, { type HoroscopePeriod } from '@/components/shared/SubHeaderTabs';
import ProfileSelector from '@/components/shared/ProfileSelector';
import UserZodiacDetailCard from '@/components/shared/UserZodiacDetailCard';
import HoroscopeCategoryCard from '@/components/shared/HoroscopeCategoryCard';

import { CalendarRange, Sparkles, Heart, CircleDollarSign, Activity } from 'lucide-react'; 

interface WeeklyHoroscopePageProps {
  params: { 
    locale: Locale;
  };
}

function WeeklyHoroscopeContent({ dictionary, locale }: { dictionary: Dictionary, locale: Locale }) {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [onboardingData, setOnboardingData] = useState<OnboardingFormData | null>(null);
  const [userSunSign, setUserSunSign] = useState<ZodiacSign | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<SelectedProfileType>('user');
  const [horoscopeData, setHoroscopeData] = useState<HoroscopeDetail | null>(null);
  const [isHoroscopeLoading, setIsHoroscopeLoading] = useState(false);
  
  // This state will hold the sign name to fetch for, especially for generic profile
  const [currentSelectedSignName, setCurrentSelectedSignName] = useState<ZodiacSignName | null>(null);


  useEffect(() => {
    if (user?.uid) {
      const storedData = localStorage.getItem(`onboardingData_${user.uid}`);
      if (storedData) {
        const parsedData = JSON.parse(storedData) as OnboardingFormData;
        if (parsedData.dateOfBirth) {
          parsedData.dateOfBirth = new Date(parsedData.dateOfBirth);
        }
        setOnboardingData(parsedData);
        const sunSign = parsedData.dateOfBirth ? getSunSignFromDate(parsedData.dateOfBirth) : null;
        setUserSunSign(sunSign);
        if (sunSign) {
          setCurrentSelectedSignName(sunSign.name); // Default to user's sign
        } else {
          setCurrentSelectedSignName(ZODIAC_SIGNS[0].name); // Default to Aries if no user sign
        }
      } else {
        setUserSunSign(null);
        setCurrentSelectedSignName(ZODIAC_SIGNS[0].name); // Default to Aries
      }
    } else {
      setOnboardingData(null);
      setUserSunSign(null);
      setSelectedProfile('generic'); 
      setCurrentSelectedSignName(ZODIAC_SIGNS[0].name); // Default to Aries for generic
    }
  }, [user]);

  useEffect(() => {
    const fetchWeeklyHoroscope = async () => {
      let signToFetch: ZodiacSignName | null = null;

      if (selectedProfile === 'user' && userSunSign) {
        signToFetch = userSunSign.name;
      } else if (selectedProfile === 'generic' && currentSelectedSignName) {
        signToFetch = currentSelectedSignName;
      } else if (selectedProfile === 'user' && !userSunSign) { // User profile selected, but no sun sign data
        signToFetch = currentSelectedSignName || ZODIAC_SIGNS[0].name; // Use default or current generic
      } else { // Default to currentSelectedSignName if available, or Aries
        signToFetch = currentSelectedSignName || ZODIAC_SIGNS[0].name;
      }


      if (signToFetch) {
        setIsHoroscopeLoading(true);
        setHoroscopeData(null);
        try {
          const input: HoroscopeFlowInput = { 
            sign: signToFetch, 
            locale 
          };
          const result = await getHoroscopeFlow(input);
          setHoroscopeData(result.weekly);
        } catch (error) {
          console.error("Error fetching weekly horoscope:", error);
          setHoroscopeData(null);
        } finally {
          setIsHoroscopeLoading(false);
        }
      } else {
        setHoroscopeData(null);
        setIsHoroscopeLoading(false);
      }
    };
    
    if (!authLoading) {
        fetchWeeklyHoroscope();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProfile, userSunSign, locale, authLoading, currentSelectedSignName]);


  const handleSubHeaderTabSelect = (tab: HoroscopePeriod) => {
    if (tab === 'yesterday') {
      router.push(`/${locale}/yesterday-horoscope`);
    } else if (tab === 'today' || tab === 'tomorrow') {
      router.push(`/${locale}`); 
    } else if (tab === 'monthly') {
      router.push(`/${locale}/monthly-horoscope`);
    }
  };

  const detailedHoroscopeCategories = horoscopeData ? [
    { id: "main", titleKey: "HomePage.workCategory", icon: WorkIcon, content: horoscopeData?.main },
    { id: "love", titleKey: "HoroscopeSection.loveTitle", icon: Heart, content: horoscopeData?.love },
    { id: "money", titleKey: "HoroscopeSection.moneyTitle", icon: CircleDollarSign, content: horoscopeData?.money },
    { id: "health", titleKey: "HoroscopeSection.healthTitle", icon: Activity, content: horoscopeData?.health },
  ] : [];
  
  const displayedSignDetails = selectedProfile === 'user' && userSunSign 
    ? userSunSign 
    : (currentSelectedSignName ? ZODIAC_SIGNS.find(s => s.name === currentSelectedSignName) ?? ZODIAC_SIGNS[0] : ZODIAC_SIGNS[0]);


  return (
    <main className="flex-grow container mx-auto px-3 sm:px-4 py-3 sm:py-4 space-y-4 sm:space-y-6">
       <SubHeaderTabs 
        dictionary={dictionary} 
        activeTab="weekly" 
        onTabChange={handleSubHeaderTabSelect} 
      />
      <div className="my-4 md:my-6">
        <ProfileSelector
            dictionary={dictionary}
            locale={locale}
            selectedProfile={selectedProfile}
            setSelectedProfile={(profile) => {
              setSelectedProfile(profile);
              // When switching to generic, if user has a sign, default to it, else Aries
              if (profile === 'generic') {
                setCurrentSelectedSignName(userSunSign?.name || ZODIAC_SIGNS[0].name);
              }
              // When switching to user, currentSelectedSignName will naturally update via userSunSign effect if needed
            }}
            user={user}
            onboardingData={onboardingData}
        />
        <UserZodiacDetailCard
            dictionary={dictionary}
            locale={locale}
            selectedProfile={selectedProfile}
            userSunSign={displayedSignDetails} // Pass the sign to display
            onboardingData={onboardingData}
            user={user}
            authLoading={authLoading}
            activeHoroscopePeriod="weekly"
        />
      </div>

      <SectionTitle 
        title={dictionary['WeeklyHoroscopePage.title'] || "Weekly Horoscope"}
        subtitle={dictionary['WeeklyHoroscopePage.subtitle'] || "Your astrological forecast for the week."}
        icon={CalendarRange}
        className="mb-4 mt-6" 
      />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3.5">
        {detailedHoroscopeCategories.map(cat => (
          <HoroscopeCategoryCard
            key={cat.id}
            dictionary={dictionary}
            titleKey={cat.titleKey}
            icon={cat.icon}
            content={cat.content}
            isLoading={isHoroscopeLoading}
          />
        ))}
         {isHoroscopeLoading && detailedHoroscopeCategories.length === 0 && Array.from({ length: 4 }).map((_, index) => (
            <HoroscopeCategoryCard
              key={`skeleton-weekly-${index}`}
              dictionary={dictionary}
              titleKey="Loading..."
              icon={Sparkles}
              content=""
              isLoading={true}
            />
        ))}
        {!isHoroscopeLoading && !horoscopeData && (
            <div className="sm:col-span-2 text-center py-10">
                 <p className="text-muted-foreground">{dictionary['HoroscopeSection.noData']}</p>
            </div>
        )}
      </div>
    </main>
  );
}

export default function WeeklyHoroscopePageWrapper({ params: paramsPromise }: { params: Promise<WeeklyHoroscopePageProps["params"]> }) {
  const params = use(paramsPromise); 
  const dictionaryPromise = useMemo(() => getDictionary(params.locale), [params.locale]);
  const dictionary = use(dictionaryPromise); 

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || Object.keys(dictionary).length === 0) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-screen bg-background text-foreground">
        <Sparkles className="h-12 w-12 animate-pulse text-primary mx-auto" />
        {Object.keys(dictionary).length > 0 && <p className="mt-4 font-body text-muted-foreground">{dictionary['HomePage.loadingDashboard'] || "Loading Cosmic Dashboard..."}</p>}
      </div>
    );
  }

  return <WeeklyHoroscopeContent dictionary={dictionary} locale={params.locale} />;
}

    