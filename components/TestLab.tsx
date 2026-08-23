'use client';

import React from 'react';
import { FlaskConical, Play, ShieldAlert, ShieldCheck, Bug, Globe, FileCode2, Sparkles, ArrowRight } from 'lucide-react';
import { ScanReport } from '@/types/scanner';

interface TestLabProps {
  onScanComplete: (report: ScanReport) => void;
  setIsScanning: (val: boolean) => void;
  isScanning: boolean;
}

export default function TestLab({
  onScanComplete,
  setIsScanning,
  isScanning
}: TestLabProps) {
  const runFileTest = async (presetType: 'eicar' | 'clean_pdf' | 'script_trojan') => {
    setIsScanning(true);
    let blob: Blob;
    let fileName: string;

    if (presetType === 'eicar') {
      const eicarString = 'X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*';
      blob = new Blob([eicarString], { type: 'text/plain' });
      fileName = 'eicar_antivirus_test_file.com';
    } else if (presetType === 'clean_pdf') {
      const cleanContent = '%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Resources<<>>>>endobj\nxref\n0 4\n0000000000 65535 f\n0000000009 00000 n\n0000000052 00000 n\n0000000108 00000 n\ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n185\n%%EOF';
      blob = new Blob([cleanContent], { type: 'application/pdf' });
      fileName = 'sample_clean_document.pdf';
    } else {
      const scriptContent = '#!/usr/bin/env powershell\n# Remote Injection Wrapper\npowershell.exe -w hidden -nop -enc JABjAGwAaQBlAG4AdAAgAD0AIABOAGUAdwAtAE8AYgBqAGUAYwB0AA==\nVirtualAllocEx -Size 4096\n';
      blob = new Blob([scriptContent], { type: 'text/plain' });
      fileName = 'malicious_powershell_dropper.ps1';
    }

    try {
      const formData = new FormData();
      formData.append('file', blob, fileName);

      const res = await fetch('/api/scan/file', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (data.success && data.report) {
        setIsScanning(false);
        onScanComplete(data.report);
      }
    } catch (e) {
      setIsScanning(false);
    }
  };

  const runUrlTest = async (url: string) => {
    setIsScanning(true);
    try {
      const res = await fetch('/api/scan/url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      const data = await res.json();
      if (data.success && data.report) {
        setIsScanning(false);
        onScanComplete(data.report);
      }
    } catch (e) {
      setIsScanning(false);
    }
  };

  const runHashTest = async (hash: string) => {
    setIsScanning(true);
    try {
      const res = await fetch('/api/scan/hash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hash })
      });
      const data = await res.json();
      if (data.success && data.report) {
        setIsScanning(false);
        onScanComplete(data.report);
      }
    } catch (e) {
      setIsScanning(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-4 sm:space-y-6">
      {/* Header Info - Editorial Paper Card */}
      <div className="bg-white border border-zinc-300 rounded-3xl p-5 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 sm:gap-6 text-center sm:text-left shadow-xs">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4">
          <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-900 flex items-center justify-center shrink-0 shadow-2xs">
            <FlaskConical className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-800" />
          </div>
          <div className="space-y-0.5">
            <h3 className="font-editorial text-xl sm:text-2xl font-bold text-zinc-950">
              Security Threat Sandbox &amp; Test Lab
            </h3>
            <p className="text-xs text-zinc-600 max-w-2xl leading-relaxed">
              Lingkungan uji coba interaktif untuk menguji akurasi deteksi engine, klasifikasi malware, analisis heuristik, dan telemetri multi-engine dalam satu klik.
            </p>
          </div>
        </div>

        <div className="px-3 py-1 rounded-full bg-[#faf9f5] border border-zinc-300 text-zinc-900 text-[11px] font-mono shrink-0 shadow-2xs">
          6 Skenario Live
        </div>
      </div>

      {/* Grid of Test Scenarios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {/* Card 1: EICAR Virus */}
        <div className="bg-white border border-zinc-300 rounded-3xl p-4 sm:p-5 flex flex-col justify-between space-y-3 sm:space-y-4 hover:border-zinc-800 transition-all shadow-xs group">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[9px] sm:text-[10px] font-mono font-bold px-2 py-0.2 rounded-full bg-red-100 text-red-800 border border-red-200">
                File Threat Test
              </span>
              <FileCode2 className="w-3.5 h-3.5 text-zinc-400" />
            </div>
            <h4 className="font-editorial text-lg sm:text-xl font-bold text-zinc-950">EICAR Standard Antivirus Test</h4>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Uji deteksi berkas standar internasional untuk memastikan 72 AV engine merespons tanda tangan malware secara instan.
            </p>
          </div>

          <button
            onClick={() => runFileTest('eicar')}
            disabled={isScanning}
            className="w-full py-2 px-3 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5 group-hover:shadow-xs min-h-[36px]"
          >
            <Play className="w-3 h-3" />
            <span>Jalankan Simulasi File</span>
          </button>
        </div>

        {/* Card 2: PowerShell Dropper */}
        <div className="bg-white border border-zinc-300 rounded-3xl p-4 sm:p-5 flex flex-col justify-between space-y-3 sm:space-y-4 hover:border-zinc-800 transition-all shadow-xs group">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[9px] sm:text-[10px] font-mono font-bold px-2 py-0.2 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                Suspicious Script
              </span>
              <Bug className="w-3.5 h-3.5 text-zinc-400" />
            </div>
            <h4 className="font-editorial text-lg sm:text-xl font-bold text-zinc-950">Stealth PowerShell Dropper</h4>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Script terenkode Base64 yang mengeksekusi payload di memori tanpa menulis berkas di disk (living-off-the-land).
            </p>
          </div>

          <button
            onClick={() => runFileTest('script_trojan')}
            disabled={isScanning}
            className="w-full py-2 px-3 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5 group-hover:shadow-xs min-h-[36px]"
          >
            <Play className="w-3 h-3" />
            <span>Jalankan Analisis Heuristik</span>
          </button>
        </div>

        {/* Card 3: Phishing URL */}
        <div className="bg-white border border-zinc-300 rounded-3xl p-4 sm:p-5 flex flex-col justify-between space-y-3 sm:space-y-4 hover:border-zinc-800 transition-all shadow-xs group">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[9px] sm:text-[10px] font-mono font-bold px-2 py-0.2 rounded-full bg-red-100 text-red-800 border border-red-200">
                Phishing URL
              </span>
              <Globe className="w-3.5 h-3.5 text-zinc-400" />
            </div>
            <h4 className="font-editorial text-lg sm:text-xl font-bold text-zinc-950">Credential Harvester Domain</h4>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Domain palsu dengan pola nama spoofing perbankan, SSL mencurigakan, dan form pencurian kredensial.
            </p>
          </div>

          <button
            onClick={() => runUrlTest('https://phishing-banking-update.secure-login-attempt.top/login')}
            disabled={isScanning}
            className="w-full py-2 px-3 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5 group-hover:shadow-xs min-h-[36px]"
          >
            <Play className="w-3 h-3" />
            <span>Audit Reputasi URL</span>
          </button>
        </div>

        {/* Card 4: WannaCry Hash */}
        <div className="bg-white border border-zinc-300 rounded-3xl p-4 sm:p-5 flex flex-col justify-between space-y-3 sm:space-y-4 hover:border-zinc-800 transition-all shadow-xs group">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[9px] sm:text-[10px] font-mono font-bold px-2 py-0.2 rounded-full bg-red-100 text-red-800 border border-red-200">
                Known Malware Hash
              </span>
              <ShieldAlert className="w-3.5 h-3.5 text-zinc-400" />
            </div>
            <h4 className="font-editorial text-lg sm:text-xl font-bold text-zinc-950">WannaCry Ransomware Hash</h4>
            <p className="text-xs text-zinc-600 leading-relaxed">
              SHA-256 asli dari ransomware WannaCry untuk menguji database intelijen IOC dan pemetaan MITRE ATT&amp;CK.
            </p>
          </div>

          <button
            onClick={() => runHashTest('ed01ebfbc9eb5bbea545af4d01bf5f1071661840480439c6e5babe8e080e41aa')}
            disabled={isScanning}
            className="w-full py-2 px-3 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5 group-hover:shadow-xs min-h-[36px]"
          >
            <Play className="w-3 h-3" />
            <span>Investigasi Hash Global</span>
          </button>
        </div>

        {/* Card 5: Clean Document */}
        <div className="bg-white border border-zinc-300 rounded-3xl p-4 sm:p-5 flex flex-col justify-between space-y-3 sm:space-y-4 hover:border-zinc-800 transition-all shadow-xs group">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[9px] sm:text-[10px] font-mono font-bold px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                Clean Benign File
              </span>
              <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
            </div>
            <h4 className="font-editorial text-lg sm:text-xl font-bold text-zinc-950">Clean Corporate Document</h4>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Dokumen PDF resmi berformat standar untuk memverifikasi akurasi zero false-positive pada engine.
            </p>
          </div>

          <button
            onClick={() => runFileTest('clean_pdf')}
            disabled={isScanning}
            className="w-full py-2 px-3 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5 group-hover:shadow-xs min-h-[36px]"
          >
            <Play className="w-3 h-3" />
            <span>Uji Objek Bersih</span>
          </button>
        </div>

        {/* Card 6: Clean URL */}
        <div className="bg-white border border-zinc-300 rounded-3xl p-4 sm:p-5 flex flex-col justify-between space-y-3 sm:space-y-4 hover:border-zinc-800 transition-all shadow-xs group">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[9px] sm:text-[10px] font-mono font-bold px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                Whitelisted Domain
              </span>
              <Globe className="w-3.5 h-3.5 text-zinc-400" />
            </div>
            <h4 className="font-editorial text-lg sm:text-xl font-bold text-zinc-950">Official Linux Kernel Repo</h4>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Tautan repositori publik dengan sertifikat TLS valid, security headers lengkap, dan reputasi tinggi.
            </p>
          </div>

          <button
            onClick={() => runUrlTest('https://github.com/torvalds/linux')}
            disabled={isScanning}
            className="w-full py-2 px-3 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5 group-hover:shadow-xs min-h-[36px]"
          >
            <Play className="w-3 h-3" />
            <span>Audit Reputasi Bersih</span>
          </button>
        </div>
      </div>
    </div>
  );
}
