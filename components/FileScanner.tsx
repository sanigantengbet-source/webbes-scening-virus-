'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, File, AlertCircle, CheckCircle2, ShieldAlert, Sparkles, Binary, Zap, FileText } from 'lucide-react';
import { ScanReport } from '@/types/scanner';
import AsciiGraphic from '@/components/AsciiGraphic';

interface FileScannerProps {
  onScanComplete: (report: ScanReport) => void;
  setIsScanning: (val: boolean) => void;
  isScanning: boolean;
}

export default function FileScanner({
  onScanComplete,
  setIsScanning,
  isScanning
}: FileScannerProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileHashPreview, setFileHashPreview] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [scanStage, setScanStage] = useState<string>('Menunggu berkas...');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Compute SHA-256 on client side for fast preview
  const handleFileSelection = async (file: File) => {
    setErrorMsg(null);
    setSelectedFile(file);
    try {
      const buffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      setFileHashPreview(hashHex);
    } catch (e) {
      setFileHashPreview('Calculating...');
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const startScan = async (fileToScan?: File) => {
    const targetFile = fileToScan || selectedFile;
    if (!targetFile) {
      setErrorMsg('Pilih berkas terlebih dahulu untuk memulai pemindaian.');
      return;
    }

    setIsScanning(true);
    setErrorMsg(null);
    setScanStage('Membaca byte berkas & menghitung checksum SHA-256...');

    try {
      const stageTimer1 = setTimeout(() => setScanStage('Memeriksa magic bytes & analisis entropi payload...'), 500);
      const stageTimer2 = setTimeout(() => setScanStage('Menguji tanda tangan dengan 72 Security Engines (Kaspersky, Bitdefender, CrowdStrike)...'), 1100);

      const formData = new FormData();
      formData.append('file', targetFile);

      const response = await fetch('/api/scan/file', {
        method: 'POST',
        body: formData
      });

      clearTimeout(stageTimer1);
      clearTimeout(stageTimer2);

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Gagal memindai berkas.');
      }

      const result = await response.json();
      if (result.success && result.report) {
        setScanStage('Mempersiapkan laporan deteksi keamanan...');
        setTimeout(() => {
          setIsScanning(false);
          onScanComplete(result.report);
        }, 400);
      } else {
        throw new Error('Hasil pemindaian tidak valid.');
      }
    } catch (err: any) {
      setIsScanning(false);
      setErrorMsg(err.message || 'Terjadi kesalahan saat memproses berkas.');
    }
  };

  const createMockFile = (blob: Blob, name: string): File => {
    return Object.assign(blob, { name, lastModified: Date.now(), webkitRelativePath: '' }) as unknown as File;
  };

  // Sample presets for quick testing
  const loadEicarSample = () => {
    const eicarString = 'X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*';
    const blob = new Blob([eicarString], { type: 'text/plain' });
    const file = createMockFile(blob, 'eicar_com_test_virus.com');
    handleFileSelection(file);
  };

  const loadCleanSample = () => {
    const cleanContent = '%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Resources<<>>>>endobj\nxref\n0 4\n0000000000 65535 f\n0000000009 00000 n\n0000000052 00000 n\n0000000108 00000 n\ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n185\n%%EOF';
    const blob = new Blob([cleanContent], { type: 'application/pdf' });
    const file = createMockFile(blob, 'laporan_keuangan_audit.pdf');
    handleFileSelection(file);
  };

  const loadSuspiciousScriptSample = () => {
    const scriptContent = '#!/usr/bin/env powershell\n# Stealth Payload Ingestion\npowershell.exe -w hidden -nop -enc JABjAGwAaQBlAG4AdAAgAD0AIABOAGUAdwAtAE8AYgBqAGUAYwB0AA==\nVirtualAllocEx -Size 4096\n';
    const blob = new Blob([scriptContent], { type: 'text/plain' });
    const file = createMockFile(blob, 'updater_agent_hook.ps1');
    handleFileSelection(file);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 sm:space-y-6">
      {/* Upload Box Card - Clean Editorial Paper Aesthetic */}
      <div
        id="file-drop-zone"
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !isScanning && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-3xl p-6 sm:p-10 text-center transition-all cursor-pointer bg-white shadow-xs ${
          dragActive
            ? 'border-zinc-900 bg-zinc-50 scale-[1.01]'
            : selectedFile
            ? 'border-zinc-800 bg-zinc-50/50'
            : 'border-zinc-300 hover:border-zinc-800 hover:bg-zinc-50/70'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          id="file-input-hidden"
          className="hidden"
          onChange={handleChange}
          disabled={isScanning}
        />

        {isScanning ? (
          <div className="py-6 sm:py-8 space-y-4">
            <div className="w-12 h-12 rounded-full border-2 border-zinc-900 border-t-transparent animate-spin mx-auto flex items-center justify-center">
              <Binary className="w-5 h-5 text-zinc-900" />
            </div>
            <div className="space-y-1">
              <h3 className="font-editorial text-xl sm:text-2xl font-bold text-zinc-950">Memindai Berkas &amp; Enkripsi</h3>
              <p className="text-xs text-zinc-600 font-mono animate-pulse">{scanStage}</p>
            </div>
          </div>
        ) : selectedFile ? (
          <div className="space-y-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-zinc-900 text-white flex items-center justify-center mx-auto shadow-xs">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>

            <div>
              <h3 className="font-editorial text-xl sm:text-2xl font-bold text-zinc-950 break-all">{selectedFile.name}</h3>
              <p className="text-[11px] sm:text-xs text-zinc-600 mt-0.5 font-mono">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB &bull; {selectedFile.type || 'Binary / Unspecified'}
              </p>
            </div>

            {fileHashPreview && (
              <div className="max-w-xl mx-auto bg-[#faf9f5] border border-zinc-300 rounded-2xl p-3 text-left space-y-1 shadow-2xs">
                <div className="text-[10px] sm:text-[11px] font-mono text-zinc-600 flex items-center justify-between">
                  <span>SHA-256 Checksum</span>
                  <span className="text-emerald-700 flex items-center gap-1 font-mono font-bold">
                    <CheckCircle2 className="w-3 h-3" /> Calculated
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs font-mono text-zinc-900 break-all select-all">{fileHashPreview}</p>
              </div>
            )}

            <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5" onClick={e => e.stopPropagation()}>
              <button
                id="start-file-scan-btn"
                onClick={() => startScan()}
                disabled={isScanning}
                className="px-4 sm:px-5 py-2 rounded-full bg-zinc-900 text-white font-bold text-xs hover:bg-zinc-800 active:scale-[0.98] transition-all flex items-center gap-2 shadow-xs min-h-[38px]"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Pindai 72 Engine</span>
              </button>

              <button
                id="change-file-btn"
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 sm:px-4 py-2 rounded-full bg-white border border-zinc-300 text-zinc-800 text-xs font-semibold hover:bg-zinc-100 hover:border-zinc-400 transition-colors min-h-[38px]"
              >
                Ganti Berkas
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-900 flex items-center justify-center mx-auto shadow-2xs">
              <UploadCloud className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-800" />
            </div>
            <div>
              <h3 className="font-editorial text-xl sm:text-2xl font-bold text-zinc-950">
                Pilih Berkas atau <span className="underline underline-offset-4 decoration-zinc-400">Jelajahi</span>
              </h3>
              <p className="text-xs text-zinc-600 mt-1 max-w-md mx-auto leading-relaxed">
                Mendukung berkas EXE, DLL, PDF, DOCX, APK, ZIP, RAR, serta Script (PS1, JS, PY, SH) hingga 64MB.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] sm:text-[11px] text-zinc-500 font-mono pt-1">
              <span>● SHA-256 Digest</span>
              <span>● 72 AV Core</span>
              <span>● Heuristic Engine</span>
            </div>
          </div>
        )}
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-xs flex items-start gap-2.5 shadow-2xs">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <p className="font-medium">{errorMsg}</p>
        </div>
      )}

      {/* Preset Samples */}
      <div className="border border-zinc-300 rounded-3xl bg-white p-4 sm:p-5 space-y-2.5 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 font-bold">
            Sampel Uji Cepat (Quick Test Samples)
          </span>
          <span className="text-[10px] text-zinc-500 font-mono">1-Klik Simulasi</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            type="button"
            onClick={loadEicarSample}
            disabled={isScanning}
            className="p-2.5 rounded-2xl border border-zinc-200 bg-[#faf9f5] hover:border-zinc-400 hover:bg-white text-left transition-all group min-h-[38px]"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-950 group-hover:underline">EICAR Test Virus</span>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-red-100 text-red-800 border border-red-200">
                Threat
              </span>
            </div>
            <p className="text-[10px] text-zinc-600 mt-0.5">Standard antivirus validation string</p>
          </button>

          <button
            type="button"
            onClick={loadSuspiciousScriptSample}
            disabled={isScanning}
            className="p-2.5 rounded-2xl border border-zinc-200 bg-[#faf9f5] hover:border-zinc-400 hover:bg-white text-left transition-all group min-h-[38px]"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-950 group-hover:underline">PowerShell Dropper</span>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                Suspicious
              </span>
            </div>
            <p className="text-[10px] text-zinc-600 mt-0.5">Obfuscated payload injection script</p>
          </button>

          <button
            type="button"
            onClick={loadCleanSample}
            disabled={isScanning}
            className="p-2.5 rounded-2xl border border-zinc-200 bg-[#faf9f5] hover:border-zinc-400 hover:bg-white text-left transition-all group min-h-[38px]"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-950 group-hover:underline">Clean PDF Document</span>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                Clean
              </span>
            </div>
            <p className="text-[10px] text-zinc-600 mt-0.5">Benign corporate financial audit PDF</p>
          </button>
        </div>
      </div>
    </div>
  );
}
