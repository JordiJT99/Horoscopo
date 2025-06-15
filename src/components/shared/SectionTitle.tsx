
import type React from 'react';
import { cn } from '@/lib/utils';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
  icon?: React.ElementType;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ title, subtitle, className, icon: Icon }) => {
  return (
    <div className={cn("mb-6 md:mb-8 text-center", className)}>
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-headline font-semibold text-primary flex items-center justify-center gap-2 px-2">
        {Icon && <Icon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" />}
        {title}
      </h2>
      {subtitle && <p className="text-base sm:text-lg text-muted-foreground mt-2 font-body px-2">{subtitle}</p>}
    </div>
  );
};

export default SectionTitle;

