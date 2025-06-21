// A custom SVG icon component for the Ox, matching the lucide-react style.
import * as React from 'react';
import { cn } from '@/lib/utils';

const OxIcon = React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>(
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
      <path d="M13.5 9a3.5 3.5 0 1 0-7 0" />
      <path d="M21 9a3.5 3.5 0 1 1-7 0" />
      <path d="M14 5c-1 0-3.5 4-3.5 7.5" />
      <path d="M10 5c1 0 3.5 4 3.5 7.5" />
      <path d="M12 12.5V22" />
      <path d="M5 16h14" />
    </svg>
  )
);
OxIcon.displayName = 'OxIcon';

export default OxIcon;
