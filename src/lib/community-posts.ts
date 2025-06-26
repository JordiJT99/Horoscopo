
import type { CommunityPost } from '@/types';
import { v4 as uuidv4 } from 'uuid';

const initialPosts: CommunityPost[] = [
  {
    id: '1',
    authorName: 'LeoStarGazer',
    authorAvatarUrl: 'https://placehold.co/64x64/7c3aed/ffffff.png?text=L',
    authorZodiacSign: 'Leo',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
    content: "¡Vaya día! El horóscopo de hoy para Leo decía que habría un impulso de energía creativa y ¡no bromeaba! Terminé una pintura en la que he estado trabajando durante semanas. ¿Alguien más sintió esa chispa hoy?",
  },
  {
    id: '2',
    authorName: 'AquaMind',
    authorAvatarUrl: 'https://placehold.co/64x64/7c3aed/ffffff.png?text=A',
    authorZodiacSign: 'Aquarius',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    content: "La sección de compatibilidad es fascinante. Como Acuario, siempre he tenido curiosidad por mi dinámica con Tauro. La descripción del 'innovador vs. el tradicionalista' fue muy acertada. ¿Alguna pareja Acuario-Tauro por aquí?",
  },
  {
    id: '3',
    authorName: 'Cancer_Heart',
    authorAvatarUrl: 'https://placehold.co/64x64/7c3aed/ffffff.png?text=C',
    authorZodiacSign: 'Cancer',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    content: "La lectura de sueños de anoche fue increíblemente profunda. Soñé que volaba sobre una ciudad de nubes y la interpretación sobre la libertad y las aspiraciones realmente resonó conmigo. Recomiendo mucho probar esa función.",
  },
  {
    id: '4',
    authorName: 'PracticalCap',
    authorAvatarUrl: 'https://placehold.co/64x64/7c3aed/ffffff.png?text=P',
    authorZodiacSign: 'Capricorn',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    content: "Como Capricornio, la sección de finanzas del horóscopo semanal es mi primera lectura cada lunes. Me ayuda a establecer un tono práctico para la semana. La precisión es a menudo sorprendente.",
  },
];

// In-memory array to store posts
let posts: CommunityPost[] = [...initialPosts];

// Simulate fetching posts with a delay
export const getCommunityPosts = async (): Promise<CommunityPost[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Return a sorted copy
      resolve([...posts].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
    }, 500);
  });
};

// Simulate adding a post with a delay
export const addCommunityPost = async (newPostData: Omit<CommunityPost, 'id' | 'timestamp'>): Promise<CommunityPost> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newPost: CommunityPost = {
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        ...newPostData,
      };
      posts.unshift(newPost); // Add to the beginning of the array
      resolve(newPost);
    }, 300);
  });
};
