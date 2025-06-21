// A custom SVG icon component for the Pig, matching the lucide-react style.
import * as React from 'react';
import { cn } from '@/lib/utils';

const PigIcon = React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>(
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
      <path d="M15 5L12 2L9 5"/>
      <path d="M12 22c-3.5 0-6.2-2-7.5-5c-2.7-6.5-1-12.5 4.5-12.5s9 3.5 9 10c0 3-1.5 5-4.5 5.5"/>
      <path d="M12.5 13.5c-1-1-1.5-1.5-1.5-2.5c0-1 1-1.5 1.5-1.5s1.5.5 1.5 2.5c0 1-1 1.5-1.5 1.5"/>
      <path d="M11 16.5c-1.5 0-2.5-1-2.5-2.5c0-4.5 3-8.5 7-8.5"/>
    </svg>
  )
);
PigIcon.displayName = 'PigIcon';

export default PigIcon;
