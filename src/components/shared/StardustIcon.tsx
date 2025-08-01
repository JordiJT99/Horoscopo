
'use client';

import React from 'react';

// Custom Stardust Icon SVG Component
export const StardustIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g stroke="#0D0D0D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path
        fill="#facc15" 
        d="m14.045 3.046 1.769 4.792 4.792 1.769-3.415 3.415 1.026 5.09-4.81-2.22-4.81 2.22 1.026-5.09-3.415-3.415 4.792-1.769z"
      />
      <path
        fill="#67e8f9"
        d="m5.253 6.942 1.045 2.825 2.825 1.045-2.013 2.013.605 2.99-2.835-1.308-2.835 1.308.605-2.99-2.013-2.013 2.825-1.045z"
      />
      <path
        fill="#f472b6"
        d="m19.78 14.542.748 2.025 2.025.748-1.44 1.44.433 2.14-2.028-1.04-2.028 1.04.433-2.14-1.44-1.44 2.025-.748z"
      />
    </g>
  </svg>
);
