
"use client";

import type { Dictionary } from '@/lib/dictionaries';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Zap } from 'lucide-react'; // Or another suitable icon

interface PromotionCardProps {
  dictionary: Dictionary;
}

export default function PromotionCard({ dictionary }: PromotionCardProps) {
  return (
    <Card className="bg-gradient-to-br from-purple-600 via-primary to-pink-500 text-primary-foreground p-0 rounded-xl shadow-xl overflow-hidden my-4">
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="https://placehold.co/60x60/ffffff/7c3aed.png?text=TN" // Placeholder for TAROT Nebula icon
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
            {/* <p className="text-xs opacity-80">{dictionary['PromotionCard.tarotNebulaSubtitle'] || "Descubre tu destino"}</p> */}
          </div>
        </div>
        <Badge variant="secondary" className="bg-yellow-400 text-yellow-900 font-semibold px-2.5 py-1 text-xs">
          {dictionary['PromotionCard.freeBadge'] || "GRATIS"}
        </Badge>
      </CardContent>
    </Card>
  );
}
