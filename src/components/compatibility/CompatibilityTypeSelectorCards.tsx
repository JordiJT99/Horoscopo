
"use client";

import type { Dictionary, Locale } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// Button component is no longer needed here
import Link from 'next/link';
import { Heart, Handshake, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CompatibilityTypeSelectorCardsProps {
  dictionary: Dictionary;
  locale: Locale;
}

type CompatibilityTypeOption = 'love' | 'friendship' | 'work';

interface TypeCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  type: CompatibilityTypeOption;
  locale: Locale;
}

const TypeCard = ({ title, description, icon: Icon, type, locale }: TypeCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -10, boxShadow: "0 20px 35px -10px hsl(var(--primary)/0.6)" }} // Enhanced hover effect
      transition={{ type: "spring", stiffness: 260, damping: 15 }}
      className="h-full"
    >
      <Link href={`/${locale}/compatibility/calculator?type=${type}`} passHref className="h-full block">
        <Card className={cn(
          "flex flex-col h-full cursor-pointer text-center shadow-xl hover:border-primary focus-visible:border-primary border-2 border-transparent",
          "bg-card/80 backdrop-blur-sm items-center justify-center p-4 sm:p-6"
          )}>
          <div className="p-3 sm:p-4 bg-primary/20 rounded-full mb-3 sm:mb-4">
            <Icon className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-primary" />
          </div>
          <CardTitle className="font-headline text-xl sm:text-2xl md:text-3xl text-primary mb-1 sm:mb-2">
            {title}
          </CardTitle>
          <CardContent className="p-0 text-sm sm:text-base text-secondary-foreground flex-grow-0"> {/* Changed to text-secondary-foreground */}
            <p>{description}</p>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
};

export default function CompatibilityTypeSelectorCards({ dictionary, locale }: CompatibilityTypeSelectorCardsProps) {
  const types: TypeCardProps[] = [
    {
      title: dictionary['CompatibilityPage.typeLoveTitle'] || "Love Compatibility",
      description: dictionary['CompatibilityPage.typeLoveDescription'] || "Discover romantic potential and challenges between signs.",
      icon: Heart,
      type: 'love',
      locale
    },
    {
      title: dictionary['CompatibilityPage.typeFriendshipTitle'] || "Friendship Compatibility",
      description: dictionary['CompatibilityPage.typeFriendshipDescription'] || "Explore the dynamics of friendship and camaraderie.",
      icon: Handshake,
      type: 'friendship',
      locale
    },
    {
      title: dictionary['CompatibilityPage.typeWorkTitle'] || "Work Compatibility",
      description: dictionary['CompatibilityPage.typeWorkDescription'] || "Uncover how signs collaborate in a professional setting.",
      icon: Briefcase,
      type: 'work',
      locale
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
      {types.map((typeInfo) => (
        <TypeCard key={typeInfo.type} {...typeInfo} />
      ))}
    </div>
  );
}

