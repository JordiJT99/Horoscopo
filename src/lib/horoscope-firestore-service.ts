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
      
      if (!allHoroscopes) {
        console.log(`🎯 No hay horóscopos para ${date}`);
        return null;
      }
      
      // Buscar el signo en diferentes formatos (mayúsculas, minúsculas, capitalizado)
      const signKeyLower = sign.toLowerCase();
      const allHoroscopesLowerKeys = Object.keys(allHoroscopes).reduce((acc, key) => {
        acc[key.toLowerCase()] = allHoroscopes[key as ZodiacSignName];
        return acc;
      }, {} as Record<string, HoroscopeDetail>);

      let result = allHoroscopesLowerKeys[signKeyLower];

      // If not found, check with capitalized key as a fallback
      if (!result) {
        const capitalizedSignKey = sign.charAt(0).toUpperCase() + sign.slice(1).toLowerCase();
        result = allHoroscopes[capitalizedSignKey as ZodiacSignName];
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

  /**
   * Limpia horóscopos diarios antiguos (más de 1 semana)
   */
  static async cleanOldDailyHoroscopes(): Promise<{
    cleaned: number;
    errors: string[];
  }> {
    try {
      this.validateFirestore();
      
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - 7); // 7 días atrás
      const cutoffDateString = cutoffDate.toISOString().split('T')[0]; // YYYY-MM-DD
      
      console.log(`🧹 Iniciando limpieza de horóscopos anteriores a: ${cutoffDateString}`);
      
      let cleaned = 0;
      const errors: string[] = [];
      const batch = writeBatch(db!);
      let operationsInBatch = 0;
      const MAX_BATCH_SIZE = 400; // Límite conservador para Firestore
      
      // Generar fechas a verificar (últimos 30 días para encontrar fechas antiguas)
      const datesToCheck: string[] = [];
      for (let i = 7; i <= 30; i++) { // Desde hace 7 días hasta hace 30 días
        const checkDate = new Date();
        checkDate.setDate(checkDate.getDate() - i);
        const dateString = checkDate.toISOString().split('T')[0];
        datesToCheck.push(dateString);
      }
      
      console.log(`🔍 Verificando ${datesToCheck.length} fechas para limpieza...`);
      
      const locales = ['es', 'en', 'de', 'fr'];
      
      for (const dateString of datesToCheck) {
        try {
          // Verificar si la fecha es anterior al cutoff
          if (dateString < cutoffDateString) {
            let dateHadData = false;
            
            for (const locale of locales) {
              // Referencia al documento específico: horoscopes/daily/{date}/{locale}
              const docRef = doc(db!, 'horoscopes', 'daily', dateString, locale);
              
              // Verificar si el documento existe
              const docSnap = await getDoc(docRef);
              
              if (docSnap.exists()) {
                dateHadData = true;
                batch.delete(docRef);
                operationsInBatch++;
                
                console.log(`🗑️ Marcando para eliminar: ${dateString}/${locale}`);
                
                // Si alcanzamos el límite del batch, ejecutarlo
                if (operationsInBatch >= MAX_BATCH_SIZE) {
                  await batch.commit();
                  console.log(`🗑️ Ejecutado batch con ${operationsInBatch} operaciones`);
                  operationsInBatch = 0;
                  
                  // Crear nuevo batch - método correcto
                  const newBatch = writeBatch(db!);
                  // Reasignar la variable batch
                  Object.setPrototypeOf(batch, Object.getPrototypeOf(newBatch));
                  Object.assign(batch, newBatch);
                }
              }
            }
            
            if (dateHadData) {
              cleaned++;
              console.log(`✅ Fecha ${dateString} marcada para limpieza completa`);
            }
          }
        } catch (docError) {
          const errorMsg = `Error procesando fecha ${dateString}: ${docError}`;
          console.error('❌', errorMsg);
          errors.push(errorMsg);
        }
      }
      
      // Ejecutar el último batch si tiene operaciones pendientes
      if (operationsInBatch > 0) {
        await batch.commit();
        console.log(`🗑️ Ejecutado batch final con ${operationsInBatch} operaciones`);
      }
      
      console.log(`✅ Limpieza completada. Fechas procesadas: ${cleaned}, Errores: ${errors.length}`);
      
      return {
        cleaned,
        errors
      };
      
    } catch (error) {
      console.error('❌ Error en limpieza de horóscopos antiguos:', error);
      throw error;
    }
  }

  /**
   * Guarda un horóscopo personalizado para un usuario específico
   */
  static async savePersonalizedHoroscope(
    userId: string,
    sign: ZodiacSignName,
    date: string, // YYYY-MM-DD
    horoscope: HoroscopeDetail,
    personalizationData: HoroscopePersonalizationData,
    locale: Locale = 'es'
  ): Promise<void> {
    try {
      this.validateFirestore();
      
      console.log(`💾 Guardando horóscopo personalizado para usuario ${userId}, signo ${sign}, fecha ${date}`);
      
      const personalizedDocRef = doc(db!, 'horoscopes', 'personalized', date, locale, sign, userId);
      
      const personalizedData: PersonalizedHoroscopeData = {
        main: horoscope.main,
        love: horoscope.love,
        money: horoscope.money,
        health: horoscope.health,
        generatedAt: new Date(),
        sign: sign,
        userId: userId,
        personalizationData: personalizationData
      };
      
      await setDoc(personalizedDocRef, personalizedData);
      
      console.log(`✅ Horóscopo personalizado guardado para ${userId} - ${sign} - ${date} (${locale})`);
    } catch (error) {
      console.error('❌ Error guardando horóscopo personalizado:', error);
      throw error;
    }
  }

  /**
   * Carga un horóscopo personalizado para un usuario específico
   */
  static async loadPersonalizedHoroscope(
    userId: string,
    sign: ZodiacSignName,
    date: string, // YYYY-MM-DD
    locale: Locale = 'es'
  ): Promise<HoroscopeDetail | null> {
    try {
      this.validateFirestore();
      
      console.log(`🔍 Buscando horóscopo personalizado para usuario ${userId}, signo ${sign}, fecha ${date}`);
      
      const personalizedDocRef = doc(db!, 'horoscopes', 'personalized', date, locale, sign, userId);
      const docSnap = await getDoc(personalizedDocRef);
      
      if (!docSnap.exists()) {
        console.log(`📅 No hay horóscopo personalizado para ${userId} - ${sign} - ${date} (${locale})`);
        return null;
      }
      
      const data = docSnap.data() as PersonalizedHoroscopeData;
      
      const result: HoroscopeDetail = {
        main: data.main,
        love: data.love,
        money: data.money,
        health: data.health
      };
      
      console.log(`✅ Horóscopo personalizado cargado para ${userId} - ${sign} - ${date} (${locale})`);
      return result;
    } catch (error) {
      console.error('❌ Error cargando horóscopo personalizado:', error);
      throw error;
    }
  }

  /**
   * Verifica si existe un horóscopo personalizado para un usuario
   */
  static async personalizedHoroscopeExists(
    userId: string,
    sign: ZodiacSignName,
    date: string,
    locale: Locale = 'es'
  ): Promise<boolean> {
    try {
      this.validateFirestore();
      
      const personalizedDocRef = doc(db!, 'horoscopes', 'personalized', date, locale, sign, userId);
      const docSnap = await getDoc(personalizedDocRef);
      return docSnap.exists();
    } catch (error) {
      console.error('❌ Error verificando existencia de horóscopo personalizado:', error);
      return false;
    }
  }

  /**
   * Limpia horóscopos personalizados antiguos (más de 2 semanas)
   */
  static async cleanOldPersonalizedHoroscopes(): Promise<{
    cleaned: number;
    errors: string[];
  }> {
    try {
      this.validateFirestore();
      
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - 14); // 14 días atrás
      const cutoffDateString = cutoffDate.toISOString().split('T')[0]; // YYYY-MM-DD
      
      console.log(`🧹 Iniciando limpieza de horóscopos personalizados anteriores a: ${cutoffDateString}`);
      
      let cleaned = 0;
      const errors: string[] = [];
      const batch = writeBatch(db!);
      let operationsInBatch = 0;
      const MAX_BATCH_SIZE = 400;
      
      // Generar fechas a verificar (últimos 45 días para encontrar fechas antiguas)
      const datesToCheck: string[] = [];
      for (let i = 14; i <= 45; i++) { // Desde hace 14 días hasta hace 45 días
        const checkDate = new Date();
        checkDate.setDate(checkDate.getDate() - i);
        const dateString = checkDate.toISOString().split('T')[0];
        datesToCheck.push(dateString);
      }
      
      console.log(`🔍 Verificando ${datesToCheck.length} fechas para limpieza de horóscopos personalizados...`);
      
      const locales = ['es', 'en', 'de', 'fr'];
      
      for (const dateString of datesToCheck) {
        try {
          if (dateString < cutoffDateString) {
            let dateHadData = false;

            for (const locale of locales) {
              for (const signName of ALL_SIGN_NAMES) {
                // Verificar si hay documentos en esta ruta
                const personalizedCollectionRef = collection(db!, 'horoscopes', 'personalized', dateString, locale, signName);
                const personalizedDocs = await getDocs(personalizedCollectionRef);

                personalizedDocs.forEach((doc) => {
                  dateHadData = true;
                  batch.delete(doc.ref);
                  operationsInBatch++;

                  console.log(`🗑️ Marcando para eliminar horóscopo personalizado: ${dateString}/${locale}/${signName}/${doc.id}`);

                  // Si alcanzamos el límite del batch, ejecutarlo
                  if (operationsInBatch >= MAX_BATCH_SIZE) {
                    batch.commit().then(() => {
                      console.log(`🗑️ Ejecutado batch con ${operationsInBatch} operaciones`);
                    });
                    operationsInBatch = 0;

                    // Crear nuevo batch
                    const newBatch = writeBatch(db!);
                    Object.setPrototypeOf(batch, Object.getPrototypeOf(newBatch));
                    Object.assign(batch, newBatch);
                  }
                });
              }
            }

            if (dateHadData) {
              cleaned++;
              console.log(`✅ Fecha ${dateString} marcada para limpieza completa de horóscopos personalizados`);
            }
          }
        } catch (docError) {
          const errorMsg = `Error procesando fecha ${dateString} para horóscopos personalizados: ${docError}`;
          console.error('❌', errorMsg);
          errors.push(errorMsg);
        }
      }
      
      // Ejecutar el último batch si tiene operaciones pendientes
      if (operationsInBatch > 0) {
        await batch.commit();
        console.log(`🗑️ Ejecutado batch final con ${operationsInBatch} operaciones`);
      }
      
      console.log(`✅ Limpieza de horóscopos personalizados completada. Fechas procesadas: ${cleaned}, Errores: ${errors.length}`);
      
      return {
        cleaned,
        errors
      };
      
    } catch (error) {
      console.error('❌ Error en limpieza de horóscopos personalizados antiguos:', error);
      throw error;
    }
  }

  /**
   * ⚡ NUEVA FUNCIONALIDAD ON-DEMAND
   * Carga o genera un horóscopo específico para un signo y fecha
   * Solo genera el horóscopo solicitado, no todos los signos
   */
  static async loadOrGenerateHoroscopeForSign(
    sign: ZodiacSignName,
    date: string,
    locale: Locale = 'es',
    period: HoroscopePeriod = 'daily'
  ): Promise<HoroscopeDetail | null> {
    const { getHoroscopeFlow } = await import('@/ai/flows/horoscope-flow');
    const { validateModel, getAllowedModel } = await import('@/ai/model-config');
    
    try {
      console.log(`🎯 CONSULTA ON-DEMAND: ${sign} - ${date} (${locale}) - ${period}`);
      
      // 1. Intentar cargar desde cache/BD primero
      let existingHoroscope: HoroscopeDetail | null = null;
      
      if (period === 'daily') {
        existingHoroscope = await this.loadHoroscopeForSign(sign, date, locale);
      } else if (period === 'weekly') {
        const weekKey = this.getWeekKey(new Date(date));
        existingHoroscope = await this.loadWeeklyHoroscopeForSign(sign, weekKey, locale);
      } else if (period === 'monthly') {
        const monthKey = this.getMonthKey(new Date(date));
        existingHoroscope = await this.loadMonthlyHoroscopeForSign(sign, monthKey, locale);
      }
      
      // 2. Si existe, retornarlo inmediatamente
      if (existingHoroscope) {
        console.log(`✅ CACHE HIT: Horóscopo ${period} para ${sign} ya existe`);
        return existingHoroscope;
      }
      
      // 3. Si no existe, generarlo ON-DEMAND
      console.log(`🤖 GENERANDO ON-DEMAND: ${period} para ${sign} - ${date} (${locale})`);
      
      // Validar modelo antes de generar
      const authorizedModel = getAllowedModel();
      validateModel(authorizedModel);
      console.log(`🔒 Modelo validado: ${authorizedModel}`);
      
      // Generar solo el horóscopo específico
      const result = await getHoroscopeFlow({
        sign,
        locale,
        targetDate: date
      }, period);
      
      const horoscopeData = result[period];
      
      if (!horoscopeData) {
        console.error(`❌ No se pudo generar horóscopo ${period} para ${sign}`);
        return null;
      }
      
      // 4. Guardar en BD para futuras consultas
      await this.saveIndividualHoroscope(sign, date, horoscopeData, locale, period);
      
      console.log(`✅ GENERADO Y GUARDADO: ${period} para ${sign} - ${date}`);
      return horoscopeData;
      
    } catch (error) {
      console.error(`❌ Error en loadOrGenerateHoroscopeForSign para ${sign}:`, error);
      return null;
    }
  }
  
  /**
   * Guarda un horóscopo individual (no todos los signos a la vez)
   */
  private static async saveIndividualHoroscope(
    sign: ZodiacSignName,
    date: string,
    horoscope: HoroscopeDetail,
    locale: Locale = 'es',
    period: HoroscopePeriod = 'daily'
  ): Promise<void> {
    try {
      this.validateFirestore();
      
      let docPath: string;
      let docRef;
      
      if (period === 'daily') {
        docPath = `horoscopes/daily/${date}/${locale}`;
      } else if (period === 'weekly') {
        const weekKey = this.getWeekKey(new Date(date));
        docPath = `horoscopes/weekly/${weekKey}/${locale}`;
      } else if (period === 'monthly') {
        const monthKey = this.getMonthKey(new Date(date));
        docPath = `horoscopes/monthly/${monthKey}/${locale}`;
      } else {
        throw new Error(`Período no soportado: ${period}`);
      }
      
      docRef = doc(db!, docPath);
      
      // Usar merge: true para solo actualizar el signo específico
      await setDoc(docRef, {
        [sign.toLowerCase()]: {
          main: horoscope.main,
          love: horoscope.love,
          money: horoscope.money,
          health: horoscope.health,
          generatedAt: new Date(),
        }
      }, { merge: true });
      
      console.log(`📝 Guardado horóscopo individual: ${sign} en ${docPath}`);
      
    } catch (error) {
      console.error('❌ Error guardando horóscopo individual:', error);
      throw error;
    }
  }

  // Funciones auxiliares para claves de tiempo (si no existen)
  private static getWeekKey(date: Date): string {
    const year = date.getFullYear();
    const week = this.getWeekNumber(date);
    return `${year}-W${week.toString().padStart(2, '0')}`;
  }
  
  private static getMonthKey(date: Date): string {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    return `${year}-${month.toString().padStart(2, '0')}`;
  }
  
  private static getWeekNumber(date: Date): number {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }
}
