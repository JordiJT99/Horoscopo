
"use client";

import type { Dictionary, Locale } from '@/lib/dictionaries';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Heart, Hand, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

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
    <Link href={`/${locale}${href}`} passHref legacyBehavior>
      <motion.a
        className="block"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Card className="bg-feature-card-background text-feature-card-foreground p-4 rounded-lg shadow-md transition-opacity">
          <CardContent className="flex items-center justify-between p-0">
            <div className="flex items-center gap-3">
              <Icon className="w-7 h-7" />
              <span className="font-semibold font-body text-sm">{title}</span>
            </div>
            <ChevronRight className="w-5 h-5 opacity-70" />
          </CardContent>
        </Card>
      </motion.a>
    </Link>
  );
};

export default function FeatureLinkCards({ dictionary, locale }: FeatureLinkCardsProps) {
  const features = [
    {
      titleKey: "FeatureCards.compatibilityReading",
      icon: Heart,
      href: "/compatibility",
    },
    {
      titleKey: "FeatureCards.palmReading",
      icon: Hand,
      href: "/palm-reading", // Placeholder page
    },
  ];

  return (
    <motion.div 
      className="grid grid-cols-2 gap-3 sm:gap-4 my-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
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
    </motion.div>
  );
}
