
"use client";

import type { ZodiacSign } from '@/types';
import type { Dictionary, Locale } from '@/lib/dictionaries';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import ZodiacSignIcon from '@/components/shared/ZodiacSignIcon'; // Asegúrate de que este no está causando problemas
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface SelectedSignDisplayProps {
  dictionary: Dictionary;
  locale: Locale;
  selectedSign: ZodiacSign;
}

export default function SelectedSignDisplay({
  dictionary,
  locale,
  selectedSign,
}: SelectedSignDisplayProps) {
  
  const imagePath = selectedSign.customIconPath
    ? selectedSign.customIconPath
    : `https://placehold.co/144x144/7c3aed/ffffff.png?text=${selectedSign.name.substring(0,2).toUpperCase()}`;

  const isCustomImage = !!selectedSign.customIconPath;

  return (
    <div className="flex flex-col items-center text-center py-4">
      <h2 className="text-3xl font-bold font-headline text-foreground">
        {dictionary[selectedSign.name] || selectedSign.name}
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        {selectedSign.dateRange}
      </p>
      {/* Aplicar borde, redondeo y overflow al div contenedor */}
      <div className="relative w-32 h-32 sm:w-36 sm:h-36 mb-4 rounded-full border-4 border-primary shadow-lg overflow-hidden">
        <Image
            src={imagePath}
            alt={dictionary[selectedSign.name] || selectedSign.name}
            layout="fill" // Para que la imagen llene el contenedor
            objectFit="cover" // Similar a object-cover de Tailwind
            priority={true}
            key={imagePath} 
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null; 
              target.src = `https://placehold.co/144x144/CCCCCC/999999.png?text=Err`;
            }}
            data-ai-hint={isCustomImage ? `${selectedSign.name.toLowerCase()} zodiac symbol illustration` : "zodiac placeholder"}
            // Quitar className de aquí si solo tenía borde y redondeo
        />
      </div>
      <Button variant="default" size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground px-6">
        {dictionary['SelectedSign.moreDetails'] || "Más detalles"}
      </Button>
    </div>
  );
}
