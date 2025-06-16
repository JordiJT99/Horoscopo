
"use client";

import { useEffect, useState, useMemo } from 'react';
import { useRouter } // Removed useSearchParams as it's not used here
from 'next/navigation';
import type { Locale, Dictionary } from '@/lib/dictionaries';
import { useAuth } from '@/context/AuthContext';
import type { OnboardingFormData, ZodiacSign, HoroscopeDetail, SelectedProfileType, ZodiacSignName } from '@/types';
import { getSunSignFromDate, ZODIAC_SIGNS, WorkIcon } from '@/lib/constants';
import { getHoroscopeFlow, type HoroscopeFlowInput, type HoroscopeFlowOutput } from '@/ai/flows/horoscope-flow';
import { format } from 'date-fns'; // Removed subDays as it's not directly used here

// New and modified components for the redesign
import SignSelectorHorizontalScroll from '@/components/shared/SignSelectorHorizontalScroll';
import SelectedSignDisplay from '@/components/shared/SelectedSignDisplay';
import SubHeaderTabs, { type HoroscopePeriod } from '@/components/shared/SubHeaderTabs';
import FeatureLinkCards from '@/components/shared/FeatureLinkCards';
import HoroscopeCategoriesSummary from '@/components/shared/HoroscopeCategoriesSummary';
import PromotionCard from '@/components/shared/PromotionCard';
import { Sparkles as ContentSparklesIcon } from 'lucide-react';

interface AstroVibesHomePageContentProps {
  dictionary: Dictionary;
  locale: Locale;
}

export default function AstroVibesHomePageContent({ dictionary, locale }: AstroVibesHomePageContentProps) {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [onboardingData, setOnboardingData] = useState<OnboardingFormData | null>(null);
  const [userSunSign, setUserSunSign] = useState<ZodiacSign | null>(null);
  
  // State for the sign selected in the horizontal scroll
  const [selectedDisplaySign, setSelectedDisplaySign] = useState<ZodiacSign>(ZODIAC_SIGNS.find(s => s.name === "Capricorn")!); // Default to Capricorn as in image
  
  const [fullHoroscopeData, setFullHoroscopeData] = useState<HoroscopeFlowOutput | null>(null);
  const [currentCategoryHoroscope, setCurrentCategoryHoroscope] = useState<HoroscopeDetail | null>(null);
  const [isHoroscopeLoading, setIsHoroscopeLoading] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<HoroscopePeriod>('today'); // Default to 'today'

  // This effect manages fetching data based on the user's actual sun sign if logged in
  // or falls back to a default for generic view.
  // For the new design, `selectedDisplaySign` drives the display.
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
        // If user is logged in and has a sun sign, make it the default selected display sign
        if (sunSign) {
          // Commented out to keep "Capricorn" as default for image matching for now
          // setSelectedDisplaySign(sunSign); 
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
      if (!selectedDisplaySign) return; // Use the sign from the horizontal selector

      setIsHoroscopeLoading(true);
      try {
        let targetDateStr: string | undefined = undefined;
        const today = new Date();
        
        if (activeSubTab === 'today' || activeSubTab === 'tomorrow' || activeSubTab === 'yesterday') {
          // For 'yesterday', 'today', 'tomorrow', we fetch the daily horoscope.
          // The actual date logic for 'yesterday' is handled by its dedicated page.
          // 'tomorrow' will show today's horoscope with a "Tomorrow" label.
          targetDateStr = format(today, 'yyyy-MM-dd');
        }
        // Weekly and Monthly periods are handled by their respective pages.
        // This page (page.tsx) now focuses on daily views.

        const input: HoroscopeFlowInput = { 
          sign: selectedDisplaySign.name, 
          locale, 
          targetDate: targetDateStr 
        };
        const result = await getHoroscopeFlow(input);
        setFullHoroscopeData(result); // Store full data if needed elsewhere
        
        // For the category summary, we always use the 'daily' part for 'today', 'tomorrow', 'yesterday'
        setCurrentCategoryHoroscope(result.daily);

      } catch (error) {
        console.error("Error fetching horoscope:", error);
        setFullHoroscopeData(null);
        setCurrentCategoryHoroscope(null);
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
      // For 'today' and 'tomorrow', update the active tab state for this page
      setActiveSubTab(tab); 
    }
  };
  
  // Callback for the horizontal sign selector
  const handleSignSelected = (sign: ZodiacSign) => {
    setSelectedDisplaySign(sign);
  };

  // Mock data for HoroscopeCategoriesSummary based on the image
  const summaryCategories = [
    { nameKey: "HoroscopeSummary.love", percentage: 80 },
    { nameKey: "HoroscopeSummary.career", percentage: 60 },
    { nameKey: "HoroscopeSummary.health", percentage: 40 },
  ];

  if (authLoading && !user) { // Show loader if auth is still loading and there's no user yet
     return (
      <div className="flex-grow flex items-center justify-center min-h-[calc(100vh-var(--top-bar-height)-var(--bottom-nav-height))]">
        <ContentSparklesIcon className="h-12 w-12 animate-pulse text-primary mx-auto" />
        {dictionary && Object.keys(dictionary).length > 0 && <p className="mt-4 font-body text-muted-foreground">{dictionary['HomePage.loadingDashboard'] || "Loading Cosmic Dashboard..."}</p>}
      </div>
    );
  }

  return (
    <div className="flex flex-col"> {/* Removed min-h-screen, handled by layout */}
      {/* Top Bar and Bottom Nav are in layout.tsx */}
      
      <main className="flex-grow container mx-auto px-2 sm:px-3 py-3 space-y-4">
        <SignSelectorHorizontalScroll
          dictionary={dictionary}
          locale={locale}
          signs={ZODIAC_SIGNS}
          selectedSignName={selectedDisplaySign.name}
          onSignSelect={handleSignSelected}
          user={user} // Pass user to potentially show "Add a friend" differently
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
            titleKey={activeSubTab === 'today' ? "HoroscopeSummary.essentialToday" : activeSubTab === 'tomorrow' ? "HoroscopeSummary.essentialTomorrow" : "HoroscopeSummary.essentialYesterday"}
            // For now, the "Relaciones" part is static. Could be dynamic later.
            subtitleKey="HoroscopeSummary.relations"
            categories={summaryCategories} // Using mock data
            isLoading={isHoroscopeLoading}
            horoscopeDetail={currentCategoryHoroscope} // Pass the actual horoscope content
        />
       
        <PromotionCard dictionary={dictionary} />
      </main>
    </div>
  );
}
