
"use client";

import type { Dictionary, Locale } from '@/lib/dictionaries';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface PromotionCardProps {
  dictionary: Dictionary;
  locale: Locale;
}

export default function PromotionCard({ dictionary, locale }: PromotionCardProps) {
  const tarotPersonalityTestPath = `/${locale}/tarot-personality-test`;

  return (
    <Link href={tarotPersonalityTestPath} className="block group">
      <Card className="bg-gradient-to-br from-purple-600 via-primary to-pink-500 text-primary-foreground p-0 rounded-xl shadow-xl overflow-hidden my-4 transition-transform duration-300 group-hover:scale-[1.02] group-hover:shadow-primary/40 group-hover:shadow-2xl">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="https://placehold.co/60x60/ffffff/7c3aed.png?text=TN"
              alt={dictionary['PromotionCard.tarotNebulaAlt'] || "TAROT Nebula Icon"}
              width={48}
              height={48}
              className="rounded-lg border-2 border-white/50"
              data-ai-hint="mystical tarot app icon"
            />
            <div>
              <h3 className="text-md font-bold font-headline">
                {dictionary['PromotionCard.tarotNebulaTitle'] || "TAROT Nebula"}
              </h3>
              <p className="text-xs opacity-80">{dictionary['PromotionCard.dailyCard'] || "Your daily card awaits"}</p>
            </div>
          </div>
          <ArrowRight className="w-6 h-6 opacity-70 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
        </CardContent>
      </Card>
    </Link>
  );
}
