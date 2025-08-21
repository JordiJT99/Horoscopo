#!/usr/bin/env node

// Script para verificar errores comunes en los archivos de traducción
const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../src/locales');
const files = fs.readdirSync(localesDir).filter(file => file.endsWith('.json'));

console.log('🔍 Revisando errores en archivos de traducción...\n');

let totalErrors = 0;

files.forEach(file => {
  const filePath = path.join(localesDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  const locale = file.replace('.json', '');
  
  console.log(`📁 Revisando ${file}:`);
  
  let fileErrors = 0;
  
  // 1. Buscar patrones duplicados como {sign1} {sign2} {sign1} {sign2}
  const duplicateSignPatterns = content.match(/\{sign1\}.*\{sign2\}.*\{sign1\}.*\{sign2\}/g);
  if (duplicateSignPatterns) {
    console.log(`  ❌ Patrones de signo duplicados: ${duplicateSignPatterns.length}`);
    fileErrors += duplicateSignPatterns.length;
  }
  
  // 2. Buscar patrones rotos como {signi}
  const brokenPatterns = content.match(/\{signi\}/g);
  if (brokenPatterns) {
    console.log(`  ❌ Patrones rotos {signi}: ${brokenPatterns.length}`);
    fileErrors += brokenPatterns.length;
  }
  
  // 3. Buscar texto sin traducir (inglés en otros idiomas)
  if (locale !== 'en') {
    const englishWords = [
      'Compatibility', 'Sign information', 'Further', 'Friendship', 'Love',
      'Work', 'Astrology', 'Horoscope', 'Zodiac', 'Tarot'
    ];
    
    englishWords.forEach(word => {
      if (content.includes(word) && !content.includes(`"${word}"`)) {
        const matches = (content.match(new RegExp(word, 'gi')) || []).length;
        if (matches > 0) {
          console.log(`  ⚠️  Posible texto sin traducir "${word}": ${matches} ocurrencias`);
          fileErrors += matches;
        }
      }
    });
  }
  
  // 4. Buscar caracteres extraños como "zzzzzzz"
  const strangeChars = content.match(/z{3,}|x{3,}|a{4,}/gi);
  if (strangeChars) {
    console.log(`  ❌ Caracteres extraños: ${strangeChars.join(', ')}`);
    fileErrors += strangeChars.length;
  }
  
  // 5. Verificar estructura JSON
  try {
    JSON.parse(content);
  } catch (e) {
    console.log(`  ❌ Error de sintaxis JSON: ${e.message}`);
    fileErrors++;
  }
  
  if (fileErrors === 0) {
    console.log(`  ✅ Sin errores detectados`);
  } else {
    console.log(`  📊 Total errores en este archivo: ${fileErrors}`);
  }
  
  totalErrors += fileErrors;
  console.log('');
});

console.log(`🎯 RESUMEN FINAL:`);
console.log(`   Total archivos revisados: ${files.length}`);
console.log(`   Total errores encontrados: ${totalErrors}`);

if (totalErrors === 0) {
  console.log(`   🎉 ¡Todos los archivos están limpios!`);
} else {
  console.log(`   🔧 Se requiere corrección en los archivos`);
}
