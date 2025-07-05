
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Dictionary, Locale } from '@/lib/dictionaries';
import BirthDataForm from './BirthDataForm';
import NatalChartClientContent from './NatalChartClientContent';
import { useAuth } from '@/context/AuthContext';
import { useCosmicEnergy } from '@/hooks/use-cosmic-energy';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import PremiumLockScreen from '@/components/premium/PremiumLockScreen';

interface BirthData {
  date: string;
  time: string;
  city: string;
  country: string;
}

interface NatalChartClientWrapperProps {
  dictionary: Dictionary;
  locale: Locale;
}

const NatalChartClientWrapper: React.FC<NatalChartClientWrapperProps> = ({ dictionary, locale }) => {
  const { user, isLoading: authLoading } = useAuth();
  const { isPremium, isLoading: energyLoading } = useCosmicEnergy();
  const [birthData, setBirthData] = useState<BirthData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getStorageKey = useCallback(() => {
    return user ? `natalChartData_${user.uid}` : null;
  }, [user]);

  useEffect(() => {
    if (authLoading || energyLoading) {
      return; // Wait until auth and energy state are resolved
    }
    
    const key = getStorageKey();
    if (key) {
      try {
        const savedData = localStorage.getItem(key);
        if (savedData) {
          setBirthData(JSON.parse(savedData));
        }
      } catch (error) {
        console.error("Failed to parse birth data from localStorage", error);
        setBirthData(null);
      }
    } else {
      // No user, so no saved data to fetch
      setBirthData(null);
    }
    setIsLoading(false);
  }, [user, authLoading, energyLoading, getStorageKey]);

  const handleFormSubmit = (data: BirthData) => {
    const key = getStorageKey();
    if (key) {
      try {
        localStorage.setItem(key, JSON.stringify(data));
      } catch (error) {
        console.error("Failed to save birth data to localStorage", error);
      }
    }
    setBirthData(data);
  };
  
  const handleReset = () => {
    const key = getStorageKey();
    if (key) {
      localStorage.removeItem(key);
    }
    setBirthData(null);
  };

  const birthFormDictionary = {
    dateLabel: dictionary.birthForm?.dateLabel || 'Birth Date',
    timeLabel: dictionary.birthForm?.timeLabel || 'Birth Time',
    cityLabel: dictionary.birthForm?.cityLabel || 'Birth City',
    countryLabel: dictionary.birthForm?.countryLabel || 'Birth Country',
    submitButton: dictionary.birthForm?.submitButton || 'Generate Natal Chart',
    validationErrors: {
      required: dictionary.birthForm?.validationErrors?.required || 'This field is required.',
    },
    pickDate: dictionary.birthForm?.pickDate || 'Pick a date',
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner className="h-12 w-12 text-primary" />
      </div>
    );
  }
  
  if (!isPremium) {
    return <PremiumLockScreen dictionary={dictionary} locale={locale} featureTitle={dictionary.NatalChartPage?.title} />;
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {!birthData ? (
        <BirthDataForm onSubmit={handleFormSubmit} dictionary={birthFormDictionary} locale={locale} />
      ) : (
        <NatalChartClientContent 
          birthData={birthData} 
          dictionary={dictionary}
          locale={locale} 
          user={user}
          onReset={handleReset} 
        />
      )}
    </div>
  );
};

export default NatalChartClientWrapper;
