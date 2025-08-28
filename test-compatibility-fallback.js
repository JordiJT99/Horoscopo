// Test script para verificar el fallback de compatibilidad
import { getCompatibility } from './src/lib/constants.js';

// Simular la importación de tipos (en un script real necesitarías import)
const testCombinations = [
  { sign1: 'Aries', sign2: 'Leo', type: 'love' },
  { sign1: 'Taurus', sign2: 'Cancer', type: 'friendship' }
];

const testLocales = ['es', 'en', 'de', 'fr', 'pt', 'it', 'ja', 'ko', 'hi'];

console.log('🧪 Probando fallbacks de compatibilidad zodiacal...\n');

testCombinations.forEach(({ sign1, sign2, type }) => {
  console.log(`\n🔮 ${sign1} & ${sign2} (${type}):`);
  
  testLocales.forEach(locale => {
    try {
      const result = getCompatibility(sign1, sign2, type, locale);
      const hasNote = result.report.includes('Translation not available') || 
                     result.report.includes('不可用') || 
                     result.report.includes('उपलब्ध नहीं');
      
      console.log(`  ${locale}: ${hasNote ? '🔄 Fallback' : '✅ Native'} - ${result.report.substring(0, 50)}...`);
    } catch (error) {
      console.log(`  ${locale}: ❌ Error - ${error.message}`);
    }
  });
});

console.log('\n💡 Ahora los usuarios sabrán cuando están viendo un fallback!');
