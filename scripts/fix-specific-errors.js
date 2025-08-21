#!/usr/bin/env node

// Script para corregir errores específicos encontrados en los archivos
const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../src/locales');
const files = fs.readdirSync(localesDir).filter(file => file.endsWith('.json'));

console.log('🔧 Corrigiendo errores específicos encontrados...\n');

let totalCorrections = 0;

// Correcciones específicas que encontramos
const specificFixes = [
  // Problema: placeholders duplicados
  { pattern: /\{year\}([^}]*)\{year\}/g, replacement: '{year}', description: 'placeholders {year} duplicados' },
  { pattern: /\{signName\}([^}]*)\{signName\}/g, replacement: '{signName}', description: 'placeholders {signName} duplicados' },
  { pattern: /\{userName\}([^}]*)\{userName\}/g, replacement: '{userName}', description: 'placeholders {userName} duplicados' },
  { pattern: /\{date\}([^}]*)\{date\}/g, replacement: '{date}', description: 'placeholders {date} duplicados' },
  { pattern: /\{phaseName\}([^}]*)\{phaseName\}/g, replacement: '{phaseName}', description: 'placeholders {phaseName} duplicados' },
  { pattern: /\{illumination\}([^}]*)\{illumination\}/g, replacement: '{illumination}', description: 'placeholders {illumination} duplicados' },
  { pattern: /\{currentStep\}([^}]*)\{totalSteps\}/g, replacement: '{currentStep} de {totalSteps}', description: 'formato de pasos' },
  
  // Problema: caracteres extraños al final de placeholders
  { pattern: /\{signName\}Z/g, replacement: '{signName}', description: 'carácter Z extra después de placeholder' },
  
  // Problema: texto mixto (español en francés)
  { pattern: /"([^"]*) horoscopo ([^"]*)"/g, replacement: '"$1 horoscope $2"', description: 'palabra española en francés' },
  
  // Problema: texto extraño
  { pattern: /"ph000 SPERI所以知道/g, replacement: '"Paso', description: 'texto corrupto en chino' },
  { pattern: /Journoscopo du journal/g, replacement: 'Horoscope quotidien de', description: 'texto mal traducido en francés' }
];

files.forEach(file => {
  const filePath = path.join(localesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  const locale = file.replace('.json', '');
  
  console.log(`📁 Corrigiendo ${file}:`);
  
  let fileCorrections = 0;
  const originalContent = content;
  
  // Aplicar cada corrección específica
  specificFixes.forEach(fix => {
    const matches = (content.match(fix.pattern) || []).length;
    if (matches > 0) {
      content = content.replace(fix.pattern, fix.replacement);
      console.log(`  ✅ Corregidos ${matches} casos: ${fix.description}`);
      fileCorrections += matches;
    }
  });
  
  // Correcciones específicas por idioma
  if (locale === 'fr') {
    // Francés: corregir "COSMIC PRÉVENCES" que debería ser "PRÉVISIONS COSMIQUES"
    const cosmicMatches = (content.match(/COSMIC PRÉVENCES/g) || []).length;
    if (cosmicMatches > 0) {
      content = content.replace(/COSMIC PRÉVENCES/g, 'PRÉVISIONS COSMIQUES');
      console.log(`  ✅ Corregidos ${cosmicMatches} casos: COSMIC PRÉVENCES → PRÉVISIONS COSMIQUES`);
      fileCorrections += cosmicMatches;
    }
  }
  
  if (locale === 'zh-CN') {
    // Chino: corregir texto corrupto específico
    const corruptMatches = (content.match(/ph000 SPERI所以知道/g) || []).length;
    if (corruptMatches > 0) {
      content = content.replace(/ph000 SPERI所以知道/g, '第');
      console.log(`  ✅ Corregidos ${corruptMatches} casos: texto corrupto → 第`);
      fileCorrections += corruptMatches;
    }
  }
  
  // Validar JSON después de las correcciones
  try {
    JSON.parse(content);
  } catch (e) {
    console.log(`  ❌ Error de JSON después de correcciones: ${e.message}`);
    content = originalContent; // Revertir cambios
    fileCorrections = 0;
  }
  
  // Guardar archivo solo si hay correcciones
  if (fileCorrections > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  💾 Archivo guardado con ${fileCorrections} correcciones`);
  } else {
    console.log(`  ✅ Sin errores específicos encontrados`);
  }
  
  totalCorrections += fileCorrections;
  console.log('');
});

console.log(`🎯 RESUMEN FINAL:`);
console.log(`   Total archivos procesados: ${files.length}`);
console.log(`   Total correcciones específicas: ${totalCorrections}`);

if (totalCorrections > 0) {
  console.log(`   🎉 ¡Errores específicos corregidos!`);
} else {
  console.log(`   ✅ No se encontraron errores específicos para corregir`);
}
