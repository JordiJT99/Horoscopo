
import { db } from '@/lib/firebase';
import type { CommunityPost } from '@/types';
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
        postType: data.postType || 'text', // Fallback to 'text' for old posts
        // Add all potential data fields
        textContent: data.textContent,
        dreamData: data.dreamData,
        tarotReadingData: data.tarotReadingData,
        tarotPersonalityData: data.tarotPersonalityData,
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
    });

    // The returned object has the ID and a client-side generated timestamp for immediate UI update.
    // The serverTimestamp will be accurate in the database.
    return {
      id: docRef.id,
      timestamp: new Date().toISOString(),
      ...newPostData,
    };
  } catch (error) {
    console.error("Error adding community post:", error);
    throw new Error("Failed to add post to the community feed.");
  }
};
