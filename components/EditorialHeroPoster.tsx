'use client';

import React from 'react';
import ThreatScannerGraphic from '@/components/ThreatScannerGraphic';

export default function EditorialHeroPoster() {
  return (
    <section className="relative w-full border border-zinc-300 rounded-3xl bg-[#faf9f5] shadow-xs overflow-hidden transition-all">
      {/* Halftone Dot Matrix Texture on Corners */}
      <div className="absolute top-0 left-0 w-24 sm:w-32 h-24 sm:h-32 bg-halftone-dots opacity-40 pointer-events-none rounded-tl-3xl" />
      <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-halftone-dots opacity-40 pointer-events-none rounded-tr-3xl" />
      <div className="absolute bottom-0 left-0 w-24 sm:w-32 h-24 sm:h-32 bg-halftone-dots opacity-30 pointer-events-none rounded-bl-3xl" />
      <div className="absolute bottom-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-halftone-dots opacity-30 pointer-events-none rounded-br-3xl" />

      {/* Subtle Vertical Ledger Guide Lines */}
      <div className="absolute inset-0 bg-ledger-lines opacity-60 pointer-events-none" />

      <div className="relative z-10 p-4 sm:p-8 lg:p-10 flex flex-col justify-between space-y-4 sm:space-y-6">
        {/* Top Header Row */}
        <div className="flex items-center justify-between gap-2 border-b border-zinc-200/80 pb-3 sm:pb-4">
          {/* Left: Author / Threat Analyst Profile */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-zinc-900 text-white flex items-center justify-center text-[8px] sm:text-[10px] font-bold">
              ●
            </div>
            <span className="text-[11px] sm:text-xs font-semibold text-zinc-900 tracking-tight">
              Threat Intelligence Lab
            </span>
          </div>

          {/* Center: Thin Border Pill Capsule Badge */}
          <div className="px-2.5 sm:px-3.5 py-0.5 sm:py-1 rounded-full border border-zinc-300 bg-white/90 text-zinc-800 text-[10px] sm:text-xs font-medium shadow-2xs backdrop-blur-xs select-none">
            Multi-Engine Threat Core
          </div>

          {/* Right: Agency / Handle */}
          <div className="text-[10px] sm:text-xs font-medium text-zinc-700 font-mono tracking-tight hidden sm:block">
            @virusscan.live
          </div>
        </div>

        {/* Big Editorial Headline */}
        <div className="py-2 sm:py-3 text-center space-y-0.5 select-none">
          <h1 className="font-editorial text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-normal text-zinc-950 tracking-tight leading-[0.95] sm:leading-[0.9]">
            How to Scan <span className="italic font-normal">&amp;</span> Detect
          </h1>
          <h2 className="font-editorial text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-zinc-950 tracking-tight leading-[0.95] sm:leading-[0.9]">
            Malware
          </h2>
        </div>

        {/* Centerpiece Scanner Graphic - High clarity Threat Radar Scanner HUD */}
        <div className="relative my-2 sm:my-3 flex flex-col items-center justify-center overflow-hidden">
          <ThreatScannerGraphic />
        </div>

        {/* Bottom Two Balanced Editorial Captions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 pt-3 sm:pt-5 border-t border-zinc-200/80 text-zinc-700 text-xs sm:text-sm leading-relaxed">
          <div className="space-y-0.5">
            <p className="font-normal text-zinc-800 text-[11px] sm:text-xs">
              Automated multi-engine security inspection core designed to analyze binary file signatures, URL phishing vectors, and hash checksums in real time.
            </p>
          </div>

          <div className="space-y-0.5 sm:text-right">
            <p className="font-normal text-zinc-800 text-[11px] sm:text-xs">
              Instantly inspect zero-day threats, PowerShell droppers, and malicious payloads directly inside a unified, distraction-free environment.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
