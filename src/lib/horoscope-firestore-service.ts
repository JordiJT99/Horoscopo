import { db } from '@/lib/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs,
  query,
  writeBatch,
  orderBy,
  limit,
  deleteDoc
} from 'firebase/firestore';
import { ALL_SIGN_NAMES } from '@/lib/constants';
import type { HoroscopeDetail, ZodiacSignName, Locale } from '@/types';
import type { 
  FirestoreHoroscopeData, 
  HoroscopePeriod, 
  DailyHoroscopeDocument,
  PersonalizedHoroscopeData,
  PersonalizedHoroscopeDocument,
  HoroscopePersonalizationData
} from '@/types';

export class HoroscopeFirestoreService {
  
  /**
   * Verifica si Firestore está disponible
   */
  private static validateFirestore(): void {
    if (!db) {
      throw new Error('Firestore no está inicializado');
    }
  }

  private static async saveHoroscopesByPeriod(
    period: HoroscopePeriod,
    key: string,
    horoscopes: Record<ZodiacSignName, HoroscopeDetail>,
    locale: Locale
  ): Promise<void> {
    try {
      this.validateFirestore();
      
      const docRef = doc(db!, 'horoscopes', period, key, locale);
      const firestoreData: DailyHoroscopeDocument = {};
      
      for (const signName of ALL_SIGN_NAMES) {
        const horoscopeData = horoscopes[signName];
        if (horoscopeData) {
          firestoreData[signName.toLowerCase()] = {
            main: horoscopeData.main,
            love: horoscopeData.love,
            money: horoscopeData.money,
            health: horoscopeData.health,
            generatedAt: new Date(),
            sign: signName
          };
        }
      }
      
      // Corregido: Usar { merge: true } para añadir o actualizar sin sobreescribir el documento completo.
      await setDoc(docRef, firestoreData, { merge: true });
      console.log(`✅ Horóscopos de ${period} guardados/actualizados para ${key} (${locale})`);
    } catch (error) {
      console.error(`❌ Error guardando horóscopos de ${period}:`, error);
      throw error;
    }
  }

  private static async loadHoroscopesByPeriod(
    period: HoroscopePeriod,
    key: string,
    locale: Locale
  ): Promise<Record<ZodiacSignName, HoroscopeDetail> | null> {
    try {
      this.validateFirestore();
      
      const docRef = doc(db!, 'horoscopes', period, key, locale);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        console.log(`📅 No hay horóscopos de ${period} para ${key} (${locale})`);
        return null;
      }
      
      const data = docSnap.data() as DailyHoroscopeDocument;
      const result: Record<ZodiacSignName, HoroscopeDetail> = {} as Record<ZodiacSignName, HoroscopeDetail>;
      
      for (const signName of ALL_SIGN_NAMES) {
        const signKey = signName.toLowerCase();
        const signData = data[signKey];
        
        if (signData) {
          result[signName] = {
            main: signData.main,
            love: signData.love,
            money: signData.money,
            health: signData.health
          };
        }
      }
      
      console.log(`✅ Horóscopos de ${period} cargados para ${key} (${locale})`);
      return result;
    } catch (error) {
      console.error(`❌ Error cargando horóscopos de ${period}:`, error);
      throw error;
    }
  }

  static async saveDailyHoroscopes(date: string, horoscopes: Record<ZodiacSignName, HoroscopeDetail>, locale: Locale): Promise<void> {
    await this.saveHoroscopesByPeriod('daily', date, horoscopes, locale);
  }

  static async loadDailyHoroscopes(date: string, locale: Locale): Promise<Record<ZodiacSignName, HoroscopeDetail> | null> {
    return this.loadHoroscopesByPeriod('daily', date, locale);
  }

  static async saveWeeklyHoroscopes(weekKey: string, horoscopes: Record<ZodiacSignName, HoroscopeDetail>, locale: Locale): Promise<void> {
    await this.saveHoroscopesByPeriod('weekly', weekKey, horoscopes, locale);
  }

  static async loadWeeklyHoroscopes(weekKey: string, locale: Locale): Promise<Record<ZodiacSignName, HoroscopeDetail> | null> {
    return this.loadHoroscopesByPeriod('weekly', weekKey, locale);
  }

  static async saveMonthlyHoroscopes(monthKey: string, horoscopes: Record<ZodiacSignName, HoroscopeDetail>, locale: Locale): Promise<void> {
    await this.saveHoroscopesByPeriod('monthly', monthKey, horoscopes, locale);
  }

  static async loadMonthlyHoroscopes(monthKey: string, locale: Locale): Promise<Record<ZodiacSignName, HoroscopeDetail> | null> {
    return this.loadHoroscopesByPeriod('monthly', monthKey, locale);
  }

  static async horoscopesExistForDate(date: string, locale: Locale = 'es'): Promise<boolean> {
    try {
      this.validateFirestore();
      const dailyDocRef = doc(db!, 'horoscopes', 'daily', date, locale);
      const docSnap = await getDoc(dailyDocRef);
      return docSnap.exists();
    } catch (error) {
      console.error('❌ Error verificando existencia de horóscopos:', error);
      return false;
    }
  }

  private static async loadHoroscopeForSignByPeriod(period: HoroscopePeriod, sign: ZodiacSignName, key: string, locale: Locale): Promise<HoroscopeDetail | null> {
    try {
      const allHoroscopes = await this.loadHoroscopesByPeriod(period, key, locale);
      return allHoroscopes?.[sign] || null;
    } catch (error) {
      console.error(`❌ Error cargando horóscopo de ${period} para signo:`, error);
      return null;
    }
  }

  static async loadHoroscopeForSign(sign: ZodiacSignName, date: string, locale: Locale = 'es'): Promise<HoroscopeDetail | null> {
    return this.loadHoroscopeForSignByPeriod('daily', sign, date, locale);
  }

  static async loadWeeklyHoroscopeForSign(sign: ZodiacSignName, weekKey: string, locale: Locale = 'es'): Promise<HoroscopeDetail | null> {
    return this.loadHoroscopeForSignByPeriod('weekly', sign, weekKey, locale);
  }

  static async loadMonthlyHoroscopeForSign(sign: ZodiacSignName, monthKey: string, locale: Locale = 'es'): Promise<HoroscopeDetail | null> {
    return this.loadHoroscopeForSignByPeriod('monthly', sign, monthKey, locale);
  }
  
  static async cleanOldDailyHoroscopes(): Promise<{ cleaned: number; errors: string[]; }> {
    try {
      this.validateFirestore();
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - 7);
      const cutoffDateString = cutoffDate.toISOString().split('T')[0];
      
      console.log(`🧹 Limpiando horóscopos diarios anteriores a: ${cutoffDateString}`);
      let cleaned = 0;
      const errors: string[] = [];
      const locales = ['es', 'en', 'de', 'fr'];

      const dailyCollectionRef = collection(db!, 'horoscopes', 'daily');
      const q = query(dailyCollectionRef);
      const querySnapshot = await getDocs(q);

      for (const dateDoc of querySnapshot.docs) {
        if (dateDoc.id < cutoffDateString) {
          for (const locale of locales) {
            const localeDocRef = doc(db!, 'horoscopes', 'daily', dateDoc.id, locale);
            const localeDocSnap = await getDoc(localeDocRef);
            if(localeDocSnap.exists()) {
                await deleteDoc(localeDocRef);
                cleaned++;
                console.log(`🗑️ Eliminado: daily/${dateDoc.id}/${locale}`);
            }
          }
        }
      }
      console.log(`✅ Limpieza de horóscopos diarios completada. Documentos eliminados: ${cleaned}`);
      return { cleaned, errors };
    } catch (error) {
      console.error('❌ Error en limpieza de horóscopos diarios antiguos:', error);
      throw error;
    }
  }

  static async savePersonalizedHoroscope(
    userId: string,
    sign: ZodiacSignName,
    period: HoroscopePeriod,
    key: string,
    horoscope: HoroscopeDetail,
    personalizationData: HoroscopePersonalizationData,
    locale: Locale = 'es'
  ): Promise<void> {
    try {
      this.validateFirestore();
      const docRef = doc(db!, 'horoscopes', 'personalized', userId, period, key);
      const data: PersonalizedHoroscopeDocument = {
        [sign]: {
          ...horoscope,
          generatedAt: new Date(),
          sign: sign,
          userId: userId,
          personalizationData: personalizationData,
          period: period,
        }
      };
      
      await setDoc(docRef, data, { merge: true });
      console.log(`💾 Horóscopo personalizado guardado: ${userId}/${period}/${key}/${sign}`);
    } catch (error) {
      console.error('❌ Error guardando horóscopo personalizado:', error);
      throw error;
    }
  }

  static async loadPersonalizedHoroscope(
    userId: string,
    sign: ZodiacSignName,
    period: HoroscopePeriod,
    key: string,
    locale: Locale = 'es'
  ): Promise<HoroscopeDetail | null> {
    try {
      this.validateFirestore();
      const docRef = doc(db!, 'horoscopes', 'personalized', userId, period, key);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        console.log(`📅 No hay horóscopo personalizado para ${userId}/${period}/${key}`);
        return null;
      }
      const data = docSnap.data() as PersonalizedHoroscopeDocument;
      const signData = data[sign];

      if (!signData) {
        console.log(`📅 No hay horóscopo para el signo ${sign} en ${userId}/${period}/${key}`);
        return null;
      }
      
      console.log(`✅ Horóscopo personalizado cargado desde BD para ${userId}/${period}/${key}/${sign}`);
      return {
        main: signData.main,
        love: signData.love,
        money: signData.money,
        health: signData.health
      };
    } catch (error) {
      console.error('❌ Error cargando horóscopo personalizado:', error);
      throw error;
    }
  }
  
  static async personalizedHoroscopeExists(
    userId: string,
    sign: ZodiacSignName,
    dateKey: string,
    locale: Locale = 'es'
  ): Promise<boolean> {
     try {
      this.validateFirestore();
      const docRef = doc(db!, 'horoscopes', 'personalized', userId, 'daily', dateKey);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) return false;
      const data = docSnap.data() as PersonalizedHoroscopeDocument;
      return !!data[sign];
    } catch (error) {
      console.error('❌ Error verificando existencia de horóscopo personalizado:', error);
      return false;
    }
  }

  static async cleanOldPersonalizedHoroscopes(): Promise<{ cleaned: number; errors: string[]; }> {
    // This logic needs to be adapted for the new structure, which is more complex.
    // For now, returning a successful empty result to avoid errors.
    console.warn("🧹 La limpieza de horóscopos personalizados necesita ser actualizada para la nueva estructura de datos.");
    return { cleaned: 0, errors: [] };
  }
}
