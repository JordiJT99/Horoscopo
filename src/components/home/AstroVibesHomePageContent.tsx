
"use client";

import { useEffect, useState, useMemo } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import type { Locale, Dictionary } from '@/lib/dictionaries';
import { useAuth } from '@/context/AuthContext';
import type { OnboardingFormData, ZodiacSign, HoroscopeDetail, SelectedProfileType, ZodiacSignName, HoroscopeFlowOutput } from '@/types';
import { getSunSignFromDate, ZODIAC_SIGNS, WorkIcon } from '@/lib/constants';
import { getHoroscopeFlow, type HoroscopeFlowInput } from '@/ai/flows/horoscope-flow';
import { motion } from 'framer-motion';

import SignSelectorHorizontalScroll from '@/components/shared/SignSelectorHorizontalScroll';
import SelectedSignDisplay from '@/components/shared/SelectedSignDisplay';
import SubHeaderTabs, { type HoroscopePeriod } from '@/components/shared/SubHeaderTabs';
import FeatureLinkCards from '@/components/shared/FeatureLinkCards';
import HoroscopeCategoriesSummary from '@/components/shared/HoroscopeCategoriesSummary';
import HoroscopeCategoryCard from '@/components/shared/HoroscopeCategoryCard';
import PromotionCard from '@/components/shared/PromotionCard';
import { Sparkles as ContentSparklesIcon, Heart, CircleDollarSign, Activity, CalendarDays } from 'lucide-react';
import UserZodiacDetailCard from '../shared/UserZodiacDetailCard'; // Ajustado para la nueva ubicación
import ProfileSelector from '../shared/ProfileSelector'; // Ajustado para la nueva ubicación


interface AstroVibesPageContentProps {
  dictionary: Dictionary;
  locale: Locale;
  displayPeriod: 'daily' | 'weekly' | 'monthly'; // determines which data (daily, weekly, monthly) to fetch and show in detailed cards
  targetDate?: string; // YYYY-MM-DD format, optional, for daily period (e.g. yesterday)
  activeHoroscopePeriodForTitles: HoroscopePeriod; // determines titles for summary and detailed cards (today, tomorrow, yesterday, weekly, monthly)
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
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [onboardingData, setOnboardingData] = useState<OnboardingFormData | null>(null);
  const [userSunSign, setUserSunSign] = useState<ZodiacSign | null>(null);
  
  const [selectedProfile, setSelectedProfile] = useState<SelectedProfileType>('generic');

  const [selectedDisplaySignName, setSelectedDisplaySignName] = useState<ZodiacSignName>(() => {
    const signFromUrl = searchParams.get('sign') as ZodiacSignName | null;
    if (signFromUrl && ZODIAC_SIGNS.find(s => s.name === signFromUrl)) {
      return signFromUrl;
    }
    // User sun sign will be determined later
    return "Capricorn"; // Default fallback
  });

  const selectedDisplaySign = useMemo(() => {
    return ZODIAC_SIGNS.find(s => s.name === selectedDisplaySignName) || ZODIAC_SIGNS.find(s => s.name === "Capricorn")!;
  }, [selectedDisplaySignName]);


  const [fullHoroscopeData, setFullHoroscopeData] = useState<HoroscopeFlowOutput | null>(null);
  const [currentDisplayHoroscope, setCurrentDisplayHoroscope] = useState<HoroscopeDetail | null>(null);
  const [isHoroscopeLoading, setIsHoroscopeLoading] = useState(true);

  useEffect(() => {
    if (user?.uid) {
      const storedData = localStorage.getItem(`onboardingData_${user.uid}`);
      if (storedData) {
        const parsedData = JSON.parse(storedData) as OnboardingFormData;
        if (parsedData.dateOfBirth) {
          parsedData.dateOfBirth = new Date(parsedData.dateOfBirth); // Ensure it's a Date object
        }
        setOnboardingData(parsedData);
        const sunSign = parsedData.dateOfBirth ? getSunSignFromDate(parsedData.dateOfBirth) : null;
        setUserSunSign(sunSign);
        if (sunSign && !searchParams.get('sign')) { // If no sign in URL, default to user's sign
           setSelectedDisplaySignName(sunSign.name);
           setSelectedProfile('user');
        } else {
          // If there's a sign in URL, or user has no sun sign, keep current logic
          const signFromUrl = searchParams.get('sign') as ZodiacSignName | null;
          if (signFromUrl && ZODIAC_SIGNS.find(s => s.name === signFromUrl)) {
            setSelectedDisplaySignName(signFromUrl);
            setSelectedProfile('generic'); // Or 'user' if signFromUrl matches userSunSign
          } else {
            setSelectedDisplaySignName(sunSign?.name || "Capricorn");
            setSelectedProfile(sunSign ? 'user' : 'generic');
          }
        }
      } else {
        setUserSunSign(null);
        const signFromUrl = searchParams.get('sign') as ZodiacSignName | null;
        setSelectedDisplaySignName(signFromUrl || "Capricorn");
        setSelectedProfile('generic');
      }
    } else { // No user
      setOnboardingData(null);
      setUserSunSign(null);
      const signFromUrl = searchParams.get('sign') as ZodiacSignName | null;
      setSelectedDisplaySignName(signFromUrl || "Capricorn");
      setSelectedProfile('generic');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading]); // Removed searchParams from here to avoid loops, handled in its own effect

  useEffect(() => {
    const signFromUrl = searchParams.get('sign') as ZodiacSignName | null;
    if (signFromUrl && ZODIAC_SIGNS.find(s => s.name === signFromUrl)) {
      if (signFromUrl !== selectedDisplaySignName) {
        setSelectedDisplaySignName(signFromUrl);
        // Determine if this sign matches the user's sign to set profile type
        if (userSunSign && signFromUrl === userSunSign.name) {
          setSelectedProfile('user');
        } else {
          setSelectedProfile('generic');
        }
      }
    } else if (!userSunSign && !signFromUrl) { // No user sign and no URL sign, default to Capricorn generic
        if (selectedDisplaySignName !== "Capricorn") {
          setSelectedDisplaySignName("Capricorn");
          setSelectedProfile('generic');
        }
    } else if (userSunSign && !signFromUrl) { // User sign exists but no URL sign, set to user's sign
        if(selectedDisplaySignName !== userSunSign.name) {
          setSelectedDisplaySignName(userSunSign.name);
          setSelectedProfile('user');
        }
    }
    // This effect specifically handles URL changes for the sign
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, userSunSign, selectedDisplaySignName]);



  useEffect(() => {
    const fetchHoroscope = async () => {
      if (!selectedDisplaySignName || authLoading) {
        if (authLoading && !searchParams.get('sign')) {
          setIsHoroscopeLoading(true);
          return;
        }
      }
      setIsHoroscopeLoading(true);
      try {
        const input: HoroscopeFlowInput = {
          sign: selectedDisplaySignName,
          locale,
          targetDate: targetDate, // Used for 'daily' when it's 'yesterday'
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
    } else { // today or tomorrow
      newPath = `/${locale}?sign=${currentSignParam}`;
      if (tab === 'tomorrow') {
        newPath += '&period=tomorrow';
      }
    }
    router.push(newPath, { scroll: false });
  };

  const handleSignSelectedFromScroll = (sign: ZodiacSign) => {
    setSelectedDisplaySignName(sign.name);
    // If the selected sign is the user's sun sign, switch to user profile
    if (userSunSign && sign.name === userSunSign.name) {
      setSelectedProfile('user');
    } else {
      setSelectedProfile('generic');
    }

    const currentQueryParams = new URLSearchParams(searchParams.toString());
    currentQueryParams.set('sign', sign.name);
    const newPath = `${pathname}?${currentQueryParams.toString()}`;
    router.push(newPath, { scroll: false });
  };
  
  const handleProfileTypeSelected = (profileType: SelectedProfileType) => {
    setSelectedProfile(profileType);
    if (profileType === 'user' && userSunSign) {
        if (selectedDisplaySignName !== userSunSign.name) {
             setSelectedDisplaySignName(userSunSign.name);
             // Update URL if sign changes due to profile type switch
             const currentQueryParams = new URLSearchParams(searchParams.toString());
             currentQueryParams.set('sign', userSunSign.name);
             const newPath = `${pathname}?${currentQueryParams.toString()}`;
             router.push(newPath, { scroll: false });
        }
    } else if (profileType === 'generic' && selectedDisplaySignName === userSunSign?.name) {
        // If switching to generic and current sign is user's, pick a default (e.g. first in list or Capricorn)
        // Or let it stay if that's desired behavior. For now, let it stay on user's sign but under 'generic' profile context.
        // If you want it to change to a non-user sign:
        // const defaultGenericSign = ZODIAC_SIGNS.find(s => s.name !== userSunSign?.name)?.name || "Capricorn";
        // setSelectedDisplaySignName(defaultGenericSign);
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

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
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
        
        {/* This ProfileSelector and UserZodiacDetailCard block is specific to the old design.
            The new design integrates profile/sign display differently.
            Keeping UserZodiacDetailCard for potential use if 'More Details' button is implemented
            to show a modal or dedicated view with it.
        */}
        {/* <ProfileSelector 
            dictionary={dictionary} 
            locale={locale}
            selectedProfile={selectedProfile}
            setSelectedProfile={handleProfileTypeSelected}
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
            activeHoroscopePeriod={displayPeriod}
        /> */}

        <FeatureLinkCards dictionary={dictionary} locale={locale} />

        <motion.div
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
                key={cat.id}
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <PromotionCard dictionary={dictionary} />
        </motion.div>
      </main>
    </div>
  );
}
