
import type { StaticImageData } from 'next/image';

export interface Psychic {
  id: string;
  name: string;
  image: string; // Changed from StaticImageData to string
  specialty: string; // This will now be a translation key
  phrase: string; // This will now be a translation key
  rating: number;
  readings: number;
  status: "Available" | "Busy" | "Meditating";
}

export const psychics: Psychic[] = [
  {
    id: 'esmeralda', // Keep IDs as unique identifiers
    name: 'Esmeralda', // Keep names as they might be used elsewhere or remain untranslated specific names
    image: '/images/esmeralda.png', // Using public URL path
    specialty: 'PsychicSpecialty.loveRelationships', // Translation key
    phrase: 'PsychicPhrase.esmeralda', // Translation key
    rating: 4.8,
    readings: 1250,
    status: 'Available',
  },
  {
    id: 'zephyr', // Keep IDs
    name: 'Zephyr', // Keep names
    image: '/images/zephyr.png', // Using public URL path
    specialty: 'PsychicSpecialty.careerFinance', // Translation key
    phrase: 'PsychicPhrase.zephyr', // Translation key
    rating: 4.5,
    readings: 980,
    status: 'Busy',
  },
  {
    id: 'seraphina',
    name: 'Seraphina',
    image: '/images/seraphina.png', // Using public URL path
    specialty: 'PsychicSpecialty.spiritualityGrowth', // Translation key
    phrase: 'PsychicPhrase.seraphina', // Translation key
    rating: 4.9,
    readings: 1520,
    status: 'Meditating',
  },
];
