#!/usr/bin/env node

// Script para corregir placeholders mal formateados
const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../src/locales');
const files = fs.readdirSync(localesDir).filter(file => file.endsWith('.json'));

console.log('🔧 Corrigiendo placeholders mal formateados...\n');

let totalCorrections = 0;

// Mapeo de placeholders incorrectos a correctos
const placeholderFixes = [
  // Placeholders generales
  { wrong: /<<< ph_0 >>>/g, correct: '{signName}', name: 'ph_0 → signName' },
  { wrong: /<<< ph_1 >>>/g, correct: '{sign2}', name: 'ph_1 → sign2' },
  { wrong: /<<< Ph_0 >>>/g, correct: '{year}', name: 'Ph_0 → year' },
  
  // Para compatibilidad específicamente
  { wrong: /<<< ph_0 >>> & <<< ph_1 >>>/g, correct: '{sign1} & {sign2}', name: 'compatibilidad ph_0 & ph_1' },
  
  // Otros formatos incorrectos
  { wrong: /<<<\s*ph_0\s*>>>/g, correct: '{signName}', name: 'ph_0 con espacios' },
  { wrong: /<<<\s*ph_1\s*>>>/g, correct: '{sign2}', name: 'ph_1 con espacios' },
  { wrong: /<<<\s*Ph_0\s*>>>/g, correct: '{year}', name: 'Ph_0 con espacios' },
];

files.forEach(file => {
  const filePath = path.join(localesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  const locale = file.replace('.json', '');
  
  console.log(`📁 Corrigiendo ${file}:`);
  
  let fileCorrections = 0;
  const originalContent = content;
  
  // Aplicar cada corrección
  placeholderFixes.forEach(fix => {
    const matches = (content.match(fix.wrong) || []).length;
    if (matches > 0) {
      content = content.replace(fix.wrong, fix.correct);
      console.log(`  ✅ Corregidos ${matches} casos: ${fix.name}`);
      fileCorrections += matches;
    }
  });
  
  // Correcciones específicas por contexto
  if (content.includes('Love compatibility:')) {
    // Asegurar que la compatibilidad use sign1 y sign2
    const compatibilityPattern = /"CompatibilitySection\.reportTitle\.love":\s*"Love compatibility: ([^"]+)"/;
    const match = content.match(compatibilityPattern);
    if (match && !match[1].includes('{sign1}')) {
      content = content.replace(compatibilityPattern, '"CompatibilitySection.reportTitle.love": "Love compatibility: {sign1} & {sign2}"');
      console.log(`  ✅ Corregida compatibilidad de amor específicamente`);
      fileCorrections++;
    }
  }
  
  // Validar JSON
  try {
    JSON.parse(content);
  } catch (e) {
    console.log(`  ❌ Error de JSON: ${e.message}`);
    content = originalContent; // Revertir
    fileCorrections = 0;
  }
  
  // Guardar si hay cambios
  if (fileCorrections > 0) {
    try {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`  💾 Archivo guardado con ${fileCorrections} correcciones`);
      totalCorrections += fileCorrections;
    } catch (writeError) {
      console.log(`  ❌ Error al guardar: ${writeError.message}`);
    }
  } else {
    console.log(`  ✅ Sin placeholders incorrectos encontrados`);
  }
  
  console.log('');
});

console.log(`🎯 RESUMEN FINAL:`);
console.log(`   Total correcciones de placeholders: ${totalCorrections}`);

if (totalCorrections > 0) {
  console.log(`   🎉 ¡Placeholders corregidos exitosamente!`);
} else {
  console.log(`   ✅ Todos los placeholders están correctos`);
}
