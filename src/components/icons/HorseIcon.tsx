// A custom SVG icon component for the Horse, matching the lucide-react style.
import * as React from 'react';
import { cn } from '@/lib/utils';

const HorseIcon = React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>(
  ({ className, ...props }, ref) => (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('lucide-icon', className)}
      {...props}
    >
      <path d="M16 16.23a2 2 0 0 0 2.1-2.16l-1-6.1A2 2 0 0 0 15.18 6H9.1a2 2 0 0 0-1.9 1.45l-1.07 5.37a2 2 0 0 0 1.28 2.45l.1.04.1.05a2 2 0 0 0 2.22-.69l.3-.46.36-.55a2 2 0 0 1 2.22-.69l.36.55.3.46a2 2 0 0 0 2.22.69l.1-.05Z"/>
      <path d="M12 6V3"/>
      <path d="M17.5 11.5 19 9"/>
      <path d="M6.5 11.5 5 9"/>
    </svg>
  )
);
HorseIcon.displayName = 'HorseIcon';

export default HorseIcon;
