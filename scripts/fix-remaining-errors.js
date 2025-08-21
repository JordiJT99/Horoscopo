#!/usr/bin/env node

// Script para corregir errores específicos con mejor manejo de errores
const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../src/locales');

console.log('🔧 Corrigiendo errores específicos restantes...\n');

// Lista de archivos que necesitan corrección específica basado en el error anterior
const filesToFix = ['fi.json', 'fr.json', 'gu.json', 'he.json', 'hi.json', 'hu.json', 'id.json', 'it.json', 'ja.json', 'kn.json', 'ko.json', 'mr.json', 'nl.json', 'no.json', 'pl.json', 'pt.json', 'ro.json', 'ru.json', 'sv.json', 'sw.json', 'ta.json', 'te.json', 'th.json', 'tr.json', 'uk.json', 'ur.json', 'vi.json', 'zh-CN.json'];

let totalCorrections = 0;

filesToFix.forEach(file => {
  const filePath = path.join(localesDir, file);
  
  // Verificar que el archivo existe
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  ${file} no existe, saltando...`);
    return;
  }
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const locale = file.replace('.json', '');
    
    console.log(`📁 Corrigiendo ${file}:`);
    
    let fileCorrections = 0;
    const originalContent = content;
    
    // Corrección 1: Placeholders duplicados específicos
    const fixes = [
      { pattern: /\{signName\}\s+[^{}]*\s+\{signName\}/g, replacement: '{signName}', name: 'signName duplicados' },
      { pattern: /\{userName\}\s+[^{}]*\s+\{userName\}/g, replacement: '{userName}', name: 'userName duplicados' },
      { pattern: /\{date\}\s+[^{}]*\s+\{date\}/g, replacement: '{date}', name: 'date duplicados' },
      { pattern: /\{year\}\s+[^{}]*\s+\{year\}/g, replacement: '{year}', name: 'year duplicados' },
      { pattern: /\{signName\}Z\b/g, replacement: '{signName}', name: 'signName con Z extra' }
    ];
    
    fixes.forEach(fix => {
      const before = content;
      content = content.replace(fix.pattern, fix.replacement);
      if (content !== before) {
        const matches = (before.match(fix.pattern) || []).length;
        console.log(`  ✅ Corregidos ${matches} casos: ${fix.name}`);
        fileCorrections += matches;
      }
    });
    
    // Correcciones específicas por idioma
    if (locale === 'fr') {
      // Francés específico
      const frenchFixes = [
        { pattern: /horoscopo/g, replacement: 'horoscope', name: 'español → francés' },
        { pattern: /COSMIC PRÉVENCES/g, replacement: 'PRÉVISIONS COSMIQUES', name: 'traducción francesa' },
        { pattern: /Journoscopo du journal/g, replacement: 'Horoscope quotidien de', name: 'texto mal traducido' }
      ];
      
      frenchFixes.forEach(fix => {
        const before = content;
        content = content.replace(fix.pattern, fix.replacement);
        if (content !== before) {
          const matches = (before.match(fix.pattern) || []).length;
          console.log(`  ✅ Corregidos ${matches} casos: ${fix.name}`);
          fileCorrections += matches;
        }
      });
    }
    
    if (locale === 'zh-CN') {
      // Chino específico
      const chineseFixes = [
        { pattern: /ph000 SPERI所以知道/g, replacement: '第', name: 'texto corrupto chino' }
      ];
      
      chineseFixes.forEach(fix => {
        const before = content;
        content = content.replace(fix.pattern, fix.replacement);
        if (content !== before) {
          const matches = (before.match(fix.pattern) || []).length;
          console.log(`  ✅ Corregidos ${matches} casos: ${fix.name}`);
          fileCorrections += matches;
        }
      });
    }
    
    // Validar JSON
    try {
      JSON.parse(content);
    } catch (e) {
      console.log(`  ❌ Error de JSON: ${e.message}`);
      content = originalContent; // Revertir
      fileCorrections = 0;
    }
    
    // Guardar solo si hay cambios
    if (fileCorrections > 0) {
      // Usar writeFile síncrono con try-catch
      try {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`  💾 Archivo guardado con ${fileCorrections} correcciones`);
        totalCorrections += fileCorrections;
      } catch (writeError) {
        console.log(`  ❌ Error al guardar: ${writeError.message}`);
      }
    } else {
      console.log(`  ✅ Sin errores específicos para corregir`);
    }
    
  } catch (error) {
    console.log(`  ❌ Error procesando ${file}: ${error.message}`);
  }
  
  console.log('');
});

console.log(`🎯 RESUMEN FINAL:`);
console.log(`   Total correcciones aplicadas: ${totalCorrections}`);

if (totalCorrections > 0) {
  console.log(`   🎉 ¡Errores específicos corregidos exitosamente!`);
} else {
  console.log(`   ✅ No se encontraron más errores para corregir`);
}
