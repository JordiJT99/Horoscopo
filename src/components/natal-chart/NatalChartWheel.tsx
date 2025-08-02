

'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface AspectDetail {
  body1: string;
  body2: string;
  type: string;
  degree: number;
  explanation: string;
}

interface NatalChartWheelProps {
  planetPositions: Record<string, { sign: string; degree: number }>;
  aspects: AspectDetail[];
  imageDataUrl?: string;
}

// Map planet names to their astrological glyphs
const planetGlyphs: Record<string, string> = {
  sun: '☉',
  moon: '☽',
  mercury: '☿',
  venus: '♀',
  mars: '♂',
  jupiter: '♃',
  saturn: '♄',
  uranus: '♅',
  neptune: '♆',
  pluto: '♇',
  ascendant: 'AC',
};

// Map sign names to their zodiac glyphs and starting degrees for calculation
const zodiacSignDetails: Record<string, { glyph: string; start: number }> = {
  Aries: { glyph: '♈', start: 0 },
  Taurus: { glyph: '♉', start: 30 },
  Gemini: { glyph: '♊', start: 60 },
  Cancer: { glyph: '♋', start: 90 },
  Leo: { glyph: '♌', start: 120 },
  Virgo: { glyph: '♍', start: 150 },
  Libra: { glyph: '♎', start: 180 },
  Scorpio: { glyph: '♏', start: 210 },
  Sagittarius: { glyph: '♐', start: 240 },
  Capricorn: { glyph: '♑', start: 270 },
  Aquarius: { glyph: '♒', start: 300 },
  Pisces: { glyph: '♓', start: 330 },
};

// Map aspect types to colors for line drawing
const aspectColors: Record<string, string> = {
  // Spanish & English
  'Conjunción': '#3182CE', // Blue for easy
  'Conjunction': '#3182CE',
  'Oposición': '#E53E3E',   // Red for hard
  'Opposition': '#E53E3E',
  'Trígono': '#3182CE',    // Blue
  'Trine': '#3182CE',
  'Cuadratura': '#E53E3E',  // Red
  'Square': '#E53E3E',
  'Sextil': '#38A169',     // Green for opportunity
  'Sextile': '#38A169',
};


const NatalChartWheel: React.FC<NatalChartWheelProps> = ({ planetPositions, aspects, imageDataUrl }) => {
  const wheelSize = 320; // The size of the wheel container in pixels, reduced to create padding

  // Function to calculate position, now accepts an offset flag
  const calculateLabelPosition = (degree: number, useOffset: boolean) => {
    const radius = wheelSize * (useOffset ? 0.62 : 0.51); // Radii adjusted for new size
    const angleRad = (180 - degree) * (Math.PI / 180);
    const x = wheelSize / 2 + radius * Math.cos(angleRad);
    const y = wheelSize / 2 - radius * Math.sin(angleRad);
    return { x, y };
  };
  
    // Pre-process planets to determine which ones need to be staggered
  const sortedPlanets = Object.entries(planetPositions).sort(
    (a, b) => a[1].degree - b[1].degree
  );

  let lastWasOffset = false;
  const planetRenderData = sortedPlanets.map((entry, index, array) => {
    const [planet, data] = entry;
    let isCloseToPrevious = false;
    const DEGREE_THRESHOLD = 15; // Labels will be staggered if they are within 15 degrees

    // Check distance to previous planet
    if (index > 0) {
      const prevPlanetData = array[index - 1][1];
      if (Math.abs(data.degree - prevPlanetData.degree) < DEGREE_THRESHOLD) {
        isCloseToPrevious = true;
      }
    }
    
    // Check wrap-around case between last and first planet
    if (index === 0 && array.length > 1) {
      const lastPlanetData = array[array.length - 1][1];
      const diff = (data.degree + 360) - lastPlanetData.degree;
      if (diff < DEGREE_THRESHOLD) {
        isCloseToPrevious = true;
      }
    }

    // Decide whether to apply the offset based on proximity and the state of the previous label
    let useOffset = false;
    if (isCloseToPrevious) {
      if (!lastWasOffset) {
        useOffset = true;
      }
      lastWasOffset = !lastWasOffset;
    } else {
      lastWasOffset = false;
    }

    return { planet, data, useOffset };
  });

  return (
    <div className="relative flex justify-center items-center" style={{ width: wheelSize, height: wheelSize }}>
      {/* Render the static background image */}
      {imageDataUrl && (
        <Image
          src={imageDataUrl}
          alt="Natal Chart Wheel Background"
          width={wheelSize}
          height={wheelSize}
          className="rounded-full shadow-lg"
          data-ai-hint="natal chart background"
        />
      )}

      {/* SVG overlay for aspect lines */}
      <svg className="absolute top-0 left-0 w-full h-full" viewBox={`0 0 ${wheelSize} ${wheelSize}`}>
        {aspects.map((aspect, index) => {
            const planet1 = planetPositions[aspect.body1.toLowerCase()];
            const planet2 = planetPositions[aspect.body2.toLowerCase()];
            
            if (!planet1 || !planet2) return null;
            
            const lineRadius = wheelSize * 0.42; // A larger radius for the line endpoints
            const pos1 = {
                x: wheelSize / 2 + lineRadius * Math.cos((180 - planet1.degree) * Math.PI / 180),
                y: wheelSize / 2 - lineRadius * Math.sin((180 - planet1.degree) * Math.PI / 180)
            };
            const pos2 = {
                x: wheelSize / 2 + lineRadius * Math.cos((180 - planet2.degree) * Math.PI / 180),
                y: wheelSize / 2 - lineRadius * Math.sin((180 - planet2.degree) * Math.PI / 180)
            };
            
            const color = aspectColors[aspect.type] || 'rgba(255, 255, 255, 0.5)';
            
            return (
                <line
                    key={index}
                    x1={pos1.x}
                    y1={pos1.y}
                    x2={pos2.x}
                    y2={pos2.y}
                    stroke={color}
                    strokeWidth="1.5"
                    opacity="0.9"
                />
            );
        })}
      </svg>

      {/* Div overlay for planet glyphs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {planetRenderData.map(({ planet, data, useOffset }) => {
          if (!planetGlyphs[planet]) return null;

          const { x, y } = calculateLabelPosition(data.degree, useOffset);
          const signInfo = zodiacSignDetails[data.sign];
          const degreeInSign = Math.floor(data.degree % 30);
          
          return (
            <div
              key={planet}
              className="absolute text-white flex items-center gap-1"
              style={{
                left: `${x}px`,
                top: `${y}px`,
                transform: 'translate(-50%, -50%)',
                textShadow: '0 1px 3px rgba(0,0,0,0.7)',
                background: 'hsl(var(--primary) / 0.75)',
                padding: '2px 5px',
                borderRadius: '4px',
                border: '1px solid hsl(var(--primary) / 0.5)',
                backdropFilter: 'blur(2px)',
              }}
            >
              {/* Planet Glyph */}
              <span className="text-base leading-none font-semibold">{planetGlyphs[planet]}</span>
              
              {/* Info Box Content */}
              <div className="flex items-baseline">
                <span className="text-xs font-bold tracking-tighter">{`${degreeInSign}°`}</span>
                {signInfo && (
                   <span className="text-sm font-normal ml-0.5">
                     {signInfo.glyph}
                   </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NatalChartWheel;
