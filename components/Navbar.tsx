'use client';

import React from 'react';
import { History, Globe, FileCode2, Hash, FlaskConical, Shield, Terminal, Code2 } from 'lucide-react';
import { ScanType } from '@/types/scanner';

interface NavbarProps {
  activeTab: ScanType | 'lab';
  setActiveTab: (tab: ScanType | 'lab') => void;
  historyCount: number;
  onOpenHistory: () => void;
}

export default function Navbar({
  activeTab,
  setActiveTab,
  historyCount,
  onOpenHistory
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-300/80 bg-[#f6f6f2]/95 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-3 sm:px-6 h-14 flex items-center justify-between">
        {/* Brand Logo & Developer Attribution */}
        <div 
          id="brand-logo-btn"
          onClick={() => setActiveTab('file')}
          className="flex items-center gap-2 sm:gap-3 cursor-pointer group select-none"
        >
          <div className="h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="SANN404 FORUM GROUP Logo"
              className="h-full w-full object-contain"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-editorial text-lg sm:text-xl font-bold tracking-tight text-zinc-950">
                VirusScan<span className="italic font-normal text-zinc-600">.pro</span>
              </span>
              <span className="text-[8px] sm:text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.2 rounded-full border border-zinc-300 text-zinc-700 bg-white font-medium">
                72 Engines
              </span>
            </div>
            <span className="text-[9px] sm:text-[10px] text-zinc-600 font-mono tracking-wider font-bold">
              SANN404 FORUM GROUP
            </span>
          </div>
        </div>

        {/* Navigation Tabs (Desktop) - Sleek Compact Pill */}
        <nav className="hidden md:flex items-center gap-0.5 bg-white p-0.5 rounded-full border border-zinc-300 shadow-2xs">
          <button
            id="nav-file-tab"
            onClick={() => setActiveTab('file')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'file'
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
            }`}
          >
            <FileCode2 className="w-3.5 h-3.5" />
            <span>Pindai File</span>
          </button>

          <button
            id="nav-url-tab"
            onClick={() => setActiveTab('url')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'url'
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Pindai URL</span>
          </button>

          <button
            id="nav-hash-tab"
            onClick={() => setActiveTab('hash')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'hash'
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
            }`}
          >
            <Hash className="w-3.5 h-3.5" />
            <span>Cari Hash</span>
          </button>

          <button
            id="nav-lab-tab"
            onClick={() => setActiveTab('lab')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'lab'
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Test Lab</span>
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white border border-zinc-300 text-zinc-700 text-[10px] font-mono shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Live Core</span>
          </div>

          <button
            id="history-btn"
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-zinc-300 text-xs font-medium text-zinc-900 hover:bg-zinc-100 hover:border-zinc-400 transition-colors shadow-2xs min-h-[32px]"
          >
            <History className="w-3.5 h-3.5 text-zinc-600" />
            <span className="text-xs font-semibold">Riwayat</span>
            {historyCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-zinc-900 text-white flex items-center justify-center text-[9px] font-bold font-mono">
                {historyCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
