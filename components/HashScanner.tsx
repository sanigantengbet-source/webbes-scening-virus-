'use client';

import React, { useState } from 'react';
import { Hash, Search, AlertCircle, ShieldAlert, Sparkles, Check, X, Zap } from 'lucide-react';
import { ScanReport } from '@/types/scanner';

interface HashScannerProps {
  onScanComplete: (report: ScanReport) => void;
  setIsScanning: (val: boolean) => void;
  isScanning: boolean;
}

export default function HashScanner({
  onScanComplete,
  setIsScanning,
  isScanning
}: HashScannerProps) {
  const [hashInput, setHashInput] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const cleanHash = hashInput.trim().toLowerCase();
  const isMd5 = /^[a-f0-9]{32}$/i.test(cleanHash);
  const isSha1 = /^[a-f0-9]{40}$/i.test(cleanHash);
  const isSha256 = /^[a-f0-9]{64}$/i.test(cleanHash);
  const isValidHash = isMd5 || isSha1 || isSha256;

  const handleScan = async (hashOverride?: string) => {
    const target = (hashOverride || hashInput).trim();
    if (!target) {
      setErrorMsg('Masukkan nilai hash (MD5, SHA-1, atau SHA-256).');
      return;
    }

    setIsScanning(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/scan/hash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hash: target })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Gagal mencari data hash.');
      }

      const result = await response.json();
      if (result.success && result.report) {
        setIsScanning(false);
        onScanComplete(result.report);
      } else {
        throw new Error('Data laporan hash tidak valid.');
      }
    } catch (err: any) {
      setIsScanning(false);
      setErrorMsg(err.message || 'Terjadi kesalahan saat memproses hash.');
    }
  };

  const handlePresetClick = (presetHash: string) => {
    setHashInput(presetHash);
    handleScan(presetHash);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 sm:space-y-6">
      {/* Search Box - Editorial Paper Card */}
      <div className="bg-white border border-zinc-300 rounded-3xl p-5 sm:p-8 space-y-4 sm:space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 text-center sm:text-left">
          <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-900 flex items-center justify-center shrink-0 shadow-2xs">
            <Hash className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-800" />
          </div>
          <div className="space-y-0.5">
            <h3 className="font-editorial text-xl sm:text-2xl font-bold text-zinc-950">
              Pencarian Hash &amp; Reputasi Malware
            </h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Cari catatan ancaman berdasarkan checksum hash berkas MD5 (32 hex), SHA-1 (40 hex), atau SHA-256 (64 hex).
            </p>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleScan();
          }}
          className="space-y-2.5"
        >
          <div className="relative flex flex-col sm:flex-row items-stretch gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                <Hash className="w-3.5 h-3.5 text-zinc-500" />
              </div>
              <input
                type="text"
                id="hash-scan-input"
                value={hashInput}
                onChange={(e) => setHashInput(e.target.value)}
                placeholder="275a021bbfb6489e54d471899f7db9d16bba4a04..."
                disabled={isScanning}
                className="w-full pl-9 pr-9 py-2 sm:py-2.5 bg-[#faf9f5] border border-zinc-300 focus:border-zinc-900 focus:bg-white focus:outline-none rounded-full text-xs sm:text-sm text-zinc-900 placeholder-zinc-400 font-mono transition-all min-h-[40px]"
              />
              {hashInput && !isScanning && (
                <button
                  type="button"
                  onClick={() => setHashInput('')}
                  className="absolute inset-y-0 right-3 flex items-center text-zinc-400 hover:text-zinc-900"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              type="submit"
              id="submit-hash-scan-btn"
              disabled={isScanning || !hashInput.trim()}
              className="px-5 py-2 rounded-full bg-zinc-900 text-white font-bold text-xs sm:text-sm hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-1.5 shadow-xs min-h-[40px]"
            >
              {isScanning ? (
                <>
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Mencari...</span>
                </>
              ) : (
                <>
                  <Search className="w-3.5 h-3.5" />
                  <span>Cari Hash</span>
                </>
              )}
            </button>
          </div>

          {/* Hash Type Indicator Pill */}
          {hashInput.trim() && (
            <div className="flex items-center gap-1.5 text-[11px] font-mono pt-0.5">
              <span className="text-zinc-500">Format:</span>
              {isSha256 ? (
                <span className="px-2 py-0.2 rounded-full bg-zinc-900 text-white font-bold">SHA-256 (64 hex)</span>
              ) : isSha1 ? (
                <span className="px-2 py-0.2 rounded-full bg-zinc-800 text-white font-bold">SHA-1 (40 hex)</span>
              ) : isMd5 ? (
                <span className="px-2 py-0.2 rounded-full bg-zinc-800 text-white font-bold">MD5 (32 hex)</span>
              ) : (
                <span className="px-2 py-0.2 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                  Format hash tidak baku
                </span>
              )}
            </div>
          )}
        </form>

        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <p className="font-medium">{errorMsg}</p>
          </div>
        )}
      </div>

      {/* Preset Hashes */}
      <div className="border border-zinc-300 rounded-3xl bg-white p-4 sm:p-5 space-y-2.5 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 font-bold">
            Sampel Hash Malware Terkenal
          </span>
          <span className="text-[10px] text-zinc-500 font-mono">1-Klik Investigasi</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handlePresetClick('275a021bbfb6489e54d471899f7db9d1663fc695ec2fe2a2c4538aabf651fd0f')}
            disabled={isScanning}
            className="p-2.5 rounded-2xl border border-zinc-200 bg-[#faf9f5] hover:border-zinc-400 hover:bg-white text-left transition-all group min-h-[38px]"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-950 group-hover:underline">EICAR Standard Virus</span>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-red-100 text-red-800 border border-red-200">
                Threat
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 font-mono truncate mt-0.5">275a021bbfb6489e54d471899...</p>
          </button>

          <button
            type="button"
            onClick={() => handlePresetClick('ed01ebfbc9eb5bbea545af4d01bf5f1071661840480439c6e5babe8e080e41aa')}
            disabled={isScanning}
            className="p-2.5 rounded-2xl border border-zinc-200 bg-[#faf9f5] hover:border-zinc-400 hover:bg-white text-left transition-all group min-h-[38px]"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-950 group-hover:underline">WannaCry Ransomware</span>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-red-100 text-red-800 border border-red-200">
                Critical
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 font-mono truncate mt-0.5">ed01ebfbc9eb5bbea545af4d0...</p>
          </button>

          <button
            type="button"
            onClick={() => handlePresetClick('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855')}
            disabled={isScanning}
            className="p-2.5 rounded-2xl border border-zinc-200 bg-[#faf9f5] hover:border-zinc-400 hover:bg-white text-left transition-all group min-h-[38px]"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-950 group-hover:underline">Empty File (Null Hash)</span>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                Clean
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 font-mono truncate mt-0.5">e3b0c44298fc1c149afbf4c89...</p>
          </button>
        </div>
      </div>
    </div>
  );
}
