// src/components/store/ProductCard.tsx

'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import type { StoreProduct } from '@/lib/store-products';
import type { Dictionary } from '@/lib/dictionaries';

interface ProductCardProps {
  product: StoreProduct;
  dictionary: Dictionary;
}

export default function ProductCard({ product, dictionary }: ProductCardProps) {
  const { titleKey, descriptionKey, image, aiHint, amazonLink } = product;

  // Function to safely get nested dictionary values
  const getProductText = (key: string, subkey: 'title' | 'description'): string => {
    return dictionary.StoreProducts?.[key]?.[subkey] || `[${key}.${subkey}]`;
  };

  const title = getProductText(titleKey, 'title');
  const description = getProductText(descriptionKey, 'description');

  return (
    <Card className="flex flex-col bg-card/70 backdrop-blur-sm border-border/30 shadow-lg hover:shadow-primary/30 transition-shadow duration-300">
      <CardHeader>
        <div className="relative aspect-square w-full overflow-hidden rounded-md">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 hover:scale-105"
            data-ai-hint={aiHint}
          />
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardTitle className="font-headline text-xl text-primary">{title}</CardTitle>
        <CardDescription className="mt-2 text-sm text-card-foreground/80">
          {description}
        </CardDescription>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <a href={amazonLink} target="_blank" rel="noopener noreferrer">
            {dictionary['StorePage.viewOnAmazon'] || "View on Amazon"} <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
