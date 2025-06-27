
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

// Define a more specific type for creating new posts, ensuring authorId is always present.
type NewPostData = Pick<
  CommunityPost,
  | 'authorId'
  | 'authorName'
  | 'authorAvatarUrl'
  | 'authorZodiacSign'
  | 'postType'
> & Partial<
  Pick<
    CommunityPost,
    'textContent' | 'dreamData' | 'tarotReadingData' | 'tarotPersonalityData'
  >
>;


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
export const addCommunityPost = async (newPostData: NewPostData): Promise<CommunityPost> => {
  if (!db) {
    throw new Error("Firestore is not initialized. Cannot add post.");
  }
  if (!newPostData.authorId) {
    throw new Error("Cannot create post: authorId is missing.");
  }

  try {
    // Explicitly build the object to save, avoiding any undefined fields from the spread
    const dataToSave: any = {
      authorId: newPostData.authorId,
      authorName: newPostData.authorName,
      authorAvatarUrl: newPostData.authorAvatarUrl,
      authorZodiacSign: newPostData.authorZodiacSign,
      postType: newPostData.postType,
      timestamp: serverTimestamp(),
      reactions: {},
      commentCount: 0,
    };

    // Add optional fields only if they exist in the input data
    if (newPostData.textContent) dataToSave.textContent = newPostData.textContent;
    if (newPostData.dreamData) dataToSave.dreamData = newPostData.dreamData;
    if (newPostData.tarotReadingData) dataToSave.tarotReadingData = newPostData.tarotReadingData;
    if (newPostData.tarotPersonalityData) dataToSave.tarotPersonalityData = newPostData.tarotPersonalityData;


    const postsCollection = collection(db, 'community-posts');
    const docRef = await addDoc(postsCollection, dataToSave);

    // Create a complete CommunityPost object for optimistic UI update.
    const optimisticPost: CommunityPost = {
      id: docRef.id,
      timestamp: new Date().toISOString(),
      reactions: {},
      commentCount: 0,
      ...newPostData,
    };
    
    // Clean up undefined properties for the return object
    Object.keys(optimisticPost).forEach(key => {
      if (optimisticPost[key as keyof CommunityPost] === undefined) {
          delete optimisticPost[key as keyof CommunityPost];
      }
    });
    
    return optimisticPost;

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

    // Generate a new ref for the comment document *before* the transaction
    const newCommentRef = doc(commentsCollectionRef);

    try {
        await runTransaction(db, async (transaction) => {
            const postDoc = await transaction.get(postRef);
            if (!postDoc.exists()) {
                throw new Error("Post does not exist!");
            }

            const completeCommentData = {
                ...commentData,
                timestamp: serverTimestamp(),
            };

            // 1. Create the new comment document
            transaction.set(newCommentRef, completeCommentData);

            // 2. Atomically increment the commentCount on the parent post
            transaction.update(postRef, { commentCount: increment(1) });
        });
        
        // If transaction is successful, return the optimistic data for the UI
        return {
            id: newCommentRef.id,
            ...commentData,
            timestamp: new Date().toISOString(),
        };

    } catch (error) {
        console.error("Error adding comment in transaction: ", error);
        throw error; // Re-throw to be caught by the UI component
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
        
        if (currentReactions[userId] === emoji) {
            delete currentReactions[userId];
        } else {
            currentReactions[userId] = emoji;
        }

        transaction.update(postRef, { reactions: currentReactions });
        finalReactions = currentReactions;
    });

    return finalReactions;
}
