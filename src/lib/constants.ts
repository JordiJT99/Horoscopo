
import type { ZodiacSignName, ZodiacSign, HoroscopeData, CompatibilityData, LuckyNumbersData, LunarData, AscendantData, ChineseZodiacSign, MayanZodiacSign, ChineseAnimalSignName, ChineseZodiacResult, ChineseCompatibilityData, MayanSignName, GalacticTone, MayanKinInfo } from '@/types';
import type { Locale } from '@/lib/dictionaries';
import { Activity, CircleDollarSign, Users, Moon, Sun, Leaf, Scale, Zap, ArrowUpRight, Mountain, Waves, Fish, SparklesIcon, Rabbit as RabbitIcon, Feather as FeatherIcon, Star as StarIcon, Squirrel, VenetianMask, Bird, Crown, Shell, PawPrint, Bone, Dog as DogIcon, Type as TypeIcon, Heart, Layers, Calculator as CalculatorIcon, HelpCircle } from 'lucide-react';

export const ZODIAC_SIGNS: ZodiacSign[] = [
  { name: "Aries", icon: Activity, dateRange: "Mar 21 - Abr 19" },
  { name: "Taurus", icon: CircleDollarSign, dateRange: "Abr 20 - May 20" },
  { name: "Gemini", icon: Users, dateRange: "May 21 - Jun 20" },
  { name: "Cancer", icon: Moon, dateRange: "Jun 21 - Jul 22" },
  { name: "Leo", icon: Sun, dateRange: "Jul 23 - Ago 22" },
  { name: "Virgo", icon: Leaf, dateRange: "Ago 23 - Sep 22" },
  { name: "Libra", icon: Scale, dateRange: "Sep 23 - Oct 22" },
  { name: "Scorpio", icon: Zap, dateRange: "Oct 23 - Nov 21" },
  { name: "Sagittarius", icon: ArrowUpRight, dateRange: "Nov 22 - Dic 21" },
  { name: "Capricorn", icon: Mountain, dateRange: "Dic 22 - Ene 19" },
  { name: "Aquarius", icon: Waves, dateRange: "Ene 20 - Feb 18" },
  { name: "Pisces", icon: Fish, dateRange: "Feb 19 - Mar 20" },
];

export const ALL_SIGN_NAMES = ZODIAC_SIGNS.map(sign => sign.name);

const genericHoroscopeText = "Hoy es un día de nuevos comienzos. Abraza el cambio y busca oportunidades. Tus niveles de energía son altos, ¡aprovéchalos al máximo! Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

export const getHoroscope = (sign: ZodiacSignName): HoroscopeData => ({
  sign,
  daily: `Horóscopo Diario para ${sign}: ${genericHoroscopeText} Concéntrate en proyectos personales.`,
  weekly: `Horóscopo Semanal para ${sign}: Esta semana trae una mezcla de desafíos y recompensas. ${genericHoroscopeText} Planifica tus finanzas cuidadosamente.`,
  monthly: `Horóscopo Mensual para ${sign}: El mes que viene es crucial para tu crecimiento profesional. ${genericHoroscopeText} Las relaciones requerirán atención.`,
});

export const getCompatibility = (sign1: ZodiacSignName, sign2: ZodiacSignName): CompatibilityData => ({
  sign1,
  sign2,
  report: `${sign1} y ${sign2} tienen una dinámica compleja pero potencialmente gratificante. La comunicación es clave. ${sign1} aporta pasión, mientras que ${sign2} ofrece estabilidad. Juntos pueden lograr grandes cosas si aprenden a apreciar sus diferencias. Este es un texto de ejemplo en español.`,
  score: Math.floor(Math.random() * 5) + 1, // Placeholder score
});

const motivationalPhrases: Record<Locale, string[]> = {
  es: [
    "La fortuna favorece a los audaces.",
    "Cada día es una nueva oportunidad para brillar.",
    "Confía en tu intuición, te guiará sabiamente.",
    "La perseverancia es la clave del éxito.",
    "Siembra pensamientos positivos y cosecharás alegría."
  ],
  en: [
    "Fortune favors the bold.",
    "Every day is a new opportunity to shine.",
    "Trust your intuition, it will guide you wisely.",
    "Perseverance is the key to success.",
    "Sow positive thoughts and you will reap joy."
  ],
  de: [
    "Das Glück bevorzugt die Mutigen.",
    "Jeder Tag ist eine neue Gelegenheit zu glänzen.",
    "Vertraue deiner Intuition, sie wird dich weise führen.",
    "Ausdauer ist der Schlüssel zum Erfolg.",
    "Säe positive Gedanken und du wirst Freude ernten."
  ],
  fr: [
    "La fortune sourit aux audacieux.",
    "Chaque jour est une nouvelle opportunité de briller.",
    "Faites confiance à votre intuition, elle vous guidera sagement.",
    "La persévérance est la clé du succès.",
    "Semez des pensées positives et vous récolterez la joie."
  ]
};

export const getLuckyNumbers = (sign: ZodiacSignName, locale: Locale = 'es'): LuckyNumbersData => {
  const phrases = motivationalPhrases[locale] || motivationalPhrases.es;
  return {
    sign,
    numbers: [Math.floor(Math.random() * 50) + 1, Math.floor(Math.random() * 50) + 1, Math.floor(Math.random() * 50) + 1],
    luckyColor: ["Rojo", "Verde", "Azul", "Amarillo", "Púrpura", "Naranja"][Math.floor(Math.random() * 6)],
    luckyGemstone: ["Diamante", "Esmeralda", "Zafiro", "Rubí", "Amatista", "Topacio"][Math.floor(Math.random() * 6)],
    motivationalPhrase: phrases[Math.floor(Math.random() * phrases.length)],
  };
};


export const getCurrentLunarData = (locale: string = 'es-ES'): LunarData => {
  const today = new Date(); // This will be client's 'today' when called in useEffect
  const dayOfMonth = today.getDate(); // 1-31

  let phase: string;
  let illumination: number;

  // Simplified deterministic logic based on the day of the month
  // These phase names are in Spanish; ideally, they'd be keys for localization.
  if (dayOfMonth <= 4) {
    phase = "Luna Nueva";
    illumination = Math.round((dayOfMonth / 4) * 15);
  } else if (dayOfMonth <= 11) {
    phase = "Cuarto Creciente";
    illumination = 15 + Math.round(((dayOfMonth - 4) / 7) * 35);
  } else if (dayOfMonth <= 18) {
    phase = "Luna Llena";
    illumination = 50 + Math.round(((dayOfMonth - 11) / 7) * 50);
  } else if (dayOfMonth <= 25) {
    phase = "Cuarto Menguante";
    illumination = 100 - Math.round(((dayOfMonth - 18) / 7) * 50);
  } else {
    phase = "Menguante Gibosa";
    illumination = 50 - Math.round(((dayOfMonth - 25) / (6)) * 50); // Approx 6 days left
  }

  illumination = Math.max(0, Math.min(100, illumination)); // Ensure illumination is within 0-100

  const nextFullMoonDate = new Date(today);
  if (today.getDate() > 15 && phase !== "Luna Llena") {
    nextFullMoonDate.setMonth(today.getMonth() + 1);
  }
  nextFullMoonDate.setDate(15);

  const nextNewMoonDate = new Date(today);
  if (today.getDate() > 1 && phase !== "Luna Nueva") {
    nextNewMoonDate.setMonth(today.getMonth() + 1);
  }
  nextNewMoonDate.setDate(1);

  return {
    phase: phase,
    illumination: illumination,
    nextFullMoon: nextFullMoonDate.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric'}),
    nextNewMoon: nextNewMoonDate.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric'}),
  };
};


export const getAscendantSign = (birthDate: Date, birthTime: string, birthCity: string): AscendantData => {
  const month = birthDate.getMonth(); // 0-11
  // Simplistic placeholder logic
  const ascendantSign = ZODIAC_SIGNS[month % 12].name;
  return {
    sign: ascendantSign,
    briefExplanation: `Tu signo ascendente, ${ascendantSign}, influye en tu personalidad externa y cómo te perciben los demás. Juega un papel importante en tus primeras impresiones y reacciones espontáneas. (Explicación de ejemplo en español, para ${birthCity} a las ${birthTime} del ${birthDate.toLocaleDateString()}).`,
  };
};

export const AstroAppLogo = SparklesIcon;
export const WesternAstrologyIcon = StarIcon;
export const ChineseAstrologyIcon = RabbitIcon;
export const MayanAstrologyIcon = FeatherIcon;
export const GalacticTonesIcon = Layers;
export const CompatibilityIcon = Heart;
export const KinCalculatorIcon = CalculatorIcon;
export const TarotPersonalityTestIcon = HelpCircle; // Icon for the new test


// --- Full data for Chinese Astrology ---
export const CHINESE_ZODIAC_SIGNS: ChineseZodiacSign[] = [
  { name: "Rat", icon: Squirrel, years: [2020, 2008, 1996, 1984, 1972, 1960, 1948, 1936, 1924, 2032], element: "Agua", description: "Inventiva, ingeniosa, encantadora y persuasiva." },
  { name: "Ox", icon: VenetianMask, years: [2021, 2009, 1997, 1985, 1973, 1961, 1949, 1937, 1925, 2033], element: "Tierra", description: "Diligente, confiable, fuerte y determinado." },
  { name: "Tiger", icon: PawPrint, years: [2022, 2010, 1998, 1986, 1974, 1962, 1950, 1938, 1926, 2034], element: "Madera", description: "Valiente, seguro de sí mismo, competitivo e impredecible." },
  { name: "Rabbit", icon: RabbitIcon, years: [2023, 2011, 1999, 1987, 1975, 1963, 1951, 1939, 1927, 2035], element: "Madera", description: "Gentil, tranquilo, elegante y alerta; rápido y hábil." },
  { name: "Dragon", icon: Crown, years: [2024, 2012, 2000, 1988, 1976, 1964, 1952, 1940, 1928, 2036], element: "Tierra", description: "Seguro de sí mismo, inteligente, entusiasta y un líder natural." },
  { name: "Snake", icon: Shell, years: [2025, 2013, 2001, 1989, 1977, 1965, 1953, 1941, 1929, 2037], element: "Fuego", description: "Enigmática, inteligente, sabia e intuitiva." },
  { name: "Horse", icon: Zap, years: [2026, 2014, 2002, 1990, 1978, 1966, 1954, 1942, 1930, 2038], element: "Fuego", description: "Vivaz, activo, enérgico y le encanta estar entre la multitud." },
  { name: "Goat", icon: Leaf, years: [2027, 2015, 2003, 1991, 1979, 1967, 1955, 1943, 1931, 2039], element: "Tierra", description: "Amable, de buenos modales, tímida, estable, comprensiva y amigable." },
  { name: "Monkey", icon: Bird, years: [2028, 2016, 2004, 1992, 1980, 1968, 1956, 1944, 1932, 2040], element: "Metal", description: "Agudo, inteligente, curioso y travieso." },
  { name: "Rooster", icon: VenetianMask, years: [2029, 2017, 2005, 1993, 1981, 1969, 1957, 1945, 1933, 2041], element: "Metal", description: "Observador, trabajador, ingenioso, valiente y talentoso." },
  { name: "Dog", icon: DogIcon, years: [2030, 2018, 2006, 1994, 1982, 1970, 1958, 1946, 1934, 2042], element: "Tierra", description: "Leal, honesto, amable, bondadoso, cauteloso y prudente." },
  { name: "Pig", icon: Bone, years: [2031, 2019, 2007, 1995, 1983, 1971, 1959, 1947, 1935, 2043], element: "Agua", description: "Diligente, compasivo, generoso y de trato fácil." },
];
export const ALL_CHINESE_SIGN_NAMES = CHINESE_ZODIAC_SIGNS.map(s => s.name as string) as [string, ...string[]];


export const getChineseZodiacSignAndElement = (birthYear: number): ChineseZodiacResult | null => {
  for (const sign of CHINESE_ZODIAC_SIGNS) {
    if (sign.years.includes(birthYear)) {
      return {
        animal: sign.name,
        element: sign.element,
        year: birthYear,
        icon: sign.icon,
      };
    }
  }
  return null;
};

export const getChineseCompatibility = (animal1: ChineseAnimalSignName, animal2: ChineseAnimalSignName): ChineseCompatibilityData => {
  const compatibilityPairings: Record<string, { report: string; score: number }> = {
    "Rat-Dragon": { report: "¡Una combinación excelente! La Rata admira el poder del Dragón, y el Dragón aprecia la astucia de la Rata. Juntos forman un equipo imparable, lleno de éxito y prosperidad.", score: 5 },
    "Rat-Monkey": { report: "Gran compatibilidad. La Rata y el Mono comparten un ingenio similar y disfrutan de la compañía mutua. Su relación es divertida, estimulante y llena de aventuras.", score: 5 },
    "Dragon-Monkey": { report: "Una pareja dinámica y exitosa. El Dragón y el Mono se entienden bien y se motivan mutuamente para alcanzar grandes metas. Ambos son inteligentes y ambiciosos.", score: 5 },
    "Ox-Snake": { report: "Una unión armoniosa y estable. El Buey y la Serpiente comparten valores similares y se respetan profundamente. La Serpiente aporta sabiduría y el Buey, constancia.", score: 5 },
    "Ox-Rooster": { report: "Muy compatibles. El Buey y el Gallo son prácticos, trabajadores y leales. Se complementan bien, creando una relación sólida y segura.", score: 4 },
    "Snake-Rooster": { report: "Excelente compatibilidad intelectual y emocional. La Serpiente y el Gallo se admiran mutuamente por su inteligencia y encanto. Relación elegante y exitosa.", score: 5 },
    "Tiger-Horse": { report: "Una pareja apasionada y aventurera. El Tigre y el Caballo aman la libertad y la emoción. Se entienden instintivamente y se apoyan en sus empresas.", score: 5 },
    "Tiger-Dog": { report: "Gran lealtad y apoyo mutuo. El Perro ofrece al Tigre la comprensión y la calma que necesita, mientras que el Tigre inspira al Perro a ser más audaz.", score: 4 },
    "Horse-Dog": { report: "Una relación feliz y armoniosa. El Caballo y el Perro son honestos, leales y disfrutan de la compañía del otro. Comparten muchos intereses y valores.", score: 5 },
    "Rabbit-Goat": { report: "Muy buena compatibilidad. El Conejo y la Cabra son sensibles, artísticos y disfrutan de la paz y la armonía. Crean un hogar confortable y amoroso.", score: 5 },
    "Rabbit-Pig": { report: "Una pareja encantadora y feliz. El Conejo y el Cerdo son amables, generosos y disfrutan de los placeres simples de la vida. Se cuidan mutuamente.", score: 5 },
    "Goat-Pig": { report: "Relación muy armoniosa y comprensiva. La Cabra y el Cerdo se llevan muy bien, ambos son hogareños y buscan el bienestar del otro. Mucha ternura y afecto.", score: 5 },
    "Rat-Ox": { report: "La Rata y el Buey son amigos secretos, una conexión profunda y entendimiento natural. El Buey ofrece estabilidad a la Rata, y la Rata inspira al Buey. ¡Excelente unión!", score: 5 },
    "Tiger-Pig": { report: "El Tigre y el Cerdo son amigos secretos. El Cerdo admira la valentía del Tigre, y el Tigre aprecia la generosidad del Cerdo. Se equilibran y apoyan.", score: 5 },
    "Rabbit-Dog": { report: "El Conejo y el Perro, amigos secretos, tienen lealtad y confianza profundas. Se protegen y ofrecen consuelo. Muy buena compatibilidad.", score: 5 },
    "Dragon-Rooster": { report: "¡Amigos secretos! El Dragón y el Gallo forman una pareja brillante y exitosa. El Gallo admira la majestuosidad del Dragón, y el Dragón se beneficia de la organización del Gallo. Logran grandes cosas juntos.", score: 5 },
    "Snake-Monkey": { report: "Amigos secretos con conexión astuta. La Serpiente y el Mono se desafían intelectualmente y se divierten. Puede haber juegos de poder, pero la atracción es fuerte.", score: 4 },
    "Horse-Goat": { report: "Amigos secretos, el Caballo y la Cabra se entienden emocionalmente. La Cabra suaviza al Caballo, y el Caballo anima a la Cabra. Relación tierna y solidaria.", score: 5 },
    "Rat-Rabbit": { report: "La Rata y el Conejo pueden ser cordiales, pero necesitarán esfuerzo. La Rata puede encontrar al Conejo demasiado sensible, y el Conejo ver a la Rata como agresiva.", score: 3 },
    "Ox-Tiger": { report: "Relación desafiante. El Buey es conservador y el Tigre impulsivo. Sus diferencias pueden llevar a conflictos sin mucho respeto y comprensión.", score: 2 },
    "Tiger-Snake": { report: "Combinación complicada. El Tigre es abierto y directo, la Serpiente reservada y misteriosa. La desconfianza puede surgir fácilmente.", score: 2 },
    "Dragon-Dog": { report: "Pareja opuesta (Choque). El Dragón es optimista y expansivo, el Perro más cauto y a veces pesimista. Requiere mucho trabajo y compromiso.", score: 1 },
    "Horse-Rooster": { report: "Atracción inicial posible, pero el Caballo independiente y el Gallo crítico pueden chocar. Necesitan paciencia y aceptar diferencias.", score: 2 },
  };
  const key1 = `${animal1}-${animal2}`;
  const key2 = `${animal2}-${animal1}`;

  if (compatibilityPairings[key1]) {
    return { animal1, animal2, ...compatibilityPairings[key1] };
  }
  if (compatibilityPairings[key2]) {
    const result = compatibilityPairings[key2];
    return { animal1, animal2, report: result.report, score: result.score };
  }

  return {
    animal1,
    animal2,
    report: `La compatibilidad entre ${animal1} y ${animal2} tiene sus propios matices únicos. En general, las relaciones entre estos dos signos requieren comprensión y esfuerzo para apreciar las fortalezas de cada uno. (Informe genérico).`,
    score: Math.floor(Math.random() * 3) + 2,
  };
};

const DefaultMayanIcon = TypeIcon;

export const MAYAN_ZODIAC_SIGNS: MayanZodiacSign[] = [
  { name: "Imix", icon: DefaultMayanIcon, description: "Dragón/Cocodrilo - Representa el mar primordial, la fuente de toda vida, abundancia y nuevos comienzos.", detailedInterpretation: "Imix es la energía de la iniciación pura, la nutrición y el sustento maternal. Te invita a confiar en la abundancia del universo y a atreverte a empezar de nuevo. Es un día para conectar con tus instintos más primarios y recordar que todo es posible.", associatedColor: "Rojo" },
  { name: "Ik", icon: DefaultMayanIcon, description: "Viento - Simboliza el viento, el aliento, el espíritu, la fuerza vital, la comunicación y la inspiración.", detailedInterpretation: "Ik es el aliento de vida, la comunicación divina y la verdad. Te impulsa a expresar tu verdad con claridad y a escuchar los mensajes sutiles del espíritu. Es un día para la inspiración, las nuevas ideas y la conexión con lo invisible.", associatedColor: "Blanco" },
  { name: "Akbal", icon: DefaultMayanIcon, description: "Noche/Casa - Significa noche, oscuridad, el inframundo y el cuerpo. Un lugar de misterio, sueños e introspección.", detailedInterpretation: "Akbal te sumerge en el misterio de la oscuridad, el mundo de los sueños y la introspección profunda. Es un tiempo para mirar hacia adentro, encontrar la paz en la quietud y descubrir la abundancia que reside en tu ser interior. Confía en tu intuición.", associatedColor: "Negro/Azul" },
  { name: "Kan", icon: DefaultMayanIcon, description: "Semilla/Lagarto - Representa la semilla, la maduración, la manifestación y el potencial de crecimiento.", detailedInterpretation: "Kan es la semilla del potencial, lista para germinar y florecer. Te recuerda tu capacidad inherente para crecer, madurar y manifestar tus sueños. Es un día para plantar intenciones y enfocarte en tu desarrollo personal y creativo.", associatedColor: "Amarillo" },
  { name: "Chicchan", icon: DefaultMayanIcon, description: "Serpiente - Simboliza la vitalidad, la pasión, el instinto, la fuerza vital y la transformación.", detailedInterpretation: "Chicchan es la fuerza vital pura, la energía kundalini que reside en ti. Te conecta con tus instintos, tu cuerpo y tu pasión por la vida. Es un día para la sanación, la transformación y para honrar la sabiduría de tu cuerpo.", associatedColor: "Rojo" },
  { name: "Cimi", icon: DefaultMayanIcon, description: "Muerte/Transformador/Enlazador de Mundos - Representa la muerte, la transformación, la rendición y el desapego.", detailedInterpretation: "Cimi es el gran transformador, el que enlaza los mundos. Te enseña sobre el desapego, la rendición y la belleza de los ciclos de muerte y renacimiento. Es un día para soltar lo viejo y abrirte a nuevas oportunidades y perspectivas.", associatedColor: "Blanco" },
  { name: "Manik", icon: DefaultMayanIcon, description: "Venado/Mano - Simboliza la finalización, el logro, la sanación y las herramientas espirituales.", detailedInterpretation: "Manik es la mano que sana, la herramienta de la realización y el conocimiento. Te guía hacia la finalización de tus proyectos y te recuerda tu poder de sanar y crear. Es un día para la acción, la generosidad y la manifestación de tus dones.", associatedColor: "Azul/Negro" },
  { name: "Lamat", icon: DefaultMayanIcon, description: "Estrella/Conejo - Representa la estrella, la armonía, la abundancia, la belleza y el arte.", detailedInterpretation: "Lamat es la estrella que brilla con armonía y belleza, atrayendo la abundancia. Te inspira a crear, a encontrar la elegancia en todas las cosas y a multiplicar tus talentos. Es un día para la creatividad, la fertilidad y la apreciación del arte.", associatedColor: "Amarillo" },
  { name: "Muluc", icon: DefaultMayanIcon, description: "Agua/Luna - Simboliza el agua, las emociones, la purificación y el flujo de la vida.", detailedInterpretation: "Muluc es el agua primordial, la esencia de las emociones y la purificación. Te invita a fluir con la vida, a limpiar tus emociones y a recordar tu conexión con la conciencia universal. Es un día para la introspección emocional y la renovación.", associatedColor: "Rojo" },
  { name: "Oc", icon: DefaultMayanIcon, description: "Perro - Representa la lealtad, la compañía, la guía y el amor incondicional.", detailedInterpretation: "Oc es el compañero leal, el guía amoroso que te acompaña en tu camino. Te enseña sobre el amor incondicional, la fidelidad y la importancia de las relaciones verdaderas. Es un día para conectar con tus seres queridos y abrir tu corazón.", associatedColor: "Blanco" },
  { name: "Chuen", icon: DefaultMayanIcon, description: "Mono - Simboliza la alegría, la creatividad, el arte, el juego y la magia.", detailedInterpretation: "Chuen es el artista, el mago, el tejedor de la ilusión y la alegría. Te anima a jugar, a ser creativo y a encontrar la magia en lo cotidiano. Es un día para la espontaneidad, la diversión y la expresión artística.", associatedColor: "Azul/Negro" },
  { name: "Eb", icon: DefaultMayanIcon, description: "Camino/Hierba - Representa el sendero, el viaje, el libre albedrío y la vitalidad.", detailedInterpretation: "Eb es el camino de la vida, el libre albedrío y la vitalidad que surge de la tierra. Te recuerda que tienes el poder de elegir tu sendero y te conecta con la abundancia de la naturaleza. Es un día para tomar decisiones conscientes y agradecer las bendiciones.", associatedColor: "Amarillo" },
  { name: "Ben", icon: DefaultMayanIcon, description: "Caña/Caminante del Cielo - Simboliza los pilares de luz, conectando cielo y tierra, el coraje y la exploración.", detailedInterpretation: "Ben es el caminante del cielo, el pilar que une el cielo y la tierra. Te infunde coraje para explorar nuevos horizontes y expandir tu conciencia. Es un día para el crecimiento, la aventura y la conexión con tu sabiduría interior.", associatedColor: "Rojo" },
  { name: "Ix", icon: DefaultMayanIcon, description: "Jaguar/Mago - Representa el chamanismo, la magia, la intuición y los misterios del corazón de la tierra.", detailedInterpretation: "Ix es el mago, el jaguar que ve en la oscuridad y conoce los secretos de la tierra. Te conecta con tu intuición, tu poder interior y la magia del universo. Es un día para la introspección, la integridad y la conexión con lo sagrado.", associatedColor: "Blanco" },
  { name: "Men", icon: DefaultMayanIcon, description: "Águila - Simboliza la visión, la ambición, la conciencia superior y la mente colectiva.", detailedInterpretation: "Men es el águila que vuela alto, con una visión clara y una conexión con la conciencia superior. Te inspira a perseguir tus sueños más elevados y a confiar en tu visión. Es un día para la esperanza, la ambición y la expansión mental.", associatedColor: "Azul/Negro" },
  { name: "Cib", icon: DefaultMayanIcon, description: "Buitre/Lechuza/Guerrero - Representa la sabiduría, la introspección, el conocimiento ancestral y el perdón.", detailedInterpretation: "Cib es el guerrero sabio, el que extrae conocimiento de las experiencias pasadas y ancestrales. Te enseña sobre el perdón, la confianza y la capacidad de enfrentar tus miedos. Es un día para la introspección profunda y la conexión con la sabiduría interior.", associatedColor: "Amarillo" },
  { name: "Caban", icon: DefaultMayanIcon, description: "Tierra/Terremoto - Simboliza la tierra, la sincronicidad, la navegación y la evolución.", detailedInterpretation: "Caban es la fuerza de la Tierra, la sincronicidad y la evolución constante. Te ayuda a navegar los cambios de la vida y a mantenerte centrado en tu propósito. Es un día para la alineación, la gratitud por la Madre Tierra y la adaptación.", associatedColor: "Rojo" },
  { name: "Etznab", icon: DefaultMayanIcon, description: "Pedernal/Cuchillo/Espejo - Representa la verdad, la claridad, el discernimiento y el sacrificio.", detailedInterpretation: "Etznab es el espejo de la verdad, el cuchillo que corta la ilusión y trae claridad. Te desafía a enfrentar la verdad, a tomar decisiones con discernimiento y a soltar lo que ya no te sirve. Es un día para la honestidad radical y la auto-reflexión.", associatedColor: "Blanco" },
  { name: "Cauac", icon: DefaultMayanIcon, description: "Tormenta/Lluvia - Simboliza la tormenta, la purificación, la transformación y la renovación.", detailedInterpretation: "Cauac es la tormenta que purifica, transforma y renueva. Te trae la energía necesaria para liberar viejos patrones y catalizar cambios profundos. Es un día para la limpieza energética, la activación y la bienvenida a la transformación.", associatedColor: "Azul/Negro" },
  { name: "Ahau", icon: DefaultMayanIcon, description: "Sol/Flor/Señor/Iluminación - Representa la iluminación, el amor incondicional, la totalidad y la conexión con lo divino.", detailedInterpretation: "Ahau es la iluminación, el Sol central, la expresión del amor incondicional y la maestría. Te conecta con tu divinidad interior y te recuerda tu capacidad de irradiar luz y amor. Es un día para la celebración, la gratitud y la unión con el Todo.", associatedColor: "Amarillo" },
];
export const ALL_MAYAN_SIGN_NAMES = MAYAN_ZODIAC_SIGNS.map(s => s.name as string) as [string, ...string[]];

export const GALACTIC_TONES: GalacticTone[] = [
  { id: 1, nameKey: "Magnetic", keywordKey: "Unity", questionKey: "WhatIsMyGoal", detailedInterpretation: "El Tono Magnético es el inicio, el que atrae el propósito. Unifica todas las partes de tu ser para enfocarte en una meta clara. Hoy pregúntate: ¿Cuál es mi verdadera intención? ¿Qué quiero atraer a mi vida?" },
  { id: 2, nameKey: "Lunar", keywordKey: "Challenge", questionKey: "WhatAreTheObstacles", detailedInterpretation: "El Tono Lunar revela la dualidad y los desafíos. Te ayuda a identificar los obstáculos que necesitas superar para alcanzar tu propósito. Hoy reflexiona: ¿Qué polaridades existen en mi situación? ¿Cuáles son los desafíos que me fortalecen?" },
  { id: 3, nameKey: "Electric", keywordKey: "Service", questionKey: "HowCanIBestServe", detailedInterpretation: "El Tono Eléctrico activa el servicio. Es la energía en movimiento, la chispa que enciende la acción. Te pregunta cómo puedes poner tus talentos al servicio de un propósito mayor. Hoy considera: ¿Cómo puedo activar mis recursos? ¿De qué manera mi servicio beneficia a otros?" },
  { id: 4, nameKey: "SelfExisting", keywordKey: "Form", questionKey: "WhatIsTheFormOfAction", detailedInterpretation: "El Tono Auto-Existente define la forma de la acción. Da estructura y medida a tu propósito. Te ayuda a establecer las bases y a entender cómo manifestar tus ideas. Hoy piensa: ¿Cuál es la forma más efectiva para mi acción? ¿Qué patrones y medidas necesito establecer?" },
  { id: 5, nameKey: "Overtone", keywordKey: "Radiance", questionKey: "HowCanIEmpowerMyself", detailedInterpretation: "El Tono Entonado comanda el esplendor y el poder interior. Reúne los recursos y te da la autoridad para brillar. Hoy enfócate en: ¿Cómo puedo reunir mis fuerzas y recursos? ¿De qué manera irradio mi poder personal?" },
  { id: 6, nameKey: "Rhythmic", keywordKey: "Equality", questionKey: "HowCanIOrganizeForEquality", detailedInterpretation: "El Tono Rítmico organiza para la igualdad y el equilibrio. Te ayuda a encontrar el balance en el flujo de la vida y a administrar los desafíos de manera orgánica. Hoy busca: ¿Cómo puedo equilibrar mi vida y mis acciones? ¿Cómo organizo mi entorno para la armonía?" },
  { id: 7, nameKey: "Resonant", keywordKey: "Attunement", questionKey: "HowCanIAlignMyService", detailedInterpretation: "El Tono Resonante canaliza la sintonización y la inspiración. Te conecta con la fuente de la sabiduría y te permite vibrar en armonía con el universo. Hoy sintoniza con: ¿Qué me inspira verdaderamente? ¿Cómo puedo alinear mi ser con mi propósito más elevado?" },
  { id: 8, nameKey: "Galactic", keywordKey: "Integrity", questionKey: "DoILiveWhatIBelieve", detailedInterpretation: "El Tono Galáctico modela la integridad y la armonía. Te invita a vivir de acuerdo con tus creencias y a actuar con coherencia. Hoy examina: ¿Mis acciones reflejan mis valores? ¿Estoy viviendo en integridad con mi verdad?" },
  { id: 9, nameKey: "Solar", keywordKey: "Intention", questionKey: "HowDoIAchieveMyPurpose", detailedInterpretation: "El Tono Solar pulsa la intención y la realización. Te da el impulso final para manifestar tu propósito y alcanzar tus metas. Hoy pregúntate: ¿Cómo puedo dirigir mi energía hacia la realización de mi intención? ¿Qué pasos concretos debo tomar?" },
  { id: 10, nameKey: "Planetary", keywordKey: "Manifestation", questionKey: "HowDoIPerfectWhatIDo", detailedInterpretation: "El Tono Planetario perfecciona la manifestación. Produce lo que has intencionado, haciendo tangible tu visión. Hoy enfócate en: ¿Cómo puedo mejorar y perfeccionar mi creación? ¿Qué se está manifestando a través de mí?" },
  { id: 11, nameKey: "Spectral", keywordKey: "Liberation", questionKey: "HowDoIReleaseAndLetGo", detailedInterpretation: "El Tono Espectral disuelve y libera. Te ayuda a soltar lo que ya no sirve, a desintegrar viejas estructuras y a abrir espacio para lo nuevo. Hoy considera: ¿Qué necesito liberar en mi vida? ¿Cómo puedo dejar ir las ataduras y limitaciones?" },
  { id: 12, nameKey: "Crystal", keywordKey: "Cooperation", questionKey: "HowCanIDedicateToCooperation", detailedInterpretation: "El Tono Cristal dedica a la cooperación y la universalización. Te enseña a compartir tus dones y a trabajar en conjunto por un bien mayor. Hoy reflexiona: ¿Cómo puedo colaborar con otros? ¿De qué manera mis acciones contribuyen a la comunidad?" },
  { id: 13, nameKey: "Cosmic", keywordKey: "Presence", questionKey: "HowCanIExpandMyJoyAndLove", detailedInterpretation: "El Tono Cósmico trasciende con presencia y perdurabilidad. Es el retorno al origen y la expansión de la conciencia. Te invita a vivir plenamente en el presente y a irradiar amor y alegría. Hoy experimenta: ¿Cómo puedo estar más presente? ¿Cómo expando mi amor y mi alegría sin límites?" },
];


// Base date: July 26, 1987, is Kin 1 (Imix, Tone 1) in the Dreamspell count.
const DREAMSPELL_BASE_DATE_GREGORIAN = new Date(1987, 7 - 1, 26); // Month is 0-indexed
const DREAMSPELL_BASE_KIN_NUMBER = 1; // Kin 1: Imix (index 0), Tone 1.

function getDaysDifference(date1: Date, date2: Date): number {
  // Normalize dates to UTC midnight to avoid timezone issues in day difference calculation
  const utcDate1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const utcDate2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
  const diffTime = utcDate2 - utcDate1;
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

export function calculateMayanKin(birthDate: Date): MayanKinInfo | null {
  if (!(birthDate instanceof Date) || isNaN(birthDate.getTime())) {
    return null;
  }

  const daysDiff = getDaysDifference(DREAMSPELL_BASE_DATE_GREGORIAN, birthDate);

  // Kin index (0-259)
  const kinIndexToday = ( (DREAMSPELL_BASE_KIN_NUMBER - 1 + daysDiff) % 260 + 260) % 260;

  // Kin number (1-260) for display
  const kinNumber = kinIndexToday + 1;

  // Day Sign (Nahual) - index 0-19
  const daySignIndex = kinIndexToday % 20;
  // Tone - index 0-12 for array, but we need to match tone.id which is 1-13
  const toneId = (kinIndexToday % 13) + 1;

  const daySign = MAYAN_ZODIAC_SIGNS[daySignIndex];
  const tone = GALACTIC_TONES.find(t => t.id === toneId);

  if (!daySign || !tone) {
    console.error("Error calculating Mayan Kin: Could not find sign or tone for indices.", {daySignIndex, toneId, kinIndexToday, daysDiff});
    return null;
  }

  return { daySign, tone, kinNumber };
}

export const MAJOR_ARCANA_TAROT_CARDS = [
  "The Fool", "The Magician", "The High Priestess", "The Empress", "The Emperor",
  "The Hierophant", "The Lovers", "The Chariot", "Strength", "The Hermit",
  "Wheel of Fortune", "Justice", "The Hanged Man", "Death", "Temperance",
  "The Devil", "The Tower", "The Star", "The Moon", "The Sun", "Judgement", "The World"
];


// Aliased DogIcon from Dog and TypeIcon from Type for clarity if needed elsewhere, though direct use is fine.
export { DogIcon as ActualDogIcon, TypeIcon as ActualTypeIcon };

