
'use client';

import { useState, useEffect } from 'react';
import type { CommunityPost, Comment } from '@/types';
import type { Dictionary, Locale } from '@/lib/dictionaries';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ZodiacSignIcon from '../shared/ZodiacSignIcon';
import { formatDistanceToNow } from 'date-fns';
import { es, enUS, de, fr } from 'date-fns/locale';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Brain, Hash, MessageCircle, Smile, Users, MapPin, Feather, Sparkles, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAuth } from '@/context/AuthContext';
import { Textarea } from '../ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { getCommentsForPost, addCommentToPost, toggleReactionOnPost } from '@/lib/community-posts';
import LoadingSpinner from '@/components/shared/LoadingSpinner';


interface CommunityPostCardProps {
  post: CommunityPost;
  dictionary: Dictionary;
  locale: Locale;
}

const dateLocales: Record<Locale, typeof enUS> = {
  es,
  en: enUS,
  de,
  fr,
};

const DreamElements = ({ dreamData, dictionary }: { dreamData: any, dictionary: Dictionary }) => {
  const elements = [
    { key: 'symbols', icon: Hash, title: dictionary['DreamReadingPage.mapSymbols'] || 'Symbols' },
    { key: 'emotions', icon: Smile, title: dictionary['DreamReadingPage.mapEmotions'] || 'Emotions' },
    { key: 'themes', icon: Brain, title: dictionary['DreamReadingPage.mapThemes'] || 'Themes' },
  ];

  return (
    <div className="space-y-3">
      {elements.map(el => {
        const items = dreamData.dreamElements?.[el.key];
        if (!items || items.length === 0) return null;
        return (
          <div key={el.key}>
            <h4 className="font-semibold text-xs flex items-center gap-1.5 text-muted-foreground">
              <el.icon className="w-3.5 h-3.5" />
              {el.title}
            </h4>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {items.map((item: string, index: number) => (
                <Badge key={index} variant="secondary" className="text-xs font-normal">{item}</Badge>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  );
};

const ExpandableText = ({ text, dictionary }: { text: string; dictionary: Dictionary }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isLongText = text.length > 250;

  if (!isLongText) {
    return <p className="whitespace-pre-line text-sm text-card-foreground">{text}</p>;
  }

  return (
    <div>
      <p className={cn("whitespace-pre-wrap text-sm text-card-foreground", !isExpanded && "line-clamp-4")}>
        {text}
      </p>
      <Button variant="link" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="p-0 h-auto text-primary text-xs mt-1">
        {isExpanded ? (dictionary['CommunityPage.seeLess'] || 'See Less') : (dictionary['CommunityPage.seeMore'] || 'See More')}
      </Button>
    </div>
  );
};

export default function CommunityPostCard({ post, dictionary, locale }: CommunityPostCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [reactions, setReactions] = useState<Record<string, string>>(post.reactions || {});
  const [commentCount, setCommentCount] = useState(post.commentCount || 0);
  const [comments, setComments] = useState<Comment[]>([]);
  
  const [showComments, setShowComments] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isPostingComment, setIsPostingComment] = useState(false);

  const timeAgo = formatDistanceToNow(new Date(post.timestamp), {
    addSuffix: true,
    locale: dateLocales[locale] || enUS,
  });

  useEffect(() => {
    if (showComments && comments.length === 0 && commentCount > 0) {
      const fetchComments = async () => {
        setIsLoadingComments(true);
        try {
          const fetchedComments = await getCommentsForPost(post.id);
          setComments(fetchedComments);
        } catch (error) {
          toast({ title: dictionary['Error.genericTitle'], description: 'Could not load comments.', variant: 'destructive' });
        } finally {
          setIsLoadingComments(false);
        }
      };
      fetchComments();
    }
  }, [showComments, post.id, comments.length, commentCount, dictionary, toast]);


  const handleReact = async (emoji: string) => {
    if (!user) {
      toast({ title: dictionary['Auth.notLoggedInTitle'], description: dictionary['CommunityPage.loginToReact'] || 'You must be logged in to react.', variant: 'destructive' });
      return;
    }

    const originalReactions = { ...reactions };
    const newReactions = { ...reactions };

    if (newReactions[user.uid] === emoji) {
      delete newReactions[user.uid];
    } else {
      newReactions[user.uid] = emoji;
    }
    setReactions(newReactions);

    try {
      await toggleReactionOnPost(post.id, user.uid, emoji);
    } catch (error: any) {
      setReactions(originalReactions);
      if (error.code === 'permission-denied') {
        toast({
            title: dictionary['Error.permissionDeniedTitle'] || "Permission Denied",
            description: dictionary['Error.permissionDeniedDescription'] || "Your Firestore security rules do not allow this action. Please ensure you have configured rules to allow writes for authenticated users.",
            variant: 'destructive'
        });
      } else {
        toast({ title: dictionary['Error.genericTitle'], description: dictionary['CommunityPage.reactionError'] || 'Could not save reaction.', variant: 'destructive' });
      }
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setIsPostingComment(true);
    try {
      const commentData = {
        authorId: user.uid,
        authorName: user.displayName || 'Anonymous',
        authorAvatarUrl: user.photoURL || `https://placehold.co/64x64/7c3aed/ffffff.png?text=${(user.displayName || 'A').charAt(0)}`,
        text: newComment,
      };

      const addedComment = await addCommentToPost(post.id, commentData);
      
      setComments(prev => [...prev, addedComment]);
      setCommentCount(prev => prev + 1);
      setNewComment('');
    } catch (error: any) {
       if (error.code === 'permission-denied') {
            toast({
                title: dictionary['Error.permissionDeniedTitle'] || "Permission Denied",
                description: dictionary['Error.permissionDeniedDescription'] || "Your Firestore security rules do not allow this action. Please ensure you have configured rules to allow writes for authenticated users.",
                variant: 'destructive'
            });
       } else {
            toast({ title: dictionary['Error.genericTitle'], description: dictionary['CommunityPage.commentError'] || 'Could not post comment.', variant: 'destructive' });
       }
    } finally {
       setIsPostingComment(false);
    }
  };
  
  const reactionCounts = Object.values(reactions).reduce((acc, emoji) => {
    acc[emoji] = (acc[emoji] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedReactions = Object.entries(reactionCounts).sort(([, a], [, b]) => b - a);

  const renderPostContent = () => {
    switch (post.postType) {
      case 'dream':
        return (
          <div className="mt-2 space-y-3 p-3 bg-background/50 rounded-md border border-border/50">
            <div className="flex items-center gap-2 text-muted-foreground text-sm font-semibold">
              <Feather className="w-4 h-4" />
              <span>{dictionary['CommunityPage.dreamPostTitle'] || "Shared a Dream Interpretation"}</span>
            </div>
            <div className="italic text-sm text-foreground/90">
              <ExpandableText text={post.dreamData?.interpretation || ''} dictionary={dictionary} />
            </div>
            {post.dreamData?.dreamElements && <DreamElements dreamData={post.dreamData} dictionary={dictionary} />}
          </div>
        );

      case 'tarot_reading':
      case 'tarot_personality':
        const cardData = post.tarotReadingData || post.tarotPersonalityData;
        const reading = post.tarotReadingData?.advice || post.tarotPersonalityData?.reading || '';
        const isReversed = post.tarotPersonalityData?.isReversed || false;
        
        return (
          <div className="mt-2 space-y-3 p-3 bg-background/50 rounded-md border border-border/50">
             <div className="flex items-center gap-2 text-muted-foreground text-sm font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>{dictionary['CommunityPage.tarotPostTitle'] || "Shared a Tarot Card"}</span>
            </div>
            <div className="flex gap-4 items-start">
               <Image 
                  src={cardData?.imagePlaceholderUrl || ''} 
                  alt={cardData?.cardName || 'Tarot Card'} 
                  width={80}  
                  height={140} 
                  className={cn("rounded-md shadow-md border-2 border-primary/20", isReversed && "transform rotate-180")}
                  data-ai-hint={`${cardData?.cardName?.toLowerCase() || 'tarot'} card illustration`}
                />
                <div className="flex-1 space-y-1">
                  <h4 className="font-bold font-headline text-foreground">{cardData?.cardName} {isReversed ? `(${dictionary['Tarot.reversed'] || 'Reversed'})` : ''}</h4>
                  <div className="text-sm text-foreground/80">
                     <ExpandableText text={reading} dictionary={dictionary} />
                  </div>
                </div>
            </div>
          </div>
        )
      
      case 'text':
      default:
        return (
          <ExpandableText text={post.textContent || ''} dictionary={dictionary} />
        );
    }
  };

  return (
    <Card className="bg-card/70 backdrop-blur-sm border-border/30 shadow-lg">
      <CardHeader className="flex flex-row items-center gap-4 p-4">
        <Avatar>
          <AvatarImage src={post.authorAvatarUrl} alt={post.authorName} />
          <AvatarFallback>{post.authorName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <CardTitle className="text-base font-semibold font-body leading-tight">
            {post.authorName}
          </CardTitle>
          <div className="flex items-center text-xs text-muted-foreground">
            <ZodiacSignIcon signName={post.authorZodiacSign} className="w-3.5 h-3.5 mr-1" />
            <span>{dictionary[post.authorZodiacSign] || post.authorZodiacSign}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-2 pt-0">
        {renderPostContent()}
      </CardContent>

      <div className="px-4 pb-2 flex items-center gap-2">
        {sortedReactions.length > 0 ? (
          sortedReactions.slice(0, 3).map(([emoji, count]) => (
            <div key={emoji} className="flex items-center gap-1 bg-background/50 rounded-full px-2 py-0.5 text-xs">
              <span className="text-sm">{emoji}</span>
              <span className="font-medium text-muted-foreground">{count}</span>
            </div>
          ))
        ) : (
          <p className="text-xs text-muted-foreground italic">{dictionary['CommunityPage.beFirstToReact'] || "Be the first to react"}</p>
        )}
      </div>

      <CardFooter className="p-4 pt-0 flex justify-between items-center text-xs text-muted-foreground border-t border-border/30 mt-2">
        <div className="flex items-center gap-1">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" disabled={!user}>
                <Smile className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-1 bg-background/80 backdrop-blur-md border-border/50">
              <div className="flex gap-1">
                {['👍', '❤️', '😂', '😢', '🙏', '✨'].map(emoji => (
                  <Button key={emoji} variant="ghost" size="icon" className="h-8 w-8 rounded-full text-2xl hover:bg-primary/20 transition-transform hover:scale-125" onClick={() => handleReact(emoji)}>
                    {emoji}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary" onClick={() => setShowComments(s => !s)}>
          <MessageCircle className="w-4 h-4 mr-2" />
          <span className="text-xs">{commentCount} {dictionary['CommunityPage.commentButton'] || 'Comment'}</span>
        </Button>
      </CardFooter>
      
      {showComments && (
        <div className="px-4 pb-4 border-t border-border/30 bg-background/30">
          {user && (
            <form onSubmit={handleCommentSubmit} className="flex items-start gap-2 pt-4">
              <Avatar className="w-8 h-8">
                <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'}/>
                <AvatarFallback>{user.displayName?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder={dictionary['CommunityPage.commentPlaceholder'] || 'Write a comment...'}
                  className="bg-input/50 text-sm min-h-[40px]"
                  rows={1}
                  disabled={isPostingComment}
                />
                <Button type="submit" size="sm" className="mt-2" disabled={!newComment.trim() || isPostingComment}>
                   {isPostingComment ? <LoadingSpinner className="h-3 w-3 mr-2" /> : <Send className="mr-2 h-3 w-3" />}
                  {dictionary['CommunityPage.postCommentButton'] || 'Post Comment'}
                </Button>
              </div>
            </form>
          )}
          <div className="mt-4 space-y-4">
            {isLoadingComments ? (
              <div className="py-4 text-center">
                <LoadingSpinner className="h-6 w-6 text-primary" />
              </div>
            ) : comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="flex items-start gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={comment.authorAvatarUrl} alt={comment.authorName} />
                    <AvatarFallback>{comment.authorName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 bg-background/40 rounded-lg p-2">
                    <p className="font-semibold text-xs text-foreground">{comment.authorName}</p>
                    <p className="text-sm text-muted-foreground">{comment.text}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-xs text-muted-foreground py-2">{dictionary['CommunityPage.noCommentsYet'] || "No comments yet. Be the first to comment!"}</p>
            )}
          </div>
        </div>
      )}

    </Card>
  );
}
