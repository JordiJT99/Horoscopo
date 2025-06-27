
'use client';

import { useState, useEffect } from 'react';
import type { Dictionary, Locale } from '@/lib/dictionaries';
import type { CommunityPost, ZodiacSignName } from '@/types';
import { getCommunityPosts, addCommunityPost } from '@/lib/community-posts';
import CommunityPostCard from './CommunityPostCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { getSunSignFromDate } from '@/lib/constants';

interface CommunityFeedProps {
  dictionary: Dictionary;
  locale: Locale;
}

export default function CommunityFeed({ dictionary, locale }: CommunityFeedProps) {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newPostContent, setNewPostContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      const initialPosts = await getCommunityPosts();
      setPosts(initialPosts);
      setIsLoading(false);
    };
    fetchPosts();
  }, []);

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) {
      toast({
        title: dictionary['CommunityPage.postErrorTitle'] || "Post Error",
        description: dictionary['CommunityPage.postErrorEmpty'] || "Your post cannot be empty.",
        variant: 'destructive',
      });
      return;
    }
    if (!user) {
      toast({
        title: dictionary['Auth.notLoggedInTitle'] || "Not Logged In",
        description: dictionary['CommunityPage.loginToPost'] || "You must be logged in to post.",
        variant: 'destructive',
      });
      return;
    }

    setIsPosting(true);

    let authorZodiacSign: ZodiacSignName = 'Aries'; // Default value
    if (user?.uid) {
      const storedDataRaw = localStorage.getItem(`onboardingData_${user.uid}`);
      if (storedDataRaw) {
        try {
          const storedData = JSON.parse(storedDataRaw);
          if (storedData.dateOfBirth) {
            const sign = getSunSignFromDate(new Date(storedData.dateOfBirth));
            if (sign) {
              authorZodiacSign = sign.name;
            }
          }
        } catch(e) {
          console.error("Could not parse onboarding data to get zodiac sign.", e)
        }
      }
    }

    const newPost: Omit<CommunityPost, 'id' | 'timestamp'> = {
      authorName: user.displayName || 'Anonymous Astro-Fan',
      authorAvatarUrl: user.photoURL || `https://placehold.co/64x64/7c3aed/ffffff.png?text=${(user.displayName || 'A').charAt(0)}`,
      authorZodiacSign: authorZodiacSign,
      postType: 'text',
      textContent: newPostContent,
    };

    try {
      const addedPost = await addCommunityPost(newPost);
      setPosts(prevPosts => [addedPost, ...prevPosts]);
      setNewPostContent('');
    } catch (error) {
      toast({
        title: dictionary['Error.genericTitle'] || "Error",
        description: (error as Error).message || "Could not submit post.",
        variant: 'destructive',
      });
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {user && (
        <Card className="bg-card/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg font-headline">
              {dictionary['CommunityPage.newPostTitle'] || "Create a New Post"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePostSubmit} className="space-y-4">
              <Textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder={dictionary['CommunityPage.postPlaceholder'] || "What's on your mind, stargazer?"}
                className="bg-input/50"
                rows={3}
                disabled={isPosting}
              />
              <Button type="submit" disabled={isPosting || !newPostContent.trim()}>
                {isPosting ? <LoadingSpinner className="mr-2 h-4 w-4" /> : <Send className="mr-2 h-4 w-4" />}
                {isPosting ? (dictionary['CommunityPage.posting'] || "Posting...") : (dictionary['CommunityPage.postButton'] || "Post")}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
      
      {isLoading ? (
        <div className="text-center py-10">
          <LoadingSpinner className="h-12 w-12 text-primary" />
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <CommunityPostCard key={post.id} post={post} dictionary={dictionary} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}
