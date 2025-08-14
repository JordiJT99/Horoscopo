import { HoroscopeFirestoreService } from './horoscope-firestore-service';
import { getHoroscopeFlow } from '@/ai/flows/horoscope-flow';
import { ALL_SIGN_NAMES } from './constants';
import { format, addDays, getISOWeek, getYear } from 'date-fns';
import type { ZodiacSignName, Locale, HoroscopeDetail } from '@/types';
import { validateModel, getAllowedModel } from '@/ai/model-config';

export class HoroscopeBatchGenerator {
  
  /**
   * Genera horóscopos diarios para todos los signos y idiomas
   */
  static async generateDailyHoroscopesForDate(
    date: Date,
    locales: Locale[] = ['es', 'en', 'de', 'fr']
  ): Promise<void> {
    // VALIDACIÓN CRÍTICA: Asegurar que solo usamos Gemini 2.0 Flash
    const authorizedModel = getAllowedModel();
    validateModel(authorizedModel);
    console.log(`🔒 CRON JOB: Usando modelo autorizado: ${authorizedModel}`);
    
    const dateKey = format(date, 'yyyy-MM-dd');
    
    console.log(`🚀 Iniciando generación masiva para ${dateKey}`);
    
    for (const locale of locales) {
      try {
        // Verificar si ya existen
        const exists = await HoroscopeFirestoreService.horoscopesExistForDate(dateKey, locale);
        if (exists) {
          console.log(`⏭️ Horóscopos ya existen para ${dateKey} (${locale})`);
          continue;
        }

        console.log(`📝 Generando horóscopos para ${dateKey} (${locale})`);
        
        // Generar para todos los signos
        const allHoroscopes: Record<ZodiacSignName, HoroscopeDetail> = {} as Record<ZodiacSignName, HoroscopeDetail>;
        
        for (const sign of ALL_SIGN_NAMES) {
          try {
            console.log(`  🔮 Generando ${sign}...`);
            const result = await getHoroscopeFlow({
              sign,
              locale,
              targetDate: dateKey
            });
            
            allHoroscopes[sign] = result.daily;
            
            // Pausa para evitar rate limits
            await new Promise(resolve => setTimeout(resolve, 1000));
            
          } catch (error) {
            console.error(`❌ Error generando ${sign}:`, error);
            // Continuar con los demás signos
          }
        }
        
        // Guardar todos los horóscopos de una vez
        if (Object.keys(allHoroscopes).length > 0) {
          await HoroscopeFirestoreService.saveDailyHoroscopes(dateKey, allHoroscopes, locale);
          console.log(`✅ Guardados ${Object.keys(allHoroscopes).length} horóscopos para ${locale}`);
        }
        
      } catch (error) {
        console.error(`❌ Error generando horóscopos para ${locale}:`, error);
      }
    }
    
    console.log(`🎉 Generación masiva completada para ${dateKey}`);
  }

  /**
   * Genera horóscopos diarios usando string de fecha
   */
  static async generateDailyHoroscopes(
    dateString: string, // YYYY-MM-DD
    locales: Locale[] = ['es', 'en', 'de', 'fr']
  ): Promise<void> {
    // VALIDACIÓN CRÍTICA: Asegurar que solo usamos Gemini 2.0 Flash
    const authorizedModel = getAllowedModel();
    validateModel(authorizedModel);
    console.log(`🔒 API HOROSCOPES: Usando modelo autorizado: ${authorizedModel}`);
    
    const date = new Date(dateString + 'T00:00:00.000Z');
    await this.generateDailyHoroscopesForDate(date, locales);
  }

  /**
   * Genera horóscopos para los próximos N días
   */
  static async generateHoroscopesForNextDays(
    days: number = 7,
    locales: Locale[] = ['es', 'en', 'de', 'fr']
  ): Promise<void> {
    // VALIDACIÓN CRÍTICA: Asegurar que solo usamos Gemini 2.0 Flash
    const authorizedModel = getAllowedModel();
    validateModel(authorizedModel);
    console.log(`🔒 BATCH GENERATION: Usando modelo autorizado: ${authorizedModel}`);
    
    const today = new Date();
    
    for (let i = 0; i < days; i++) {
      const targetDate = addDays(today, i);
      await this.generateDailyHoroscopesForDate(targetDate, locales);
    }
  }

  /**
   * Pre-genera horóscopos para mañana (útil para cron jobs)
   */
  static async generateTomorrowHoroscopes(): Promise<void> {
    // VALIDACIÓN CRÍTICA: Asegurar que solo usamos Gemini 2.0 Flash
    const authorizedModel = getAllowedModel();
    validateModel(authorizedModel);
    console.log(`🔒 CRON TOMORROW: Usando modelo autorizado: ${authorizedModel}`);
    
    const tomorrow = addDays(new Date(), 1);
    await this.generateDailyHoroscopesForDate(tomorrow);
  }

  /**
   * Genera horóscopos semanales para todos los signos
   */
  static async generateWeeklyHoroscopesForWeek(
    date: Date,
    locales: Locale[] = ['es', 'en', 'de', 'fr']
  ): Promise<void> {
    // VALIDACIÓN CRÍTICA: Asegurar que solo usamos Gemini 2.0 Flash
    const authorizedModel = getAllowedModel();
    validateModel(authorizedModel);
    console.log(`🔒 WEEKLY GENERATION: Usando modelo autorizado: ${authorizedModel}`);
    
    const weekKey = `${getYear(date)}-${getISOWeek(date).toString().padStart(2, '0')}`;
    
    console.log(`🚀 Iniciando generación semanal para ${weekKey}`);
    
    for (const locale of locales) {
      try {
        console.log(`📝 Generando horóscopos semanales para ${weekKey} (${locale})`);
        
        const allHoroscopes: Record<ZodiacSignName, HoroscopeDetail> = {} as Record<ZodiacSignName, HoroscopeDetail>;
        
        for (const sign of ALL_SIGN_NAMES) {
          try {
            console.log(`  🔮 Generando ${sign} semanal...`);
            const result = await getHoroscopeFlow({
              sign,
              locale,
              targetDate: format(date, 'yyyy-MM-dd')
            });
            
            allHoroscopes[sign] = result.weekly;
            
            await new Promise(resolve => setTimeout(resolve, 1000));
            
          } catch (error) {
            console.error(`❌ Error generando ${sign} semanal:`, error);
          }
        }
        
        if (Object.keys(allHoroscopes).length > 0) {
          await HoroscopeFirestoreService.saveWeeklyHoroscopes(weekKey, allHoroscopes, locale);
          console.log(`✅ Guardados ${Object.keys(allHoroscopes).length} horóscopos semanales para ${locale}`);
        }
        
      } catch (error) {
        console.error(`❌ Error generando horóscopos semanales para ${locale}:`, error);
      }
    }
    
    console.log(`🎉 Generación semanal completada para ${weekKey}`);
  }

  /**
   * Genera horóscopos mensuales para todos los signos
   */
  static async generateMonthlyHoroscopesForMonth(
    date: Date,
    locales: Locale[] = ['es', 'en', 'de', 'fr']
  ): Promise<void> {
    // VALIDACIÓN CRÍTICA: Asegurar que solo usamos Gemini 2.0 Flash
    const authorizedModel = getAllowedModel();
    validateModel(authorizedModel);
    console.log(`🔒 MONTHLY GENERATION: Usando modelo autorizado: ${authorizedModel}`);
    
    const monthKey = format(date, 'yyyy-MM');
    
    console.log(`🚀 Iniciando generación mensual para ${monthKey}`);
    
    for (const locale of locales) {
      try {
        console.log(`📝 Generando horóscopos mensuales para ${monthKey} (${locale})`);
        
        const allHoroscopes: Record<ZodiacSignName, HoroscopeDetail> = {} as Record<ZodiacSignName, HoroscopeDetail>;
        
        for (const sign of ALL_SIGN_NAMES) {
          try {
            console.log(`  🔮 Generando ${sign} mensual...`);
            const result = await getHoroscopeFlow({
              sign,
              locale,
              targetDate: format(date, 'yyyy-MM-dd')
            });
            
            allHoroscopes[sign] = result.monthly;
            
            await new Promise(resolve => setTimeout(resolve, 1000));
            
          } catch (error) {
            console.error(`❌ Error generando ${sign} mensual:`, error);
          }
        }
        
        if (Object.keys(allHoroscopes).length > 0) {
          await HoroscopeFirestoreService.saveMonthlyHoroscopes(monthKey, allHoroscopes, locale);
          console.log(`✅ Guardados ${Object.keys(allHoroscopes).length} horóscopos mensuales para ${locale}`);
        }
        
      } catch (error) {
        console.error(`❌ Error generando horóscopos mensuales para ${locale}:`, error);
      }
    }
    
    console.log(`🎉 Generación mensual completada para ${monthKey}`);
  }

  /**
   * Genera contenido completo para una fecha (diario, semanal, mensual)
   */
  static async generateCompleteHoroscopesForDate(
    date: Date,
    locales: Locale[] = ['es', 'en', 'de', 'fr']
  ): Promise<void> {
    // VALIDACIÓN CRÍTICA: Asegurar que solo usamos Gemini 2.0 Flash
    const authorizedModel = getAllowedModel();
    validateModel(authorizedModel);
    console.log(`🔒 COMPLETE GENERATION: Usando modelo autorizado: ${authorizedModel}`);
    
    console.log(`🌟 Iniciando generación completa para ${format(date, 'yyyy-MM-dd')}`);
    
    await Promise.all([
      this.generateDailyHoroscopesForDate(date, locales),
      this.generateWeeklyHoroscopesForWeek(date, locales),
      this.generateMonthlyHoroscopesForMonth(date, locales)
    ]);
    
    console.log(`🎉 Generación completa finalizada para ${format(date, 'yyyy-MM-dd')}`);
  }
}
