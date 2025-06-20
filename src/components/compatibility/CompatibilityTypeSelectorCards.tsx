
"use client";

import type { Dictionary, Locale } from '@/lib/dictionaries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Heart, Handshake, Briefcase } from 'lucide-react'; // Removed ChevronRight
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
      whileHover={{ y: -5, boxShadow: "0 10px 20px -5px hsl(var(--primary)/0.3)" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="h-full"
    >
      <Link href={`/${locale}/compatibility/calculator?type=${type}`} passHref>
        <Card className={cn(
          "flex flex-col justify-between h-full cursor-pointer text-center shadow-xl hover:border-primary focus-visible:border-primary border-2 border-transparent",
          "bg-card/80 backdrop-blur-sm"
          )}>
          <CardHeader className="items-center p-4 sm:p-6">
            <div className="p-3 sm:p-4 bg-primary/20 rounded-full mb-3 sm:mb-4">
              <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
            </div>
            <CardTitle className="font-headline text-xl sm:text-2xl text-primary">{title}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 text-sm sm:text-base text-muted-foreground flex-grow">
            <p>{description}</p>
          </CardContent>
          {/* div container for button with reduced padding */}
          <div className="p-2 sm:p-4 pt-0"> 
            <Button
              variant="outline"
              // Centered text by default, ensured single line, and proper height
              className="w-full font-body border-primary/50 text-primary hover:bg-primary/10 hover:text-primary px-4 py-2.5 text-sm whitespace-nowrap h-10"
            >
              {title}
            </Button>
          </div>
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

