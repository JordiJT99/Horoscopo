#!/usr/bin/env node

// Script para corregir errores críticos de formato únicamente
const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../src/locales');
const files = fs.readdirSync(localesDir).filter(file => file.endsWith('.json'));

console.log('🔧 Buscando y corrigiendo errores críticos de formato...\n');

let totalCorrections = 0;

files.forEach(file => {
  const filePath = path.join(localesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  const locale = file.replace('.json', '');
  
  console.log(`📁 Verificando ${file}:`);
  
  let fileCorrections = 0;
  const originalContent = content;
  
  // 1. Detectar y corregir caracteres extraños/basura
  const beforeGarbage = content;
  content = content.replace(/z{3,}/gi, ''); // zzzzz o ZZZZ
  content = content.replace(/x{3,}/gi, ''); // xxxx
  content = content.replace(/q{3,}/gi, ''); // qqqq
  content = content.replace(/\?{3,}/g, ''); // ????
  content = content.replace(/!{3,}/g, ''); // !!!!
  content = content.replace(/#{3,}/g, ''); // ####
  const garbageRemoved = beforeGarbage !== content;
  
  if (garbageRemoved) {
    const garbageMatches = (originalContent.match(/[zxq\?\!#]{3,}/gi) || []).length;
    console.log(`  ✅ Eliminados ${garbageMatches} grupos de caracteres basura`);
    fileCorrections += garbageMatches;
  }
  
  // 2. Corregir placeholders mal formados
  const placeholderFixes = [
    { wrong: /\{signi\}/g, correct: '{sign1}', name: '{signi} → {sign1}' },
    { wrong: /\{sign2\}/g, correct: '{sign2}', name: 'verificar {sign2}' },
    { wrong: /\{sing1\}/g, correct: '{sign1}', name: '{sing1} → {sign1}' },
    { wrong: /\{sing2\}/g, correct: '{sign2}', name: '{sing2} → {sign2}' },
    { wrong: /\{sigh1\}/g, correct: '{sign1}', name: '{sigh1} → {sign1}' },
    { wrong: /\{sigh2\}/g, correct: '{sign2}', name: '{sigh2} → {sign2}' },
    { wrong: /\{sign 1\}/g, correct: '{sign1}', name: '{sign 1} → {sign1}' },
    { wrong: /\{sign 2\}/g, correct: '{sign2}', name: '{sign 2} → {sign2}' },
    { wrong: /\{ sign1\}/g, correct: '{sign1}', name: '{ sign1} → {sign1}' },
    { wrong: /\{ sign2\}/g, correct: '{sign2}', name: '{ sign2} → {sign2}' },
    { wrong: /\{sign1 \}/g, correct: '{sign1}', name: '{sign1 } → {sign1}' },
    { wrong: /\{sign2 \}/g, correct: '{sign2}', name: '{sign2 } → {sign2}' }
  ];
  
  placeholderFixes.forEach(fix => {
    const matches = (content.match(fix.wrong) || []).length;
    if (matches > 0) {
      content = content.replace(fix.wrong, fix.correct);
      console.log(`  ✅ Corregidos ${matches} placeholder(s): ${fix.name}`);
      fileCorrections += matches;
    }
  });
  
  // 3. Detectar patrones duplicados completos
  const duplicatePattern = /(\{sign1\}.*?\{sign2\}).*?(\{sign1\}.*?\{sign2\})/g;
  let duplicateMatches = 0;
  content = content.replace(duplicatePattern, (match, group1, group2) => {
    duplicateMatches++;
    return group1; // Mantener solo el primer grupo
  });
  
  if (duplicateMatches > 0) {
    console.log(`  ✅ Eliminados ${duplicateMatches} patrones de signo completamente duplicados`);
    fileCorrections += duplicateMatches;
  }
  
  // 4. Corregir comillas mal formadas
  const beforeQuotes = content;
  content = content.replace(/"/g, '"'); // Comillas curvas izquierda
  content = content.replace(/"/g, '"'); // Comillas curvas derecha
  content = content.replace(/'/g, "'"); // Apostrofes curvos
  const quotesFixed = beforeQuotes !== content;
  
  if (quotesFixed) {
    console.log(`  ✅ Corregidas comillas mal formadas`);
    fileCorrections++;
  }
  
  // 5. Eliminar espacios extra alrededor de placeholders
  const beforeSpaces = content;
  content = content.replace(/\s+\{/g, ' {'); // Múltiples espacios antes de {
  content = content.replace(/\}\s+/g, '} '); // Múltiples espacios después de }
  const spacesFixed = beforeSpaces !== content;
  
  if (spacesFixed) {
    console.log(`  ✅ Corregidos espacios extra alrededor de placeholders`);
    fileCorrections++;
  }
  
  // 6. Detectar y reportar JSON mal formado
  let isValidJSON = true;
  try {
    JSON.parse(content);
  } catch (e) {
    console.log(`  ❌ ERROR JSON: ${e.message}`);
    isValidJSON = false;
  }
  
  // 7. Detectar valores completamente vacíos
  const emptyValues = (content.match(/:\s*""\s*,/g) || []).length;
  if (emptyValues > 0) {
    console.log(`  ⚠️  Detectados ${emptyValues} valores completamente vacíos`);
  }
  
  // 8. Detectar keys duplicadas (esto rompería el JSON)
  const keyMatches = content.match(/"[^"]+"\s*:/g) || [];
  const keys = keyMatches.map(k => k.replace(/[":]/g, '').trim());
  const duplicateKeys = keys.filter((key, index) => keys.indexOf(key) !== index);
  if (duplicateKeys.length > 0) {
    console.log(`  ❌ KEYS DUPLICADAS: ${duplicateKeys.join(', ')}`);
  }
  
  // Guardar archivo solo si hay correcciones Y es JSON válido
  if (fileCorrections > 0 && isValidJSON) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  💾 Archivo guardado con ${fileCorrections} correcciones`);
  } else if (fileCorrections > 0 && !isValidJSON) {
    console.log(`  ⚠️  No se guardó por errores de JSON`);
    fileCorrections = 0; // No contar correcciones si no se pudo guardar
  } else {
    console.log(`  ✅ Sin errores críticos de formato`);
  }
  
  totalCorrections += fileCorrections;
  console.log('');
});

console.log(`🎯 RESUMEN FINAL:`);
console.log(`   Total archivos procesados: ${files.length}`);
console.log(`   Total correcciones críticas: ${totalCorrections}`);

if (totalCorrections > 0) {
  console.log(`   🎉 ¡Errores críticos de formato corregidos!`);
} else {
  console.log(`   ✅ No se encontraron errores críticos de formato`);
}
