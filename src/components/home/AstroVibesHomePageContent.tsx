
"use client";

import { useEffect, useState, useMemo } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import type { Locale, Dictionary } from '@/lib/dictionaries';
import { useAuth } from '@/context/AuthContext';
import type { OnboardingFormData, ZodiacSign, HoroscopeDetail, ZodiacSignName, HoroscopeFlowOutput } from '@/types';
import { getSunSignFromDate, ZODIAC_SIGNS, WorkIcon } from '@/lib/constants';
import { getHoroscopeFlow, type HoroscopeFlowInput } from '@/ai/flows/horoscope-flow';
import { motion, type PanInfo } from 'framer-motion';

import SignSelectorHorizontalScroll from '@/components/shared/SignSelectorHorizontalScroll';
import SelectedSignDisplay from '@/components/shared/SelectedSignDisplay';
import SubHeaderTabs, { type HoroscopePeriod } from '@/components/shared/SubHeaderTabs';
import FeatureLinkCards from '@/components/shared/FeatureLinkCards';
import HoroscopeCategoriesSummary from '@/components/shared/HoroscopeCategoriesSummary';
import HoroscopeCategoryCard from '@/components/shared/HoroscopeCategoryCard';
import PromotionCard from '@/components/shared/PromotionCard';
import { Sparkles as ContentSparklesIcon, Heart, CircleDollarSign, Activity, CalendarDays } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';


interface AstroVibesPageContentProps {
  dictionary: Dictionary;
  locale: Locale;
  displayPeriod: 'daily' | 'weekly' | 'monthly';
  targetDate?: string;
  activeHoroscopePeriodForTitles: HoroscopePeriod;
}

const orderedTabs: HoroscopePeriod[] = ['yesterday', 'today', 'tomorrow', 'weekly', 'monthly'];
const SWIPE_CONFIDENCE_THRESHOLD = 10000;

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

  const initialSignFromUrl = searchParams.get('sign') as ZodiacSignName | null;

  const [selectedDisplaySignName, setSelectedDisplaySignName] = useState<ZodiacSignName>(() => {
    if (initialSignFromUrl && ZODIAC_SIGNS.find(s => s.name === initialSignFromUrl)) {
      return initialSignFromUrl;
    }
    return "Capricorn"; // Default fallback
  });

  const selectedDisplaySign = useMemo(() => {
    return ZODIAC_SIGNS.find(s => s.name === selectedDisplaySignName) || ZODIAC_SIGNS.find(s => s.name === "Capricorn")!;
  }, [selectedDisplaySignName]);

  const [fullHoroscopeData, setFullHoroscopeData] = useState<HoroscopeFlowOutput | null>(null);
  const [currentDisplayHoroscope, setCurrentDisplayHoroscope] = useState<HoroscopeDetail | null>(null);
  const [isHoroscopeLoading, setIsHoroscopeLoading] = useState(true);

  useEffect(() => {
    const signFromUrl = searchParams.get('sign') as ZodiacSignName | null;
    let determinedInitialSign = "Capricorn" as ZodiacSignName; // Default if no other source

    if (user?.uid) {
      const storedData = localStorage.getItem(`onboardingData_${user.uid}`);
      if (storedData) {
        try {
            const parsedData = JSON.parse(storedData) as OnboardingFormData;
            if (parsedData.dateOfBirth) {
                parsedData.dateOfBirth = new Date(parsedData.dateOfBirth);
            }
            setOnboardingData(parsedData);
            const sunSign = parsedData.dateOfBirth ? getSunSignFromDate(parsedData.dateOfBirth) : null;
            setUserSunSign(sunSign);
            if (sunSign) {
              determinedInitialSign = sunSign.name;
            }
        } catch (e) {
            console.error("Failed to parse onboarding data:", e);
        }
      }
    }
    // URL parameter takes precedence over user sign if present
    if (signFromUrl && ZODIAC_SIGNS.find(s => s.name === signFromUrl)) {
      determinedInitialSign = signFromUrl;
    }
    
    setSelectedDisplaySignName(determinedInitialSign);

  }, [user, authLoading, searchParams]);


  useEffect(() => {
    const fetchHoroscope = async () => {
      if (!selectedDisplaySignName || (authLoading && !searchParams.get('sign'))) {
         if (authLoading) setIsHoroscopeLoading(true);
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
        setCurrentDisplayHoroscope(result[displayPeriod]);

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
    const currentSignParam = selectedDisplaySignName || (userSunSign?.name) || "Capricorn";
    let newPath = '';
    const queryParams = new URLSearchParams();
    queryParams.set('sign', currentSignParam);


    if (tab === 'yesterday') {
      newPath = `/${locale}/yesterday-horoscope`;
    } else if (tab === 'weekly') {
      newPath = `/${locale}/weekly-horoscope`;
    } else if (tab === 'monthly') {
      newPath = `/${locale}/monthly-horoscope`;
    } else {
      newPath = `/${locale}`; // Base for 'today' and 'tomorrow'
      if (tab === 'tomorrow') {
        queryParams.set('period', 'tomorrow');
      }
    }
    router.push(`${newPath}?${queryParams.toString()}`, { scroll: false });
  };

  const handleSignSelectedFromScroll = (sign: ZodiacSign) => {
    setSelectedDisplaySignName(sign.name);
    const currentQueryParams = new URLSearchParams(searchParams.toString());
    currentQueryParams.set('sign', sign.name);
    
    let basePath = pathname.split('?')[0]; 
    const newPath = `${basePath}?${currentQueryParams.toString()}`;
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
    const swipe = info.offset.x * info.velocity.x;
    if (swipe < -SWIPE_CONFIDENCE_THRESHOLD) {
      paginate(1); // Deslizar a la izquierda -> siguiente
    } else if (swipe > SWIPE_CONFIDENCE_THRESHOLD) {
      paginate(-1); // Deslizar a la derecha -> anterior
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

  if (authLoading && !user && !initialSignFromUrl) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-[calc(100vh-var(--top-bar-height)-var(--bottom-nav-height))]">
        <ContentSparklesIcon className="h-12 w-12 animate-pulse text-primary mx-auto" />
        {dictionary && Object.keys(dictionary).length > 0 && <p className="mt-4 font-body text-muted-foreground">{dictionary['HomePage.loadingDashboard'] || "Loading Cosmic Dashboard..."}</p>}
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <main className="flex-grow container mx-auto px-2 sm:px-3 py-3 space-y-4 overflow-x-hidden">
        <SignSelectorHorizontalScroll
          dictionary={dictionary}
          locale={locale}
          signs={ZODIAC_SIGNS}
          selectedSignName={selectedDisplaySignName}
          onSignSelect={handleSignSelectedFromScroll}
          user={user}
        />

        {/* Este motion.div maneja el gesto de arrastre en móviles y sirve como contenedor para las animaciones internas */}
        <motion.div
          key={activeHoroscopePeriodForTitles + selectedDisplaySignName} // Clave importante para re-animar hijos
          drag={isMobile ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2} // Un poco de "tirón" visual
          onDragEnd={isMobile ? handleDragEnd : undefined}
          className="w-full cursor-grab active:cursor-grabbing"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            key={`sign-display-${selectedDisplaySignName}-${activeHoroscopePeriodForTitles}`} // Clave más específica
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
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            key={`features-${selectedDisplaySignName}-${activeHoroscopePeriodForTitles}`}
          >
            <FeatureLinkCards dictionary={dictionary} locale={locale} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }} // Mismo delay que features
            key={`summary-${activeHoroscopePeriodForTitles}-${selectedDisplaySignName}`}
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            key={`details-${activeHoroscopePeriodForTitles}-${selectedDisplaySignName}`}
          >
            <div className="flex justify-between items-center mb-2 sm:mb-3 px-1">
              <h2 className="text-base sm:text-lg font-semibold font-headline text-foreground flex items-center">
                <CalendarDays className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 text-muted-foreground" />
                {dictionary[pageTitleKey] || "Horoscope Details"}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3.5">
              {detailedHoroscopeCategories.map((cat) => (
                <HoroscopeCategoryCard
                    key={`${cat.id}-${activeHoroscopePeriodForTitles}-${selectedDisplaySignName}-detail`}
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
                    titleKey="Loading..." // Debería ser una clave de diccionario
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
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            key={`promo-${activeHoroscopePeriodForTitles}-${selectedDisplaySignName}`}
          >
            <PromotionCard dictionary={dictionary} />
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}

