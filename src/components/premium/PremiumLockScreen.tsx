'use client';

import type { Dictionary, Locale } from '@/lib/dictionaries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import Link from 'next/link';

interface PremiumLockScreenProps {
  dictionary: Dictionary;
  locale: Locale;
  featureTitle?: string;
}

export default function PremiumLockScreen({ dictionary, locale, featureTitle }: PremiumLockScreenProps) {
  const title = featureTitle || dictionary.PremiumLock?.title || 'Premium Feature';
  const description = dictionary.PremiumLock?.description || 'Unlock this and many other exclusive features with AstroMística Premium.';
  const buttonText = dictionary.PremiumLock?.button || 'Go Premium';

  return (
    <div className="flex items-center justify-center w-full my-8">
      <Card className="w-full max-w-md mx-auto text-center bg-card/70 backdrop-blur-sm border-primary/20 shadow-xl">
        <CardHeader>
          <div className="mx-auto bg-primary/20 p-3 rounded-full w-fit mb-4">
            <Star className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="font-headline text-2xl text-primary">{title}</CardTitle>
          <CardDescription className="text-base text-card-foreground/80">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild size="lg" className="w-full">
            <Link href={`/${locale}/premium`}>{buttonText}</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
