
'use server';

import { db } from '@/lib/firebase';
import type { CommunityPost } from '@/types';
import {
  collection,
  query,
  orderBy,
  getDocs,
  Timestamp,
  limit,
} from 'firebase/firestore';

// Fetch posts from Firestore. This is a read operation and is safe to keep on the server.
export const getCommunityPosts = async (): Promise<CommunityPost[]> => {
  if (!db) {
    console.error("Firestore is not initialized. Cannot fetch posts.");
    return [];
  }
  try {
    const postsCollection = collection(db, 'community-posts');
    const q = query(postsCollection, orderBy('timestamp', 'desc'), limit(50));
    const querySnapshot = await getDocs(q);

    const posts: CommunityPost[] = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      const timestamp = data.timestamp instanceof Timestamp ? data.timestamp.toDate().toISOString() : new Date().toISOString();
      
      const post: CommunityPost = {
        id: doc.id,
        authorId: data.authorId,
        authorName: data.authorName,
        authorAvatarUrl: data.authorAvatarUrl,
        authorZodiacSign: data.authorZodiacSign,
        timestamp: timestamp,
        postType: data.postType || 'text',
        textContent: data.textContent,
        dreamData: data.dreamData,
        tarotReadingData: data.tarotReadingData,
        tarotPersonalityData: data.tarotPersonalityData,
        reactions: data.reactions || {},
        commentCount: data.commentCount || 0,
      };

      // Clean up undefined fields to avoid serialization issues
      Object.keys(post).forEach(key => {
          if ((post as any)[key] === undefined) {
              delete (post as any)[key];
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
