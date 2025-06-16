
"use client";

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { Locale, Dictionary } from '@/lib/dictionaries';
import { useAuth } from '@/context/AuthContext';
import type { OnboardingFormData, ZodiacSign, HoroscopeDetail, SelectedProfileType, ZodiacSignName, HoroscopeFlowOutput } from '@/types';
import { getSunSignFromDate, ZODIAC_SIGNS, WorkIcon } from '@/lib/constants';
import { getHoroscopeFlow, type HoroscopeFlowInput } from '@/ai/flows/horoscope-flow';
import { format, subDays } from 'date-fns';

import SignSelectorHorizontalScroll from '@/components/shared/SignSelectorHorizontalScroll';
import SelectedSignDisplay from '@/components/shared/SelectedSignDisplay';
import SubHeaderTabs, { type HoroscopePeriod } from '@/components/shared/SubHeaderTabs';
import FeatureLinkCards from '@/components/shared/FeatureLinkCards';
import HoroscopeCategoriesSummary from '@/components/shared/HoroscopeCategoriesSummary';
import HoroscopeCategoryCard from '@/components/shared/HoroscopeCategoryCard';
import PromotionCard from '@/components/shared/PromotionCard';
import { Sparkles as ContentSparklesIcon, Heart, CircleDollarSign, Activity, CalendarDays } from 'lucide-react';

interface AstroVibesPageContentProps {
  dictionary: Dictionary;
  locale: Locale;
  // Determines which set of data to fetch and display (daily, weekly, monthly)
  // And also which detail to show in the 4-card grid
  displayPeriod: 'daily' | 'weekly' | 'monthly';
  // For 'daily' period, this can specify 'yesterday'
  targetDate?: string;
  // This prop will determine which tab is highlighted in SubHeaderTabs
  // and also which titles to use for summaries and sections.
  activeHoroscopePeriodForTitles: HoroscopePeriod;
}

export default function AstroVibesHomePageContent({
  dictionary,
  locale,
  displayPeriod,
  targetDate,
  activeHoroscopePeriodForTitles,
}: AstroVibesPageContentProps) {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [onboardingData, setOnboardingData] = useState<OnboardingFormData | null>(null);
  const [userSunSign, setUserSunSign] = useState<ZodiacSign | null>(null);

  const [selectedDisplaySign, setSelectedDisplaySign] = useState<ZodiacSign>(ZODIAC_SIGNS.find(s => s.name === "Capricorn")!);

  const [fullHoroscopeData, setFullHoroscopeData] = useState<HoroscopeFlowOutput | null>(null);
  const [currentDisplayHoroscope, setCurrentDisplayHoroscope] = useState<HoroscopeDetail | null>(null);
  const [isHoroscopeLoading, setIsHoroscopeLoading] = useState(false);

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
           // Keep current selectedDisplaySign if a user logs in, unless it's still the default Capricorn
          if (selectedDisplaySign.name === "Capricorn") {
            setSelectedDisplaySign(sunSign);
          }
        }
      } else {
        setUserSunSign(null);
      }
    } else {
      setOnboardingData(null);
      setUserSunSign(null);
       // If user logs out, revert to default or keep current if it wasn't user-specific
      if (userSunSign && selectedDisplaySign.name === userSunSign.name) {
        setSelectedDisplaySign(ZODIAC_SIGNS.find(s => s.name === "Capricorn")!);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);


  useEffect(() => {
    const fetchHoroscope = async () => {
      if (!selectedDisplaySign) return;

      setIsHoroscopeLoading(true);
      try {
        const input: HoroscopeFlowInput = {
          sign: selectedDisplaySign.name,
          locale,
          targetDate: targetDate, // Use the prop
        };
        const result = await getHoroscopeFlow(input);
        setFullHoroscopeData(result);
        
        // Set currentDisplayHoroscope based on the displayPeriod prop
        if (displayPeriod === 'daily') {
          setCurrentDisplayHoroscope(result.daily);
        } else if (displayPeriod === 'weekly') {
          setCurrentDisplayHoroscope(result.weekly);
        } else if (displayPeriod === 'monthly') {
          setCurrentDisplayHoroscope(result.monthly);
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
  }, [selectedDisplaySign, locale, authLoading, displayPeriod, targetDate]);


  const handleSubHeaderTabSelect = (tab: HoroscopePeriod) => {
    if (tab === 'yesterday') {
      router.push(`/${locale}/yesterday-horoscope`);
    } else if (tab === 'weekly') {
      router.push(`/${locale}/weekly-horoscope`);
    } else if (tab === 'monthly') {
      router.push(`/${locale}/monthly-horoscope`);
    } else { // today or tomorrow, handled by main page
      router.push(`/${locale}${tab === 'tomorrow' ? '?period=tomorrow' : ''}`);
    }
  };

  const handleSignSelected = (sign: ZodiacSign) => {
    setSelectedDisplaySign(sign);
  };

  const summaryCategories = [
    { nameKey: "HoroscopeSummary.love", percentage: 80, dataKey: "love" as keyof HoroscopeDetail },
    { nameKey: "HoroscopeSummary.career", percentage: 60, dataKey: "main" as keyof HoroscopeDetail },
    { nameKey: "HoroscopeSummary.health", percentage: 40, dataKey: "health" as keyof HoroscopeDetail },
  ];

  const detailedHoroscopeCategories = currentDisplayHoroscope ? [
    { id: "main", titleKey: "HomePage.workCategory", icon: WorkIcon, content: currentDisplayHoroscope?.main },
    { id: "love", titleKey: "HoroscopeSection.loveTitle", icon: Heart, content: currentDisplayHoroscope?.love },
    { id: "money", titleKey: "HoroscopeSection.moneyTitle", icon: CircleDollarSign, content: currentDisplayHoroscope?.money },
    { id: "health", titleKey: "HoroscopeSection.healthTitle", icon: Activity, content: currentDisplayHoroscope?.health },
  ] : [];

  let pageTitleKey = "HomePage.yourHoroscopeToday";
  let summaryTitleKey = "HoroscopeSummary.essentialToday";

  switch (activeHoroscopePeriodForTitles) {
    case 'today':
      pageTitleKey = "HomePage.yourHoroscopeToday";
      summaryTitleKey = "HoroscopeSummary.essentialToday";
      break;
    case 'tomorrow':
      pageTitleKey = "HomePage.yourHoroscopeTomorrow";
      summaryTitleKey = "HoroscopeSummary.essentialTomorrow";
      break;
    case 'yesterday':
      pageTitleKey = "HomePage.yourHoroscopeYesterday";
      summaryTitleKey = "HoroscopeSummary.essentialYesterday";
      break;
    case 'weekly':
      pageTitleKey = "WeeklyHoroscopePage.title";
      summaryTitleKey = "HoroscopeSummary.essentialWeekly";
      break;
    case 'monthly':
      pageTitleKey = "MonthlyHoroscopePage.title";
      summaryTitleKey = "HoroscopeSummary.essentialMonthly";
      break;
  }


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
          activeTab={activeHoroscopePeriodForTitles}
          onTabChange={handleSubHeaderTabSelect}
        />

        <FeatureLinkCards dictionary={dictionary} locale={locale} />

        <HoroscopeCategoriesSummary
          dictionary={dictionary}
          titleKey={summaryTitleKey}
          subtitleKey="HoroscopeSummary.relations" 
          categories={summaryCategories}
          isLoading={isHoroscopeLoading}
          horoscopeDetail={currentDisplayHoroscope}
        />

        <div>
          <div className="flex justify-between items-center mb-2 sm:mb-3 px-1">
            <h2 className="text-base sm:text-lg font-semibold font-headline text-foreground flex items-center">
              <CalendarDays className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 text-muted-foreground" />
              {dictionary[pageTitleKey] || "Horoscope Details"}
            </h2>
          </div>
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
                key={`skeleton-${index}`}
                dictionary={dictionary}
                titleKey="Loading..."
                icon={ContentSparklesIcon}
                content=""
                isLoading={true}
              />
            ))}
            {!isHoroscopeLoading && !currentDisplayHoroscope && (
               <div className="sm:col-span-2 text-center py-10">
                 <p className="text-muted-foreground">{dictionary['HoroscopeSection.noData']}</p>
              </div>
            )}
          </div>
        </div>

        <PromotionCard dictionary={dictionary} />
      </main>
    </div>
  );
}
