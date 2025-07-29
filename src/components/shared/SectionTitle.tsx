
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
      <div className="flex items-center justify-center gap-2 px-2">
        {Icon && <Icon className="h-6 w-6 sm:h-7 sm:h-7 text-primary" />}
        <h1 className="text-2xl font-headline font-semibold text-primary">
          {title}
        </h1>
      </div>
      {subtitle && (
        <>
          <hr className="my-2 sm:my-3 border-border/30 w-1/4 sm:w-1/5 mx-auto" />
          <p className="text-base text-foreground/90 mt-1 font-body px-2">{subtitle}</p>
        </>
      )}
    </div>
  );
};

export default SectionTitle;
