
"use client"; 

import { use, useEffect, useMemo, useState } from 'react'; 
import { useRouter } from 'next/navigation'; 
import type { Locale, Dictionary } from '@/lib/dictionaries'; 
import { getDictionary } from '@/lib/dictionaries';
import { useAuth } from '@/context/AuthContext';
import type { OnboardingFormData, ZodiacSign, SelectedProfileType } from '@/types';
import { getSunSignFromDate, ZODIAC_SIGNS } from '@/lib/constants';

import SectionTitle from '@/components/shared/SectionTitle';
import HoroscopeSection from '@/components/sections/HoroscopeSection';
import SubHeaderTabs, { type HoroscopePeriod } from '@/components/shared/SubHeaderTabs'; 
import ProfileSelector from '@/components/shared/ProfileSelector';
import UserZodiacDetailCard from '@/components/shared/UserZodiacDetailCard';

import { Calendar } from 'lucide-react';
import { Sparkles } from 'lucide-react'; 

interface MonthlyHoroscopePageProps {
  params: { 
    locale: Locale;
  };
}

// Content component to handle client-side logic
function MonthlyHoroscopeContent({ dictionary, locale }: { dictionary: Dictionary, locale: Locale }) {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [onboardingData, setOnboardingData] = useState<OnboardingFormData | null>(null);
  const [userSunSign, setUserSunSign] = useState<ZodiacSign | null>(null);
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


  const handleSubHeaderTabSelect = (tab: HoroscopePeriod) => {
    if (tab === 'yesterday') {
      router.push(`/${locale}/yesterday-horoscope`);
    } else if (tab === 'today' || tab === 'tomorrow') {
      router.push(`/${locale}`); 
    } else if (tab === 'weekly') {
      router.push(`/${locale}/weekly-horoscope`);
    }
    // If 'monthly' is clicked, do nothing
  };
  
  return (
    <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
      <SubHeaderTabs 
        dictionary={dictionary} 
        activeTab="monthly" 
        onTabChange={handleSubHeaderTabSelect} 
      />
       <div className="my-4 md:my-6">
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
      </div>
      <SectionTitle 
        title={dictionary['MonthlyHoroscopePage.title'] || "Monthly Horoscope"}
        subtitle={dictionary['MonthlyHoroscopePage.subtitle'] || "Your astrological forecast for the month."}
        icon={Calendar}
        className="mb-8 mt-6" 
      />
      
      <div className="grid grid-cols-1 gap-8 md:gap-12">
        <div>
          <HoroscopeSection dictionary={dictionary} locale={locale} period="monthly" />
        </div>
      </div>
    </main>
  );
}


export default function MonthlyHoroscopePageWrapper({ params: paramsPromise }: { params: Promise<MonthlyHoroscopePageProps["params"]> }) {
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
        <p className="mt-4 font-body text-muted-foreground">{dictionary['HomePage.loadingDashboard'] || "Loading Cosmic Dashboard..."}</p>
      </div>
    );
  }
  
  return <MonthlyHoroscopeContent dictionary={dictionary} locale={params.locale} />;
}
