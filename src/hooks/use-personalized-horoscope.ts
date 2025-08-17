import { useState, useEffect, useCallback } from 'react';
import { HoroscopeFirestoreService } from '@/lib/horoscope-firestore-service';
import { getHoroscopeFlow, type HoroscopeFlowInput } from '@/ai/flows/horoscope-flow';
import type { 
  HoroscopeDetail, 
  ZodiacSignName, 
  Locale,
  HoroscopePersonalizationData 
} from '@/types';

interface UsePersonalizedHoroscopeParams {
  userId: string | null;
  sign: ZodiacSignName;
  locale: Locale;
  date?: string;
  personalizationData: HoroscopePersonalizationData;
  enabled?: boolean; // Para controlar cuándo se ejecuta
}

interface UsePersonalizedHoroscopeReturn {
  horoscope: HoroscopeDetail | null;
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

export function usePersonalizedHoroscope({
  userId,
  sign,
  locale,
  date,
  personalizationData,
  enabled = true
}: UsePersonalizedHoroscopeParams): UsePersonalizedHoroscopeReturn {
  const [horoscope, setHoroscope] = useState<HoroscopeDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const targetDate = date || new Date().toISOString().split('T')[0];

  const fetchPersonalizedHoroscope = useCallback(async () => {
    if (!userId || !enabled) {
      setHoroscope(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log(`🔮 Iniciando carga de horóscopo personalizado para ${userId} - ${sign} - ${targetDate}`);
      
      const input: HoroscopeFlowInput = {
        sign: sign,
        locale: locale,
        targetDate: targetDate,
        onboardingData: personalizationData,
        userId: userId,
      } as any;

      const result = await getHoroscopeFlow(input);
      setHoroscope(result.daily);

    } catch (err) {
      console.error('❌ Error en usePersonalizedHoroscope:', err);
      setError(err instanceof Error ? err : new Error('Error desconocido'));
      setHoroscope(null);
    } finally {
      setLoading(false);
    }
  }, [userId, sign, locale, targetDate, enabled, JSON.stringify(personalizationData)]);

  useEffect(() => {
    fetchPersonalizedHoroscope();
  }, [fetchPersonalizedHoroscope]);

  const refresh = async () => {
    await fetchPersonalizedHoroscope();
  };

  return {
    horoscope,
    loading,
    error,
    refresh
  };
}
