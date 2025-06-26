
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

// The initialPosts array is removed, as data will now come from Firestore.

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
      // Convert Firestore Timestamp to ISO string for consistency with the type
      const timestamp = data.timestamp instanceof Timestamp ? data.timestamp.toDate().toISOString() : new Date().toISOString();
      
      return {
        id: doc.id,
        authorName: data.authorName,
        authorAvatarUrl: data.authorAvatarUrl,
        authorZodiacSign: data.authorZodiacSign,
        content: data.content,
        timestamp: timestamp,
      } as CommunityPost;
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
