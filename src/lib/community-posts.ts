
'use server';

import { db } from '@/lib/firebase';
import type { CommunityPost, Comment, NewPostData } from '@/types';
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
  updateDoc,
  deleteField,
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
export const addCommunityPost = async (newPostData: NewPostData): Promise<CommunityPost> => {
  if (!db) {
    throw new Error("Firestore is not initialized. Cannot add post.");
  }
  if (!newPostData.authorId) {
    throw new Error("Cannot create post: authorId is missing.");
  }

  try {
    // Build the data object carefully, ensuring no undefined fields are sent.
    const dataToSave: any = {
      authorId: newPostData.authorId,
      authorName: newPostData.authorName,
      authorAvatarUrl: newPostData.authorAvatarUrl,
      authorZodiacSign: newPostData.authorZodiacSign,
      postType: newPostData.postType,
      timestamp: serverTimestamp(),
      reactions: {}, // Initialize as empty
      commentCount: 0, // Initialize as 0
    };

    if (newPostData.textContent) dataToSave.textContent = newPostData.textContent;
    if (newPostData.dreamData) dataToSave.dreamData = newPostData.dreamData;
    if (newPostData.tarotReadingData) dataToSave.tarotReadingData = newPostData.tarotReadingData;
    if (newPostData.tarotPersonalityData) dataToSave.tarotPersonalityData = newPostData.tarotPersonalityData;


    const postsCollection = collection(db, 'community-posts');
    const docRef = await addDoc(postsCollection, dataToSave);

    // Return an optimistic version of the post for immediate UI update.
    const optimisticPost: CommunityPost = {
      id: docRef.id,
      timestamp: new Date().toISOString(),
      reactions: {},
      commentCount: 0,
      ...newPostData,
    };
    
    // Final cleanup of the returned object
    Object.keys(optimisticPost).forEach(key => {
      if (optimisticPost[key as keyof CommunityPost] === undefined) {
          delete optimisticPost[key as keyof CommunityPost];
      }
    });
    
    return optimisticPost;

  } catch (error: any) {
    console.error("Firestore addCommunityPost operation failed:", error.message, error.stack);
    // You can customize this error message further if needed
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
    const newCommentRef = doc(collection(postRef, 'comments'));
    
    try {
        const batch = writeBatch(db);

        // 1. Set the new comment in the subcollection
        const completeCommentData = {
            ...commentData,
            timestamp: serverTimestamp(),
        };
        batch.set(newCommentRef, completeCommentData);

        // 2. Atomically increment the comment count on the parent post
        batch.update(postRef, { commentCount: increment(1) });

        // 3. Commit the batch
        await batch.commit();
        
        // Return the comment for optimistic UI update
        return {
            id: newCommentRef.id,
            ...commentData,
            timestamp: new Date().toISOString(),
        };

    } catch (error: any) {
        console.error("Firestore addCommentToPost batch failed:", error.message, error.stack);
        // Re-throw the original error to be caught by the client
        throw error;
    }
}

// --- Reactions ---
export const toggleReactionOnPost = async (postId: string, userId: string, emoji: string): Promise<Record<string, string>> => {
    if (!db) {
        throw new Error("Firestore is not initialized. Cannot toggle reaction.");
    }
    const postRef = doc(db, 'community-posts', postId);

    try {
        // We still need one read to know if we are adding or removing the reaction
        const postDoc = await getDoc(postRef);
        if (!postDoc.exists()) {
            throw new Error("Post does not exist!");
        }

        const currentReactions = postDoc.data().reactions || {};
        const userReactionField = `reactions.${userId}`;

        if (currentReactions[userId] === emoji) {
            // User is toggling off their own reaction - use deleteField
            await updateDoc(postRef, { [userReactionField]: deleteField() });
            delete currentReactions[userId]; // Update local copy for return
        } else {
            // User is adding a new reaction or changing it
            await updateDoc(postRef, { [userReactionField]: emoji });
            currentReactions[userId] = emoji; // Update local copy for return
        }
        
        return currentReactions;

    } catch (error: any) {
        console.error("Firestore toggleReactionOnPost failed:", error.message, error.stack);
        // Re-throw original error
        throw error;
    }
}
