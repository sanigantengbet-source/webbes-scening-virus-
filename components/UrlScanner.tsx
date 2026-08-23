'use client';

import React, { useState } from 'react';
import { Globe, Search, AlertCircle, ShieldAlert, Sparkles, ShieldCheck, Zap, X } from 'lucide-react';
import { ScanReport } from '@/types/scanner';

interface UrlScannerProps {
  onScanComplete: (report: ScanReport) => void;
  setIsScanning: (val: boolean) => void;
  isScanning: boolean;
}

export default function UrlScanner({
  onScanComplete,
  setIsScanning,
  isScanning
}: UrlScannerProps) {
  const [urlInput, setUrlInput] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [scanStage, setScanStage] = useState<string>('Menunggu masukan URL...');

  const handleScan = async (urlOverride?: string) => {
    const targetUrl = urlOverride || urlInput;
    if (!targetUrl || targetUrl.trim().length === 0) {
      setErrorMsg('Masukkan alamat URL atau domain yang ingin diperiksa.');
      return;
    }

    setIsScanning(true);
    setErrorMsg(null);
    setScanStage('Memvalidasi format URL & resolving DNS host...');

    try {
      const stageTimer1 = setTimeout(() => setScanStage('Memeriksa reputasi domain, SSL certificate & header HTTP...'), 500);
      const stageTimer2 = setTimeout(() => setScanStage('Mencocokkan blacklist & 72 Security Engines (Google SafeBrowsing, Kaspersky)...'), 1100);

      const response = await fetch('/api/scan/url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl.trim() })
      });

      clearTimeout(stageTimer1);
      clearTimeout(stageTimer2);

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Gagal memindai URL.');
      }

      const result = await response.json();
      if (result.success && result.report) {
        setScanStage('Mempersiapkan laporan deteksi keamanan...');
        setTimeout(() => {
          setIsScanning(false);
          onScanComplete(result.report);
        }, 400);
      } else {
        throw new Error('Hasil pemindaian URL tidak valid.');
      }
    } catch (err: any) {
      setIsScanning(false);
      setErrorMsg(err.message || 'Terjadi kesalahan saat memeriksa URL.');
    }
  };

  const handlePresetClick = (presetUrl: string) => {
    setUrlInput(presetUrl);
    handleScan(presetUrl);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 sm:space-y-6">
      {/* URL Input Box - Editorial Paper Card */}
      <div className="bg-white border border-zinc-300 rounded-3xl p-5 sm:p-8 space-y-4 sm:space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 text-center sm:text-left">
          <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-900 flex items-center justify-center shrink-0 shadow-2xs">
            <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-800" />
          </div>
          <div className="space-y-0.5">
            <h3 className="font-editorial text-xl sm:text-2xl font-bold text-zinc-950">
              Pemindai URL &amp; Domain Phishing
            </h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Periksa tautan website untuk mendeteksi penipuan phishing, malware injection, domain scam, dan sertifikat berbahaya.
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
                <Globe className="w-3.5 h-3.5 text-zinc-500" />
              </div>
              <input
                type="text"
                id="url-scan-input"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com atau domain.com"
                disabled={isScanning}
                className="w-full pl-9 pr-9 py-2 sm:py-2.5 bg-[#faf9f5] border border-zinc-300 focus:border-zinc-900 focus:bg-white focus:outline-none rounded-full text-xs sm:text-sm text-zinc-900 placeholder-zinc-400 font-mono transition-all min-h-[40px]"
              />
              {urlInput && !isScanning && (
                <button
                  type="button"
                  onClick={() => setUrlInput('')}
                  className="absolute inset-y-0 right-3 flex items-center text-zinc-400 hover:text-zinc-900"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              type="submit"
              id="submit-url-scan-btn"
              disabled={isScanning || !urlInput.trim()}
              className="px-5 py-2 rounded-full bg-zinc-900 text-white font-bold text-xs sm:text-sm hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-1.5 shadow-xs min-h-[40px]"
            >
              {isScanning ? (
                <>
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Memindai...</span>
                </>
              ) : (
                <>
                  <Search className="w-3.5 h-3.5" />
                  <span>Pindai URL</span>
                </>
              )}
            </button>
          </div>
        </form>

        {isScanning && (
          <div className="p-3.5 rounded-2xl bg-[#faf9f5] border border-zinc-200 text-center space-y-1 animate-pulse">
            <p className="text-xs font-mono font-bold text-zinc-900">{scanStage}</p>
            <p className="text-[10px] text-zinc-500 font-mono">Memeriksa 72 database blacklist keamanan global...</p>
          </div>
        )}

        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <p className="font-medium">{errorMsg}</p>
          </div>
        )}
      </div>

      {/* Preset URLs */}
      <div className="border border-zinc-300 rounded-3xl bg-white p-4 sm:p-5 space-y-2.5 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 font-bold">
            Sampel URL Simulasi
          </span>
          <span className="text-[10px] text-zinc-500 font-mono">1-Klik Uji Coba</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handlePresetClick('https://phishing-banking-update.secure-login-attempt.top/login')}
            disabled={isScanning}
            className="p-2.5 rounded-2xl border border-zinc-200 bg-[#faf9f5] hover:border-zinc-400 hover:bg-white text-left transition-all group min-h-[38px]"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-950 group-hover:underline">Phishing Login Page</span>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-red-100 text-red-800 border border-red-200">
                Phishing
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 font-mono truncate mt-0.5">secure-login-attempt.top</p>
          </button>

          <button
            type="button"
            onClick={() => handlePresetClick('http://free-crypto-bonus-airdrop-claim.xyz/gift')}
            disabled={isScanning}
            className="p-2.5 rounded-2xl border border-zinc-200 bg-[#faf9f5] hover:border-zinc-400 hover:bg-white text-left transition-all group min-h-[38px]"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-950 group-hover:underline">Crypto Scam Airdrop</span>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                Suspicious
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 font-mono truncate mt-0.5">crypto-bonus-airdrop.xyz</p>
          </button>

          <button
            type="button"
            onClick={() => handlePresetClick('https://github.com/torvalds/linux')}
            disabled={isScanning}
            className="p-2.5 rounded-2xl border border-zinc-200 bg-[#faf9f5] hover:border-zinc-400 hover:bg-white text-left transition-all group min-h-[38px]"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-950 group-hover:underline">GitHub Official Repo</span>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                Clean
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 font-mono truncate mt-0.5">github.com/torvalds</p>
          </button>
        </div>
      </div>
    </div>
  );
}
