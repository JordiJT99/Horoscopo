
import type React from 'react';
import type { ZodiacSignName } from '@/types';
import { ZODIAC_SIGNS } from '@/lib/constants';
import { HelpCircle } from 'lucide-react';
import Image from 'next/image';

interface ZodiacSignIconProps {
  signName: ZodiacSignName;
  className?: string;
}

const ZodiacSignIcon: React.FC<ZodiacSignIconProps> = ({ signName, className }) => {
  const signData = ZODIAC_SIGNS.find(s => s.name === signName);

  if (!signData) {
    return <HelpCircle className={className || "w-6 h-6"} />;
  }

  // Prioritize customIconPath if available
  if (signData.customIconPath) {
    // Use the non-translated name for alt text. It's robust and server-safe.
    const altText = signData.name;
    return (
      <Image
        src={signData.customIconPath}
        alt={altText}
        width={24}
        height={24}
        className={className || "w-6 h-6"}
        priority={false}
      />
    );
  }

  // Fallback to Lucide icon component if no customIconPath
  const IconComponent = signData.icon || HelpCircle;
  return <IconComponent className={className || "w-6 h-6"} />;
};

export default ZodiacSignIcon;
