#!/usr/bin/env node

// Script para corregir keys duplicadas haciendo que sean únicas
const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../src/locales');
const files = fs.readdirSync(localesDir).filter(file => file.endsWith('.json'));

console.log('🔧 Corrigiendo keys duplicadas en archivos JSON...\n');

let totalCorrections = 0;

files.forEach(file => {
  const filePath = path.join(localesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  const locale = file.replace('.json', '');
  
  console.log(`📁 Verificando ${file}:`);
  
  let fileCorrections = 0;
  const originalContent = content;
  
  // Detectar si el archivo tiene estructura válida
  let parsedJSON;
  try {
    parsedJSON = JSON.parse(content);
    console.log(`  ✅ JSON válido - estructura correcta`);
  } catch (e) {
    console.log(`  ❌ JSON inválido: ${e.message}`);
    
    // Si hay error de parsing, intentar corregir keys duplicadas básicas
    const lines = content.split('\n');
    let correctedLines = [];
    let seenKeys = new Set();
    let correctionsMade = 0;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const keyMatch = line.match(/^\s*"([^"]+)"\s*:/);
      
      if (keyMatch) {
        const key = keyMatch[1];
        if (seenKeys.has(key)) {
          // Key duplicada - agregar sufijo numérico
          let newKey = key;
          let counter = 2;
          while (seenKeys.has(newKey)) {
            newKey = `${key}_${counter}`;
            counter++;
          }
          const newLine = line.replace(`"${key}"`, `"${newKey}"`);
          correctedLines.push(newLine);
          seenKeys.add(newKey);
          correctionsMade++;
          console.log(`  ✅ Key duplicada "${key}" → "${newKey}"`);
        } else {
          correctedLines.push(line);
          seenKeys.add(key);
        }
      } else {
        correctedLines.push(line);
      }
    }
    
    if (correctionsMade > 0) {
      content = correctedLines.join('\n');
      fileCorrections += correctionsMade;
      
      // Verificar que ahora sea JSON válido
      try {
        JSON.parse(content);
        console.log(`  ✅ JSON corregido y validado`);
      } catch (e) {
        console.log(`  ❌ Aún hay errores de JSON: ${e.message}`);
        content = originalContent; // Revertir si sigue siendo inválido
        fileCorrections = 0;
      }
    }
  }
  
  // Guardar archivo solo si hay correcciones
  if (fileCorrections > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  💾 Archivo guardado con ${fileCorrections} correcciones`);
  } else {
    console.log(`  ✅ Sin keys duplicadas para corregir`);
  }
  
  totalCorrections += fileCorrections;
  console.log('');
});

console.log(`🎯 RESUMEN FINAL:`);
console.log(`   Total archivos procesados: ${files.length}`);
console.log(`   Total correcciones de keys: ${totalCorrections}`);

if (totalCorrections > 0) {
  console.log(`   🎉 ¡Keys duplicadas corregidas!`);
} else {
  console.log(`   ✅ Todos los archivos tienen estructura JSON válida`);
}
