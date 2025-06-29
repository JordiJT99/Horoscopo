
'use client';

import React, { useId } from 'react';
import { cn } from '@/lib/utils';
import type { MoonPhaseKey } from '@/types';

interface MoonPhaseVisualizerProps {
  illumination: number; // 0-100
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
  const maskId = `moon-mask-${uniqueId}`;

  const r = size / 2;
  const isWaning = phaseKey.startsWith('waning') || phaseKey === 'lastQuarter' || (phaseKey === 'full' && illumination < 100);

  // Translate illumination (0-100) to a mask position (0 to size)
  const maskCx = r - (size * (illumination / 100 - 0.5));

  // Simplified crater pattern
  const craterPattern = (
    <g fill="hsl(var(--muted-foreground))" opacity="0.1">
      <circle cx={r * 0.6} cy={r * 0.5} r={r * 0.15} />
      <circle cx={r * 1.4} cy={r * 0.8} r={r * 0.2} />
      <circle cx={r * 0.9} cy={r * 1.5} r={r * 0.12} />
      <ellipse cx={r * 1.5} cy={r * 1.4} rx={r * 0.1} ry={r * 0.15} />
    </g>
  );

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
          <mask id={maskId}>
            <rect x="0" y="0" width={size} height={size} fill="white" />
            {illumination < 100 && <circle cx={maskCx} cy={r} r={r} fill="black" />}
          </mask>
        </defs>

        {/* Base dark side */}
        <circle cx={r} cy={r} r={r} fill="hsl(var(--muted) / 0.8)" />
        {/* Craters on the dark side */}
        {craterPattern}

        {/* Illuminated part */}
        <g mask={`url(#${maskId})`} transform={isWaning ? `rotate(180 ${r} ${r})` : ''}>
           <circle cx={r} cy={r} r={r} fill="hsl(var(--foreground))" />
           {/* Craters on the light side */}
           {craterPattern}
        </g>
      </svg>
    </div>
  );
};

export default MoonPhaseVisualizer;
