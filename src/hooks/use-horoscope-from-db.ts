import { useState, useEffect, useCallback, useRef } from 'react';
import type { ZodiacSignName, Locale, HoroscopeDetail } from '@/types';
import { capacitorFetch, getCapacitorInfo } from '@/lib/capacitor-utils';

interface UseHoroscopeFromDBOptions {
  sign: ZodiacSignName;
  locale: Locale;
  date?: string; // YYYY-MM-DD
}

interface UseHoroscopeFromDBResult {
  horoscope: HoroscopeDetail | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useHoroscopeFromDB({
  sign,
  locale,
  date
}: UseHoroscopeFromDBOptions): UseHoroscopeFromDBResult {
  const [horoscope, setHoroscope] = useState<HoroscopeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const isLoadingRef = useRef(false);
  const cacheKeyRef = useRef<string>('');

  const fetchHoroscope = useCallback(async () => {
    const targetDate = date || new Date().toISOString().split('T')[0];
    const cacheKey = `${sign}-${targetDate}-${locale}`;
    
    if (isLoadingRef.current && cacheKeyRef.current === cacheKey) {
      return;
    }
    
    try {
      isLoadingRef.current = true;
      cacheKeyRef.current = cacheKey;
      setLoading(true);
      setError(null);
      
      const capacitorInfo = getCapacitorInfo();
      
      console.log(`🔍 Cargando horóscopo (${capacitorInfo.isCapacitor ? 'Capacitor' : 'Web'}): ${sign} - ${targetDate} (${locale})`);
      
      const apiUrl = `/api/horoscopes/${targetDate}?locale=${locale}&sign=${sign}`;
      
      const response = await capacitorFetch(apiUrl, {
        method: 'GET'
      });
      
      console.log(`📡 Response status: ${response.status} ${response.statusText}`);
      
      if (!response.ok) {
        let errorData: any = {};
        try {
          errorData = await response.json();
        } catch (parseError) {
          throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
        }
        
        throw new Error(errorData.error || `Error HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      setHoroscope(data.horoscope);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      console.error('❌ Error cargando horóscopo:', {
        error: errorMessage,
        sign,
        locale,
        date: targetDate,
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'SSR'
      });
      setError(errorMessage);
      setHoroscope(null);
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, [sign, locale, date]);

  useEffect(() => {
    fetchHoroscope();
  }, [fetchHoroscope]);

  return { 
    horoscope, 
    loading, 
    error,
    refetch: fetchHoroscope
  };
}
