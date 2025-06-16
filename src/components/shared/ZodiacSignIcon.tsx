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

  if (signData?.customIconPath) {
    return (
      <Image
        src={signData.customIconPath}
        alt={dictionary[signData.name] || signData.name} // Use dictionary for alt text
        width={24} // Default width for icons
        height={24} // Default height for icons
        className={className || "w-6 h-6"} // Apply passed className
      />
    );
  }

  const IconComponent = signData?.icon || HelpCircle;
  // Ensure dictionary is accessible or pass it as a prop if needed for alt text with IconComponent too
  // For now, IconComponent (Lucide) doesn't inherently use alt text in the same way as Image.
  return <IconComponent className={className || "w-6 h-6"} />;
};

// A global dictionary instance might not be directly accessible here
// For proper localization of alt text, dictionary might need to be passed or context used.
// For simplicity, this example uses signData.name directly for alt text if dictionary isn't available.
// Consider how to best provide dictionary to this component if it's used widely and needs translated alt text.
let dictionary: any = {}; // Placeholder, ideally inject or use context
if (typeof window !== 'undefined') { // Basic client-side check
    // This is a simplified way and might not always work depending on when/how dictionary is loaded
    // A more robust solution would involve React Context or passing dictionary as a prop.
    try {
        const locale = window.location.pathname.split('/')[1] || 'es';
        // This is a conceptual way to access dictionary; actual implementation may vary.
        // e.g., if dictionary is in a global store or context.
        // For now, this is a placeholder and might not function correctly.
        // import(`@/locales/${locale}.json`).then(mod => dictionary = mod.default);
    } catch (e) {
        // console.warn("Could not auto-load dictionary for ZodiacSignIcon alt text");
    }
}


export default ZodiacSignIcon;
