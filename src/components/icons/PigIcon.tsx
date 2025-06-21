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
      <path d="M15.14 14.86c0 1.9-1.6 3.43-3.57 3.43s-3.57-1.53-3.57-3.43" />
      <path d="M5.16 11.23C5.06 9.94 5.9 8.5 7.19 8.5h.06" />
      <path d="M18.81 11.23c.1 1.29-.74 2.73-2.03 2.73h-.06" />
      <path d="M12 2c-3.23 0-5.59 2.05-6.19 4.78C5.24 8.58 4.03 9.87 4 11.5c-.03 2.07 1.43 4.26 4.1 4.72" />
      <path d="M12 2c3.23 0 5.59 2.05 6.19 4.78 0 0 1.21 1.29 1.19 3.22 0 2.07-1.43 4.26-4.1 4.72" />
      <path d="M12 2v4" />
      <path d="M12 18.3v3.7" />
      <path d="M9.43 4.12L7.96 6.38" />
      <path d="M14.57 4.12l1.47 2.26" />
    </svg>
  )
);
PigIcon.displayName = 'PigIcon';

export default PigIcon;
