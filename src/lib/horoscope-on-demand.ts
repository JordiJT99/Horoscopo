/**
 * @fileOverview Utilitarios para carga on-demand de horóscopos
 * 
 * Sistema optimizado que genera solo lo que se necesita, cuando se necesita.
 * Reemplaza la generación masiva de todos los signos a la vez.
 */

import { HoroscopeFirestoreService } from '@/lib/horoscope-firestore-service';
import type { ZodiacSignName, HoroscopeDetail, Locale, HoroscopePeriod } from '@/types';

export interface OnDemandHoroscopeOptions {
  sign: ZodiacSignName;
  date?: string; // YYYY-MM-DD, defaults to today
  locale: Locale;
  period: HoroscopePeriod;
}

/**
 * ⚡ FUNCIÓN PRINCIPAL ON-DEMAND
 * 
 * Carga un horóscopo específico. Si no existe, lo genera solo para ese signo.
 * No genera todos los signos como el sistema anterior.
 */
export async function getHoroscopeOnDemand(
  options: OnDemandHoroscopeOptions
): Promise<HoroscopeDetail | null> {
  const { sign, date, locale, period } = options;
  const targetDate = date || new Date().toISOString().split('T')[0];
  
  console.log(`🎯 HORÓSCOPO ON-DEMAND: ${sign} - ${period} - ${targetDate} (${locale})`);
  
  try {
    const result = await HoroscopeFirestoreService.loadOrGenerateHoroscopeForSign(
      sign,
      targetDate,
      locale,
      period
    );
    
    if (result) {
      console.log(`✅ ÉXITO: Horóscopo ${period} disponible para ${sign}`);
    } else {
      console.warn(`⚠️ FALLBACK: No se pudo obtener horóscopo ${period} para ${sign}`);
    }
    
    return result;
    
  } catch (error) {
    console.error(`❌ ERROR ON-DEMAND: ${sign} - ${period}:`, error);
    return null;
  }
}

/**
 * Interfaz para múltiples períodos
 */
export interface MultiPeriodHoroscopeOptions {
  sign: ZodiacSignName;
  date?: string;
  locale: Locale;
  periods: HoroscopePeriod[];
}

/**
 * Obtiene múltiples períodos para un signo específico
 * Solo genera los períodos solicitados
 */
export async function getMultiPeriodHoroscopeOnDemand(
  options: MultiPeriodHoroscopeOptions
): Promise<Partial<Record<HoroscopePeriod, HoroscopeDetail>>> {
  const { sign, date, locale, periods } = options;
  const targetDate = date || new Date().toISOString().split('T')[0];
  
  console.log(`🎯 MULTI-PERÍODO ON-DEMAND: ${sign} - [${periods.join(', ')}] - ${targetDate} (${locale})`);
  
  const results: Partial<Record<HoroscopePeriod, HoroscopeDetail>> = {};
  
  // Cargar cada período de forma independiente
  for (const period of periods) {
    try {
      const horoscope = await getHoroscopeOnDemand({
        sign,
        date: targetDate,
        locale,
        period
      });
      
      if (horoscope) {
        results[period] = horoscope;
      }
      
    } catch (error) {
      console.error(`❌ Error cargando período ${period} para ${sign}:`, error);
    }
  }
  
  console.log(`✅ MULTI-PERÍODO COMPLETADO: ${sign} - ${Object.keys(results).length}/${periods.length} períodos cargados`);
  return results;
}

/**
 * Función de conveniencia para el período diario (más común)
 */
export async function getDailyHoroscopeOnDemand(
  sign: ZodiacSignName,
  locale: Locale,
  date?: string
): Promise<HoroscopeDetail | null> {
  return getHoroscopeOnDemand({
    sign,
    date,
    locale,
    period: 'daily'
  });
}

/**
 * Función de conveniencia para obtener los 3 períodos (comportamiento legacy)
 * ⚠️ NOTA: Esto sigue siendo menos eficiente que pedir solo lo necesario
 */
export async function getAllPeriodsHoroscopeOnDemand(
  sign: ZodiacSignName,
  locale: Locale,
  date?: string
): Promise<{
  daily?: HoroscopeDetail;
  weekly?: HoroscopeDetail;
  monthly?: HoroscopeDetail;
}> {
  console.log(`⚠️ GENERANDO LOS 3 PERÍODOS: Considera usar solo el período específico para mejor eficiencia`);
  
  const results = await getMultiPeriodHoroscopeOnDemand({
    sign,
    date,
    locale,
    periods: ['daily', 'weekly', 'monthly']
  });
  
  return {
    daily: results.daily,
    weekly: results.weekly,
    monthly: results.monthly
  };
}
