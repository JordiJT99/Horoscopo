
import type { ZodiacSignName, ZodiacSign, HoroscopeData, CompatibilityData, LuckyNumbersData, LunarData, AscendantData, ChineseZodiacSign, MayanZodiacSign, ChineseAnimalSignName, MayanSignName } from '@/types';
import { Activity, CircleDollarSign, Users, Moon, Sun, Leaf, Scale, Zap, ArrowUpRight, Mountain, Waves, Fish, SparklesIcon, Rabbit as RabbitIcon, Feather as FeatherIcon, Star as StarIcon, Squirrel, VenetianMask, Bird, Crown, Shell, PawPrint, HorseIcon, Sheep, Bone, DogIcon, TypeIcon } from 'lucide-react';

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

const genericHoroscopeText = "Today is a day of new beginnings. Embrace change and look for opportunities. Your energy levels are high, make the most of it! Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

export const getHoroscope = (sign: ZodiacSignName): HoroscopeData => ({
  sign,
  daily: `Daily Horoscope for ${sign}: ${genericHoroscopeText} Focus on personal projects.`,
  weekly: `Weekly Horoscope for ${sign}: This week brings a mix of challenges and rewards. ${genericHoroscopeText} Plan your finances carefully.`,
  monthly: `Monthly Horoscope for ${sign}: The month ahead is pivotal for your career growth. ${genericHoroscopeText} Relationships will require attention.`,
});

export const getCompatibility = (sign1: ZodiacSignName, sign2: ZodiacSignName): CompatibilityData => ({
  sign1,
  sign2,
  report: `${sign1} and ${sign2} have a complex but potentially rewarding dynamic. Communication is key. ${sign1} brings passion, while ${sign2} offers stability. Together, they can achieve great things if they learn to appreciate their differences. Lorem ipsum dolor sit amet.`,
  score: Math.floor(Math.random() * 5) + 1,
});

export const getLuckyNumbers = (sign: ZodiacSignName): LuckyNumbersData => ({
  sign,
  numbers: [Math.floor(Math.random() * 50) + 1, Math.floor(Math.random() * 50) + 1, Math.floor(Math.random() * 50) + 1],
  luckyColor: ["Red", "Green", "Blue", "Yellow", "Purple", "Orange"][Math.floor(Math.random() * 6)],
  luckyGemstone: ["Diamond", "Emerald", "Sapphire", "Ruby", "Amethyst", "Topaz"][Math.floor(Math.random() * 6)],
});

export const getCurrentLunarData = (): LunarData => ({
  phase: ["Full Moon", "New Moon", "Waxing Crescent", "Waning Gibbous"][Math.floor(Math.random() * 4)],
  illumination: Math.floor(Math.random() * 100),
  nextFullMoon: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toDateString(),
  nextNewMoon: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toDateString(),
});

export const getAscendantSign = (birthDate: Date, birthTime: string, birthCity: string): AscendantData => {
  const month = birthDate.getMonth();
  const ascendantSign = ZODIAC_SIGNS[month % 12].name;
  return {
    sign: ascendantSign,
    briefExplanation: `Your ascendant sign, ${ascendantSign}, influences your outer personality and how others perceive you. It plays a significant role in your first impressions and spontaneous reactions.`,
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
  { name: "Rat", icon: Squirrel, years: [2020, 2008, 1996, 1984, 1972, 1960, 1948, 1936], element: "Water", description: "Resourceful, quick-witted, charming, and persuasive." },
  { name: "Ox", icon: VenetianMask, years: [2021, 2009, 1997, 1985, 1973, 1961, 1949, 1937], element: "Earth", description: "Diligent, dependable, strong, and determined." },
  { name: "Tiger", icon: PawPrint, years: [2022, 2010, 1998, 1986, 1974, 1962, 1950, 1938], element: "Wood", description: "Brave, confident, competitive, and unpredictable." },
  { name: "Rabbit", icon: RabbitIcon, years: [2023, 2011, 1999, 1987, 1975, 1963, 1951, 1939], element: "Wood", description: "Gentle, quiet, elegant, and alert; quick and skillful." },
  { name: "Dragon", icon: Crown, years: [2024, 2012, 2000, 1988, 1976, 1964, 1952, 1940], element: "Earth", description: "Confident, intelligent, enthusiastic, and a natural leader." },
  { name: "Snake", icon: Shell, years: [2025, 2013, 2001, 1989, 1977, 1965, 1953, 1941], element: "Fire", description: "Enigmatic, intelligent, wise, and intuitive." },
  { name: "Horse", icon: HorseIcon, years: [2026, 2014, 2002, 1990, 1978, 1966, 1954, 1942], element: "Fire", description: "Animated, active, energetic, and loves to be in a crowd." },
  { name: "Goat", icon: Sheep, years: [2027, 2015, 2003, 1991, 1979, 1967, 1955, 1943], element: "Earth", description: "Gentle, mild-mannered, shy, stable, sympathetic, and amicable." },
  { name: "Monkey", icon: Bird, years: [2028, 2016, 2004, 1992, 1980, 1968, 1956, 1944], element: "Metal", description: "Sharp, smart, curious, and mischievous." },
  { name: "Rooster", icon: VenetianMask, years: [2029, 2017, 2005, 1993, 1981, 1969, 1957, 1945], element: "Metal", description: "Observant, hardworking, resourceful, courageous, and talented." },
  { name: "Dog", icon: DogIcon, years: [2030, 2018, 2006, 1994, 1982, 1970, 1958, 1946], element: "Earth", description: "Loyal, honest, amiable, kind, cautious, and prudent." },
  { name: "Pig", icon: Bone, years: [2031, 2019, 2007, 1995, 1983, 1971, 1959, 1947], element: "Water", description: "Diligent, compassionate, generous, and easy-going." },
];
export const ALL_CHINESE_SIGN_NAMES = CHINESE_ZODIAC_SIGNS.map(s => s.name);

// --- Full data for Mayan Astrology ---
export const MAYAN_ZODIAC_SIGNS: MayanZodiacSign[] = [
  { name: "Imix", icon: DefaultMayanIcon, description: "Dragon/Crocodile - Represents the primal sea, the source of all life, abundance, and new beginnings." },
  { name: "Ik", icon: DefaultMayanIcon, description: "Wind - Symbolizes wind, breath, spirit, life force, communication, and inspiration." },
  { name: "Akbal", icon: DefaultMayanIcon, description: "Night/House - Means night, darkness, and the underworld; a place of mystery, dreams, and intuition." },
  { name: "Kan", icon: DefaultMayanIcon, description: "Seed/Lizard - Represents seed, ripening, manifestation, and the potential for growth." },
  { name: "Chicchan", icon: DefaultMayanIcon, description: "Serpent - Symbolizes vitality, passion, instinct, and transformation." },
  { name: "Cimi", icon: DefaultMayanIcon, description: "Death/Transformer - Represents death, transformation, surrender, and the connection to ancestors." },
  { name: "Manik", icon: DefaultMayanIcon, description: "Deer/Hand - Symbolizes completion, accomplishment, spiritual tools, and guidance." },
  { name: "Lamat", icon: DefaultMayanIcon, description: "Star/Rabbit - Represents star, harmony, abundance, and the ability to see beauty." },
  { name: "Muluc", icon: DefaultMayanIcon, description: "Water/Moon - Symbolizes water, emotions, purification, and the flow of life." },
  { name: "Oc", icon: DefaultMayanIcon, description: "Dog - Represents loyalty, companionship, guidance, and breaking through barriers." },
  { name: "Chuen", icon: DefaultMayanIcon, description: "Monkey - Symbolizes playfulness, creativity, artistry, and the weaver of time." },
  { name: "Eb", icon: DefaultMayanIcon, description: "Road/Grass - Represents the path, journey, free will, and the connection to nature." },
  { name: "Ben", icon: DefaultMayanIcon, description: "Reed/Skywalker - Symbolizes pillars of light, connecting heaven and earth, courage, and exploration." },
  { name: "Ix", icon: DefaultMayanIcon, description: "Jaguar/Wizard - Represents shamanism, magic, intuition, and the mysteries of the night." },
  { name: "Men", icon: DefaultMayanIcon, description: "Eagle - Symbolizes vision, ambition, higher consciousness, and the pursuit of goals." },
  { name: "Cib", icon: DefaultMayanIcon, description: "Vulture/Owl/Warrior - Represents wisdom, introspection, ancestral knowledge, and confronting challenges." },
  { name: "Caban", icon: DefaultMayanIcon, description: "Earth/Earthquake - Symbolizes earth, synchronicity, navigation, and the forces of nature." },
  { name: "Etznab", icon: DefaultMayanIcon, description: "Flint/Knife - Represents truth, clarity, discernment, and the ability to cut through illusion." },
  { name: "Cauac", icon: DefaultMayanIcon, description: "Storm/Rain - Symbolizes storm, purification, transformation, and renewal." },
  { name: "Ahau", icon: DefaultMayanIcon, description: "Sun/Flower/Lord - Represents enlightenment, unconditional love, wholeness, and connection to the divine." },
];
export const ALL_MAYAN_SIGN_NAMES = MAYAN_ZODIAC_SIGNS.map(s => s.name);
