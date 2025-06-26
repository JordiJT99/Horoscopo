
'use client';

import type { CommunityPost } from '@/types';
import type { Dictionary, Locale } from '@/lib/dictionaries';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ZodiacSignIcon from '../shared/ZodiacSignIcon';
import { formatDistanceToNow } from 'date-fns';
import { es, enUS, de, fr } from 'date-fns/locale';

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

export default function CommunityPostCard({ post, dictionary, locale }: CommunityPostCardProps) {
  const timeAgo = formatDistanceToNow(new Date(post.timestamp), {
    addSuffix: true,
    locale: dateLocales[locale] || enUS,
  });

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
        <p className="whitespace-pre-wrap text-sm text-card-foreground">
          {post.content}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <p className="text-xs text-muted-foreground">{timeAgo}</p>
      </CardFooter>
    </Card>
  );
}
