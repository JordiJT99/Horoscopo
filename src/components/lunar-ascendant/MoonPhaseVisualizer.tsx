'use client';

import React, { useId } from 'react';
import { cn } from '@/lib/utils';
import type { MoonPhaseKey } from '@/types';

interface MoonPhaseVisualizerProps {
  illumination: number; // Used to refine crescent/gibbous, but phaseKey is primary
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
  const r = size / 2;

  const lightForeground = 'hsl(var(--foreground))';
  const darkBackground = 'hsl(var(--muted) / 0.8)';
  
  // Base dark moon with subtle craters
  const darkCraters = (
    <g fill="hsl(var(--foreground))" opacity="0.08">
      <circle cx={r * 0.6} cy={r * 0.5} r={r * 0.15} />
      <circle cx={r * 1.4} cy={r * 0.8} r={r * 0.2} />
      <circle cx={r * 0.9} cy={r * 1.5} r={r * 0.12} />
    </g>
  );
  
  const baseDarkMoon = (
      <g>
          <circle cx={r} cy={r} r={r} fill={darkBackground} />
          {darkCraters}
      </g>
  );

  // Lit part with subtle craters
  const lightCraters = (
    <g fill="hsl(var(--muted-foreground))" opacity="0.15">
        <circle cx={r * 0.6} cy={r * 0.5} r={r * 0.15} />
        <circle cx={r * 1.4} cy={r * 0.8} r={r * 0.2} />
        <circle cx={r * 0.9} cy={r * 1.5} r={r * 0.12} />
    </g>
  );

  let litElement = null;

  switch (phaseKey) {
    case 'new':
      // Correct: Only the base dark moon is needed. litElement remains null.
      break;
    case 'full':
      litElement = (
        <g>
          <circle cx={r} cy={r} r={r} fill={lightForeground} />
          {lightCraters}
        </g>
      );
      break;
    case 'firstQuarter':
      litElement = (
        <g>
          <path d={`M ${r},0 V ${size} H ${size} V 0 Z`} fill={lightForeground} />
          {lightCraters}
        </g>
      );
      break;
    case 'lastQuarter':
      litElement = (
        <g>
          <path d={`M 0,0 V ${size} H ${r} V 0 Z`} fill={lightForeground} />
          {lightCraters}
        </g>
      );
      break;
    default: // Handles crescent and gibbous phases by overlaying a shadow
      const isWaxing = phaseKey.includes('waxing');
      const isCrescent = phaseKey.includes('Crescent');
      
      // The horizontal offset of the shadow circle's center
      // A smaller offset for gibbous (revealing more light), larger for crescent (revealing less light)
      const shadowOffset = isCrescent ? r * 0.5 : r * 1.5;
      const shadowCx = isWaxing ? r + shadowOffset : r - shadowOffset;

      litElement = (
        <g>
          {/* Base lit moon with craters */}
          <circle cx={r} cy={r} r={r} fill={lightForeground} />
          {lightCraters}
          
          {/* Occluding shadow circle that creates the phase shape */}
          <circle cx={shadowCx} cy={r} r={r} fill={darkBackground} />
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
