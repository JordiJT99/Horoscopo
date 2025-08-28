# Sistema de Horóscopos con Firestore - Guía de Implementación

## Descripción General
Esta guía explica cómo implementar un sistema completo para guardar horóscopos generados por IA en Firestore, cargarlos para todos los usuarios, y actualizarlos diariamente de forma automática.

## Estructura de Firestore

### Colecciones Propuestas

```
horoscopes/
├── daily/
│   └── {YYYY-MM-DD}/
│       ├── es/
│       │   ├── aries: { main, love, money, health, generatedAt, sign }
│       │   ├── taurus: { main, love, money, health, generatedAt, sign }
│       │   └── ... (12 signos)
│       ├── en/
│       │   └── ... (12 signos)
│       └── ... (otros idiomas)
├── weekly/
│   └── {YYYY-WW}/
│       └── [estructura similar por idioma]
└── monthly/
    └── {YYYY-MM}/
        └── [estructura similar por idioma]
```

## Paso 1: Configurar Tipos y Esquemas

### 1.1 Agregar Tipos a types/index.ts

```typescript
// Agregar estos tipos al final de src/types/index.ts

export interface FirestoreHoroscopeData {
  main: string;
  love: string;
  money: string;
  health: string;
  generatedAt: Date;
  sign: ZodiacSignName;
}

export interface DailyHoroscopeDocument {
  [key: string]: FirestoreHoroscopeData; // key = sign name en minúscula
}

export type HoroscopePeriod = 'daily' | 'weekly' | 'monthly';

export interface HoroscopeGenerationJob {
  id: string;
  date: string;
  period: HoroscopePeriod;
  locale: Locale;
  status: 'pending' | 'processing' | 'completed' | 'error';
  createdAt: Date;
  completedAt?: Date;
  error?: string;
}
```

## Paso 2: Crear Servicio de Firestore

### 2.1 Crear lib/horoscope-firestore-service.ts

```typescript
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
   * Guarda horóscopos para todos los signos en una fecha específica
   */
  static async saveDailyHoroscopes(
    date: string, // YYYY-MM-DD
    horoscopes: Record<ZodiacSignName, HoroscopeDetail>,
    locale: Locale = 'es'
  ): Promise<void> {
    try {
      const batch = writeBatch(db);
      const dailyDocRef = doc(db, 'horoscopes', 'daily', date, locale);
      
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
      const dailyDocRef = doc(db, 'horoscopes', 'daily', date, locale);
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
      const dailyDocRef = doc(db, 'horoscopes', 'daily', date, locale);
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
      const allHoroscopes = await this.loadDailyHoroscopes(date, locale);
      return allHoroscopes?.[sign] || null;
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
      const batch = writeBatch(db);
      const weeklyDocRef = doc(db, 'horoscopes', 'weekly', weekKey, locale);
      
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
   * Guarda horóscopos mensuales
   */
  static async saveMonthlyHoroscopes(
    monthKey: string, // YYYY-MM
    horoscopes: Record<ZodiacSignName, HoroscopeDetail>,
    locale: Locale = 'es'
  ): Promise<void> {
    try {
      const batch = writeBatch(db);
      const monthlyDocRef = doc(db, 'horoscopes', 'monthly', monthKey, locale);
      
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
}
```

## Paso 3: Modificar el Flow de Horóscopos

### 3.1 Actualizar horoscope-flow.ts

```typescript
// Agregar estas importaciones al inicio del archivo
import { HoroscopeFirestoreService } from '@/lib/horoscope-firestore-service';
import { format, getISOWeek, getYear } from 'date-fns';

// Modificar la función getHoroscopeFlow para integrar Firestore
export async function getHoroscopeFlow(input: PublicHoroscopeFlowInput): Promise<HoroscopeFlowOutput> {
  const { sign, locale = 'es', targetDate, onboardingData } = input;
  
  const today = targetDate ? new Date(targetDate) : new Date();
  const dateKey = format(today, 'yyyy-MM-dd');
  const weekKey = `${getYear(today)}-${getISOWeek(today).toString().padStart(2, '0')}`;
  const monthKey = format(today, 'yyyy-MM');

  try {
    // Intentar cargar desde Firestore primero
    const [dailyFromDB, weeklyFromDB, monthlyFromDB] = await Promise.all([
      HoroscopeFirestoreService.loadHoroscopeForSign(sign, dateKey, locale),
      loadWeeklyHoroscopeForSign(sign, weekKey, locale),
      loadMonthlyHoroscopeForSign(sign, monthKey, locale),
    ]);

    // Si todos están disponibles en BD, usarlos
    if (dailyFromDB && weeklyFromDB && monthlyFromDB) {
      console.log(`✅ Cargando horóscopos desde Firestore para ${sign}`);
      return {
        daily: dailyFromDB,
        weekly: weeklyFromDB,
        monthly: monthlyFromDB,
      };
    }

    // Si no están en BD, generar con IA y guardar
    console.log(`🤖 Generando horóscopos con IA para ${sign}`);
    const aiGenerated = await generateHoroscopesWithAI(sign, locale, onboardingData);
    
    // Guardar los horóscopos generados (en background)
    await saveGeneratedHoroscopes(sign, aiGenerated, dateKey, weekKey, monthKey, locale);
    
    return aiGenerated;
    
  } catch (error) {
    console.error('❌ Error en getHoroscopeFlow:', error);
    // Fallback a mocks
    return getRandomMockHoroscope();
  }
}

// Funciones auxiliares
async function loadWeeklyHoroscopeForSign(sign: ZodiacSignName, weekKey: string, locale: Locale) {
  // Implementar lógica similar para weekly
  // ...
}

async function loadMonthlyHoroscopeForSign(sign: ZodiacSignName, monthKey: string, locale: Locale) {
  // Implementar lógica similar para monthly
  // ...
}

async function saveGeneratedHoroscopes(
  sign: ZodiacSignName, 
  horoscopes: HoroscopeFlowOutput,
  dateKey: string,
  weekKey: string,
  monthKey: string,
  locale: Locale
) {
  try {
    // Crear un objeto con todos los signos (necesario para el batch save)
    const allSignsDaily: Record<ZodiacSignName, HoroscopeDetail> = {} as Record<ZodiacSignName, HoroscopeDetail>;
    allSignsDaily[sign] = horoscopes.daily;
    
    // Solo guardar si no existe ya para esta fecha
    const exists = await HoroscopeFirestoreService.horoscopesExistForDate(dateKey, locale);
    if (!exists) {
      await HoroscopeFirestoreService.saveDailyHoroscopes(dateKey, allSignsDaily, locale);
    }
  } catch (error) {
    console.error('❌ Error guardando horóscopos generados:', error);
  }
}
```

## Paso 4: Crear Sistema de Generación Masiva

### 4.1 Crear lib/horoscope-batch-generator.ts

```typescript
import { HoroscopeFirestoreService } from './horoscope-firestore-service';
import { getHoroscopeFlow } from '@/ai/flows/horoscope-flow';
import { ALL_SIGN_NAMES } from './constants';
import { format, addDays, getISOWeek, getYear } from 'date-fns';
import type { ZodiacSignName, Locale, HoroscopeDetail } from '@/types';

export class HoroscopeBatchGenerator {
  
  /**
   * Genera horóscopos diarios para todos los signos y idiomas
   */
  static async generateDailyHoroscopesForDate(
    date: Date,
    locales: Locale[] = ['es', 'en', 'de', 'fr']
  ): Promise<void> {
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
   * Genera horóscopos para los próximos N días
   */
  static async generateHoroscopesForNextDays(
    days: number = 7,
    locales: Locale[] = ['es', 'en', 'de', 'fr']
  ): Promise<void> {
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
    const tomorrow = addDays(new Date(), 1);
    await this.generateDailyHoroscopesForDate(tomorrow);
  }
}
```

## Paso 5: Crear API Routes

### 5.1 Crear app/api/horoscopes/generate/route.ts

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { HoroscopeBatchGenerator } from '@/lib/horoscope-batch-generator';

export async function POST(request: NextRequest) {
  try {
    const { date, days, locales } = await request.json();
    
    if (date) {
      // Generar para una fecha específica
      await HoroscopeBatchGenerator.generateDailyHoroscopesForDate(
        new Date(date),
        locales || ['es', 'en', 'de', 'fr']
      );
    } else if (days) {
      // Generar para los próximos N días
      await HoroscopeBatchGenerator.generateHoroscopesForNextDays(
        days,
        locales || ['es', 'en', 'de', 'fr']
      );
    } else {
      // Generar para mañana por defecto
      await HoroscopeBatchGenerator.generateTomorrowHoroscopes();
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Horóscopos generados exitosamente' 
    });
    
  } catch (error) {
    console.error('Error en API de generación:', error);
    return NextResponse.json(
      { error: 'Error generando horóscopos' },
      { status: 500 }
    );
  }
}
```

### 5.2 Crear app/api/horoscopes/[date]/route.ts

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { HoroscopeFirestoreService } from '@/lib/horoscope-firestore-service';

export async function GET(
  request: NextRequest,
  { params }: { params: { date: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'es';
    const { date } = params;

    const horoscopes = await HoroscopeFirestoreService.loadDailyHoroscopes(
      date,
      locale as any
    );

    if (!horoscopes) {
      return NextResponse.json(
        { error: 'Horóscopos no encontrados para esta fecha' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      date,
      locale,
      horoscopes 
    });
    
  } catch (error) {
    console.error('Error cargando horóscopos:', error);
    return NextResponse.json(
      { error: 'Error cargando horóscopos' },
      { status: 500 }
    );
  }
}
```

## Paso 6: Actualizar Componentes Existentes

### 6.1 Modificar el hook use-horoscope (si existe) o crear uno nuevo

```typescript
// hooks/use-horoscope-from-db.ts
import { useState, useEffect } from 'react';
import type { ZodiacSignName, Locale, HoroscopeDetail } from '@/types';

export function useHoroscopeFromDB(sign: ZodiacSignName, locale: Locale, date?: string) {
  const [horoscope, setHoroscope] = useState<HoroscopeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHoroscope() {
      try {
        setLoading(true);
        const targetDate = date || new Date().toISOString().split('T')[0];
        
        const response = await fetch(`/api/horoscopes/${targetDate}?locale=${locale}`);
        
        if (!response.ok) {
          throw new Error('Error cargando horóscopo');
        }
        
        const data = await response.json();
        setHoroscope(data.horoscopes[sign] || null);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    }

    fetchHoroscope();
  }, [sign, locale, date]);

  return { horoscope, loading, error };
}
```

## Paso 7: Configurar Tareas Automáticas

### 7.1 Crear script para cron job

```bash
# scripts/generate-daily-horoscopes.sh
#!/bin/bash

# Script para generar horóscopos diarios (ejecutar con cron a las 00:00)
curl -X POST "https://tu-dominio.com/api/horoscopes/generate" \
  -H "Content-Type: application/json" \
  -d '{"days": 1}' \
  || echo "Error generando horóscopos diarios"
```

### 7.2 Configurar crontab

```bash
# Ejecutar todos los días a las 00:00
0 0 * * * /path/to/scripts/generate-daily-horoscopes.sh

# O generar para varios días adelante cada semana
0 0 * * 0 /path/to/scripts/generate-weekly-batch.sh
```

### 7.3 Alternativa con Vercel Cron (si usas Vercel)

```typescript
// app/api/cron/generate-horoscopes/route.ts
import { NextResponse } from 'next/server';
import { HoroscopeBatchGenerator } from '@/lib/horoscope-batch-generator';

export async function GET() {
  try {
    await HoroscopeBatchGenerator.generateTomorrowHoroscopes();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate horoscopes' }, { status: 500 });
  }
}
```

## Paso 8: Configurar Reglas de Firestore

### 8.1 Actualizar firestore.rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir lectura pública de horóscopos
    match /horoscopes/{period}/{dateKey}/{locale} {
      allow read: if true;
      allow write: if false; // Solo desde el backend
    }
    
    // Resto de tus reglas existentes...
  }
}
```

## Paso 9: Migración y Testing

### 9.1 Script de migración inicial

```typescript
// scripts/migrate-horoscopes.ts
import { HoroscopeBatchGenerator } from '@/lib/horoscope-batch-generator';
import { subDays } from 'date-fns';

async function migrateHistoricalHoroscopes() {
  const today = new Date();
  
  // Generar horóscopos para los últimos 7 días
  for (let i = 7; i >= 0; i--) {
    const date = subDays(today, i);
    await HoroscopeBatchGenerator.generateDailyHoroscopesForDate(date);
  }
  
  console.log('Migración completada');
}

migrateHistoricalHoroscopes();
```

### 9.2 Testing

```typescript
// tests/horoscope-firestore.test.ts
import { HoroscopeFirestoreService } from '@/lib/horoscope-firestore-service';

describe('HoroscopeFirestoreService', () => {
  test('should save and load horoscopes', async () => {
    const testDate = '2025-08-02';
    const testHoroscopes = {
      Aries: {
        main: 'Test main',
        love: 'Test love',
        money: 'Test money',
        health: 'Test health'
      }
      // ... otros signos
    };
    
    await HoroscopeFirestoreService.saveDailyHoroscopes(testDate, testHoroscopes);
    const loaded = await HoroscopeFirestoreService.loadDailyHoroscopes(testDate);
    
    expect(loaded).toEqual(testHoroscopes);
  });
});
```

## Paso 10: Monitoreo y Optimización

### 10.1 Agregar logs y métricas

```typescript
// lib/horoscope-analytics.ts
export class HoroscopeAnalytics {
  static logGeneration(sign: string, period: string, success: boolean) {
    console.log(`📊 ${success ? '✅' : '❌'} ${period} horoscope for ${sign}`);
    // Enviar a analytics si tienes configurado
  }
  
  static logDatabaseAccess(type: 'read' | 'write', date: string, locale: string) {
    console.log(`🗄️ ${type.toUpperCase()} horoscopes for ${date} (${locale})`);
  }
}
```

### 10.2 Cache adicional (opcional)

```typescript
// lib/horoscope-cache.ts
const cache = new Map<string, any>();

export class HoroscopeCache {
  static getCacheKey(date: string, locale: string): string {
    return `horoscopes:${date}:${locale}`;
  }
  
  static get(date: string, locale: string) {
    return cache.get(this.getCacheKey(date, locale));
  }
  
  static set(date: string, locale: string, data: any) {
    cache.set(this.getCacheKey(date, locale), data);
    // Limpiar cache antiguo después de 24 horas
    setTimeout(() => {
      cache.delete(this.getCacheKey(date, locale));
    }, 24 * 60 * 60 * 1000);
  }
}
```

## Resumen de Pasos de Implementación

1. ✅ **Configurar tipos** - Agregar interfaces para Firestore
2. ✅ **Crear servicio Firestore** - HoroscopeFirestoreService
3. ✅ **Modificar flow de IA** - Integrar carga/guardado desde BD
4. ✅ **Crear generador batch** - Para generar todos los signos de una vez
5. ✅ **Configurar API routes** - Para endpoints públicos
6. ✅ **Actualizar componentes** - Para usar BD en lugar de mocks
7. ✅ **Configurar cron jobs** - Para generación automática diaria
8. ✅ **Configurar reglas Firestore** - Seguridad de acceso
9. ✅ **Migrar datos existentes** - Script de migración inicial
10. ✅ **Testing y monitoreo** - Verificar funcionamiento

## Beneficios del Sistema

- **📈 Escalabilidad**: Todos los usuarios comparten los mismos horóscopos
- **⚡ Performance**: Carga instantánea desde BD vs generación por IA
- **💰 Costo reducido**: Menos llamadas a APIs de IA
- **🌍 Multiidioma**: Soporte nativo para múltiples locales
- **🔄 Actualización automática**: Cron jobs generan contenido fresco diariamente
- **📱 Offline ready**: Los horóscopos están siempre disponibles
- **🔧 Mantenible**: Arquitectura clara y separación de responsabilidades

## Próximos Pasos Opcionales

- Implementar notificaciones push cuando estén listos los horóscopos del día
- Crear dashboard admin para monitorear generación
- Agregar analytics sobre qué signos son más consultados
- Implementar cache distribuido para mejor performance
- Crear sistema de fallbacks por si falla la generación IA
