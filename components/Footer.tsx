'use client';

import React from 'react';
import { Shield, Sparkles, Terminal, Code2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-zinc-300 bg-[#faf9f5] mt-12 sm:mt-16 text-zinc-600 py-8 sm:py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-center md:text-left">
        {/* Brand & Developer Info */}
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 flex items-center justify-center shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="SANN404 FORUM GROUP Logo"
              className="h-full w-full object-contain"
            />
          </div>
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="font-editorial text-lg font-bold text-zinc-950">VIRUSSCAN PRO</span>
              <span className="text-zinc-500 font-mono text-[10px]">v2.5</span>
            </div>
            <p className="text-[11px] text-zinc-600 font-mono">
              <strong className="text-zinc-900 font-bold">SANN404 FORUM GROUP</strong>
            </p>
          </div>
        </div>

        {/* Feature Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-zinc-700 text-[11px] sm:text-xs">
          <span className="flex items-center gap-1 font-medium">
            <Shield className="w-3.5 h-3.5 text-zinc-900" /> 72 AV Engines
          </span>
          <span className="flex items-center gap-1 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-zinc-900" /> Heuristic Core
          </span>
          <span className="flex items-center gap-1 font-medium">
            <Terminal className="w-3.5 h-3.5 text-zinc-900" /> SHA-256 Checksums
          </span>
        </div>

        {/* Copyright & Attribution */}
        <div className="text-zinc-500 font-mono text-[10px] sm:text-[11px] space-y-0.5">
          <div>&copy; {new Date().getFullYear()} SANN404 FORUM GROUP.</div>
          <div>All security intelligence rights reserved.</div>
        </div>
      </div>
    </footer>
  );
}
