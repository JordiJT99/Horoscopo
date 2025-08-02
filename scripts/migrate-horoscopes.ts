import { HoroscopeBatchGenerator } from '../src/lib/horoscope-batch-generator';
import { subDays, addDays } from 'date-fns';

/**
 * Script de migración para generar horóscopos históricos
 * Ejecutar con: npx tsx scripts/migrate-horoscopes.ts
 */
async function migrateHistoricalHoroscopes() {
  console.log('🚀 Iniciando migración de horóscopos históricos...');
  
  const today = new Date();
  
  try {
    // Generar horóscopos para los últimos 7 días
    console.log('📅 Generando horóscopos para los últimos 7 días...');
    for (let i = 7; i >= 1; i--) {
      const date = subDays(today, i);
      console.log(`⏳ Procesando ${date.toISOString().split('T')[0]}`);
      await HoroscopeBatchGenerator.generateCompleteHoroscopesForDate(date);
    }
    
    // Generar horóscopos para hoy
    console.log('📅 Generando horóscopos para hoy...');
    await HoroscopeBatchGenerator.generateCompleteHoroscopesForDate(today);
    
    // Generar horóscopos para los próximos 3 días
    console.log('📅 Generando horóscopos para los próximos 3 días...');
    for (let i = 1; i <= 3; i++) {
      const date = addDays(today, i);
      console.log(`⏳ Procesando ${date.toISOString().split('T')[0]}`);
      await HoroscopeBatchGenerator.generateCompleteHoroscopesForDate(date);
    }
    
    console.log('🎉 Migración completada exitosamente');
    console.log('💡 Tip: Configura un cron job para mantener los horóscopos actualizados');
    
  } catch (error) {
    console.error('❌ Error durante la migración:', error);
    process.exit(1);
  }
}

// Función para generar solo los próximos días (útil para testing)
async function generateNextDays(days: number = 7) {
  console.log(`🚀 Generando horóscopos para los próximos ${days} días...`);
  
  try {
    await HoroscopeBatchGenerator.generateHoroscopesForNextDays(days);
    console.log('✅ Generación completada');
  } catch (error) {
    console.error('❌ Error durante la generación:', error);
    process.exit(1);
  }
}

// Detectar argumentos de línea de comandos
const args = process.argv.slice(2);
const command = args[0];

if (command === 'next') {
  const days = parseInt(args[1]) || 7;
  generateNextDays(days);
} else if (command === 'historical' || !command) {
  migrateHistoricalHoroscopes();
} else {
  console.log('Uso:');
  console.log('  npx tsx scripts/migrate-horoscopes.ts [comando]');
  console.log('');
  console.log('Comandos:');
  console.log('  historical (default) - Migra horóscopos históricos y futuros');
  console.log('  next [días]          - Genera solo horóscopos futuros (default: 7 días)');
  console.log('');
  console.log('Ejemplos:');
  console.log('  npx tsx scripts/migrate-horoscopes.ts');
  console.log('  npx tsx scripts/migrate-horoscopes.ts next 3');
}
