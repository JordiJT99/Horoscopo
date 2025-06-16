
"use client";

import { useEffect, useState, useMemo } from 'react';
import { useRouter } 
from 'next/navigation';
import type { Locale, Dictionary } from '@/lib/dictionaries';
import { useAuth } from '@/context/AuthContext';
import type { OnboardingFormData, ZodiacSign, HoroscopeDetail, SelectedProfileType, ZodiacSignName } from '@/types';
import { getSunSignFromDate, ZODIAC_SIGNS, WorkIcon } from '@/lib/constants';
import { getHoroscopeFlow, type HoroscopeFlowInput, type HoroscopeFlowOutput } from '@/ai/flows/horoscope-flow';
import { format } from 'date-fns'; 

import SignSelectorHorizontalScroll from '@/components/shared/SignSelectorHorizontalScroll';
import SelectedSignDisplay from '@/components/shared/SelectedSignDisplay';
import SubHeaderTabs, { type HoroscopePeriod } from '@/components/shared/SubHeaderTabs';
import FeatureLinkCards from '@/components/shared/FeatureLinkCards';
import HoroscopeCategoriesSummary from '@/components/shared/HoroscopeCategoriesSummary';
import HoroscopeCategoryCard from '@/components/shared/HoroscopeCategoryCard'; // Import for detailed text
import PromotionCard from '@/components/shared/PromotionCard';
import { Sparkles as ContentSparklesIcon, Heart, CircleDollarSign, Activity, CalendarDays, Upload } from 'lucide-react';

interface AstroVibesHomePageContentProps {
  dictionary: Dictionary;
  locale: Locale;
}

export default function AstroVibesHomePageContent({ dictionary, locale }: AstroVibesHomePageContentProps) {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [onboardingData, setOnboardingData] = useState<OnboardingFormData | null>(null);
  const [userSunSign, setUserSunSign] = useState<ZodiacSign | null>(null);
  
  const [selectedDisplaySign, setSelectedDisplaySign] = useState<ZodiacSign>(ZODIAC_SIGNS.find(s => s.name === "Capricorn")!); 
  
  const [fullHoroscopeData, setFullHoroscopeData] = useState<HoroscopeFlowOutput | null>(null);
  const [currentDisplayHoroscope, setCurrentDisplayHoroscope] = useState<HoroscopeDetail | null>(null); // For detailed text cards
  const [isHoroscopeLoading, setIsHoroscopeLoading] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<HoroscopePeriod>('today'); 

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
        // if (sunSign) {
        //   setSelectedDisplaySign(sunSign); 
        // }
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
      if (!selectedDisplaySign) return; 

      setIsHoroscopeLoading(true);
      try {
        let targetDateStr: string | undefined = undefined;
        const today = new Date();
        
        if (activeSubTab === 'today' || activeSubTab === 'tomorrow') {
          targetDateStr = format(today, 'yyyy-MM-dd');
        }
        // 'yesterday', 'weekly', 'monthly' are handled by their own pages.

        const input: HoroscopeFlowInput = { 
          sign: selectedDisplaySign.name, 
          locale, 
          targetDate: targetDateStr 
        };
        const result = await getHoroscopeFlow(input);
        setFullHoroscopeData(result); 
        
        setCurrentDisplayHoroscope(result.daily); // For Today & Tomorrow, we show daily details

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
  }, [selectedDisplaySign, locale, authLoading, activeSubTab]);


  const handleSubHeaderTabSelect = (tab: HoroscopePeriod) => {
    if (tab === 'yesterday') {
      router.push(`/${locale}/yesterday-horoscope`);
    } else if (tab === 'weekly') {
      router.push(`/${locale}/weekly-horoscope`);
    } else if (tab === 'monthly') {
      router.push(`/${locale}/monthly-horoscope`);
    } else { 
      setActiveSubTab(tab); 
    }
  };
  
  const handleSignSelected = (sign: ZodiacSign) => {
    setSelectedDisplaySign(sign);
  };

  const summaryCategories = [
    { nameKey: "HoroscopeSummary.love", percentage: 80, dataKey: "love" as keyof HoroscopeDetail },
    { nameKey: "HoroscopeSummary.career", percentage: 60, dataKey: "main" as keyof HoroscopeDetail }, // main is usually work/general
    { nameKey: "HoroscopeSummary.health", percentage: 40, dataKey: "health" as keyof HoroscopeDetail },
  ];

  const detailedHoroscopeCategories = currentDisplayHoroscope ? [
    { id: "main", titleKey: "HomePage.workCategory", icon: WorkIcon, content: currentDisplayHoroscope?.main },
    { id: "love", titleKey: "HoroscopeSection.loveTitle", icon: Heart, content: currentDisplayHoroscope?.love },
    { id: "money", titleKey: "HoroscopeSection.moneyTitle", icon: CircleDollarSign, content: currentDisplayHoroscope?.money },
    { id: "health", titleKey: "HoroscopeSection.healthTitle", icon: Activity, content: currentDisplayHoroscope?.health },
  ] : [];

  const pageTitle = activeSubTab === 'today' 
    ? (dictionary['HomePage.yourHoroscopeToday'] || "Your Horoscope for Today")
    : (dictionary['HomePage.yourHoroscopeTomorrow'] || "Your Horoscope for Tomorrow");

  if (authLoading && !user) { 
     return (
      <div className="flex-grow flex items-center justify-center min-h-[calc(100vh-var(--top-bar-height)-var(--bottom-nav-height))]">
        <ContentSparklesIcon className="h-12 w-12 animate-pulse text-primary mx-auto" />
        {dictionary && Object.keys(dictionary).length > 0 && <p className="mt-4 font-body text-muted-foreground">{dictionary['HomePage.loadingDashboard'] || "Loading Cosmic Dashboard..."}</p>}
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <main className="flex-grow container mx-auto px-2 sm:px-3 py-3 space-y-4">
        <SignSelectorHorizontalScroll
          dictionary={dictionary}
          locale={locale}
          signs={ZODIAC_SIGNS}
          selectedSignName={selectedDisplaySign.name}
          onSignSelect={handleSignSelected}
          user={user} 
        />
        
        <SelectedSignDisplay
          dictionary={dictionary}
          locale={locale}
          selectedSign={selectedDisplaySign}
        />

        <SubHeaderTabs 
          dictionary={dictionary} 
          activeTab={activeSubTab} 
          onTabChange={handleSubHeaderTabSelect} 
        />

        <FeatureLinkCards dictionary={dictionary} locale={locale} />
        
        <HoroscopeCategoriesSummary
            dictionary={dictionary}
            titleKey={activeSubTab === 'today' ? "HoroscopeSummary.essentialToday" : "HoroscopeSummary.essentialTomorrow"}
            subtitleKey="HoroscopeSummary.relations" // This seems static from the image
            categories={summaryCategories}
            isLoading={isHoroscopeLoading}
            horoscopeDetail={currentDisplayHoroscope}
        />

        {/* Detailed Horoscope Text Section */}
        <div>
          <div className="flex justify-between items-center mb-2 sm:mb-3 px-1">
            <h2 className="text-base sm:text-lg font-semibold font-headline text-foreground flex items-center">
              <CalendarDays className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 text-muted-foreground" />
              {pageTitle}
            </h2>
            {/* Share button can be added here if needed */}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3.5">
            {detailedHoroscopeCategories.map(cat => (
              <HoroscopeCategoryCard
                key={cat.id}
                dictionary={dictionary}
                titleKey={cat.titleKey}
                icon={cat.icon}
                content={cat.content}
                // progressValue prop is removed/made optional, so not passing it here
                isLoading={isHoroscopeLoading}
              />
            ))}
            {isHoroscopeLoading && detailedHoroscopeCategories.length === 0 && Array.from({ length: 4 }).map((_, index) => (
                 <HoroscopeCategoryCard
                    key={`skeleton-${index}`}
                    dictionary={dictionary}
                    titleKey="Loading..."
                    icon={ContentSparklesIcon}
                    content=""
                    isLoading={true}
                  />
            ))}
          </div>
        </div>
       
        <PromotionCard dictionary={dictionary} />
      </main>
    </div>
  );
}
