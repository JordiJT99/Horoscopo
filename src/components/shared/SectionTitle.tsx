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
    <div className={cn("mb-6 text-center", className)}>
      <h2 className="text-3xl md:text-4xl font-headline font-semibold text-primary flex items-center justify-center gap-2">
        {Icon && <Icon className="h-8 w-8" />}
        {title}
      </h2>
      {subtitle && <p className="text-lg text-muted-foreground mt-2 font-body">{subtitle}</p>}
    </div>
  );
};

export default SectionTitle;
