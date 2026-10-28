'use client';

import React from 'react';

interface ScooterSilhouetteProps {
  variant?: 'nmax' | 'pcx' | 'scoopy' | 'vario' | 'fazzio';
  size?: 'lg' | 'sm';
  dimmed?: boolean;
}

export function ScooterSilhouette({
  variant = 'nmax',
  size = 'lg',
  dimmed = false,
}: ScooterSilhouetteProps) {
  const strokeColor = dimmed ? 'rgba(148, 163, 184, 0.35)' : '#FFFFFF';
  const accentStroke = dimmed ? 'rgba(148, 163, 184, 0.2)' : 'rgba(147, 197, 253, 0.85)';

  if (size === 'sm') {
    return (
      <div className="relative w-full h-14 flex items-center justify-center select-none pointer-events-none">
        <svg
          viewBox="0 0 120 68"
          className="w-24 h-14 overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Rear & Front Wheels */}
          <circle cx="26" cy="48" r="11" stroke={strokeColor} strokeWidth="2.5" />
          <circle cx="92" cy="48" r="11" stroke={strokeColor} strokeWidth="2.5" />
          {/* Scooter Body Chassis */}
          {variant === 'scoopy' || variant === 'fazzio' ? (
            <path
              d="M16 44 C16 32, 34 30, 48 30 L56 44 L78 44 L84 22 L72 20 M84 22 L92 48"
              stroke={strokeColor}
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : (
            <path
              d="M15 42 L30 28 L52 30 L60 44 L80 42 L86 20 L74 18 M86 20 L92 48"
              stroke={strokeColor}
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
          {/* Seat */}
          <path
            d="M28 28 Q42 26 52 30"
            stroke={accentStroke}
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className="relative w-full h-36 flex items-center justify-center select-none pointer-events-none">
      {/* Radial ambient glow under the featured scooter */}
      {!dimmed && (
        <div
          className="absolute inset-x-8 top-4 bottom-2 rounded-full blur-2xl opacity-50"
          style={{
            background:
              'radial-gradient(circle, rgba(96,165,250,0.55) 0%, rgba(37,99,235,0.2) 60%, transparent 100%)',
          }}
        />
      )}
      <svg
        viewBox="0 0 260 130"
        className="relative z-10 w-56 h-32 overflow-visible drop-shadow-[0_8px_20px_rgba(59,130,246,0.35)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Rear Wheel */}
        <circle cx="58" cy="94" r="22" stroke={strokeColor} strokeWidth="4" />
        <circle cx="58" cy="94" r="9" stroke={accentStroke} strokeWidth="2" />
        {/* Front Wheel */}
        <circle cx="198" cy="94" r="22" stroke={strokeColor} strokeWidth="4" />
        <circle cx="198" cy="94" r="9" stroke={accentStroke} strokeWidth="2" />

        {/* Maxi Scooter Touring Silhouette (NMAX / PCX) */}
        <path
          d="M36 82 C42 62, 66 56, 108 58 L126 86 L168 86 L186 38 L158 34"
          stroke={strokeColor}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Front Fork & Fairing */}
        <path
          d="M182 46 L198 94"
          stroke={strokeColor}
          strokeWidth="4"
          strokeLinecap="round"
        />
        {/* Touring Windshield & Seat Contour */}
        <path
          d="M174 24 C184 30, 192 42, 195 54"
          stroke={accentStroke}
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M54 54 C74 50, 96 52, 112 58"
          stroke={accentStroke}
          strokeWidth="4.5"
          strokeLinecap="round"
        />
        {/* Lower Footboard & Exhaust Line */}
        <path
          d="M58 94 L156 92"
          stroke={accentStroke}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="6 6"
        />
      </svg>
    </div>
  );
}
