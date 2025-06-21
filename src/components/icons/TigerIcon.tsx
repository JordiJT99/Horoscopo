// A custom SVG icon component for the Tiger, matching the lucide-react style.
import * as React from 'react';
import { cn } from '@/lib/utils';

const TigerIcon = React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>(
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
      <path d="M18.5 12c0-4.69-3.81-8.5-8.5-8.5S1.5 7.31 1.5 12s3.81 8.5 8.5 8.5 8.5-3.81 8.5-8.5Z"/>
      <path d="M13 17.5c-1.5 0-2.5-1-2.5-2.5"/>
      <path d="M9.5 11c0-1.5 1-2.5 2.5-2.5s2.5 1 2.5 2.5"/>
      <path d="M15.5 6.5s-1-2-2.5-2"/>
      <path d="M8.5 6.5s1-2 2.5-2"/>
      <path d="M18.5 12h-2"/>
      <path d="M5.5 12h-2"/>
      <path d="M15 4.5s-1 1-2 2"/>
      <path d="M9 4.5s1 1 2 2"/>
    </svg>
  )
);
TigerIcon.displayName = 'TigerIcon';

export default TigerIcon;
