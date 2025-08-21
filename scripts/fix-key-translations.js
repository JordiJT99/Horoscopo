#!/usr/bin/env node

// Script para corregir traducciones específicas de keys importantes
const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../src/locales');
const files = fs.readdirSync(localesDir).filter(file => file.endsWith('.json'));

console.log('🔧 Corrigiendo traducciones específicas de keys importantes...\n');

// Correcciones específicas por idioma y key
const keyCorrections = {
  'fr': {
    '"Header.compatibility": "acheter"': '"Header.compatibility": "Compatibilité"',
    '"Header.compatibility": "Compatibility"': '"Header.compatibility": "Compatibilité"',
    '"Header.horoscope": "Horoscope"': '"Header.horoscope": "Horoscope"',
    '"Header.tarot": "Tarot"': '"Header.tarot": "Tarot"',
    '"Header.zodiac": "Zodiac"': '"Header.zodiac": "Zodiaque"'
  },
  'de': {
    '"Header.compatibility": "Compatibility"': '"Header.compatibility": "Kompatibilität"',
    '"Header.horoscope": "Horoscope"': '"Header.horoscope": "Horoskop"',
    '"Header.tarot": "Tarot"': '"Header.tarot": "Tarot"',
    '"Header.zodiac": "Zodiac"': '"Header.zodiac": "Sternzeichen"'
  },
  'es': {
    '"Header.compatibility": "Compatibility"': '"Header.compatibility": "Compatibilidad"',
    '"Header.horoscope": "Horoscope"': '"Header.horoscope": "Horóscopo"',
    '"Header.tarot": "Tarot"': '"Header.tarot": "Tarot"',
    '"Header.zodiac": "Zodiac"': '"Header.zodiac": "Zodíaco"'
  },
  'it': {
    '"Header.compatibility": "Compatibility"': '"Header.compatibility": "Compatibilità"',
    '"Header.horoscope": "Horoscope"': '"Header.horoscope": "Oroscopo"',
    '"Header.tarot": "Tarot"': '"Header.tarot": "Tarocchi"',
    '"Header.zodiac": "Zodiac"': '"Header.zodiac": "Zodiaco"'
  },
  'pt': {
    '"Header.compatibility": "Compatibility"': '"Header.compatibility": "Compatibilidade"',
    '"Header.horoscope": "Horoscope"': '"Header.horoscope": "Horóscopo"',
    '"Header.tarot": "Tarot"': '"Header.tarot": "Tarô"',
    '"Header.zodiac": "Zodiac"': '"Header.zodiac": "Zodíaco"'
  },
  'ru': {
    '"Header.compatibility": "Compatibility"': '"Header.compatibility": "Совместимость"',
    '"Header.horoscope": "Horoscope"': '"Header.horoscope": "Гороскоп"',
    '"Header.tarot": "Tarot"': '"Header.tarot": "Таро"',
    '"Header.zodiac": "Zodiac"': '"Header.zodiac": "Зодиак"'
  },
  'ja': {
    '"Header.compatibility": "Compatibility"': '"Header.compatibility": "相性"',
    '"Header.horoscope": "Horoscope"': '"Header.horoscope": "星占い"',
    '"Header.tarot": "Tarot"': '"Header.tarot": "タロット"',
    '"Header.zodiac": "Zodiac"': '"Header.zodiac": "星座"'
  },
  'ko': {
    '"Header.compatibility": "Compatibility"': '"Header.compatibility": "호환성"',
    '"Header.horoscope": "Horoscope"': '"Header.horoscope": "별자리 운세"',
    '"Header.tarot": "Tarot"': '"Header.tarot": "타로"',
    '"Header.zodiac": "Zodiac"': '"Header.zodiac": "별자리"'
  },
  'zh-CN': {
    '"Header.compatibility": "Compatibility"': '"Header.compatibility": "兼容性"',
    '"Header.horoscope": "Horoscope"': '"Header.horoscope": "星座运势"',
    '"Header.tarot": "Tarot"': '"Header.tarot": "塔罗牌"',
    '"Header.zodiac": "Zodiac"': '"Header.zodiac": "星座"'
  }
};

let totalCorrections = 0;

files.forEach(file => {
  if (file === 'en.json') return; // Saltar inglés
  
  const locale = file.replace('.json', '');
  const corrections = keyCorrections[locale];
  
  if (!corrections) {
    console.log(`⚠️  Sin correcciones específicas para ${locale}`);
    return;
  }
  
  const filePath = path.join(localesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  
  console.log(`📁 Corrigiendo keys en ${file}:`);
  
  let fileCorrections = 0;
  
  // Aplicar correcciones específicas
  Object.entries(corrections).forEach(([wrong, correct]) => {
    if (content.includes(wrong)) {
      content = content.replace(wrong, correct);
      console.log(`  ✅ ${wrong} → ${correct}`);
      fileCorrections++;
    }
  });
  
  // Validar JSON
  try {
    JSON.parse(content);
  } catch (e) {
    console.log(`  ❌ Error de JSON después de correcciones: ${e.message}`);
    return;
  }
  
  // Guardar si hay cambios
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
console.log(`   Total correcciones de keys: ${totalCorrections}`);

if (totalCorrections > 0) {
  console.log(`   🎉 ¡Keys corregidas exitosamente!`);
} else {
  console.log(`   ✅ No se encontraron keys para corregir`);
}
