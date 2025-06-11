import type { ZodiacSignName, ZodiacSign, HoroscopeData, CompatibilityData, LuckyNumbersData, LunarData, AscendantData } from '@/types';
import { Activity, CircleDollarSign, Users, Moon, Sun, Leaf, Scale, Zap, ArrowUpRight, Mountain, Waves, Fish, SparklesIcon } from 'lucide-react';

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

// Placeholder Data
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
  score: Math.floor(Math.random() * 5) + 1, // Random score 1-5
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
  // Placeholder: In a real app, this would involve complex calculations or an API call.
  // For now, just return a random sign based on the month of birthDate as a mock.
  const month = birthDate.getMonth();
  const ascendantSign = ZODIAC_SIGNS[month % 12].name;
  return {
    sign: ascendantSign,
    briefExplanation: `Your ascendant sign, ${ascendantSign}, influences your outer personality and how others perceive you. It plays a significant role in your first impressions and spontaneous reactions.`,
  };
};

export const AstroAppLogo = SparklesIcon;
