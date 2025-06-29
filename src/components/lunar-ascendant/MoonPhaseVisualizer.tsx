'use client';

import React from 'react';
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
  const r = size / 2;
  const isWaning = phaseKey.startsWith('waning') || phaseKey === 'lastQuarter' || (phaseKey === 'full' && illumination < 100);

  // Translate illumination (0-100) to a mask position (0 to size)
  // 0 illumination (new moon) -> mask is at size/2 (centered, full black circle covers)
  // 50 illumination (quarter) -> mask is at 0 or size (half covered)
  // 100 illumination (full) -> mask is at -size/2 (moved off, full white circle visible)
  const maskCx = r - (size * (illumination / 100 - 0.5));

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
          <mask id={`moon-mask-${size}`}>
            {/* The mask is a white background with a black circle moving across it */}
            <rect x="0" y="0" width={size} height={size} fill="white" />
            {illumination < 100 && <circle cx={maskCx} cy={r} r={r} fill="black" />}
          </mask>
        </defs>

        {/* The dark side of the moon, always present as the base */}
        <circle cx={r} cy={r} r={r} fill="hsl(var(--muted) / 0.8)" />

        {/* The illuminated part, revealed by the mask */}
        <circle
          cx={r}
          cy={r}
          r={r}
          fill="hsl(var(--foreground))"
          mask={`url(#moon-mask-${size})`}
          transform={isWaning ? `rotate(180 ${r} ${r})` : ''}
        />
      </svg>
    </div>
  );
};

export default MoonPhaseVisualizer;
