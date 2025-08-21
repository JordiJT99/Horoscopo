#!/usr/bin/env node

// Script para corregir automáticamente errores en archivos JSON
const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../src/locales');
const files = fs.readdirSync(localesDir).filter(file => file.endsWith('.json'));

console.log('🔧 Corrigiendo errores en archivos de traducción...\n');

let totalCorrections = 0;

files.forEach(file => {
  const filePath = path.join(localesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  const locale = file.replace('.json', '');
  
  console.log(`📁 Corrigiendo ${file}:`);
  
  let fileCorrections = 0;
  const originalContent = content;
  
  // 1. Corregir patrones duplicados como {sign1} {sign2} {sign1} {sign2}
  const duplicatePattern = /(\{sign1\}.*?\{sign2\}).*?\{sign1\}.*?\{sign2\}/g;
  content = content.replace(duplicatePattern, '$1');
  const duplicateMatches = (originalContent.match(duplicatePattern) || []).length;
  if (duplicateMatches > 0) {
    console.log(`  ✅ Corregidos ${duplicateMatches} patrones de signo duplicados`);
    fileCorrections += duplicateMatches;
  }
  
  // 2. Corregir patrones rotos como {signi}
  content = content.replace(/\{signi\}/g, '{sign1}');
  const signiMatches = (originalContent.match(/\{signi\}/g) || []).length;
  if (signiMatches > 0) {
    console.log(`  ✅ Corregidos ${signiMatches} patrones {signi} → {sign1}`);
    fileCorrections += signiMatches;
  }
  
  // 3. Eliminar caracteres extraños como zzzzz
  content = content.replace(/z{3,}/gi, '');
  content = content.replace(/Z{3,}/g, '');
  const strangeChars = (originalContent.match(/[zZ]{3,}/g) || []).length;
  if (strangeChars > 0) {
    console.log(`  ✅ Eliminados ${strangeChars} grupos de caracteres extraños`);
    fileCorrections += strangeChars;
  }
  
  // 4. Corregir traducciones específicas por idioma
  if (locale === 'en') {
    // Inglés: Further → More
    content = content.replace(/"Further"/g, '"More"');
    if (originalContent.includes('"Further"')) {
      console.log(`  ✅ Corregido "Further" → "More"`);
      fileCorrections++;
    }
  }
  
  if (locale === 'fr') {
    // Francés: aimante → amoureuse
    content = content.replace(/aimante/g, 'amoureuse');
    if (originalContent.includes('aimante')) {
      console.log(`  ✅ Corregido "aimante" → "amoureuse"`);
      fileCorrections++;
    }
  }
  
  // 5. Corregir traducciones de "Sign information"
  const signInfoCorrections = {
    'en': 'Zodiac Sign Information',
    'fr': 'Informations du signe zodiacal',
    'de': 'Sternzeichen Informationen',
    'it': 'Informazioni del segno zodiacale',
    'pt': 'Informações do signo',
    'es': 'Información del Signo',
    'ru': 'Информация о знаке',
    'zh': '星座信息',
    'ja': '星座情報',
    'ko': '별자리 정보',
    'ar': 'معلومات البرج',
    'hi': 'राशि की जानकारी',
    'th': 'ข้อมูลราศี',
    'vi': 'Thông tin cung hoàng đạo',
    'tr': 'Burç Bilgileri',
    'pl': 'Informacje o znaku',
    'nl': 'Sterrenbeeld Informatie',
    'sv': 'Stjärntecken Information',
    'no': 'Stjernetegn Informasjon',
    'da': 'Stjernetegn Information',
    'fi': 'Tähtimerkki Tiedot',
    'cs': 'Informace o znamení',
    'hu': 'Csillagjegy Információk',
    'ro': 'Informații despre semn',
    'uk': 'Інформація про знак',
    'el': 'Πληροφορίες ζωδίου',
    'he': 'מידע על המזל',
    'fa': 'اطلاعات برج',
    'ur': 'برج کی معلومات',
    'id': 'Informasi Zodiak',
    'sw': 'Maelezo ya Dalili',
    'ta': 'ராசி தகவல்',
    'te': 'రాశి సమాచారం',
    'mr': 'राशी माहिती',
    'gu': 'રાશિ માહિતી',
    'kn': 'ರಾಶಿ ಮಾಹಿತಿ'
  };
  
  if (signInfoCorrections[locale]) {
    const oldPattern = /"ChineseHoroscopePage\.signInfoTitle":\s*"[^"]*"/;
    const newValue = `"ChineseHoroscopePage.signInfoTitle": "${signInfoCorrections[locale]}"`;
    if (oldPattern.test(content)) {
      content = content.replace(oldPattern, newValue);
      console.log(`  ✅ Corregido signInfoTitle`);
      fileCorrections++;
    }
  }
  
  // 6. Validar JSON
  try {
    JSON.parse(content);
  } catch (e) {
    console.log(`  ❌ Error de JSON después de correcciones: ${e.message}`);
    return; // No guardar si hay errores
  }
  
  // 7. Guardar archivo corregido
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  💾 Archivo guardado con ${fileCorrections} correcciones`);
  } else {
    console.log(`  ✅ Sin correcciones necesarias`);
  }
  
  totalCorrections += fileCorrections;
  console.log('');
});

console.log(`🎯 RESUMEN FINAL:`);
console.log(`   Total archivos procesados: ${files.length}`);
console.log(`   Total correcciones aplicadas: ${totalCorrections}`);

if (totalCorrections > 0) {
  console.log(`   🎉 ¡Archivos corregidos exitosamente!`);
} else {
  console.log(`   ✅ No se encontraron errores para corregir`);
}
