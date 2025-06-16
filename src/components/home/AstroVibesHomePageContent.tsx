
"use client";

import { useEffect, useState, useMemo } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import type { Locale, Dictionary } from '@/lib/dictionaries';
import { useAuth } from '@/context/AuthContext';
import type { OnboardingFormData, ZodiacSign, HoroscopeDetail, SelectedProfileType, ZodiacSignName, HoroscopeFlowOutput } from '@/types';
import { getSunSignFromDate, ZODIAC_SIGNS, WorkIcon } from '@/lib/constants';
import { getHoroscopeFlow, type HoroscopeFlowInput } from '@/ai/flows/horoscope-flow';
import { motion, PanInfo } from 'framer-motion';

import SignSelectorHorizontalScroll from '@/components/shared/SignSelectorHorizontalScroll';
import SelectedSignDisplay from '@/components/shared/SelectedSignDisplay';
import SubHeaderTabs, { type HoroscopePeriod } from '@/components/shared/SubHeaderTabs';
import FeatureLinkCards from '@/components/shared/FeatureLinkCards';
import HoroscopeCategoriesSummary from '@/components/shared/HoroscopeCategoriesSummary';
import HoroscopeCategoryCard from '@/components/shared/HoroscopeCategoryCard';
import PromotionCard from '@/components/shared/PromotionCard';
import { Sparkles as ContentSparklesIcon, Heart, CircleDollarSign, Activity, CalendarDays } from 'lucide-react';
// import UserZodiacDetailCard from '../shared/UserZodiacDetailCard'; // Not used in current design
// import ProfileSelector from '../shared/ProfileSelector'; // Not used in current design
import { useIsMobile } from '@/hooks/use-mobile';


interface AstroVibesPageContentProps {
  dictionary: Dictionary;
  locale: Locale;
  displayPeriod: 'daily' | 'weekly' | 'monthly';
  targetDate?: string;
  activeHoroscopePeriodForTitles: HoroscopePeriod;
}

const orderedTabs: HoroscopePeriod[] = ['yesterday', 'today', 'tomorrow', 'weekly', 'monthly'];
const SWIPE_CONFIDENCE_THRESHOLD = 10000; // For velocity * offset

export default function AstroVibesHomePageContent({
  dictionary,
  locale,
  displayPeriod,
  targetDate,
  activeHoroscopePeriodForTitles,
}: AstroVibesPageContentProps) {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isMobile = useIsMobile();

  const [onboardingData, setOnboardingData] = useState<OnboardingFormData | null>(null);
  const [userSunSign, setUserSunSign] = useState<ZodiacSign | null>(null);
  
  // selectedProfile is not directly used for display anymore in this new design,
  // but the logic to determine selectedDisplaySignName might still depend on user context.
  // const [selectedProfile, setSelectedProfile] = useState<SelectedProfileType>('generic'); 

  const [selectedDisplaySignName, setSelectedDisplaySignName] = useState<ZodiacSignName>(() => {
    const signFromUrl = searchParams.get('sign') as ZodiacSignName | null;
    if (signFromUrl && ZODIAC_SIGNS.find(s => s.name === signFromUrl)) {
      return signFromUrl;
    }
    return "Capricorn"; // Default fallback, will be updated by effects
  });

  const selectedDisplaySign = useMemo(() => {
    return ZODIAC_SIGNS.find(s => s.name === selectedDisplaySignName) || ZODIAC_SIGNS.find(s => s.name === "Capricorn")!;
  }, [selectedDisplaySignName]);

  const [fullHoroscopeData, setFullHoroscopeData] = useState<HoroscopeFlowOutput | null>(null);
  const [currentDisplayHoroscope, setCurrentDisplayHoroscope] = useState<HoroscopeDetail | null>(null);
  const [isHoroscopeLoading, setIsHoroscopeLoading] = useState(true);

  useEffect(() => {
    // Logic to determine initial selectedDisplaySignName based on user and URL
    const signFromUrl = searchParams.get('sign') as ZodiacSignName | null;
    let initialSign = "Capricorn" as ZodiacSignName;

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
          initialSign = sunSign.name;
        }
      }
    }

    if (signFromUrl && ZODIAC_SIGNS.find(s => s.name === signFromUrl)) {
      initialSign = signFromUrl;
    }
    
    setSelectedDisplaySignName(initialSign);

  }, [user, authLoading, searchParams]);


  useEffect(() => {
    const fetchHoroscope = async () => {
      if (!selectedDisplaySignName || authLoading && !searchParams.get('sign')) {
         if (authLoading) setIsHoroscopeLoading(true); // Keep loading if auth is still pending
        return;
      }
      setIsHoroscopeLoading(true);
      try {
        const input: HoroscopeFlowInput = {
          sign: selectedDisplaySignName,
          locale,
          targetDate: targetDate,
        };
        const result = await getHoroscopeFlow(input);
        setFullHoroscopeData(result);

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

    fetchHoroscope();
  }, [selectedDisplaySignName, locale, authLoading, displayPeriod, targetDate, searchParams]);


  const handleSubHeaderTabSelect = (tab: HoroscopePeriod) => {
    const currentSignParam = selectedDisplaySignName;
    let newPath = '';

    if (tab === 'yesterday') {
      newPath = `/${locale}/yesterday-horoscope?sign=${currentSignParam}`;
    } else if (tab === 'weekly') {
      newPath = `/${locale}/weekly-horoscope?sign=${currentSignParam}`;
    } else if (tab === 'monthly') {
      newPath = `/${locale}/monthly-horoscope?sign=${currentSignParam}`;
    } else { 
      const basePagePath = pathname.split('/').slice(0,2).join('/'); // e.g. /es or /en
      newPath = `${basePagePath}?sign=${currentSignParam}`;
      if (tab === 'tomorrow') {
        newPath += '&period=tomorrow'; // Add period for tomorrow, keep root for today
      }
    }
    router.push(newPath, { scroll: false });
  };
  
  const handleSignSelectedFromScroll = (sign: ZodiacSign) => {
    setSelectedDisplaySignName(sign.name);
    const currentQueryParams = new URLSearchParams(searchParams.toString());
    currentQueryParams.set('sign', sign.name);
    const newPath = `${pathname}?${currentQueryParams.toString()}`;
    router.push(newPath, { scroll: false });
  };

  const paginate = (direction: number) => {
    const currentIndex = orderedTabs.indexOf(activeHoroscopePeriodForTitles);
    const nextIndex = currentIndex + direction;
    if (nextIndex >= 0 && nextIndex < orderedTabs.length) {
      handleSubHeaderTabSelect(orderedTabs[nextIndex]);
    }
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipe = Math.abs(info.offset.x) * info.velocity.x;
    if (swipe < -SWIPE_CONFIDENCE_THRESHOLD) {
      paginate(1); // Swipe left, go to next tab
    } else if (swipe > SWIPE_CONFIDENCE_THRESHOLD) {
      paginate(-1); // Swipe right, go to previous tab
    }
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
      pageTitleKey = "HomePage.horoscopeTitleToday";
      summaryTitleKey = "HoroscopeSummary.essentialToday";
      break;
    case 'tomorrow':
      pageTitleKey = "HomePage.horoscopeTitleTomorrow";
      summaryTitleKey = "HoroscopeSummary.essentialTomorrow";
      break;
    case 'yesterday':
      pageTitleKey = "HomePage.horoscopeTitleYesterday";
      summaryTitleKey = "HoroscopeSummary.essentialYesterday";
      break;
    case 'weekly':
      pageTitleKey = "HomePage.horoscopeTitleWeekly";
      summaryTitleKey = "HoroscopeSummary.essentialWeekly";
      break;
    case 'monthly':
      pageTitleKey = "HomePage.horoscopeTitleMonthly";
      summaryTitleKey = "HoroscopeSummary.essentialMonthly";
      break;
  }

  if (authLoading && !user && !searchParams.get('sign')) {
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
          selectedSignName={selectedDisplaySignName}
          onSignSelect={handleSignSelectedFromScroll}
          user={user}
        />
        
        {/* Swipeable content area starts here */}
        <motion.div
          drag={isMobile ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.1}
          onDragEnd={isMobile ? handleDragEnd : undefined}
          className="overflow-hidden" // Important to contain elements during drag if they visually move
                                    // Could also set overflow-x-hidden if content is not meant to scroll horizontally
        >
          <motion.div 
            key={activeHoroscopePeriodForTitles + selectedDisplaySignName} // Re-trigger animation on tab or sign change
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.3 }}
          >
            <SelectedSignDisplay
              dictionary={dictionary}
              locale={locale}
              selectedSign={selectedDisplaySign}
            />
          </motion.div>

          <SubHeaderTabs
            dictionary={dictionary}
            activeTab={activeHoroscopePeriodForTitles}
            onTabChange={handleSubHeaderTabSelect}
          />

          <FeatureLinkCards dictionary={dictionary} locale={locale} />

          <motion.div
            key={`summary-${activeHoroscopePeriodForTitles}-${selectedDisplaySignName}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <HoroscopeCategoriesSummary
              dictionary={dictionary}
              titleKey={summaryTitleKey}
              subtitleKey="HoroscopeSummary.relations"
              categories={summaryCategories}
              isLoading={isHoroscopeLoading}
              horoscopeDetail={currentDisplayHoroscope}
            />
          </motion.div>

          <motion.div
              key={`details-${activeHoroscopePeriodForTitles}-${selectedDisplaySignName}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="flex justify-between items-center mb-2 sm:mb-3 px-1">
              <h2 className="text-base sm:text-lg font-semibold font-headline text-foreground flex items-center">
                <CalendarDays className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 text-muted-foreground" />
                {dictionary[pageTitleKey] || "Horoscope Details"}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3.5">
              {detailedHoroscopeCategories.map((cat, index) => (
                <motion.div
                  key={`${cat.id}-${activeHoroscopePeriodForTitles}-${selectedDisplaySignName}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                >
                  <HoroscopeCategoryCard
                    dictionary={dictionary}
                    titleKey={cat.titleKey}
                    icon={cat.icon}
                    content={cat.content}
                    isLoading={isHoroscopeLoading}
                  />
                </motion.div>
              ))}
              {isHoroscopeLoading && detailedHoroscopeCategories.length === 0 && Array.from({ length: 4 }).map((_, index) => (
                 <motion.div
                  key={`skeleton-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                >
                  <HoroscopeCategoryCard
                    dictionary={dictionary}
                    titleKey="Loading..."
                    icon={ContentSparklesIcon}
                    content=""
                    isLoading={true}
                  />
                </motion.div>
              ))}
              {!isHoroscopeLoading && !currentDisplayHoroscope && (
                 <div className="sm:col-span-2 text-center py-10">
                   <p className="text-muted-foreground">{dictionary['HoroscopeSection.noData']}</p>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            key={`promo-${activeHoroscopePeriodForTitles}-${selectedDisplaySignName}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <PromotionCard dictionary={dictionary} />
          </motion.div>
        </motion.div> {/* End of swipeable motion.div */}
      </main>
    </div>
  );
}

