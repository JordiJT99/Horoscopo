const fs = require('fs');
const path = require('path');

// Keys para agregar a los archivos de traducción
const fallbackKeys = {
  "CompatibilitySection.translationNote": {
    es: "Nota: Esta explicación está en inglés porque aún no está traducida a tu idioma.",
    en: "Note: This explanation is shown in English as translation is not yet available for your language.",
    de: "Hinweis: Diese Erklärung wird auf Englisch angezeigt, da die Übersetzung für Ihre Sprache noch nicht verfügbar ist.",
    fr: "Note : Cette explication est affichée en anglais car la traduction n'est pas encore disponible pour votre langue.",
    pt: "Nota: Esta explicação é mostrada em inglês porque a tradução ainda não está disponível para o seu idioma.",
    it: "Nota: Questa spiegazione è mostrata in inglese perché la traduzione non è ancora disponibile per la tua lingua.",
    ru: "Примечание: Это объяснение показано на английском языке, поскольку перевод на ваш язык пока недоступен.",
    zh: "注意：由于您的语言翻译尚不可用，此解释以英文显示。",
    ja: "注意：お使いの言語の翻訳がまだ利用できないため、この説明は英語で表示されています。",
    ko: "참고: 귀하의 언어로 번역이 아직 제공되지 않아 이 설명이 영어로 표시됩니다.",
    ar: "ملاحظة: يتم عرض هذا التفسير باللغة الإنجليزية لأن الترجمة غير متوفرة بعد بلغتك.",
    hi: "नोट: यह स्पष्टीकरण अंग्रेजी में दिखाया गया है क्योंकि आपकी भाषा में अनुवाद अभी तक उपलब्ध नहीं है।",
    th: "หมายเหตุ: คำอธิบายนี้แสดงเป็นภาษาอังกฤษเนื่องจากการแปลเป็นภาษาของคุณยังไม่พร้อมใช้งาน",
    vi: "Lưu ý: Giải thích này được hiển thị bằng tiếng Anh vì bản dịch cho ngôn ngữ của bạn chưa có sẵn.",
    tr: "Not: Bu açıklama İngilizce olarak gösterilmektedir çünkü diliniz için çeviri henüz mevcut değildir.",
    pl: "Uwaga: To wyjaśnienie jest pokazane w języku angielskim, ponieważ tłumaczenie na Twój język nie jest jeszcze dostępne.",
    nl: "Opmerking: Deze uitleg wordt in het Engels getoond omdat de vertaling naar uw taal nog niet beschikbaar is.",
    sv: "Obs: Denna förklaring visas på engelska eftersom översättningen till ditt språk ännu inte är tillgänglig.",
    no: "Merk: Denne forklaringen vises på engelsk fordi oversettelsen til ditt språk ennå ikke er tilgjengelig.",
    da: "Bemærk: Denne forklaring vises på engelsk, fordi oversættelsen til dit sprog endnu ikke er tilgængelig.",
    fi: "Huomautus: Tämä selitys näytetään englanniksi, koska käännös kielellesi ei ole vielä saatavilla.",
    cs: "Poznámka: Toto vysvětlení je zobrazeno v angličtině, protože překlad do vašeho jazyka ještě není k dispozici.",
    hu: "Megjegyzés: Ez a magyarázat angolul jelenik meg, mert a fordítás az Ön nyelvére még nem elérhető.",
    ro: "Notă: Această explicație este afișată în engleză deoarece traducerea în limba dumneavoastră nu este încă disponibilă.",
    uk: "Примітка: Це пояснення показано англійською мовою, оскільки переклад вашою мовою ще недоступний.",
    el: "Σημείωση: Αυτή η εξήγηση εμφανίζεται στα αγγλικά επειδή η μετάφραση στη γλώσσα σας δεν είναι ακόμη διαθέσιμη.",
    he: "הערה: הסבר זה מוצג באנגלית מכיוון שהתרגום לשפה שלך עדיין לא זמין.",
    fa: "توجه: این توضیح به زبان انگلیسی نمایش داده می‌شود زیرا ترجمه به زبان شما هنوز در دسترس نیست.",
    ur: "نوٹ: یہ وضاحت انگریزی میں دکھائی گئی ہے کیونکہ آپ کی زبان میں ترجمہ ابھی دستیاب نہیں ہے۔",
    id: "Catatan: Penjelasan ini ditampilkan dalam bahasa Inggris karena terjemahan untuk bahasa Anda belum tersedia.",
    sw: "Kumbuka: Maelezo haya yanaonyeshwa kwa Kiingereza kwa sababu tafsiri kwa lugha yako bado haipatikani.",
    ta: "குறிப்பு: உங்கள் மொழிக்கான மொழிபெயர்ப்பு இன்னும் கிடைக்காததால் இந்த விளக்கம் ஆங்கிலத்தில் காட்டப்படுகிறது.",
    te: "గమనిక: మీ భాషకు అనువాదం ఇంకా అందుబాటులో లేనందున ఈ వివరణ ఇంగ్లీష్‌లో చూపబడుతోంది.",
    mr: "टीप: आपल्या भाषेसाठी भाषांतर अद्याप उपलब्ध नसल्याने हे स्पष्टीकरण इंग्रजीमध्ये दर्शविले आहे.",
    gu: "નોંધ: આ સમજૂતી અંગ્રેજીમાં બતાવવામાં આવી છે કારણ કે તમારી ભાષા માટે અનુવાદ હજુ ઉપલબ્ધ નથી.",
    kn: "ಗಮನಿಸಿ: ನಿಮ್ಮ ಭಾಷೆಗೆ ಅನುವಾದ ಇನ್ನೂ ಲಭ್ಯವಿಲ್ಲದ ಕಾರಣ ಈ ವಿವರಣೆಯನ್ನು ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ ತೋರಿಸಲಾಗಿದೆ."
  }
};

const localesDir = path.join(__dirname, 'src', 'locales');
const files = fs.readdirSync(localesDir).filter(file => file.endsWith('.json'));

console.log('Agregando keys de fallback para compatibilidad...\n');

files.forEach(file => {
  const locale = file.replace('.json', '');
  const filePath = path.join(localesDir, file);
  
  try {
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Agregar las nuevas keys si no existen
    Object.entries(fallbackKeys).forEach(([key, translations]) => {
      if (!content[key] && translations[locale]) {
        content[key] = translations[locale];
        console.log(`✅ ${file}: Agregada key ${key}`);
      }
    });
    
    // Guardar el archivo actualizado
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf8');
    
  } catch (error) {
    console.error(`❌ Error procesando ${file}:`, error.message);
  }
});

console.log('\n🎉 Keys de fallback agregadas exitosamente!');
