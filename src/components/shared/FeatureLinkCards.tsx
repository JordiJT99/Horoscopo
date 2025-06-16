
"use client";

import type { Dictionary, Locale } from '@/lib/dictionaries';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Heart, Hand, ChevronRight } from 'lucide-react'; // Using Hand for "Lectura de Manos"
import { cn } from '@/lib/utils';

interface FeatureLinkCardsProps {
  dictionary: Dictionary;
  locale: Locale;
}

const FeatureCard = ({
  title,
  icon: Icon,
  href,
  locale,
  dictionary
}: {
  title: string;
  icon: React.ElementType;
  href: string;
  locale: Locale;
  dictionary: Dictionary;
}) => {
  return (
    <Link href={`/${locale}${href}`} passHref>
      <Card className="bg-feature-card-background text-feature-card-foreground p-4 rounded-lg shadow-md hover:opacity-90 transition-opacity">
        <CardContent className="flex items-center justify-between p-0">
          <div className="flex items-center gap-3">
            <Icon className="w-7 h-7" />
            <span className="font-semibold font-body text-sm">{title}</span>
          </div>
          <ChevronRight className="w-5 h-5 opacity-70" />
        </CardContent>
      </Card>
    </Link>
  );
};

export default function FeatureLinkCards({ dictionary, locale }: FeatureLinkCardsProps) {
  const features = [
    {
      titleKey: "FeatureCards.compatibilityReading",
      icon: Heart,
      href: "/compatibility", // Ensure this page exists or is a placeholder
    },
    {
      titleKey: "FeatureCards.palmReading",
      icon: Hand, // Using Hand icon
      href: "/palm-reading", // Placeholder page
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 my-4">
      {features.map((feature) => (
        <FeatureCard
          key={feature.titleKey}
          title={dictionary[feature.titleKey] || feature.titleKey.split('.').pop()}
          icon={feature.icon}
          href={feature.href}
          locale={locale}
          dictionary={dictionary}
        />
      ))}
    </div>
  );
}
