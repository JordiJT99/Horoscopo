const fs = require('fs');
const path = require('path');

// Lista de idiomas faltantes que necesitan traducciones
const missingLocales = [
  'pt', 'it', 'ru', 'zh', 'ja', 'ko', 'ar', 'hi', 'th', 'vi', 'tr', 'pl', 'nl', 'sv', 'no', 'da', 'fi', 'cs', 'hu', 'ro', 'uk', 'el', 'he', 'fa', 'ur', 'id', 'sw', 'ta', 'te', 'mr', 'gu', 'kn'
];

const compatibilityFiles = [
  'src/lib/constantslove.ts',
  'src/lib/constantsfriendship.ts', 
  'src/lib/constantswork.ts'
];

function addMissingTranslations(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let totalAdditions = 0;
  
  // Buscar todas las secciones de report que tienen es, en, de, fr
  const reportSections = content.match(/report:\s*\{[^}]+\}/g);
  
  if (!reportSections) {
    console.log(`No se encontraron secciones de reporte en ${filePath}`);
    return 0;
  }
  
  reportSections.forEach(section => {
    // Buscar el texto en inglés para usar como fallback
    const englishMatch = section.match(/en:\s*"([^"]+)"/);
    if (englishMatch) {
      const englishText = englishMatch[1];
      
      // Agregar traducciones faltantes usando inglés como fallback con nota
      let newSection = section;
      
      missingLocales.forEach(locale => {
        if (!section.includes(`${locale}:`)) {
          // Agregar una nota indicando que es fallback
          const fallbackText = `${englishText} (Note: Translation not available, showing English version)`;
          newSection = newSection.replace(/(\s+fr:\s*"[^"]+")/, `$1,\n      ${locale}: "${fallbackText}"`);
          totalAdditions++;
        }
      });
      
      // Reemplazar la sección original con la nueva
      content = content.replace(section, newSection);
    }
  });
  
  // Escribir el archivo actualizado
  fs.writeFileSync(filePath, content, 'utf8');
  
  return totalAdditions;
}

console.log('Agregando traducciones de fallback para idiomas faltantes...\n');

let totalTranslations = 0;

compatibilityFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  
  if (fs.existsSync(filePath)) {
    console.log(`Procesando ${file}...`);
    const additions = addMissingTranslations(filePath);
    console.log(`  ✅ Agregadas ${additions} traducciones de fallback`);
    totalTranslations += additions;
  } else {
    console.log(`❌ Archivo no encontrado: ${file}`);
  }
});

console.log(`\n🎉 Total: ${totalTranslations} traducciones de fallback agregadas`);
console.log('\n💡 Ahora todos los idiomas tendrán al menos una explicación (en inglés con nota) en lugar de fallback silencioso.');
