import { cn } from '@/lib/utils';
import React from 'react';

const LoadingSpinner = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid"
      className={cn('animate-spin', className)}
    >
      <circle
        cx="50"
        cy="50"
        r="45"
        fill="none"
        stroke="currentColor"
        strokeWidth="8"
        strokeDasharray="212.057504117311 70.68583470577033"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default LoadingSpinner;
