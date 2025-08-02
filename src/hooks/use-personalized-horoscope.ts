import { useState, useEffect } from 'react';
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

  const fetchPersonalizedHoroscope = async () => {
    if (!userId || !enabled) {
      setHoroscope(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log(`🔮 Iniciando carga de horóscopo personalizado para ${userId} - ${sign} - ${targetDate}`);

      // 1. Primero intentar cargar desde Firestore
      const existingHoroscope = await HoroscopeFirestoreService.loadPersonalizedHoroscope(
        userId,
        sign,
        targetDate,
        locale
      );

      if (existingHoroscope) {
        console.log(`✅ Horóscopo personalizado encontrado en BD para ${userId} - ${sign}`);
        setHoroscope(existingHoroscope);
        setLoading(false);
        return;
      }

      console.log(`🤖 Generando nuevo horóscopo personalizado para ${userId} - ${sign}`);

      // 2. Si no existe, generar uno nuevo con personalización
      const input: HoroscopeFlowInput = {
        sign: sign,
        locale: locale,
        targetDate: targetDate,
        onboardingData: personalizationData
      };

      const result = await getHoroscopeFlow(input);

      if (result && result.daily) {
        // 3. Guardar el horóscopo personalizado en Firestore
        await HoroscopeFirestoreService.savePersonalizedHoroscope(
          userId,
          sign,
          targetDate,
          result.daily,
          personalizationData,
          locale
        );

        console.log(`✅ Horóscopo personalizado generado y guardado para ${userId} - ${sign}`);
        setHoroscope(result.daily);
      } else {
        throw new Error('No se pudo generar el horóscopo personalizado');
      }

    } catch (err) {
      console.error('❌ Error en usePersonalizedHoroscope:', err);
      setError(err instanceof Error ? err : new Error('Error desconocido'));
      setHoroscope(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPersonalizedHoroscope();
  }, [userId, sign, locale, targetDate, enabled, JSON.stringify(personalizationData)]);

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
