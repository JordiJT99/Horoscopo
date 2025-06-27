
import { db } from '@/lib/firebase';
import type { CommunityPost, Comment } from '@/types';
import {
  collection,
  query,
  orderBy,
  getDocs,
  addDoc,
  serverTimestamp,
  Timestamp,
  limit,
} from 'firebase/firestore';

// Mock data generator for reactions and comments
const generateMockReactions = (): Record<string, number> => {
  const emojis = ['👍', '❤️', '😂', '😢', '🙏', '✨'];
  const reactions: Record<string, number> = {};
  const numReactions = Math.floor(Math.random() * 4); // 0 to 3 types of reactions
  for (let i = 0; i < numReactions; i++) {
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
    if (!reactions[emoji]) {
      reactions[emoji] = Math.floor(Math.random() * 50) + 1;
    }
  }
  return reactions;
};

const generateMockComments = (): Comment[] => {
  const comments: Comment[] = [];
  const numComments = Math.floor(Math.random() * 5); // 0 to 4 comments
  const sampleAuthors = ['CosmicExplorer', 'LunaDreamer', 'StarSeeker', 'AstroFan', 'Oracle'];
  const sampleTexts = [
    "¡Qué interesante! A mí me pasó algo parecido.",
    "Gracias por compartir esto.",
    "Wow, increíble.",
    "Esto realmente resuena conmigo.",
    "Nunca lo había pensado de esa manera."
  ];

  for (let i = 0; i < numComments; i++) {
    const author = sampleAuthors[Math.floor(Math.random() * sampleAuthors.length)];
    comments.push({
      authorName: author,
      authorAvatarUrl: `https://placehold.co/64x64/2A0A2A/FFFFFF.png?text=${author.charAt(0)}`,
      text: sampleTexts[Math.floor(Math.random() * sampleTexts.length)],
    });
  }
  return comments;
};


// Fetch posts from Firestore
export const getCommunityPosts = async (): Promise<CommunityPost[]> => {
  if (!db) {
    console.error("Firestore is not initialized. Cannot fetch posts.");
    return [];
  }
  try {
    const postsCollection = collection(db, 'community-posts');
    const q = query(postsCollection, orderBy('timestamp', 'desc'), limit(50)); // Limit to last 50 posts for performance
    const querySnapshot = await getDocs(q);

    const posts: CommunityPost[] = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      const timestamp = data.timestamp instanceof Timestamp ? data.timestamp.toDate().toISOString() : new Date().toISOString();
      
      const post: CommunityPost = {
        id: doc.id,
        authorName: data.authorName,
        authorAvatarUrl: data.authorAvatarUrl,
        authorZodiacSign: data.authorZodiacSign,
        timestamp: timestamp,
        postType: data.postType || 'text',
        textContent: data.textContent,
        dreamData: data.dreamData,
        tarotReadingData: data.tarotReadingData,
        tarotPersonalityData: data.tarotPersonalityData,
        // Add mock data for reactions and comments for demonstration
        reactions: data.reactions || generateMockReactions(),
        comments: data.comments || generateMockComments(),
      };

      // Clean up undefined fields to avoid serialization issues
      Object.keys(post).forEach(key => {
          if (post[key as keyof CommunityPost] === undefined) {
              delete post[key as keyof CommunityPost];
          }
      });
      
      return post;
    });

    return posts;
  } catch (error) {
    console.error("Error fetching community posts:", error);
    return []; // Return empty array on error to prevent crashes
  }
};

// Add a new post to Firestore
export const addCommunityPost = async (newPostData: Omit<CommunityPost, 'id' | 'timestamp'>): Promise<CommunityPost> => {
  if (!db) {
    throw new Error("Firestore is not initialized. Cannot add post.");
  }
  try {
    const postsCollection = collection(db, 'community-posts');
    const docRef = await addDoc(postsCollection, {
      ...newPostData,
      timestamp: serverTimestamp(),
      // Initialize empty reactions and comments for new posts
      reactions: {},
      comments: [],
    });

    // The returned object has the ID and a client-side generated timestamp for immediate UI update.
    // The serverTimestamp will be accurate in the database.
    return {
      id: docRef.id,
      timestamp: new Date().toISOString(),
      ...newPostData,
      reactions: {},
      comments: [],
    };
  } catch (error) {
    console.error("Error adding community post:", error);
    throw new Error("Failed to add post to the community feed.");
  }
};
