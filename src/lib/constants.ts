
import type { ZodiacSignName, ZodiacSign, HoroscopeData, CompatibilityData, LuckyNumbersData, LunarData, AscendantData, ChineseZodiacSign, MayanZodiacSign, ChineseAnimalSignName, MayanSignName } from '@/types';
import { Activity, CircleDollarSign, Users, Moon, Sun, Leaf, Scale, Zap, ArrowUpRight, Mountain, Waves, Fish, SparklesIcon, Rabbit as RabbitIcon, Feather as FeatherIcon, Star as StarIcon, Squirrel, VenetianMask, Bird, Crown, Shell, PawPrint, Bone, Dog as DogIcon, Type as TypeIcon } from 'lucide-react';

export const ZODIAC_SIGNS: ZodiacSign[] = [
  { name: "Aries", icon: Activity, dateRange: "Mar 21 - Apr 19" },
  { name: "Taurus", icon: CircleDollarSign, dateRange: "Apr 20 - May 20" },
  { name: "Gemini", icon: Users, dateRange: "May 21 - Jun 20" },
  { name: "Cancer", icon: Moon, dateRange: "Jun 21 - Jul 22" },
  { name: "Leo", icon: Sun, dateRange: "Jul 23 - Aug 22" },
  { name: "Virgo", icon: Leaf, dateRange: "Aug 23 - Sep 22" },
  { name: "Libra", icon: Scale, dateRange: "Sep 23 - Oct 22" },
  { name: "Scorpio", icon: Zap, dateRange: "Oct 23 - Nov 21" },
  { name: "Sagittarius", icon: ArrowUpRight, dateRange: "Nov 22 - Dec 21" },
  { name: "Capricorn", icon: Mountain, dateRange: "Dec 22 - Jan 19" },
  { name: "Aquarius", icon: Waves, dateRange: "Jan 20 - Feb 18" },
  { name: "Pisces", icon: Fish, dateRange: "Feb 19 - Mar 20" },
];

export const ALL_SIGN_NAMES = ZODIAC_SIGNS.map(sign => sign.name);

// This genericHoroscopeText is not actively used by the main horoscope section which now uses Genkit.
// However, if any other part were to call getHoroscope directly, this would be used.
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
  report: `${sign1} y ${sign2} tienen una dinámica compleja pero potencialmente gratificante. La comunicación es clave. ${sign1} aporta pasión, mientras que ${sign2} ofrece estabilidad. Juntos pueden lograr grandes cosas si aprenden a apreciar sus diferencias. Este es un texto de ejemplo.`,
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
  // Simplified logic for example, real ascendant calculation is complex
  const ascendantSign = ZODIAC_SIGNS[month % 12].name; 
  return {
    sign: ascendantSign,
    briefExplanation: `Tu signo ascendente, ${ascendantSign}, influye en tu personalidad externa y cómo te perciben los demás. Juega un papel importante en tus primeras impresiones y reacciones espontáneas. (Explicación de ejemplo).`,
  };
};

export const AstroAppLogo = SparklesIcon;
export const WesternAstrologyIcon = StarIcon;
export const ChineseAstrologyIcon = RabbitIcon; 
export const MayanAstrologyIcon = FeatherIcon;

// Placeholder generic icon for Mayan signs if specific ones aren't available in Lucide
const DefaultMayanIcon = TypeIcon; // Using 'TypeIcon' as a generic placeholder

// --- Full data for Chinese Astrology ---
export const CHINESE_ZODIAC_SIGNS: ChineseZodiacSign[] = [
  { name: "Rat", icon: Squirrel, years: [2020, 2008, 1996, 1984, 1972, 1960, 1948, 1936], element: "Agua", description: "Ingenioso, de mente rápida, encantador y persuasivo." },
  { name: "Ox", icon: VenetianMask, years: [2021, 2009, 1997, 1985, 1973, 1961, 1949, 1937], element: "Tierra", description: "Diligente, confiable, fuerte y determinado." },
  { name: "Tiger", icon: PawPrint, years: [2022, 2010, 1998, 1986, 1974, 1962, 1950, 1938], element: "Madera", description: "Valiente, seguro de sí mismo, competitivo e impredecible." },
  { name: "Rabbit", icon: RabbitIcon, years: [2023, 2011, 1999, 1987, 1975, 1963, 1951, 1939], element: "Madera", description: "Gentil, tranquilo, elegante y alerta; rápido y hábil." },
  { name: "Dragon", icon: Crown, years: [2024, 2012, 2000, 1988, 1976, 1964, 1952, 1940], element: "Tierra", description: "Seguro de sí mismo, inteligente, entusiasta y un líder natural." },
  { name: "Snake", icon: Shell, years: [2025, 2013, 2001, 1989, 1977, 1965, 1953, 1941], element: "Fuego", description: "Enigmático, inteligente, sabio e intuitivo." },
  { name: "Horse", icon: Zap, years: [2026, 2014, 2002, 1990, 1978, 1966, 1954, 1942], element: "Fuego", description: "Animado, activo, enérgico y le encanta estar entre la multitud." },
  { name: "Goat", icon: Leaf, years: [2027, 2015, 2003, 1991, 1979, 1967, 1955, 1943], element: "Tierra", description: "Amable, de buenos modales, tímido, estable, comprensivo y amigable." },
  { name: "Monkey", icon: Bird, years: [2028, 2016, 2004, 1992, 1980, 1968, 1956, 1944], element: "Metal", description: "Agudo, inteligente, curioso y travieso." },
  { name: "Rooster", icon: VenetianMask, years: [2029, 2017, 2005, 1993, 1981, 1969, 1957, 1945], element: "Metal", description: "Observador, trabajador, ingenioso, valiente y talentoso." },
  { name: "Dog", icon: DogIcon, years: [2030, 2018, 2006, 1994, 1982, 1970, 1958, 1946], element: "Tierra", description: "Leal, honesto, amable, bondadoso, cauteloso y prudente." },
  { name: "Pig", icon: Bone, years: [2031, 2019, 2007, 1995, 1983, 1971, 1959, 1947], element: "Agua", description: "Diligente, compasivo, generoso y de trato fácil." },
];
export const ALL_CHINESE_SIGN_NAMES = CHINESE_ZODIAC_SIGNS.map(s => s.name);

// --- Full data for Mayan Astrology ---
export const MAYAN_ZODIAC_SIGNS: MayanZodiacSign[] = [
  { name: "Imix", icon: DefaultMayanIcon, description: "Dragón/Cocodrilo - Representa el mar primordial, la fuente de toda vida, abundancia y nuevos comienzos." },
  { name: "Ik", icon: DefaultMayanIcon, description: "Viento - Simboliza el viento, el aliento, el espíritu, la fuerza vital, la comunicación y la inspiración." },
  { name: "Akbal", icon: DefaultMayanIcon, description: "Noche/Casa - Significa noche, oscuridad y el inframundo; un lugar de misterio, sueños e intuición." },
  { name: "Kan", icon: DefaultMayanIcon, description: "Semilla/Lagarto - Representa la semilla, la maduración, la manifestación y el potencial de crecimiento." },
  { name: "Chicchan", icon: DefaultMayanIcon, description: "Serpiente - Simboliza la vitalidad, la pasión, el instinto y la transformación." },
  { name: "Cimi", icon: DefaultMayanIcon, description: "Muerte/Transformador - Representa la muerte, la transformación, la rendición y la conexión con los antepasados." },
  { name: "Manik", icon: DefaultMayanIcon, description: "Venado/Mano - Simboliza la finalización, el logro, las herramientas espirituales y la guía." },
  { name: "Lamat", icon: DefaultMayanIcon, description: "Estrella/Conejo - Representa la estrella, la armonía, la abundancia y la capacidad de ver la belleza." },
  { name: "Muluc", icon: DefaultMayanIcon, description: "Agua/Luna - Simboliza el agua, las emociones, la purificación y el flujo de la vida." },
  { name: "Oc", icon: DefaultMayanIcon, description: "Perro - Representa la lealtad, la compañía, la guía y la superación de barreras." },
  { name: "Chuen", icon: DefaultMayanIcon, description: "Mono - Simboliza la alegría, la creatividad, el arte y el tejedor del tiempo." },
  { name: "Eb", icon: DefaultMayanIcon, description: "Camino/Hierba - Representa el sendero, el viaje, el libre albedrío y la conexión con la naturaleza." },
  { name: "Ben", icon: DefaultMayanIcon, description: "Caña/Caminante del Cielo - Simboliza los pilares de luz, conectando el cielo y la tierra, el coraje y la exploración." },
  { name: "Ix", icon: DefaultMayanIcon, description: "Jaguar/Mago - Representa el chamanismo, la magia, la intuición y los misterios de la noche." },
  { name: "Men", icon: DefaultMayanIcon, description: "Águila - Simboliza la visión, la ambición, la conciencia superior y la búsqueda de metas." },
  { name: "Cib", icon: DefaultMayanIcon, description: "Buitre/Lechuza/Guerrero - Representa la sabiduría, la introspección, el conocimiento ancestral y el enfrentamiento de desafíos." },
  { name: "Caban", icon: DefaultMayanIcon, description: "Tierra/Terremoto - Simboliza la tierra, la sincronicidad, la navegación y las fuerzas de la naturaleza." },
  { name: "Etznab", icon: DefaultMayanIcon, description: "Pedernal/Cuchillo - Representa la verdad, la claridad, el discernimiento y la capacidad de cortar la ilusión." },
  { name: "Cauac", icon: DefaultMayanIcon, description: "Tormenta/Lluvia - Simboliza la tormenta, la purificación, la transformación y la renovación." },
  { name: "Ahau", icon: DefaultMayanIcon, description: "Sol/Flor/Señor - Representa la iluminación, el amor incondicional, la totalidad y la conexión con lo divino." },
];
export const ALL_MAYAN_SIGN_NAMES = MAYAN_ZODIAC_SIGNS.map(s => s.name);

// Aliased DogIcon from Dog and TypeIcon from Type for clarity if needed elsewhere, though direct use is fine.
export { DogIcon as ActualDogIcon, TypeIcon as ActualTypeIcon };
