
import type React from 'react';
import type { ZodiacSignName } from '@/types';
import { ZODIAC_SIGNS } from '@/lib/constants';
import { HelpCircle } from 'lucide-react'; // Default icon
import Image from 'next/image'; // Import next/image

interface ZodiacSignIconProps {
  signName: ZodiacSignName;
  className?: string;
}

const ZodiacSignIcon: React.FC<ZodiacSignIconProps> = ({ signName, className }) => {
  const signData = ZODIAC_SIGNS.find(s => s.name === signName);

  // Prioritize customIconPath if available
  if (signData?.customIconPath) {
    // Attempt to get translated alt text if dictionary is available
    // This is a simplified approach; robust i18n might need context or props
    const altText = typeof dictionary !== 'undefined' && dictionary[signData.name] ? dictionary[signData.name] : signData.name;
    return (
      <Image
        src={signData.customIconPath}
        alt={altText}
        width={24} // Default width, can be overridden by className
        height={24} // Default height, can be overridden by className
        className={className || "w-6 h-6"}
        // unoptimized={false} // Removed this line
        priority={false} // Icons are usually not LCP, so false is fine
      />
    );
  }

  // Fallback to Lucide icon component if no customIconPath
  const IconComponent = signData?.icon || HelpCircle;
  return <IconComponent className={className || "w-6 h-6"} />;
};

// A global dictionary instance might not be directly accessible here
// For proper localization of alt text, dictionary might need to be passed or context used.
// This is a placeholder and might not function correctly in all scenarios.
let dictionary: any = {};
if (typeof window !== 'undefined') {
    try {
        const locale = window.location.pathname.split('/')[1] || 'es';
        // Placeholder: Actual dictionary loading would be more robust
        // e.g., import(`@/locales/${locale}.json`).then(mod => dictionary = mod.default);
    } catch (e) {
        // console.warn("Could not auto-load dictionary for ZodiacSignIcon alt text");
    }
}

export default ZodiacSignIcon;
