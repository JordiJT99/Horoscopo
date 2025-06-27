
'use client';

import { useState } from 'react';
import type { CommunityPost } from '@/types';
import type { Dictionary, Locale } from '@/lib/dictionaries';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ZodiacSignIcon from '../shared/ZodiacSignIcon';
import { formatDistanceToNow } from 'date-fns';
import { es, enUS, de, fr } from 'date-fns/locale';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Brain, Hash, MessageCircle, Smile, Users, MapPin, Feather, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';


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

const ExpandableText = ({ text, dictionary, textKey }: { text: string; dictionary: Dictionary, textKey: string }) => {
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
  const timeAgo = formatDistanceToNow(new Date(post.timestamp), {
    addSuffix: true,
    locale: dateLocales[locale] || enUS,
  });

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
              <ExpandableText text={post.dreamData?.interpretation || ''} dictionary={dictionary} textKey="interpretation" />
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
                     <ExpandableText text={reading} dictionary={dictionary} textKey="reading" />
                  </div>
                </div>
            </div>
          </div>
        )
      
      case 'text':
      default:
        return (
          <ExpandableText text={post.textContent || ''} dictionary={dictionary} textKey="textContent" />
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
      <CardContent className="px-4 pb-4 pt-0">
        {renderPostContent()}
      </CardContent>
      <CardFooter className="p-4 pt-2 flex justify-between items-center text-xs text-muted-foreground">
        <p>{timeAgo}</p>
        <div className="flex items-center gap-1">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <Smile className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-1 bg-background/80 backdrop-blur-md border-border/50">
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-2xl hover:bg-primary/20 transition-transform hover:scale-125">👍</Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-2xl hover:bg-primary/20 transition-transform hover:scale-125">❤️</Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-2xl hover:bg-primary/20 transition-transform hover:scale-125">😂</Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-2xl hover:bg-primary/20 transition-transform hover:scale-125">😢</Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-2xl hover:bg-primary/20 transition-transform hover:scale-125">🙏</Button>
              </div>
            </PopoverContent>
          </Popover>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
            <MessageCircle className="w-4 h-4 mr-2" />
            <span className="text-xs">{dictionary['CommunityPage.commentButton'] || 'Comment'}</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
