import type React from 'react';
import type { ZodiacSignName } from '@/types';
import { ZODIAC_SIGNS } from '@/lib/constants';
import { HelpCircle } from 'lucide-react'; // Default icon

interface ZodiacSignIconProps {
  signName: ZodiacSignName;
  className?: string;
}

const ZodiacSignIcon: React.FC<ZodiacSignIconProps> = ({ signName, className }) => {
  const signData = ZODIAC_SIGNS.find(s => s.name === signName);
  const IconComponent = signData?.icon || HelpCircle;

  return <IconComponent className={className || "w-6 h-6"} />;
};

export default ZodiacSignIcon;
