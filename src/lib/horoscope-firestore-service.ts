import { db } from '@/lib/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs,
  query,
  where,
  writeBatch,
  orderBy,
  limit
} from 'firebase/firestore';
import { ALL_SIGN_NAMES } from '@/lib/constants';
import type { HoroscopeDetail, ZodiacSignName, Locale } from '@/types';
import type { 
  FirestoreHoroscopeData, 
  HoroscopePeriod, 
  DailyHoroscopeDocument 
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

  /**
   * Guarda horóscopos para todos los signos en una fecha específica
   */
  static async saveDailyHoroscopes(
    date: string, // YYYY-MM-DD
    horoscopes: Record<ZodiacSignName, HoroscopeDetail>,
    locale: Locale = 'es'
  ): Promise<void> {
    try {
      this.validateFirestore();
      
      const batch = writeBatch(db!);
      const dailyDocRef = doc(db!, 'horoscopes', 'daily', date, locale);
      
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
      
      batch.set(dailyDocRef, firestoreData);
      await batch.commit();
      
      console.log(`✅ Horóscopos diarios guardados para ${date} (${locale})`);
    } catch (error) {
      console.error('❌ Error guardando horóscopos diarios:', error);
      throw error;
    }
  }

  /**
   * Carga horóscopos para una fecha específica
   */
  static async loadDailyHoroscopes(
    date: string, // YYYY-MM-DD
    locale: Locale = 'es'
  ): Promise<Record<ZodiacSignName, HoroscopeDetail> | null> {
    try {
      this.validateFirestore();
      
      const dailyDocRef = doc(db!, 'horoscopes', 'daily', date, locale);
      const docSnap = await getDoc(dailyDocRef);
      
      if (!docSnap.exists()) {
        console.log(`📅 No hay horóscopos guardados para ${date} (${locale})`);
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
      
      console.log(`✅ Horóscopos cargados para ${date} (${locale})`);
      return result;
    } catch (error) {
      console.error('❌ Error cargando horóscopos diarios:', error);
      throw error;
    }
  }

  /**
   * Verifica si existen horóscopos para una fecha
   */
  static async horoscopesExistForDate(
    date: string,
    locale: Locale = 'es'
  ): Promise<boolean> {
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

  /**
   * Carga horóscopo para un signo específico y fecha
   */
  static async loadHoroscopeForSign(
    sign: ZodiacSignName,
    date: string,
    locale: Locale = 'es'
  ): Promise<HoroscopeDetail | null> {
    try {
      console.log(`🔍 Buscando horóscopo para signo específico: ${sign} - ${date} (${locale})`);
      const allHoroscopes = await this.loadDailyHoroscopes(date, locale);
      console.log(`📊 Horóscopos encontrados:`, allHoroscopes ? Object.keys(allHoroscopes) : 'null');
      
      if (!allHoroscopes) {
        console.log(`🎯 No hay horóscopos para ${date}`);
        return null;
      }
      
      // Buscar el signo en diferentes formatos
      let result = allHoroscopes[sign]; // Formato exacto
      if (!result) {
        // Buscar en formato capitalizado
        const capitalizedSign = sign.charAt(0).toUpperCase() + sign.slice(1).toLowerCase() as ZodiacSignName;
        result = allHoroscopes[capitalizedSign];
        console.log(`🔄 Buscando formato capitalizado: ${capitalizedSign}`);
      }
      
      console.log(`🎯 Resultado para ${sign}:`, result ? 'ENCONTRADO' : 'NO ENCONTRADO');
      return result || null;
    } catch (error) {
      console.error('❌ Error cargando horóscopo para signo:', error);
      return null;
    }
  }

  /**
   * Guarda horóscopos semanales
   */
  static async saveWeeklyHoroscopes(
    weekKey: string, // YYYY-WW
    horoscopes: Record<ZodiacSignName, HoroscopeDetail>,
    locale: Locale = 'es'
  ): Promise<void> {
    try {
      this.validateFirestore();
      
      const batch = writeBatch(db!);
      const weeklyDocRef = doc(db!, 'horoscopes', 'weekly', weekKey, locale);
      
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
      
      batch.set(weeklyDocRef, firestoreData);
      await batch.commit();
      
      console.log(`✅ Horóscopos semanales guardados para ${weekKey} (${locale})`);
    } catch (error) {
      console.error('❌ Error guardando horóscopos semanales:', error);
      throw error;
    }
  }

  /**
   * Carga horóscopos semanales
   */
  static async loadWeeklyHoroscopes(
    weekKey: string, // YYYY-WW
    locale: Locale = 'es'
  ): Promise<Record<ZodiacSignName, HoroscopeDetail> | null> {
    try {
      this.validateFirestore();
      
      const weeklyDocRef = doc(db!, 'horoscopes', 'weekly', weekKey, locale);
      const docSnap = await getDoc(weeklyDocRef);
      
      if (!docSnap.exists()) {
        console.log(`📅 No hay horóscopos semanales para ${weekKey} (${locale})`);
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
      
      console.log(`✅ Horóscopos semanales cargados para ${weekKey} (${locale})`);
      return result;
    } catch (error) {
      console.error('❌ Error cargando horóscopos semanales:', error);
      throw error;
    }
  }

  /**
   * Guarda horóscopos mensuales
   */
  static async saveMonthlyHoroscopes(
    monthKey: string, // YYYY-MM
    horoscopes: Record<ZodiacSignName, HoroscopeDetail>,
    locale: Locale = 'es'
  ): Promise<void> {
    try {
      this.validateFirestore();
      
      const batch = writeBatch(db!);
      const monthlyDocRef = doc(db!, 'horoscopes', 'monthly', monthKey, locale);
      
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
      
      batch.set(monthlyDocRef, firestoreData);
      await batch.commit();
      
      console.log(`✅ Horóscopos mensuales guardados para ${monthKey} (${locale})`);
    } catch (error) {
      console.error('❌ Error guardando horóscopos mensuales:', error);
      throw error;
    }
  }

  /**
   * Carga horóscopos mensuales
   */
  static async loadMonthlyHoroscopes(
    monthKey: string, // YYYY-MM
    locale: Locale = 'es'
  ): Promise<Record<ZodiacSignName, HoroscopeDetail> | null> {
    try {
      this.validateFirestore();
      
      const monthlyDocRef = doc(db!, 'horoscopes', 'monthly', monthKey, locale);
      const docSnap = await getDoc(monthlyDocRef);
      
      if (!docSnap.exists()) {
        console.log(`📅 No hay horóscopos mensuales para ${monthKey} (${locale})`);
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
      
      console.log(`✅ Horóscopos mensuales cargados para ${monthKey} (${locale})`);
      return result;
    } catch (error) {
      console.error('❌ Error cargando horóscopos mensuales:', error);
      throw error;
    }
  }

  /**
   * Carga horóscopo semanal para un signo específico
   */
  static async loadWeeklyHoroscopeForSign(
    sign: ZodiacSignName,
    weekKey: string,
    locale: Locale = 'es'
  ): Promise<HoroscopeDetail | null> {
    try {
      const allHoroscopes = await this.loadWeeklyHoroscopes(weekKey, locale);
      return allHoroscopes?.[sign] || null;
    } catch (error) {
      console.error('❌ Error cargando horóscopo semanal para signo:', error);
      return null;
    }
  }

  /**
   * Carga horóscopo mensual para un signo específico
   */
  static async loadMonthlyHoroscopeForSign(
    sign: ZodiacSignName,
    monthKey: string,
    locale: Locale = 'es'
  ): Promise<HoroscopeDetail | null> {
    try {
      const allHoroscopes = await this.loadMonthlyHoroscopes(monthKey, locale);
      return allHoroscopes?.[sign] || null;
    } catch (error) {
      console.error('❌ Error cargando horóscopo mensual para signo:', error);
      return null;
    }
  }
}
