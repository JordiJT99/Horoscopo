
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
    <motion.div
      className="block"
      whileHover={{ scale: 1.03, y: -3 }} 
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }} 
    >
      <Link href={`/${locale}${href}`} className="block">
        <Card className={cn(
            "bg-feature-card-background text-feature-card-foreground p-4 rounded-lg shadow-xl transition-all duration-300 ease-in-out transform", // Base shadow increased to shadow-xl
            "hover:shadow-2xl hover:shadow-primary/50 hover:border-primary focus-visible:shadow-2xl focus-visible:shadow-primary/50 focus-visible:border-primary border-2 border-transparent" // Hover shadow color opacity increased to /50
        )}>
          <CardContent className="flex items-center justify-between p-0">
            <div className="flex items-center gap-3">
              <Icon className="w-7 h-7" />
              <span className="font-semibold font-body text-sm">{title}</span>
            </div>
            <ChevronRight className="w-5 h-5 opacity-70" />
          </CardContent>
        </Card>
      </Link>
    </motion.div>
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
      href: "/palm-reading", 
    },
  ];

  return (
    <motion.div 
      className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-3 sm:gap-4 my-4" 
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

