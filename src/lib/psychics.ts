
import type { StaticImageData } from 'next/image';

export interface Psychic {
  id: string;
  name: string;
  image: string; // Changed from StaticImageData to string
  specialty: string;
  phrase: string;
  rating: number;
  readings: number;
  status: "Available" | "Busy" | "Meditating";
}

export const psychics: Psychic[] = [
  {
    id: 'esmeralda',
    name: 'Esmeralda',
    image: '/images/esmeralda.png', // Using public URL path
    specialty: 'Amor y Relaciones',
    phrase: 'El corazón conoce el camino verdadero.',
    rating: 4.8,
    readings: 1250,
    status: 'Available',
  },
  {
    id: 'zephyr',
    name: 'Zephyr',
    image: '/images/zephyr.png', // Using public URL path
    specialty: 'Carrera y Finanzas',
    phrase: 'Desbloquea tu potencial.',
    rating: 4.5,
    readings: 980,
    status: 'Busy',
  },
  {
    id: 'seraphina',
    name: 'Seraphina',
    image: '/images/seraphina.png', // Using public URL path
    specialty: 'Espiritualidad y Crecimiento Personal',
    phrase: 'Encuentra la luz interior.',
    rating: 4.9,
    readings: 1520,
    status: 'Meditating',
  },
];
