#!/usr/bin/env node

// Script para traducir palabras en inglés que no han sido traducidas
const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../src/locales');
const files = fs.readdirSync(localesDir).filter(file => file.endsWith('.json'));

console.log('🌍 Corrigiendo traducciones de palabras en inglés...\n');

// Traducciones por idioma
const translations = {
  'cs': {
    'Compatibility': 'Kompatibilita',
    'Friendship': 'Přátelství',
    'Love': 'Láska',
    'Work': 'Práce',
    'Horoscope': 'Horoskop',
    'Zodiac': 'Znamení',
    'Tarot': 'Tarot',
    'Astrology': 'Astrologie'
  },
  'da': {
    'Compatibility': 'Kompatibilitet',
    'Friendship': 'Venskab',
    'Love': 'Kærlighed',
    'Work': 'Arbejde',
    'Horoscope': 'Horoskop',
    'Zodiac': 'Stjernetegn',
    'Tarot': 'Tarot',
    'Astrology': 'Astrologi'
  },
  'de': {
    'Compatibility': 'Kompatibilität',
    'Friendship': 'Freundschaft',
    'Love': 'Liebe',
    'Work': 'Arbeit',
    'Horoscope': 'Horoskop',
    'Zodiac': 'Sternzeichen',
    'Tarot': 'Tarot',
    'Astrology': 'Astrologie'
  },
  'el': {
    'Compatibility': 'Συμβατότητα',
    'Friendship': 'Φιλία',
    'Love': 'Αγάπη',
    'Work': 'Εργασία',
    'Horoscope': 'Ωροσκόπιο',
    'Zodiac': 'Ζώδιο',
    'Tarot': 'Ταρό',
    'Astrology': 'Αστρολογία'
  },
  'es': {
    'Compatibility': 'Compatibilidad',
    'Friendship': 'Amistad',
    'Love': 'Amor',
    'Work': 'Trabajo',
    'Horoscope': 'Horóscopo',
    'Zodiac': 'Zodíaco',
    'Tarot': 'Tarot',
    'Astrology': 'Astrología'
  },
  'fa': {
    'Compatibility': 'سازگاری',
    'Friendship': 'دوستی',
    'Love': 'عشق',
    'Work': 'کار',
    'Horoscope': 'طالع‌بینی',
    'Zodiac': 'برج',
    'Tarot': 'تاروت',
    'Astrology': 'نجوم'
  },
  'fi': {
    'Compatibility': 'Yhteensopivuus',
    'Friendship': 'Ystävyys',
    'Love': 'Rakkaus',
    'Work': 'Työ',
    'Horoscope': 'Horoskooppi',
    'Zodiac': 'Tähtimerkki',
    'Tarot': 'Tarot',
    'Astrology': 'Astrologia'
  },
  'fr': {
    'Compatibility': 'Compatibilité',
    'Friendship': 'Amitié',
    'Love': 'Amour',
    'Work': 'Travail',
    'Horoscope': 'Horoscope',
    'Zodiac': 'Zodiaque',
    'Tarot': 'Tarot',
    'Astrology': 'Astrologie'
  },
  'gu': {
    'Compatibility': 'સુસંગતતા',
    'Friendship': 'મિત્રતા',
    'Love': 'પ્રેમ',
    'Work': 'કામ',
    'Horoscope': 'જન્મપત્રિકા',
    'Zodiac': 'રાશિ',
    'Tarot': 'ટેરો',
    'Astrology': 'જ્યોતિષ'
  },
  'he': {
    'Compatibility': 'תאימות',
    'Friendship': 'ידידות',
    'Love': 'אהבה',
    'Work': 'עבודה',
    'Horoscope': 'הורוסקופ',
    'Zodiac': 'מזל',
    'Tarot': 'טארוט',
    'Astrology': 'אסטרולוגיה'
  },
  'hi': {
    'Compatibility': 'अनुकूलता',
    'Friendship': 'मित्रता',
    'Love': 'प्रेम',
    'Work': 'काम',
    'Horoscope': 'राशिफल',
    'Zodiac': 'राशि',
    'Tarot': 'टैरो',
    'Astrology': 'ज्योतिष'
  },
  'hu': {
    'Compatibility': 'Kompatibilitás',
    'Friendship': 'Barátság',
    'Love': 'Szerelem',
    'Work': 'Munka',
    'Horoscope': 'Horoszkóp',
    'Zodiac': 'Csillagjegy',
    'Tarot': 'Tarot',
    'Astrology': 'Asztrológia'
  },
  'id': {
    'Compatibility': 'Kompatibilitas',
    'Friendship': 'Persahabatan',
    'Love': 'Cinta',
    'Work': 'Kerja',
    'Horoscope': 'Horoskop',
    'Zodiac': 'Zodiak',
    'Tarot': 'Tarot',
    'Astrology': 'Astrologi'
  },
  'it': {
    'Compatibility': 'Compatibilità',
    'Friendship': 'Amicizia',
    'Love': 'Amore',
    'Work': 'Lavoro',
    'Horoscope': 'Oroscopo',
    'Zodiac': 'Zodiaco',
    'Tarot': 'Tarocchi',
    'Astrology': 'Astrologia'
  },
  'ja': {
    'Compatibility': '相性',
    'Friendship': '友情',
    'Love': '恋愛',
    'Work': '仕事',
    'Horoscope': '星占い',
    'Zodiac': '星座',
    'Tarot': 'タロット',
    'Astrology': '占星術'
  },
  'kn': {
    'Compatibility': 'ಹೊಂದಾಣಿಕೆ',
    'Friendship': 'ಸ್ನೇಹ',
    'Love': 'ಪ್ರೀತಿ',
    'Work': 'ಕೆಲಸ',
    'Horoscope': 'ರಾಶಿಫಲ',
    'Zodiac': 'ರಾಶಿ',
    'Tarot': 'ಟ್ಯಾರೋ',
    'Astrology': 'ಜ್ಯೋತಿಷ್ಯ'
  },
  'ko': {
    'Compatibility': '호환성',
    'Friendship': '우정',
    'Love': '사랑',
    'Work': '일',
    'Horoscope': '별자리 운세',
    'Zodiac': '별자리',
    'Tarot': '타로',
    'Astrology': '점성술'
  },
  'mr': {
    'Compatibility': 'सुसंगतता',
    'Friendship': 'मैत्री',
    'Love': 'प्रेम',
    'Work': 'काम',
    'Horoscope': 'राशीफळ',
    'Zodiac': 'राशी',
    'Tarot': 'टॅरो',
    'Astrology': 'ज्योतिष'
  },
  'nl': {
    'Compatibility': 'Compatibiliteit',
    'Friendship': 'Vriendschap',
    'Love': 'Liefde',
    'Work': 'Werk',
    'Horoscope': 'Horoscoop',
    'Zodiac': 'Sterrenbeeld',
    'Tarot': 'Tarot',
    'Astrology': 'Astrologie'
  },
  'no': {
    'Compatibility': 'Kompatibilitet',
    'Friendship': 'Vennskap',
    'Love': 'Kjærlighet',
    'Work': 'Arbeid',
    'Horoscope': 'Horoskop',
    'Zodiac': 'Stjernetegn',
    'Tarot': 'Tarot',
    'Astrology': 'Astrologi'
  },
  'pl': {
    'Compatibility': 'Kompatybilność',
    'Friendship': 'Przyjaźń',
    'Love': 'Miłość',
    'Work': 'Praca',
    'Horoscope': 'Horoskop',
    'Zodiac': 'Zodiak',
    'Tarot': 'Tarot',
    'Astrology': 'Astrologia'
  },
  'pt': {
    'Compatibility': 'Compatibilidade',
    'Friendship': 'Amizade',
    'Love': 'Amor',
    'Work': 'Trabalho',
    'Horoscope': 'Horóscopo',
    'Zodiac': 'Zodíaco',
    'Tarot': 'Tarô',
    'Astrology': 'Astrologia'
  },
  'ro': {
    'Compatibility': 'Compatibilitate',
    'Friendship': 'Prietenie',
    'Love': 'Dragoste',
    'Work': 'Muncă',
    'Horoscope': 'Horoscop',
    'Zodiac': 'Zodiac',
    'Tarot': 'Tarot',
    'Astrology': 'Astrologie'
  },
  'ru': {
    'Compatibility': 'Совместимость',
    'Friendship': 'Дружба',
    'Love': 'Любовь',
    'Work': 'Работа',
    'Horoscope': 'Гороскоп',
    'Zodiac': 'Зодиак',
    'Tarot': 'Таро',
    'Astrology': 'Астрология'
  },
  'sv': {
    'Compatibility': 'Kompatibilitet',
    'Friendship': 'Vänskap',
    'Love': 'Kärlek',
    'Work': 'Arbete',
    'Horoscope': 'Horoskop',
    'Zodiac': 'Stjärntecken',
    'Tarot': 'Tarot',
    'Astrology': 'Astrologi'
  },
  'sw': {
    'Compatibility': 'Upatanishi',
    'Friendship': 'Urafiki',
    'Love': 'Upendo',
    'Work': 'Kazi',
    'Horoscope': 'Utabiri',
    'Zodiac': 'Dalili',
    'Tarot': 'Tarot',
    'Astrology': 'Uchunguzi wa nyota'
  },
  'ta': {
    'Compatibility': 'இணக்கம்',
    'Friendship': 'நட்பு',
    'Love': 'காதல்',
    'Work': 'வேலை',
    'Horoscope': 'ராசிபலன்',
    'Zodiac': 'ராசி',
    'Tarot': 'டாரோ',
    'Astrology': 'சோதிடம்'
  },
  'te': {
    'Compatibility': 'అనుకూలత',
    'Friendship': 'స్నేహం',
    'Love': 'ప్రేమ',
    'Work': 'పని',
    'Horoscope': 'రాశిఫలం',
    'Zodiac': 'రాశి',
    'Tarot': 'టారో',
    'Astrology': 'జ్యోతిష్యం'
  },
  'th': {
    'Compatibility': 'ความเข้ากันได้',
    'Friendship': 'มิตรภาพ',
    'Love': 'ความรัก',
    'Work': 'งาน',
    'Horoscope': 'โหราศาสตร์',
    'Zodiac': 'ราศี',
    'Tarot': 'ทาโรต์',
    'Astrology': 'โหราศาสตร์'
  },
  'tr': {
    'Compatibility': 'Uyumluluk',
    'Friendship': 'Arkadaşlık',
    'Love': 'Aşk',
    'Work': 'İş',
    'Horoscope': 'Burç',
    'Zodiac': 'Burç',
    'Tarot': 'Tarot',
    'Astrology': 'Astroloji'
  },
  'uk': {
    'Compatibility': 'Сумісність',
    'Friendship': 'Дружба',
    'Love': 'Кохання',
    'Work': 'Робота',
    'Horoscope': 'Гороскоп',
    'Zodiac': 'Зодіак',
    'Tarot': 'Таро',
    'Astrology': 'Астрологія'
  },
  'ur': {
    'Compatibility': 'مطابقت',
    'Friendship': 'دوستی',
    'Love': 'محبت',
    'Work': 'کام',
    'Horoscope': 'برجی',
    'Zodiac': 'برج',
    'Tarot': 'ٹیرو',
    'Astrology': 'علم نجوم'
  },
  'vi': {
    'Compatibility': 'Tương thích',
    'Friendship': 'Tình bạn',
    'Love': 'Tình yêu',
    'Work': 'Công việc',
    'Horoscope': 'Tử vi',
    'Zodiac': 'Cung hoàng đạo',
    'Tarot': 'Tarot',
    'Astrology': 'Chiêm tinh học'
  },
  'zh-CN': {
    'Compatibility': '兼容性',
    'Friendship': '友谊',
    'Love': '爱情',
    'Work': '工作',
    'Horoscope': '星座运势',
    'Zodiac': '星座',
    'Tarot': '塔罗牌',
    'Astrology': '占星术'
  }
};

let totalCorrections = 0;

files.forEach(file => {
  if (file === 'en.json') return; // Saltar inglés
  
  const locale = file.replace('.json', '');
  const localeName = locale === 'zh-CN' ? 'zh-CN' : locale;
  
  if (!translations[localeName]) {
    console.log(`⚠️  Sin traducciones definidas para ${locale}`);
    return;
  }
  
  const filePath = path.join(localesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  
  console.log(`📁 Traduciendo ${file}:`);
  
  let fileCorrections = 0;
  
  // Aplicar traducciones
  Object.entries(translations[localeName]).forEach(([english, translated]) => {
    const regex = new RegExp(`"${english}"`, 'g');
    const matches = (content.match(regex) || []).length;
    if (matches > 0) {
      content = content.replace(regex, `"${translated}"`);
      console.log(`  ✅ "${english}" → "${translated}" (${matches} veces)`);
      fileCorrections += matches;
    }
  });
  
  // Validar JSON
  try {
    JSON.parse(content);
  } catch (e) {
    console.log(`  ❌ Error de JSON después de traducciones: ${e.message}`);
    return;
  }
  
  // Guardar si hay cambios
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  💾 Archivo guardado con ${fileCorrections} traducciones`);
  } else {
    console.log(`  ✅ Sin traducciones necesarias`);
  }
  
  totalCorrections += fileCorrections;
  console.log('');
});

console.log(`🎯 RESUMEN FINAL:`);
console.log(`   Total correcciones de traducción: ${totalCorrections}`);

if (totalCorrections > 0) {
  console.log(`   🎉 ¡Traducciones corregidas exitosamente!`);
} else {
  console.log(`   ✅ No se encontraron traducciones para corregir`);
}
