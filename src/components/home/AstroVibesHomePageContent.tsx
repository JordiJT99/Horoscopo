

"use client";

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import type { Locale, Dictionary } from '@/types';
import { useAuth } from '@/context/AuthContext';
import type { OnboardingFormData, ZodiacSign, HoroscopeDetail, ZodiacSignName, HoroscopeFlowOutput, HoroscopePersonalizationData, UserAstrologyProfile } from '@/types';
import { getSunSignFromDate, ZODIAC_SIGNS, WorkIcon, getMoonSign, getAscendantSign } from '@/lib/constants';
import { getHoroscopeFlow, type HoroscopeFlowInput } from '@/ai/flows/horoscope-flow';
import { useHoroscopeFromDB } from '@/hooks/use-horoscope-from-db';
import { usePersonalizedHoroscope } from '@/hooks/use-personalized-horoscope';
import { motion, type PanInfo } from 'framer-motion';
import { useToast } from "@/hooks/use-toast";
import { useCosmicEnergy } from '@/hooks/use-cosmic-energy';

import SignSelectorHorizontalScroll from '@/components/shared/SignSelectorHorizontalScroll';
import SelectedSignDisplay from '@/components/shared/SelectedSignDisplay';
import SubHeaderTabs, { type HoroscopePeriod } from '@/components/shared/SubHeaderTabs';
import FeatureLinkCards from '@/components/shared/FeatureLinkCards';
import HoroscopeCategoriesSummary from '@/components/shared/HoroscopeCategoriesSummary';
import PromotionCard from '@/components/shared/PromotionCard';
import DailyTransitWidget from './DailyTransitWidget';
import DailyTipWidget from './DailyTipWidget';
import { Button } from '@/components/ui/button';
import { CalendarDays, Share2, Heart, CircleDollarSign, Activity } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import AdBanner from '@/components/shared/AdBanner';
import React from 'react';


interface AstroVibesPageContentProps {
  dictionary: Dictionary;
  locale: Locale;
  displayPeriod: 'daily' | 'weekly' | 'monthly';
  targetDate?: string;
  activeHoroscopePeriodForTitles: HoroscopePeriod;
}

const orderedTabs: HoroscopePeriod[] = ['yesterday', 'today', 'tomorrow', 'weekly', 'monthly'];
const SWIPE_CONFIDENCE_THRESHOLD = 8000;
const SWIPE_OFFSET_THRESHOLD = 50;

function getDeterministicRandom(seedString: string, min: number, max: number): number {
  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    const char = seedString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  const random = (hash & 0x7fffffff) / 0x7fffffff;
  return Math.floor(random * (max - min + 1)) + min;
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
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { addEnergyPoints } = useCosmicEnergy();
  const isPremium = true; // All users have premium access now


  const [onboardingData, setOnboardingData] = useState<OnboardingFormData | null>(null);
  const [userSunSign, setUserSunSign] = useState<ZodiacSign | null>(null);
  const initialSignFromUrl = useMemo(() => searchParams.get('sign') as ZodiacSignName | null, [searchParams]);
  
  const [isPersonalizedRequestActive, setIsPersonalizedRequestActive] = useState(false);
  const [networkStatus, setNetworkStatus] = useState({
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    connectionRetries: 0,
    lastConnectionAttempt: null as Date | null
  });

  const [selectedDisplaySignName, setSelectedDisplaySignName] = useState<ZodiacSignName>(() => {
    if (initialSignFromUrl && ZODIAC_SIGNS.find(s => s.name === initialSignFromUrl)) {
      return initialSignFromUrl;
    }
    return "Capricorn";
  });

  const selectedDisplaySign = useMemo(() => {
    return ZODIAC_SIGNS.find(s => s.name === selectedDisplaySignName) || ZODIAC_SIGNS.find(s => s.name === "Capricorn")!;
  }, [selectedDisplaySignName]);

  // Hook para cargar horóscopos desde la base de datos (activará generación automática)
  const { 
    horoscope: dailyHoroscopeFromDB, 
    loading: dailyDBLoading, 
    error: dailyDBError 
  } = useHoroscopeFromDB({
    sign: selectedDisplaySignName,
    locale,
    date: targetDate
  });

  // Hook para cargar horóscopos personalizados (solo cuando el usuario está viendo su propio signo)
  const shouldUsePersonalized = useMemo(() => {
    const hasUser = !!(user?.uid);
    const isPersonalizedActive = isPersonalizedRequestActive;
    const hasUserSunSign = !!userSunSign;
    const isViewingOwnSign = selectedDisplaySignName === userSunSign?.name;
    const hasOnboardingData = !!onboardingData;
    
    console.log('🔍 Debugging shouldUsePersonalized:', {
      hasUser,
      isPersonalizedActive,
      hasUserSunSign,
      userSunSignName: userSunSign?.name,
      selectedDisplaySignName,
      isViewingOwnSign,
      hasOnboardingData,
      onboardingDataKeys: onboardingData ? Object.keys(onboardingData) : 'null'
    });
    
    const result = hasUser && isPersonalizedActive && hasUserSunSign && isViewingOwnSign && hasOnboardingData;
    console.log('📊 shouldUsePersonalized final result:', result);
    
    return result;
  }, [user?.uid, isPersonalizedRequestActive, userSunSign, selectedDisplaySignName, onboardingData]);

  const personalizationData = useMemo(() => {
    if (!onboardingData) return {};
    return {
      name: onboardingData.name,
      gender: onboardingData.gender,
      relationshipStatus: onboardingData.relationshipStatus,
      employmentStatus: onboardingData.employmentStatus,
    };
  }, [onboardingData]);

  // Generar o recuperar userId para usuarios anónimos
  const getAnonymousUserId = useCallback(() => {
    if (user?.uid) return user.uid;
    
    const storageKey = 'anonymous_user_id';
    let anonymousId = '';
    
    if (typeof window !== 'undefined') {
      anonymousId = localStorage.getItem(storageKey) || '';
      if (!anonymousId) {
        anonymousId = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem(storageKey, anonymousId);
      }
    } else {
      // Fallback para SSR
      anonymousId = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    return anonymousId;
  }, [user?.uid]);

  const { 
    horoscope: personalizedHoroscope, 
    loading: personalizedLoading, 
    error: personalizedError 
  } = usePersonalizedHoroscope({
    userId: getAnonymousUserId(),
    sign: selectedDisplaySignName,
    locale,
    date: targetDate,
    personalizationData: personalizationData,
    enabled: shouldUsePersonalized && displayPeriod === 'daily' // Solo para horóscopos diarios
  });

  const [fullHoroscopeData, setFullHoroscopeData] = useState<HoroscopeFlowOutput | null>(null);
  const [currentDisplayHoroscope, setCurrentDisplayHoroscope] = useState<HoroscopeDetail | null>(null);
  const [isHoroscopeLoading, setIsHoroscopeLoading] = useState(true);

  const userAstrologyProfile: UserAstrologyProfile = useMemo(() => {
    if (!onboardingData?.dateOfBirth) return { sun: null, moon: null, ascendant: null };
    const birthDate = new Date(onboardingData.dateOfBirth);
    const sun = getSunSignFromDate(birthDate);
    const moon = getMoonSign(birthDate);
    const ascendantSignObject = onboardingData.timeOfBirth ? getAscendantSign(birthDate, onboardingData.timeOfBirth, onboardingData.cityOfBirth || '') : null;
    const ascendant = ascendantSignObject ? ZODIAC_SIGNS.find(s => s.name === ascendantSignObject.sign) || null : null;

    return { sun, moon, ascendant };
  }, [onboardingData]);

  // Monitor network connectivity
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOnline = () => {
      console.log('🌐 Network back online');
      setNetworkStatus(prev => ({
        ...prev,
        isOnline: true,
        lastConnectionAttempt: new Date()
      }));
      
      // Retry fetching horoscope when back online
      if (!currentDisplayHoroscope) {
        console.log('🔄 Retrying horoscope fetch after coming back online');
        setTimeout(() => {
          setSelectedDisplaySignName(prev => prev);
        }, 1000);
      }
    };

    const handleOffline = () => {
      console.log('📱 Network went offline');
      setNetworkStatus(prev => ({
        ...prev,
        isOnline: false
      }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check initial network status
    setNetworkStatus(prev => ({
      ...prev,
      isOnline: navigator.onLine
    }));

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [currentDisplayHoroscope]);


  useEffect(() => {
    const signFromUrl = searchParams.get('sign') as ZodiacSignName | null;
    let determinedInitialSign = "Capricorn" as ZodiacSignName;
    let initiallyPersonalized = false;

    if (user?.uid && !authLoading) {
      console.log('🔍 Loading onboarding data for user:', user.uid);
      const storedData = localStorage.getItem(`onboardingData_${user.uid}`);
      console.log('📱 Stored data found:', !!storedData);
      
      if (storedData) {
        try {
            const parsedData = JSON.parse(storedData) as OnboardingFormData;
            console.log('✅ Parsed onboarding data:', Object.keys(parsedData));
            
            if (parsedData.dateOfBirth && typeof parsedData.dateOfBirth === 'string') {
                parsedData.dateOfBirth = new Date(parsedData.dateOfBirth);
            }
            setOnboardingData(parsedData);
            const sunSign = parsedData.dateOfBirth ? getSunSignFromDate(parsedData.dateOfBirth) : null;
            setUserSunSign(sunSign);
            console.log('🌟 User sun sign set to:', sunSign?.name);
            
            if (sunSign) {
              determinedInitialSign = sunSign.name;
              if (!signFromUrl) { 
                initiallyPersonalized = true;
                console.log('🔮 Setting initially personalized to true');
              }
            }
        } catch (e) {
            console.error("❌ Failed to parse onboarding data:", e);
            setOnboardingData(null);
            setUserSunSign(null);
        }
      } else {
         console.log('❌ No stored onboarding data found');
         setOnboardingData(null);
         setUserSunSign(null);
      }
    } else if (!user && !authLoading) {
        console.log('👤 No user logged in');
        setOnboardingData(null);
        setUserSunSign(null);
    }

    if (signFromUrl && ZODIAC_SIGNS.find(s => s.name === signFromUrl)) {
      determinedInitialSign = signFromUrl;
      initiallyPersonalized = false; // Explicit URL selection is generic
    } else if (!signFromUrl && userSunSign) {
        // Default to user's sign and personalized view if no sign in URL and user has sun sign
        determinedInitialSign = userSunSign.name;
        initiallyPersonalized = true; 
    }
    
    setSelectedDisplaySignName(determinedInitialSign);
    setIsPersonalizedRequestActive(initiallyPersonalized);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading, searchParams]); 

  // Eliminar restricción premium - permitir acceso a horóscopo de mañana para todos
  useEffect(() => {
    // Ya no redirigir - todos los usuarios pueden acceder a cualquier período
    return;
  }, [activeHoroscopePeriodForTitles, isPremium, router, locale, toast, dictionary]);


  useEffect(() => {
    const fetchHoroscope = async () => {
      // Permitir acceso completo - eliminar restricción premium
      if (!selectedDisplaySignName) {
          setIsHoroscopeLoading(true);
          return;
      }

      setIsHoroscopeLoading(true);
      
      // Debug de conectividad
      console.log('🌐 Network status debug:', {
        isOnline: navigator.onLine,
        userAgent: navigator.userAgent,
        isMobileApp: window.location.protocol === 'file:' || window.location.hostname === 'localhost',
        currentUrl: window.location.href,
        timestamp: new Date().toISOString(),
        networkState: networkStatus,
        connectionRetries: networkStatus.connectionRetries
      });
      
      // Determinar si usar horóscopo personalizado o genérico
      const usePersonalizedForDaily = shouldUsePersonalized && displayPeriod === 'daily';
      
      try {
        let dailyData: HoroscopeDetail | null = null;
        
        if (usePersonalizedForDaily) {
          console.log('🔮 Usando horóscopo personalizado para el período diario');
          // Para horóscopos personalizados, usar el hook personalizado
          dailyData = personalizedHoroscope;
          setIsHoroscopeLoading(personalizedLoading);
          
          if (personalizedError) {
            throw personalizedError;
          }
        } else {
          console.log('📊 Usando horóscopo genérico de la BD');
          // Para horóscopos genéricos, usar la BD
          dailyData = dailyHoroscopeFromDB;
          setIsHoroscopeLoading(dailyDBLoading);
          
          if (dailyDBError) {
            throw dailyDBError;
          }
        }
        
        // Si tenemos datos (personalizados o genéricos)
        if (dailyData) {
          let weeklyData = dailyData; // Fallback por defecto
          let monthlyData = dailyData; // Fallback por defecto
          
          // Solo hacer llamada adicional si realmente necesitamos weekly/monthly
          if (displayPeriod === 'weekly' || displayPeriod === 'monthly') {
            try {
              const input: HoroscopeFlowInput = {
                sign: selectedDisplaySignName,
                locale,
                targetDate: targetDate,
              };
              
              // Añadir personalización si es necesaria
              if (isPersonalizedRequestActive && userSunSign && selectedDisplaySignName === userSunSign.name && onboardingData) {
                input.onboardingData = personalizationData;
              }

              const result = await getHoroscopeFlow(input);
              
              if (result?.weekly) weeklyData = result.weekly;
              if (result?.monthly) monthlyData = result.monthly;
            } catch (flowError) {
              console.warn("Error getting weekly/monthly from getHoroscopeFlow, using daily as fallback:", flowError);
              // Mantener los fallbacks por defecto
            }
          }
          
          // Construir la respuesta híbrida
          const hybridResult: HoroscopeFlowOutput = {
            daily: dailyData,
            weekly: weeklyData,
            monthly: monthlyData
          };

          setFullHoroscopeData(hybridResult);
          setCurrentDisplayHoroscope(hybridResult[displayPeriod]);
          
          if (user?.uid) {
            const actionTypeMap: Record<typeof displayPeriod, 'read_daily_horoscope' | 'read_weekly_horoscope' | 'read_monthly_horoscope'> = {
              daily: 'read_daily_horoscope',
              weekly: 'read_weekly_horoscope',
              monthly: 'read_monthly_horoscope',
            };
            const energyResult = addEnergyPoints(actionTypeMap[displayPeriod], 5);

            if (energyResult.pointsAdded > 0) {
              toast({
                  title: `✨ ${dictionary['CosmicEnergy.pointsEarnedTitle'] || 'Cosmic Energy Gained!'}`,
                  description: `${dictionary['CosmicEnergy.pointsEarnedDescription'] || 'You earned'} +${energyResult.pointsAdded} EC!`,
              });
              if (energyResult.leveledUp) {
                  setTimeout(() => {
                      toast({
                          title: `🎉 ${dictionary['CosmicEnergy.levelUpTitle'] || 'Level Up!'}`,
                          description: `${(dictionary['CosmicEnergy.levelUpDescription'] || 'You have reached Level {level}!').replace('{level}', energyResult.newLevel.toString())}`,
                      });
                  }, 500);
              }
            }
          }
        } else if (!usePersonalizedForDaily && dailyDBError) {
          console.error("Error fetching horoscope from DB:", dailyDBError);
          
          // Check if it's a Firebase offline error
          if (dailyDBError.message?.includes('client is offline') || dailyDBError.code === 'unavailable') {
            console.log('🔄 Firebase offline detected, attempting retry...');
            // Try to restore Firebase connectivity
            try {
              const { restoreFirebaseConnectivity } = await import('@/lib/firebase');
              const restored = await restoreFirebaseConnectivity();
              
              if (restored) {
                console.log('✅ Firebase connectivity restored, retrying...');
                setNetworkStatus(prev => ({
                  ...prev,
                  connectionRetries: prev.connectionRetries + 1,
                  lastConnectionAttempt: new Date()
                }));
                
                // Wait a bit and retry
                setTimeout(() => {
                  console.log('🔄 Retrying after connectivity restore...');
                  setSelectedDisplaySignName(prev => prev);
                }, 1500);
                
                return; // Don't show error toast yet, we're retrying
              } else {
                console.log('❌ Failed to restore Firebase connectivity');
                setNetworkStatus(prev => ({
                  ...prev,
                  connectionRetries: prev.connectionRetries + 1
                }));
              }
            } catch (networkError) {
              console.error('❌ Failed to restore Firebase connectivity:', networkError);
            }
          }
          
          setFullHoroscopeData(null);
          setCurrentDisplayHoroscope(null);
          if (dictionary && Object.keys(dictionary).length > 0) {
            toast({
              title: dictionary['Error.genericTitle'] || "Error",
              description: dictionary['HoroscopeSection.error'] || "Could not load horoscope data. Please try again later.",
              variant: "destructive",
            });
          }
        } else if (usePersonalizedForDaily && personalizedError) {
          console.error("Error fetching personalized horoscope:", personalizedError);
          
          // Check if it's a Firebase offline error
          if (personalizedError.message?.includes('client is offline') || personalizedError.code === 'unavailable') {
            console.log('🔄 Firebase offline detected in personalized hook, attempting retry...');
            try {
              const { restoreFirebaseConnectivity } = await import('@/lib/firebase');
              const restored = await restoreFirebaseConnectivity();
              
              if (restored) {
                console.log('✅ Firebase connectivity restored for personalized, retrying...');
                setTimeout(() => {
                  console.log('🔄 Retrying personalized after connectivity restore...');
                  setSelectedDisplaySignName(prev => prev);
                }, 1500);
                
                return;
              }
            } catch (networkError) {
              console.error('❌ Failed to restore Firebase connectivity for personalized:', networkError);
            }
          }
          
          setFullHoroscopeData(null);
          setCurrentDisplayHoroscope(null);
          if (dictionary && Object.keys(dictionary).length > 0) {
            toast({
              title: dictionary['Error.genericTitle'] || "Error",
              description: dictionary['HoroscopeSection.error'] || "Could not load personalized horoscope data. Please try again later.",
              variant: "destructive",
            });
          }
        }
      } catch (error) {
        console.error("Error fetching horoscope (exception caught):", error);
        
        // Check if it's a Firebase offline error in the catch block
        if (error.message?.includes('client is offline') || error.code === 'unavailable') {
          console.log('🔄 Firebase offline detected in catch block, attempting recovery...');
          try {
            const { restoreFirebaseConnectivity } = await import('@/lib/firebase');
            const restored = await restoreFirebaseConnectivity();
            
            if (restored) {
              console.log('✅ Firebase connectivity restored in catch block, retrying...');
              setTimeout(() => {
                console.log('🔄 Retrying after catch block connectivity restore...');
                setSelectedDisplaySignName(prev => prev);
              }, 1500);
              
              return;
            }
          } catch (networkError) {
            console.error('❌ Failed to restore Firebase connectivity in catch:', networkError);
          }
        }
        
        setFullHoroscopeData(null);
        setCurrentDisplayHoroscope(null);
        if (dictionary && Object.keys(dictionary).length > 0) {
          toast({
            title: dictionary['Error.genericTitle'] || "Error",
            description: dictionary['HoroscopeSection.error'] || "Could not load horoscope data. Please try again later.",
            variant: "destructive",
          });
        }
      } finally {
        // El loading se controla por los hooks correspondientes
        const finalLoading = usePersonalizedForDaily ? personalizedLoading : dailyDBLoading;
        setIsHoroscopeLoading(finalLoading);
      }
    };

    fetchHoroscope();
  }, [
    selectedDisplaySignName, 
    locale, 
    displayPeriod, 
    targetDate, 
    dictionary, 
    toast, 
    userSunSign, 
    onboardingData, 
    isPersonalizedRequestActive, 
    addEnergyPoints, 
    user, 
    isPremium, 
    activeHoroscopePeriodForTitles, 
    dailyHoroscopeFromDB, 
    dailyDBLoading, 
    dailyDBError,
    shouldUsePersonalized,
    personalizedHoroscope,
    personalizedLoading,
    personalizedError,
    personalizationData
  ]);


  const handleSubHeaderTabSelect = (tab: HoroscopePeriod) => {
    let currentSignParam = searchParams.get('sign');
    if (isPersonalizedRequestActive && userSunSign) {
      // If personalized is active, we're viewing the user's own sign, so maintain that.
      currentSignParam = userSunSign.name;
    } else {
      // If not personalized, or no userSunSign, use the currently displayed sign.
      currentSignParam = selectedDisplaySignName;
    }

    let newPath = '';
    const queryParams = new URLSearchParams();
    
    if (currentSignParam) {
        queryParams.set('sign', currentSignParam);
    }

    if (tab === 'yesterday') {
      newPath = `/${locale}/yesterday-horoscope`;
    } else if (tab === 'weekly') {
      newPath = `/${locale}/weekly-horoscope`;
    } else if (tab === 'monthly') {
      newPath = `/${locale}/monthly-horoscope`;
    } else { 
      newPath = `/${locale}`; 
      if (tab === 'tomorrow') {
        queryParams.set('period', 'tomorrow');
      }
    }
    router.push(`${newPath}?${queryParams.toString()}`, { scroll: false });
  };

  const handleSignSelectedFromScroll = (sign: ZodiacSign, isItAUserProfileClick: boolean = false) => {
    setSelectedDisplaySignName(sign.name);
    setIsPersonalizedRequestActive(isItAUserProfileClick); 

    const currentQueryParams = new URLSearchParams(searchParams.toString());
    currentQueryParams.set('sign', sign.name);

    let basePath = pathname.split('?')[0];
     if (basePath === `/${locale}/yesterday-horoscope` || basePath === `/${locale}/weekly-horoscope` || basePath === `/${locale}/monthly-horoscope` ) {
      // Keep current base path
    } else if (activeHoroscopePeriodForTitles === 'tomorrow' && basePath === `/${locale}`) {
         currentQueryParams.set('period', 'tomorrow');
    } else {
      basePath = `/${locale}`;
      if(currentQueryParams.get('period') === 'tomorrow' && activeHoroscopePeriodForTitles !== 'tomorrow'){
          currentQueryParams.delete('period');
      }
    }
    const newPath = `${basePath}?${currentQueryParams.toString()}`;
    router.push(newPath, { scroll: false });
  };
  
  const handleShareHoroscope = async () => {
    if (!currentDisplayHoroscope || !currentDisplayHoroscope.main) return;

    const signNameToShare = dictionary[selectedDisplaySignName] || selectedDisplaySignName;
    const userNameToShare = (isPersonalizedRequestActive && onboardingData?.name) ? onboardingData.name : null;

    const shareTitle = userNameToShare
      ? (dictionary['Share.personalizedHoroscopeTitle'] || "My Personalized AstroVibes Horoscope for {signName}")
          .replace('{signName}', signNameToShare)
          .replace('{userName}', userNameToShare)
      : (dictionary['Share.horoscopeTitle'] || "Horoscope for {signName} from AstroVibes")
          .replace('{signName}', signNameToShare);

    let horoscopeText = `${currentDisplayHoroscope.main}`;
    if (userNameToShare) {
        horoscopeText = (dictionary['Share.personalizedHoroscopePrefix'] || "For {userName} ({signName}):").replace('{userName}', userNameToShare).replace('{signName}', signNameToShare) + `\n${horoscopeText}`;
    }

    const appInvite = dictionary['Share.downloadAppPrompt'] || "Discover AstroVibes for more insights!";
    const appStoreLink = dictionary['Share.appStoreLinkPlaceholder'] || "https://apps.apple.com/app/your-app-id-here";
    const googlePlayLink = dictionary['Share.googlePlayLinkPlaceholder'] || "https://play.google.com/store/apps/details?id=your.package.name.here";
    
    const fullShareText = `${shareTitle}\n\n${horoscopeText}\n\n${appInvite}\nApp Store: ${appStoreLink}\nGoogle Play: ${googlePlayLink}`;

    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('sign', selectedDisplaySignName);
    if (userNameToShare) {
        currentUrl.searchParams.set('userName', userNameToShare);
    }
    currentUrl.searchParams.delete('mainText'); 
    currentUrl.searchParams.delete('sharedPeriod'); 

    const shareableUrl = currentUrl.toString();

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: fullShareText,
          url: shareableUrl, 
        });
        toast({
          title: dictionary['Share.successTitle'] || "Success!",
          description: dictionary['Share.horoscopeSharedSuccess'] || "Horoscope shared successfully.",
        });
      } catch (err) {
        console.error('Error sharing:', err);
        if ((err as Error).name !== 'AbortError') {
          toast({
            title: dictionary['Share.errorTitle'] || "Sharing Error",
            description: dictionary['Share.errorMessage'] || "Could not share the content. Please try again.",
            variant: "destructive",
          });
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${fullShareText}\n\n${dictionary['Share.viewOnline'] || "View online:"} ${shareableUrl}`);
        toast({
          title: dictionary['Share.copiedTitle'] || "Copied!",
          description: dictionary['Share.horoscopeCopiedSuccess'] || "Horoscope and link copied to clipboard.",
        });
      } catch (copyError) {
        console.error('Error copying to clipboard:', copyError);
        toast({
          title: dictionary['Share.errorTitle'] || "Sharing Error",
          description: dictionary['Share.errorMessageClipboard'] || "Could not copy. Please try sharing manually.",
          variant: "destructive",
        });
      }
    }
  };


  const paginate = (newDirection: number) => {
    const currentIndex = orderedTabs.indexOf(activeHoroscopePeriodForTitles);
    const nextIndex = currentIndex + newDirection;
    if (nextIndex >= 0 && nextIndex < orderedTabs.length) {
      handleSubHeaderTabSelect(orderedTabs[nextIndex]);
    }
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const { offset, velocity } = info;
    const swipePower = Math.abs(offset.x) * velocity.x;

    if (Math.abs(offset.x) > SWIPE_OFFSET_THRESHOLD) {
        if (swipePower < -SWIPE_CONFIDENCE_THRESHOLD) {
            paginate(1);
        } else if (swipePower > SWIPE_CONFIDENCE_THRESHOLD) {
            paginate(-1);
        }
    }
  };

  const summaryCategories = useMemo(() => {
    const baseSeed = `${selectedDisplaySignName}-${displayPeriod}-${targetDate || activeHoroscopePeriodForTitles}`;
    return [
      { nameKey: "HoroscopeSummary.love", percentage: getDeterministicRandom(`${baseSeed}-love`, 40, 95), dataKey: "love" as keyof HoroscopeDetail, icon: Heart },
      { nameKey: "HoroscopeSummary.work", percentage: getDeterministicRandom(`${baseSeed}-work`, 40, 95), dataKey: "main" as keyof HoroscopeDetail, icon: WorkIcon },
      { nameKey: "HoroscopeSummary.health", percentage: getDeterministicRandom(`${baseSeed}-health`, 40, 95), dataKey: "health" as keyof HoroscopeDetail, icon: Activity },
    ];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDisplaySignName, displayPeriod, targetDate, activeHoroscopePeriodForTitles, dictionary]);


  const detailedHoroscopeCategories = currentDisplayHoroscope ? [
    { id: "main", titleKey: "HomePage.workCategory", icon: WorkIcon, content: currentDisplayHoroscope?.main },
    { id: "love", titleKey: "HoroscopeSection.loveTitle", icon: Heart, content: currentDisplayHoroscope?.love },
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
      <div className="flex-grow flex items-center justify-center min-h-[calc(100vh-var(--top-bar-height,56px)-var(--bottom-nav-height,64px))]">
        <LoadingSpinner className="h-12 w-12 text-primary" />
        {dictionary && Object.keys(dictionary).length > 0 && <p className="mt-4 font-body text-muted-foreground">{dictionary['HomePage.loadingDashboard'] || "Loading Cosmic Dashboard..."}</p>}
      </div>
    );
  }

  const motionDivKey = `${selectedDisplaySignName}-${activeHoroscopePeriodForTitles}-${targetDate || 'no-date'}-${isPersonalizedRequestActive}`;

  return (
    <div className="flex flex-col">
      <main className="flex-grow container mx-auto px-2 sm:px-3 py-3 space-y-4 overflow-x-hidden">
        
        <DailyTransitWidget dictionary={dictionary} />
        <DailyTipWidget dictionary={dictionary} locale={locale} />

        <SignSelectorHorizontalScroll
          dictionary={dictionary}
          locale={locale}
          signs={ZODIAC_SIGNS}
          selectedSignName={selectedDisplaySignName}
          onSignSelect={handleSignSelectedFromScroll}
          user={user}
          onboardingData={onboardingData}
          userSunSign={userSunSign}
        />

        <SubHeaderTabs
          dictionary={dictionary}
          activeTab={activeHoroscopePeriodForTitles}
          onTabChange={handleSubHeaderTabSelect}
        />

        <motion.div
            key={motionDivKey}
            drag={isMobile ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={isMobile ? handleDragEnd : undefined}
            className="w-full cursor-grab active:cursor-grabbing"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <SelectedSignDisplay
              dictionary={dictionary}
              locale={locale}
              selectedSign={selectedDisplaySign}
              isPersonalized={isPersonalizedRequestActive && !!user}
              userProfile={userAstrologyProfile}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <FeatureLinkCards dictionary={dictionary} locale={locale} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
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
            id="horoscope-details-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-3 sm:space-y-4"
          >
            <div className={cn("mb-2 sm:mb-3 px-1")}>
              <h2 className={cn(
                "font-semibold font-headline text-foreground flex items-center text-xl sm:text-2xl"
              )}>
                <CalendarDays className="w-5 h-5 sm:w-6 sm:h-6 mr-1.5 sm:mr-2 text-muted-foreground" />
                {dictionary[pageTitleKey] || "Horoscope Details"}
                 {isPersonalizedRequestActive && userSunSign?.name === selectedDisplaySignName && onboardingData?.name && (
                  <span className={cn("text-base sm:text-lg text-primary ml-1.5")}>({onboardingData.name})</span>
                )}
              </h2>
            </div>
            
            {currentDisplayHoroscope && !isHoroscopeLoading && (
              <div className="flex justify-center mt-1 mb-4">
                <Button
                    variant="outline"
                    size="default"
                    onClick={handleShareHoroscope}
                    className="text-primary hover:text-primary border-primary/50 hover:bg-primary/10"
                    aria-label={dictionary['HomePage.shareHoroscopeAria'] || "Share this horoscope"}
                >
                    <Share2 className="h-5 w-5 mr-2" /> {dictionary['HomePage.shareHoroscope'] || "Share Horoscope"}
                </Button>
              </div>
            )}

            <div className="space-y-3 sm:space-y-4">
              {isHoroscopeLoading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={`skeleton-cat-${index}`} className="bg-card/70 backdrop-blur-sm border-border/30 rounded-xl shadow-lg p-3 sm:p-4">
                    <h3 className="font-semibold font-headline text-primary mb-1.5 sm:mb-2 flex items-center text-lg sm:text-xl">
                      <LoadingSpinner className="h-5 w-5 sm:h-6 sm:h-6 mr-1.5 sm:mr-2" />
                      {dictionary['HoroscopeSection.loading'] || "Loading..."}
                    </h3>
                    <div className="space-y-1.5">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                    </div>
                  </div>
                ))
              ) : currentDisplayHoroscope ? (
                detailedHoroscopeCategories.map((cat, index) => (
                  <React.Fragment key={`${cat.id}-${motionDivKey}-detail`}>
                    <div className={cn("bg-card/70 backdrop-blur-sm border-border/30 rounded-xl shadow-lg p-3 sm:p-4")}>
                      <h3 className={cn("font-semibold font-headline text-primary mb-1.5 sm:mb-2 flex items-center text-lg sm:text-xl")}>
                        <cat.icon className={cn("h-5 w-5 sm:h-6 sm:h-6 mr-1.5 sm:mr-2")} />
                        {dictionary[cat.titleKey]}
                      </h3>
                      <p className="font-body text-sm text-foreground/80 leading-relaxed">
                        {cat.content || (dictionary['HoroscopeSection.noData'] || "No data available.")}
                      </p>
                    </div>
                    {!isPremium && index === 0 && <AdBanner dictionary={dictionary} />}
                  </React.Fragment>
                ))
              ) : (
                <div className="sm:col-span-2 text-center py-10">
                  <p className="font-body text-muted-foreground">{dictionary['HoroscopeSection.noData'] || "No data available."}</p>
                </div>
              )}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <PromotionCard dictionary={dictionary} locale={locale} />
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
