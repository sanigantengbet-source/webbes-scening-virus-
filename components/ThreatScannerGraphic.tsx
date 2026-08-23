'use client';

import React, { useState } from 'react';
import { Shield, Scan, AlertTriangle, Crosshair } from 'lucide-react';

interface ThreatScannerGraphicProps {
  className?: string;
}

export default function ThreatScannerGraphic({ className = '' }: ThreatScannerGraphicProps) {
  const [activeBlip, setActiveBlip] = useState<number | null>(null);

  // Threat nodes on the radar
  const threatNodes = [
    {
      id: 1,
      x: 65,
      y: 35,
      label: 'TROJAN.DROPPER',
      type: 'malware',
      severity: 'CRITICAL',
      engines: '68/72 Detections'
    },
    {
      id: 2,
      x: 32,
      y: 68,
      label: 'PHISH.INJECTOR',
      type: 'malware',
      severity: 'HIGH',
      engines: '54/72 Detections'
    },
    {
      id: 3,
      x: 72,
      y: 74,
      label: 'SYSTEM.CORE.SYS',
      type: 'clean',
      severity: 'CLEAN',
      engines: '0/72 Clean'
    },
    {
      id: 4,
      x: 30,
      y: 28,
      label: 'HEUR:EXPLOIT.GEN',
      type: 'malware',
      severity: 'MEDIUM',
      engines: '42/72 Detections'
    }
  ];

  return (
    <div className={`w-full max-w-lg mx-auto flex flex-col items-center select-none ${className}`}>
      {/* Scanner Radar Screen Frame */}
      <div className="relative w-full aspect-square max-w-[320px] sm:max-w-[380px] p-2 sm:p-4 rounded-3xl bg-zinc-950 text-zinc-100 shadow-xl border-2 border-zinc-800 flex items-center justify-center overflow-hidden">
        {/* Subtle Background Grid */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle, #38bdf8 1px, transparent 1px)`,
            backgroundSize: '16px 16px'
          }}
        />

        {/* Outer Coordinate Ring */}
        <div className="absolute inset-3 sm:inset-5 rounded-full border border-zinc-800 pointer-events-none flex items-center justify-center">
          {/* Compass / Degree markings */}
          <span className="absolute top-1 text-[8px] font-mono text-zinc-500 font-bold">000° NORTH</span>
          <span className="absolute bottom-1 text-[8px] font-mono text-zinc-500 font-bold">180° SOUTH</span>
          <span className="absolute left-1 text-[8px] font-mono text-zinc-500 font-bold">270° WEST</span>
          <span className="absolute right-1 text-[8px] font-mono text-zinc-500 font-bold">090° EAST</span>
        </div>

        {/* Concentric Radar Distance Rings */}
        <div className="absolute w-[80%] h-[80%] rounded-full border border-dashed border-zinc-700/60 pointer-events-none" />
        <div className="absolute w-[60%] h-[60%] rounded-full border border-zinc-700/80 pointer-events-none" />
        <div className="absolute w-[40%] h-[40%] rounded-full border border-dashed border-emerald-500/30 pointer-events-none" />
        <div className="absolute w-[20%] h-[20%] rounded-full border border-emerald-500/50 pointer-events-none" />

        {/* Crosshair Axes */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-full h-[1px] bg-zinc-800/80" />
          <div className="h-full w-[1px] bg-zinc-800/80 absolute" />
        </div>

        {/* Radar Rotating Sweep Cone (Pure GPU CSS Animation) */}
        <div className="absolute w-full h-full rounded-full pointer-events-none flex items-center justify-center animate-radar-sweep">
          <div 
            className="absolute top-0 right-0 w-1/2 h-1/2 origin-bottom-left"
            style={{
              background: 'conic-gradient(from 0deg, rgba(16, 185, 129, 0.35) 0deg, rgba(16, 185, 129, 0.08) 45deg, transparent 60deg)'
            }}
          />
          {/* Leading Scan Line */}
          <div className="absolute top-0 left-1/2 w-[1.5px] h-1/2 bg-emerald-400 shadow-[0_0_8px_#34d399] origin-bottom" />
        </div>

        {/* Radar Center Scanner Pivot */}
        <div className="relative z-20 w-4 h-4 rounded-full bg-emerald-400 border-2 border-zinc-950 flex items-center justify-center shadow-[0_0_12px_#10b981]">
          <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
        </div>

        {/* Detected Threat Nodes / Blips */}
        {threatNodes.map((node) => {
          const isDanger = node.type === 'malware';
          return (
            <div
              key={node.id}
              onClick={() => setActiveBlip(activeBlip === node.id ? null : node.id)}
              className="absolute z-30 cursor-pointer group -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
            >
              {/* Ping Animation */}
              <div 
                className={`absolute -inset-1 rounded-full animate-ping opacity-75 ${
                  isDanger ? 'bg-rose-500' : 'bg-emerald-400'
                }`}
              />

              {/* Target Dot */}
              <div 
                className={`relative w-3.5 h-3.5 rounded-full border-2 border-zinc-950 flex items-center justify-center shadow-md transition-transform group-hover:scale-125 ${
                  isDanger ? 'bg-rose-500' : 'bg-emerald-400'
                }`}
              >
                <div className="w-1 h-1 rounded-full bg-white" />
              </div>

              {/* Threat Label Tag */}
              <div 
                className={`absolute left-4 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded text-[8px] font-mono whitespace-nowrap shadow-md pointer-events-none transition-opacity ${
                  isDanger 
                    ? 'bg-rose-950/90 text-rose-300 border border-rose-800/80' 
                    : 'bg-emerald-950/90 text-emerald-300 border border-emerald-800/80'
                }`}
              >
                {node.label}
              </div>
            </div>
          );
        })}

        {/* Top-Left Scanner HUD Stats */}
        <div className="absolute top-3 left-3.5 z-20 flex flex-col gap-0.5 text-[8px] sm:text-[9px] font-mono text-zinc-400 pointer-events-none">
          <div className="flex items-center gap-1 text-emerald-400 font-bold tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            LIVE RADAR SCANNER
          </div>
          <span className="text-zinc-500">FREQ: 5.8 GHz | 72 AV ENGINES</span>
        </div>

        {/* Top-Right Threat Counter */}
        <div className="absolute top-3 right-3.5 z-20 flex items-center gap-1 text-[8px] sm:text-[9px] font-mono bg-zinc-900/90 px-2 py-0.5 rounded border border-zinc-800 text-rose-400 pointer-events-none">
          <AlertTriangle className="w-2.5 h-2.5" />
          <span>3 THREATS LOCKED</span>
        </div>

        {/* Bottom Scanner Scope Readout */}
        <div className="absolute bottom-3 left-3.5 right-3.5 z-20 flex items-center justify-between text-[8px] sm:text-[9px] font-mono text-zinc-400 pointer-events-none border-t border-zinc-800/80 pt-1.5">
          <div className="flex items-center gap-1 text-zinc-300">
            <Crosshair className="w-3 h-3 text-emerald-400" />
            <span>OPTICAL DEPTH: 100%</span>
          </div>
          <div className="text-emerald-400 font-bold">
            STATUS: ACTIVE INSPECTION
          </div>
        </div>
      </div>

      {/* Threat Inspection Detail Bar Underneath */}
      <div className="mt-3 w-full flex items-center justify-between gap-2 px-3 py-1.5 bg-zinc-900 text-white rounded-xl border border-zinc-800 text-[10px] sm:text-xs font-mono">
        <div className="flex items-center gap-1.5 truncate">
          <Scan className="w-3.5 h-3.5 text-emerald-400 shrink-0 animate-pulse" />
          <span className="text-zinc-400">TARGET:</span>
          <span className="text-emerald-300 font-semibold truncate">BINARY HEURISTIC MATRIX</span>
        </div>
        <div className="flex items-center gap-1 text-zinc-400 shrink-0">
          <Shield className="w-3 h-3 text-emerald-400" />
          <span>72/72 ACTIVE</span>
        </div>
      </div>
    </div>
  );
}

