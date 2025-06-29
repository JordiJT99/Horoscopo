

'use client';

import React, { useId } from 'react';
import { cn } from '@/lib/utils';
import type { MoonPhaseKey } from '@/types';

interface MoonPhaseVisualizerProps {
  illumination: number;
  phaseKey: MoonPhaseKey;
  size?: number;
  className?: string;
}

const MoonPhaseVisualizer: React.FC<MoonPhaseVisualizerProps> = ({
  illumination,
  phaseKey,
  size = 72,
  className,
}) => {
  const uniqueId = useId();
  const clipPathId = `moon-clip-${uniqueId}`;
  const shadowClipPathId = `shadow-clip-${uniqueId}`;

  const r = size / 2;

  const lightForeground = 'hsl(var(--foreground))';
  const darkBackground = 'hsl(var(--muted) / 0.8)';

  // Reusable component for the crater pattern
  const Craters = ({ fill, opacity }: { fill: string; opacity: number }) => (
    <g fill={fill} opacity={opacity}>
      <circle cx={r * 0.6} cy={r * 0.5} r={r * 0.15} />
      <circle cx={r * 1.4} cy={r * 0.8} r={r * 0.2} />
      <circle cx={r * 0.9} cy={r * 1.5} r={r * 0.12} />
    </g>
  );

  const baseDarkMoon = (
    <g>
      <circle cx={r} cy={r} r={r} fill={darkBackground} />
      <Craters fill="hsl(var(--foreground))" opacity={0.08} />
    </g>
  );

  const fullLitMoonWithCraters = (
    <g>
      <circle cx={r} cy={r} r={r} fill={lightForeground} />
      <Craters fill="hsl(var(--muted-foreground))" opacity={0.15} />
    </g>
  );

  let litElement = null;
  let defsContent = null;

  switch (phaseKey) {
    case 'new':
      litElement = null; // Base dark moon is enough
      break;
    
    case 'full':
      litElement = fullLitMoonWithCraters;
      break;
      
    case 'firstQuarter':
      defsContent = (
        <clipPath id={shadowClipPathId}>
          <rect x="0" y="0" width={r} height={size} />
        </clipPath>
      );
      litElement = (
        <g>
          {fullLitMoonWithCraters}
          <g clipPath={`url(#${shadowClipPathId})`}>{baseDarkMoon}</g>
        </g>
      );
      break;
      
    case 'lastQuarter':
      defsContent = (
        <clipPath id={shadowClipPathId}>
          <rect x={r} y="0" width={r} height={size} />
        </clipPath>
      );
      litElement = (
        <g>
          {fullLitMoonWithCraters}
          <g clipPath={`url(#${shadowClipPathId})`}>{baseDarkMoon}</g>
        </g>
      );
      break;

    default: // Handles crescent and gibbous
      const isWaxing = phaseKey.includes('waxing');
      const isCrescent = phaseKey.includes('Crescent');
      const shadowOffset = isCrescent ? r * 0.5 : r * 1.5;
      const shadowCx = isWaxing ? r + shadowOffset : r - shadowOffset;

      defsContent = (
        <clipPath id={shadowClipPathId}>
          <circle cx={shadowCx} cy={r} r={r} />
        </clipPath>
      );
      
      litElement = (
        <g>
          {fullLitMoonWithCraters}
          <g clipPath={`url(#${shadowClipPathId})`}>
            {baseDarkMoon}
          </g>
        </g>
      );
      break;
  }

  return (
    <div className={cn('relative', className)} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={`Current moon phase: ${phaseKey}, ${illumination}% illuminated`}
        className="drop-shadow-[0_0_4px_hsl(var(--primary)/0.6)]"
      >
        <defs>
          <clipPath id={clipPathId}>
            <circle cx={r} cy={r} r={r} />
          </clipPath>
          {defsContent}
        </defs>
        
        <g clipPath={`url(#${clipPathId})`}>
          {baseDarkMoon}
          {litElement}
        </g>
      </svg>
    </div>
  );
};

export default MoonPhaseVisualizer;
