
'use server';

import { db } from '@/lib/firebase';
import type { CommunityPost, Comment } from '@/types';
import {
  collection,
  query,
  orderBy,
  getDocs,
  getDoc,
  addDoc,
  doc,
  serverTimestamp,
  Timestamp,
  limit,
  runTransaction,
  writeBatch,
  increment,
} from 'firebase/firestore';

// Fetch posts from Firestore
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
        authorId: data.authorId, // Retrieve authorId
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

      // Clean up undefined fields
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
    return [];
  }
};

// Add a new post to Firestore
export const addCommunityPost = async (newPostData: Omit<CommunityPost, 'id' | 'timestamp' | 'reactions' | 'commentCount'>): Promise<CommunityPost> => {
  if (!db) {
    throw new Error("Firestore is not initialized. Cannot add post.");
  }
  try {
    const postsCollection = collection(db, 'community-posts');
    // The data passed to addDoc must include authorId, enforced by the type.
    const docRef = await addDoc(postsCollection, {
      ...newPostData,
      timestamp: serverTimestamp(),
      reactions: {},
      commentCount: 0,
    });

    return {
      id: docRef.id,
      timestamp: new Date().toISOString(),
      reactions: {},
      commentCount: 0,
      ...newPostData,
    };
  } catch (error) {
    console.error("Error adding community post:", error);
    throw new Error("Failed to add post to the community feed.");
  }
};


// --- Comments ---
export const getCommentsForPost = async (postId: string): Promise<Comment[]> => {
    if (!db) throw new Error("Firestore is not initialized.");
    const commentsCol = collection(db, 'community-posts', postId, 'comments');
    const q = query(commentsCol, orderBy('timestamp', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            timestamp: (data.timestamp as Timestamp).toDate().toISOString(),
        } as Comment;
    });
}

export const addCommentToPost = async (postId: string, commentData: Omit<Comment, 'id' | 'timestamp'>): Promise<Comment> => {
    if (!db) {
      throw new Error("Firestore is not initialized. Cannot add comment.");
    }
    const postRef = doc(db, 'community-posts', postId);
    const commentsCollectionRef = collection(postRef, 'comments');

    try {
        // Use a transaction to ensure atomicity
        await runTransaction(db, async (transaction) => {
            const newCommentRef = doc(commentsCollectionRef); // Generate a new doc ref for the comment
            
            // 1. Set the new comment data
            transaction.set(newCommentRef, {
                ...commentData,
                timestamp: serverTimestamp(), // Use server timestamp for consistency
            });

            // 2. Atomically increment the commentCount on the parent post
            transaction.update(postRef, { commentCount: increment(1) });
        });

        // Optimistically return the new comment for UI update
        // Note: The final doc ID and timestamp would need to be re-fetched for perfect accuracy,
        // but this is sufficient for optimistic UI.
        return {
            id: 'temp-id-' + Date.now(), // Temporary ID for UI
            ...commentData,
            timestamp: new Date().toISOString(),
        };

    } catch (error) {
        console.error("Error adding comment in transaction: ", error);
        throw error; // Re-throw to be caught by the calling component
    }
}

// --- Reactions ---
export const toggleReactionOnPost = async (postId: string, userId: string, emoji: string): Promise<Record<string, string>> => {
    if (!db) throw new Error("Firestore is not initialized.");
    const postRef = doc(db, 'community-posts', postId);

    let finalReactions: Record<string, string> = {};

    await runTransaction(db, async (transaction) => {
        const postDoc = await transaction.get(postRef);
        if (!postDoc.exists()) {
            throw new Error("Post does not exist!");
        }

        const currentReactions = postDoc.data().reactions || {};
        
        // If user has already reacted with this emoji, remove the reaction.
        if (currentReactions[userId] === emoji) {
            delete currentReactions[userId];
        } else { // Otherwise, add or update the reaction.
            currentReactions[userId] = emoji;
        }

        transaction.update(postRef, { reactions: currentReactions });
        finalReactions = currentReactions;
    });

    return finalReactions;
}
