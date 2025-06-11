
import type { ZodiacSignName, ZodiacSign, HoroscopeData, CompatibilityData, LuckyNumbersData, LunarData, AscendantData, ChineseZodiacSign, MayanZodiacSign, ChineseAnimalSignName, ChineseZodiacResult, ChineseCompatibilityData, MayanSignName } from '@/types';
import { Activity, CircleDollarSign, Users, Moon, Sun, Leaf, Scale, Zap, ArrowUpRight, Mountain, Waves, Fish, SparklesIcon, Rabbit as RabbitIcon, Feather as FeatherIcon, Star as StarIcon, Squirrel, VenetianMask, Bird, Crown, Shell, PawPrint, Bone, Dog as DogIcon, Type as TypeIcon, Heart } from 'lucide-react';

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
  score: Math.floor(Math.random() * 5) + 1,
});

export const getLuckyNumbers = (sign: ZodiacSignName): LuckyNumbersData => ({
  sign,
  numbers: [Math.floor(Math.random() * 50) + 1, Math.floor(Math.random() * 50) + 1, Math.floor(Math.random() * 50) + 1],
  luckyColor: ["Rojo", "Verde", "Azul", "Amarillo", "Púrpura", "Naranja"][Math.floor(Math.random() * 6)],
  luckyGemstone: ["Diamante", "Esmeralda", "Zafiro", "Rubí", "Amatista", "Topacio"][Math.floor(Math.random() * 6)],
});

export const getCurrentLunarData = (): LunarData => ({
  phase: ["Luna Llena", "Luna Nueva", "Cuarto Creciente", "Menguante Gibosa"][Math.floor(Math.random() * 4)],
  illumination: Math.floor(Math.random() * 100),
  nextFullMoon: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric'}),
  nextNewMoon: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric'}),
});

export const getAscendantSign = (birthDate: Date, birthTime: string, birthCity: string): AscendantData => {
  const month = birthDate.getMonth();
  const ascendantSign = ZODIAC_SIGNS[month % 12].name;
  return {
    sign: ascendantSign,
    briefExplanation: `Tu signo ascendente, ${ascendantSign}, influye en tu personalidad externa y cómo te perciben los demás. Juega un papel importante en tus primeras impresiones y reacciones espontáneas. (Explicación de ejemplo en español).`,
  };
};

export const AstroAppLogo = SparklesIcon;
export const WesternAstrologyIcon = StarIcon;
export const ChineseAstrologyIcon = RabbitIcon;
export const MayanAstrologyIcon = FeatherIcon;
export const CompatibilityIcon = Heart;


// --- Full data for Chinese Astrology ---
export const CHINESE_ZODIAC_SIGNS: ChineseZodiacSign[] = [
  { name: "Rat", icon: Squirrel, years: [2020, 2008, 1996, 1984, 1972, 1960, 1948, 1936, 1924, 2032], element: "Agua", description: "Ingeniosa, de mente rápida, encantadora y persuasiva." },
  { name: "Ox", icon: VenetianMask, years: [2021, 2009, 1997, 1985, 1973, 1961, 1949, 1937, 1925, 2033], element: "Tierra", description: "Diligente, confiable, fuerte y determinado." },
  { name: "Tiger", icon: PawPrint, years: [2022, 2010, 1998, 1986, 1974, 1962, 1950, 1938, 1926, 2034], element: "Madera", description: "Valiente, seguro de sí mismo, competitivo e impredecible." },
  { name: "Rabbit", icon: RabbitIcon, years: [2023, 2011, 1999, 1987, 1975, 1963, 1951, 1939, 1927, 2035], element: "Madera", description: "Gentil, tranquilo, elegante y alerta; rápido y hábil." },
  { name: "Dragon", icon: Crown, years: [2024, 2012, 2000, 1988, 1976, 1964, 1952, 1940, 1928, 2036], element: "Tierra", description: "Seguro de sí mismo, inteligente, entusiasta y un líder natural." },
  { name: "Snake", icon: Shell, years: [2025, 2013, 2001, 1989, 1977, 1965, 1953, 1941, 1929, 2037], element: "Fuego", description: "Enigmática, inteligente, sabia e intuitiva." },
  { name: "Horse", icon: Zap, years: [2026, 2014, 2002, 1990, 1978, 1966, 1954, 1942, 1930, 2038], element: "Fuego", description: "Animado, activo, enérgico y le encanta estar entre la multitud." },
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
    // Tríadas de Afinidad (Aliados) - Muy buena compatibilidad
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

    // Amigos Secretos - Excelente afinidad
    "Rat-Ox": { report: "La Rata y el Buey son amigos secretos, lo que indica una conexión profunda y un entendimiento natural. El Buey ofrece estabilidad a la Rata, y la Rata inspira al Buey. ¡Excelente unión!", score: 5 },
    "Tiger-Pig": { report: "El Tigre y el Cerdo son amigos secretos. El Cerdo admira la valentía del Tigre, y el Tigre aprecia la generosidad del Cerdo. Se equilibran y apoyan mutuamente.", score: 5 },
    "Rabbit-Dog": { report: "El Conejo y el Perro, como amigos secretos, tienen una relación de profunda lealtad y confianza. Se protegen y se ofrecen consuelo mutuo. Muy buena compatibilidad.", score: 5 },
    "Dragon-Rooster": { report: "¡Amigos secretos! El Dragón y el Gallo forman una pareja brillante y exitosa. El Gallo admira la majestuosidad del Dragón, y el Dragón se beneficia de la organización del Gallo. Juntos pueden lograr grandes cosas.", score: 5 },
    "Snake-Monkey": { report: "Amigos secretos con una conexión astuta. La Serpiente y el Mono se desafían intelectualmente y se divierten juntos. Aunque puede haber juegos de poder, la atracción es fuerte.", score: 4 },
    "Horse-Goat": { report: "Como amigos secretos, el Caballo y la Cabra se entienden a un nivel emocional profundo. La Cabra suaviza al Caballo, y el Caballo anima a la Cabra. Relación tierna y solidaria.", score: 5 },
    
    // Ejemplos de compatibilidad media o desafiante
    "Rat-Rabbit": { report: "La Rata y el Conejo pueden tener una relación cordial, pero necesitarán esforzarse. La Rata puede encontrar al Conejo demasiado sensible, y el Conejo puede ver a la Rata como agresiva.", score: 3 },
    "Ox-Tiger": { report: "Relación desafiante. El Buey es conservador y el Tigre es impulsivo. Sus diferencias pueden llevar a conflictos si no hay mucho respeto y comprensión.", score: 2 },
    "Tiger-Snake": { report: "Una combinación complicada. El Tigre es abierto y directo, mientras que la Serpiente es reservada y misteriosa. La desconfianza puede surgir fácilmente.", score: 2 },
    "Dragon-Dog": { report: "Esta es una pareja opuesta (Choque). El Dragón es optimista y expansivo, el Perro es más cauto y a veces pesimista. Requiere mucho trabajo y compromiso para que funcione.", score: 1 },
    "Horse-Rooster": { report: "Puede haber atracción inicial, pero el Caballo independiente y el Gallo crítico pueden chocar. Necesitan paciencia y aceptar sus diferencias para una relación duradera.", score: 2 },

  };
  const key1 = `${animal1}-${animal2}`;
  const key2 = `${animal2}-${animal1}`;

  if (compatibilityPairings[key1]) {
    return { animal1, animal2, ...compatibilityPairings[key1] };
  }
  if (compatibilityPairings[key2]) {
    // Asegurarse de devolver animal1 y animal2 en el orden original
    const result = compatibilityPairings[key2];
    return { animal1, animal2, report: result.report, score: result.score };
  }

  // Informe genérico si no se encuentra una pareja específica
  return {
    animal1,
    animal2,
    report: `La compatibilidad entre ${animal1} y ${animal2} tiene sus propios matices y dinámicas únicas. En general, las relaciones entre estos dos signos requieren comprensión y esfuerzo para apreciar las fortalezas de cada uno. (Informe genérico).`,
    score: Math.floor(Math.random() * 3) + 2, // Puntuación aleatoria entre 2 y 4 para el genérico
  };
};

// Placeholder generic icon for Mayan signs if specific ones aren't available in Lucide
// Moved declaration before usage
const DefaultMayanIcon = TypeIcon; // Using 'TypeIcon' as a generic placeholder

// --- Full data for Mayan Astrology ---
export const MAYAN_ZODIAC_SIGNS: MayanZodiacSign[] = [
  { name: "Imix", icon: DefaultMayanIcon, description: "Dragón/Cocodrilo - Representa el mar primordial, la fuente de toda vida, abundancia y nuevos comienzos. Energía de iniciación y nutrición.", associatedColor: "Rojo" },
  { name: "Ik", icon: DefaultMayanIcon, description: "Viento - Simboliza el viento, el aliento, el espíritu, la fuerza vital, la comunicación, la inspiración y las ideas. Energía de verdad y presencia.", associatedColor: "Blanco" },
  { name: "Akbal", icon: DefaultMayanIcon, description: "Noche/Casa - Significa noche, oscuridad, el inframundo y el cuerpo. Un lugar de misterio, sueños, introspección e intuición. Energía de quietud y abundancia interior.", associatedColor: "Negro/Azul" },
  { name: "Kan", icon: DefaultMayanIcon, description: "Semilla/Lagarto - Representa la semilla, la maduración, la manifestación, el potencial de crecimiento y la auto-germinación. Energía de creación y desarrollo.", associatedColor: "Amarillo" },
  { name: "Chicchan", icon: DefaultMayanIcon, description: "Serpiente - Simboliza la vitalidad, la pasión, el instinto, la fuerza vital (kundalini), la transformación y la sabiduría corporal. Energía de supervivencia y conexión con la tierra.", associatedColor: "Rojo" },
  { name: "Cimi", icon: DefaultMayanIcon, description: "Muerte/Transformador/Enlazador de Mundos - Representa la muerte, la transformación, la rendición, el desapego y la conexión con los antepasados. Energía de renovación y humildad.", associatedColor: "Blanco" },
  { name: "Manik", icon: DefaultMayanIcon, description: "Venado/Mano - Simboliza la finalización, el logro, la sanación, las herramientas espirituales, la guía y la danza. Energía de conocimiento y realización.", associatedColor: "Azul/Negro" },
  { name: "Lamat", icon: DefaultMayanIcon, description: "Estrella/Conejo - Representa la estrella, la armonía, la abundancia, la belleza, el arte y la capacidad de ver la elegancia. Energía de multiplicación y fertilidad.", associatedColor: "Amarillo" },
  { name: "Muluc", icon: DefaultMayanIcon, description: "Agua/Luna - Simboliza el agua, las emociones, la purificación, el flujo de la vida y las señales cósmicas. Energía de limpieza y recuerdo.", associatedColor: "Rojo" },
  { name: "Oc", icon: DefaultMayanIcon, description: "Perro - Representa la lealtad, la compañía, la guía, el amor incondicional, la fidelidad y la superación de barreras emocionales. Energía de conexión y nuevos comienzos.", associatedColor: "Blanco" },
  { name: "Chuen", icon: DefaultMayanIcon, description: "Mono - Simboliza la alegría, la creatividad, el arte, el juego, la magia y el tejedor del tiempo. Energía de ilusión y unidad.", associatedColor: "Azul/Negro" },
  { name: "Eb", icon: DefaultMayanIcon, description: "Camino/Hierba - Representa el sendero, el viaje, el libre albedrío, la vitalidad y la conexión con la naturaleza. Energía de abundancia y cosecha.", associatedColor: "Amarillo" },
  { name: "Ben", icon: DefaultMayanIcon, description: "Caña/Caminante del Cielo - Simboliza los pilares de luz, conectando el cielo y la tierra, el coraje, la exploración y el crecimiento. Energía de espacio y tiempo.", associatedColor: "Rojo" },
  { name: "Ix", icon: DefaultMayanIcon, description: "Jaguar/Mago - Representa el chamanismo, la magia, la intuición, la visión nocturna, los misterios y el corazón de la tierra. Energía de integridad y atemporalidad.", associatedColor: "Blanco" },
  { name: "Men", icon: DefaultMayanIcon, description: "Águila - Simboliza la visión, la ambición, la conciencia superior, la mente colectiva y la búsqueda de metas elevadas. Energía de esperanza y sueños.", associatedColor: "Azul/Negro" },
  { name: "Cib", icon: DefaultMayanIcon, description: "Buitre/Lechuza/Guerrero - Representa la sabiduría, la introspección, el conocimiento ancestral, el perdón y el enfrentamiento de desafíos. Energía de gracia y confianza.", associatedColor: "Amarillo" },
  { name: "Caban", icon: DefaultMayanIcon, description: "Tierra/Terremoto - Simboliza la tierra, la sincronicidad, la navegación, la evolución y las fuerzas de la naturaleza. Energía de alineación y centramiento.", associatedColor: "Rojo" },
  { name: "Etznab", icon: DefaultMayanIcon, description: "Pedernal/Cuchillo/Espejo - Representa la verdad, la claridad, el discernimiento, el sacrificio y la capacidad de cortar la ilusión. Energía de reflexión y distinción.", associatedColor: "Blanco" },
  { name: "Cauac", icon: DefaultMayanIcon, description: "Tormenta/Lluvia - Simboliza la tormenta, la purificación, la transformación, la renovación y la reunión de energías. Energía de activación y libertad.", associatedColor: "Azul/Negro" },
  { name: "Ahau", icon: DefaultMayanIcon, description: "Sol/Flor/Señor/Iluminación - Representa la iluminación, el amor incondicional, la totalidad, la ascensión y la conexión con lo divino. Energía de unión y maestría.", associatedColor: "Amarillo" },
];
export const ALL_MAYAN_SIGN_NAMES = MAYAN_ZODIAC_SIGNS.map(s => s.name as string) as [string, ...string[]];


// Aliased DogIcon from Dog and TypeIcon from Type for clarity if needed elsewhere, though direct use is fine.
export { DogIcon as ActualDogIcon, TypeIcon as ActualTypeIcon };

