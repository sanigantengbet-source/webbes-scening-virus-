'use client';

import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: number;
}

export default function BrandLogo({ className = 'h-8 w-8', size = 32 }: BrandLogoProps) {
  return (
    <svg
      viewBox="0 0 512 512"
      className={`${className} object-contain`}
      style={{ width: size, height: size }}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      {/* Top Hat */}
      <polygon points="184,54 246,54 242,90 188,90" fill="currentColor" />
      <rect x="160" y="90" width="110" height="12" rx="1" fill="currentColor" />

      {/* Raven Head, Beak, Neck, Body, Wing & Tail Feathers */}
      <polygon
        points="
          184,102 
          238,102 
          258,118 
          300,124 
          302,146 
          240,154 
          240,178 
          342,250 
          384,286 
          430,350 
          352,390 
          396,404 
          428,440 
          368,412 
          298,348 
          260,348 
          188,298 
          168,260 
          168,172 
          140,172 
          164,144 
          160,140 
          184,102
        "
        fill="currentColor"
      />

      {/* Left Leg & Claw gripping Lantern */}
      <polyline
        points="208,292 144,324 136,312 154,292 136,312 120,332 108,332 108,350"
        stroke="currentColor"
        strokeWidth="12"
        strokeLinecap="square"
        strokeLinejoin="miter"
        fill="none"
      />

      {/* Right Standing Leg & Foot */}
      <polyline
        points="296,350 298,392 254,444 212,444 196,432 220,444 260,444 286,432"
        stroke="currentColor"
        strokeWidth="12"
        strokeLinecap="square"
        strokeLinejoin="miter"
        fill="none"
      />

      {/* Lantern Top Hook and Cap */}
      <path
        d="M128,312 L108,332 V348"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="square"
        fill="none"
      />
      <polygon points="102,348 154,348 138,368 118,368" fill="currentColor" />

      {/* Lantern Outer Glass Housing */}
      <polygon
        points="104,368 152,368 164,410 148,432 108,432 92,410"
        stroke="currentColor"
        strokeWidth="10"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Lantern Base */}
      <rect x="94" y="432" width="68" height="10" fill="currentColor" />
      <polygon points="120,416 136,416 136,432 120,432" fill="currentColor" />

      {/* Red Flame Droplet Inside Lantern */}
      <path
        d="M128,378 C128,378 140,392 140,402 C140,409 135,414 128,414 C121,414 116,409 116,402 C116,392 128,378 128,378 Z"
        fill="#EF4444"
      />
    </svg>
  );
}
