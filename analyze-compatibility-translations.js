const fs = require('fs');
const path = require('path');

// Lista de todos los locales soportados
const allLocales = [
  'en', 'es', 'de', 'fr', 'pt', 'it', 'ru', 'zh', 'ja', 'ko', 'ar', 'hi', 'th', 'vi', 'tr', 'pl', 'nl', 'sv', 'no', 'da', 'fi', 'cs', 'hu', 'ro', 'uk', 'el', 'he', 'fa', 'ur', 'id', 'sw', 'ta', 'te', 'mr', 'gu', 'kn'
];

const compatibilityFiles = [
  'src/lib/constantslove.ts',
  'src/lib/constantsfriendship.ts',
  'src/lib/constantswork.ts'
];

console.log('Analizando archivos de compatibilidad para verificar traducciones...\n');

compatibilityFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`❌ Archivo no encontrado: ${file}`);
    return;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Buscar qué idiomas están presentes
  const presentLocales = [];
  allLocales.forEach(locale => {
    if (content.includes(`${locale}:`)) {
      presentLocales.push(locale);
    }
  });
  
  const missingLocales = allLocales.filter(locale => !presentLocales.includes(locale));
  
  console.log(`📁 ${file.split('/').pop()}:`);
  console.log(`  ✅ Idiomas presentes: ${presentLocales.join(', ')}`);
  console.log(`  ❌ Idiomas faltantes: ${missingLocales.join(', ')}`);
  console.log();
});

console.log('💡 Recomendación: Los archivos de compatibilidad necesitan traducciones para los idiomas faltantes.');
console.log('Para ahora, la app hace fallback a español, pero el usuario no lo sabe.');
