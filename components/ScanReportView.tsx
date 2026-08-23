'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  FileText,
  Globe,
  Hash,
  Download,
  Share2,
  RefreshCw,
  Search,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
  Clock,
  Printer,
  Copy,
  Check,
  ArrowLeft,
  Server,
  Lock,
  Layers,
  Terminal,
  Activity
} from 'lucide-react';
import { ScanReport, ThreatCategory, EngineResult } from '@/types/scanner';

interface ScanReportViewProps {
  report: ScanReport;
  onNewScan: () => void;
}

export default function ScanReportView({
  report,
  onNewScan
}: ScanReportViewProps) {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [engineSearch, setEngineSearch] = useState<string>('');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [shareSuccess, setShareSuccess] = useState<boolean>(false);

  const isMalicious = report.stats.malicious > 0;
  const isSuspicious = !isMalicious && report.stats.suspicious > 0;
  const isClean = !isMalicious && !isSuspicious;

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(type);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2000);
    }
  };

  const handleDownloadJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `VirusScan_Report_${report.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handlePrint = () => {
    window.print();
  };

  // Filter engines
  const filteredEngines = report.engineResults.filter((engine) => {
    const matchesCategory = filterCategory === 'all' || engine.category === filterCategory;
    const matchesSearch =
      engine.engineName.toLowerCase().includes(engineSearch.toLowerCase()) ||
      (engine.result && engine.result.toLowerCase().includes(engineSearch.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 pb-12">
      {/* Top Breadcrumb & Action Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-300 pb-4">
        <div className="flex items-center gap-3">
          <button
            id="back-to-scan-btn"
            onClick={onNewScan}
            className="p-2 rounded-full border border-zinc-300 bg-white hover:bg-zinc-100 text-zinc-700 transition-colors shadow-2xs min-h-[38px] min-w-[38px] flex items-center justify-center"
            title="Kembali ke Beranda Pemindai"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-500 font-bold">
                Laporan Pemindaian Keamanan
              </span>
              <span className="text-zinc-400">&bull;</span>
              <span className="text-[11px] font-mono text-zinc-600">{report.formattedDate}</span>
            </div>
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-zinc-950 break-all leading-tight">
              {report.target}
            </h2>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            id="share-report-btn"
            onClick={handleShare}
            className="px-3.5 py-1.5 rounded-full bg-white border border-zinc-300 hover:bg-zinc-100 text-zinc-800 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs min-h-[38px]"
          >
            {shareSuccess ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-zinc-500" />}
            <span>{shareSuccess ? 'Tersalin' : 'Bagikan'}</span>
          </button>

          <button
            id="download-json-btn"
            onClick={handleDownloadJson}
            className="px-3.5 py-1.5 rounded-full bg-white border border-zinc-300 hover:bg-zinc-100 text-zinc-800 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs min-h-[38px]"
          >
            <Download className="w-3.5 h-3.5 text-zinc-500" />
            <span>JSON</span>
          </button>

          <button
            id="print-report-btn"
            onClick={handlePrint}
            className="px-3.5 py-1.5 rounded-full bg-white border border-zinc-300 hover:bg-zinc-100 text-zinc-800 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs min-h-[38px]"
          >
            <Printer className="w-3.5 h-3.5 text-zinc-500" />
            <span>Cetak</span>
          </button>

          <button
            id="new-scan-cta-btn"
            onClick={onNewScan}
            className="px-4 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all min-h-[38px]"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Pindai Baru</span>
          </button>
        </div>
      </div>

      {/* Detection Overview Banner - Editorial Newspaper Headline Style */}
      <div className="rounded-3xl border border-zinc-300 bg-white p-4 sm:p-8 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 items-center">
          {/* Main Ratio & Verdict */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-zinc-900 text-white flex items-center justify-center shrink-0 shadow-xs">
                {isMalicious ? (
                  <ShieldAlert className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                ) : isSuspicious ? (
                  <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                ) : (
                  <ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                )}
              </div>

              <div className="space-y-0.5">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold border font-mono uppercase bg-[#faf9f5] border-zinc-300 text-zinc-900">
                  {isMalicious ? (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                      <span>MALWARE TERDETEKSI</span>
                    </>
                  ) : isSuspicious ? (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                      <span>MENCURIGAKAN (SUSPICIOUS)</span>
                    </>
                  ) : (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      <span>BERSIH (CLEAN)</span>
                    </>
                  )}
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-editorial text-3xl sm:text-5xl font-bold text-zinc-950">
                    {report.stats.malicious}
                    <span className="text-xl sm:text-3xl text-zinc-500 font-normal"> / {report.stats.total}</span>
                  </span>
                  <span className="text-xs sm:text-sm text-zinc-600 font-medium">
                    engine deteksi
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              <div className="p-2 sm:p-3 rounded-2xl bg-[#faf9f5] border border-zinc-200 text-center">
                <span className="text-[9px] sm:text-[10px] text-zinc-500 uppercase font-mono font-bold">Malicious</span>
                <p className="font-editorial text-xl sm:text-2xl font-bold text-zinc-950">{report.stats.malicious}</p>
              </div>
              <div className="p-2 sm:p-3 rounded-2xl bg-[#faf9f5] border border-zinc-200 text-center">
                <span className="text-[9px] sm:text-[10px] text-zinc-500 uppercase font-mono font-bold">Suspicious</span>
                <p className="font-editorial text-xl sm:text-2xl font-bold text-zinc-950">{report.stats.suspicious}</p>
              </div>
              <div className="p-2 sm:p-3 rounded-2xl bg-[#faf9f5] border border-zinc-200 text-center">
                <span className="text-[9px] sm:text-[10px] text-zinc-500 uppercase font-mono font-bold">Harmless</span>
                <p className="font-editorial text-xl sm:text-2xl font-bold text-zinc-950">{report.stats.harmless}</p>
              </div>
              <div className="p-2 sm:p-3 rounded-2xl bg-[#faf9f5] border border-zinc-200 text-center">
                <span className="text-[9px] sm:text-[10px] text-zinc-500 uppercase font-mono font-bold">Undetected</span>
                <p className="font-editorial text-xl sm:text-2xl font-bold text-zinc-950">{report.stats.undetected}</p>
              </div>
            </div>
          </div>

          {/* Community Reputation Card */}
          <div className="p-4 sm:p-5 rounded-3xl bg-[#faf9f5] border border-zinc-200 space-y-2.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-700">Skor Reputasi Komunitas</span>
              <Activity className="w-3.5 h-3.5 text-zinc-500" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="font-editorial text-2xl sm:text-3xl font-bold text-zinc-950">
                {report.reputationScore > 0 ? `+${report.reputationScore}` : report.reputationScore} / 100
              </span>
              <span className="text-[11px] text-zinc-600 font-mono">
                {report.reputationScore >= 50 ? 'Reputasi Baik' : report.reputationScore >= 0 ? 'Netral / Sedang' : 'Tinggi Risiko'}
              </span>
            </div>

            {/* Visual Bar */}
            <div className="w-full bg-zinc-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-zinc-900 rounded-full transition-all"
                style={{
                  width: `${Math.max(5, Math.min(100, (report.reputationScore + 100) / 2))}%`
                }}
              />
            </div>
            <p className="text-[10px] text-zinc-600 leading-relaxed">
              Berdasarkan telemetri submission, whitelist global, dan database reputasi.
            </p>
          </div>
        </div>
      </div>

      {/* Target Technical Details (File or URL or Hash) */}
      {report.fileDetails && (
        <div className="bg-white border border-zinc-300 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
          <h3 className="font-editorial text-2xl font-bold text-zinc-950 flex items-center gap-2">
            <FileText className="w-5 h-5 text-zinc-700" />
            <span>Detail Berkas &amp; Karakteristik Biner</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-[#faf9f5] border border-zinc-200 space-y-1">
              <span className="text-[10px] uppercase font-mono text-zinc-500 font-bold">Ukuran Berkas</span>
              <p className="text-xs font-mono font-bold text-zinc-900">{report.fileDetails.formattedSize}</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#faf9f5] border border-zinc-200 space-y-1">
              <span className="text-[10px] uppercase font-mono text-zinc-500 font-bold">Tipe File / MIME</span>
              <p className="text-xs font-mono font-bold text-zinc-900 truncate">{report.fileDetails.fileType}</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#faf9f5] border border-zinc-200 space-y-1">
              <span className="text-[10px] uppercase font-mono text-zinc-500 font-bold">Magic Bytes Header</span>
              <p className="text-xs font-mono font-bold text-zinc-900 truncate">{report.fileDetails.magicBytes}</p>
            </div>
          </div>

          {/* Hashes Checksum Block */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-500 font-bold">Kriptografi Hash Checksum</span>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#faf9f5] border border-zinc-200 text-xs font-mono">
                <span className="text-zinc-500 font-bold w-16">MD5:</span>
                <span className="text-zinc-900 truncate flex-1 select-all">{report.fileDetails.md5}</span>
                <button
                  onClick={() => copyToClipboard(report.fileDetails!.md5, 'md5')}
                  className="p-1 text-zinc-500 hover:text-zinc-900"
                  title="Salin MD5"
                >
                  {copiedHash === 'md5' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#faf9f5] border border-zinc-200 text-xs font-mono">
                <span className="text-zinc-500 font-bold w-16">SHA-1:</span>
                <span className="text-zinc-900 truncate flex-1 select-all">{report.fileDetails.sha1}</span>
                <button
                  onClick={() => copyToClipboard(report.fileDetails!.sha1, 'sha1')}
                  className="p-1 text-zinc-500 hover:text-zinc-900"
                  title="Salin SHA-1"
                >
                  {copiedHash === 'sha1' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#faf9f5] border border-zinc-200 text-xs font-mono">
                <span className="text-zinc-500 font-bold w-16">SHA-256:</span>
                <span className="text-zinc-900 truncate flex-1 select-all font-bold">{report.fileDetails.sha256}</span>
                <button
                  onClick={() => copyToClipboard(report.fileDetails!.sha256, 'sha256')}
                  className="p-1 text-zinc-500 hover:text-zinc-900"
                  title="Salin SHA-256"
                >
                  {copiedHash === 'sha256' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {report.urlDetails && (
        <div className="bg-white border border-zinc-300 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
          <h3 className="font-editorial text-2xl font-bold text-zinc-950 flex items-center gap-2">
            <Globe className="w-5 h-5 text-zinc-700" />
            <span>Detail URL &amp; Jaringan Domain</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-[#faf9f5] border border-zinc-200 space-y-1">
              <span className="text-[10px] uppercase font-mono text-zinc-500 font-bold">Domain Host</span>
              <p className="text-xs font-mono font-bold text-zinc-900 truncate">{report.urlDetails.domain}</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#faf9f5] border border-zinc-200 space-y-1">
              <span className="text-[10px] uppercase font-mono text-zinc-500 font-bold">IP Address</span>
              <p className="text-xs font-mono font-bold text-zinc-900">{report.urlDetails.ipAddress || 'N/A'}</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#faf9f5] border border-zinc-200 space-y-1">
              <span className="text-[10px] uppercase font-mono text-zinc-500 font-bold">Status SSL / TLS</span>
              <p className="text-xs font-mono font-bold text-zinc-900">
                {report.urlDetails.sslValid ? 'Valid HTTPS' : 'Tidak Aman / Insecure'}
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#faf9f5] border border-zinc-200 space-y-1">
              <span className="text-[10px] uppercase font-mono text-zinc-500 font-bold">HTTP Status Code</span>
              <p className="text-xs font-mono font-bold text-zinc-900">{report.urlDetails.httpStatus || '200 OK'}</p>
            </div>
          </div>
        </div>
      )}

      {/* 72 Security Engines Results Table */}
      <div className="bg-white border border-zinc-300 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-zinc-200 pb-4">
          <div>
            <h3 className="font-editorial text-2xl font-bold text-zinc-950 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-zinc-700" />
              <span>Daftar 72 Antivirus Security Engines</span>
            </h3>
            <p className="text-xs text-zinc-600">Hasil verifikasi mesin deteksi signature, heuristik, dan threat intelligence</p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
            <input
              type="text"
              id="engine-search-input"
              value={engineSearch}
              onChange={(e) => setEngineSearch(e.target.value)}
              placeholder="Cari engine (Kaspersky, Bitdefender...)"
              className="w-full pl-8 pr-3 py-1.5 bg-[#faf9f5] border border-zinc-300 focus:border-zinc-900 focus:outline-none rounded-full text-xs text-zinc-900 font-mono"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              filterCategory === 'all' ? 'bg-zinc-900 text-white' : 'bg-[#faf9f5] text-zinc-700 border border-zinc-300 hover:bg-zinc-100'
            }`}
          >
            Semua ({report.engineResults.length})
          </button>
          <button
            onClick={() => setFilterCategory('malicious')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              filterCategory === 'malicious' ? 'bg-red-700 text-white' : 'bg-[#faf9f5] text-zinc-700 border border-zinc-300 hover:bg-zinc-100'
            }`}
          >
            Malicious ({report.stats.malicious})
          </button>
          <button
            onClick={() => setFilterCategory('suspicious')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              filterCategory === 'suspicious' ? 'bg-amber-700 text-white' : 'bg-[#faf9f5] text-zinc-700 border border-zinc-300 hover:bg-zinc-100'
            }`}
          >
            Suspicious ({report.stats.suspicious})
          </button>
          <button
            onClick={() => setFilterCategory('harmless')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              filterCategory === 'harmless' ? 'bg-emerald-700 text-white' : 'bg-[#faf9f5] text-zinc-700 border border-zinc-300 hover:bg-zinc-100'
            }`}
          >
            Harmless ({report.stats.harmless})
          </button>
          <button
            onClick={() => setFilterCategory('undetected')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              filterCategory === 'undetected' ? 'bg-zinc-800 text-white' : 'bg-[#faf9f5] text-zinc-700 border border-zinc-300 hover:bg-zinc-100'
            }`}
          >
            Undetected ({report.stats.undetected})
          </button>
        </div>

        {/* Engine Grid List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-2 max-h-[460px] overflow-y-auto pr-1">
          {filteredEngines.map((engine, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-2xl border flex items-center justify-between text-xs transition-all ${
                engine.category === 'malicious'
                  ? 'bg-red-50/50 border-red-200 text-red-950'
                  : engine.category === 'suspicious'
                  ? 'bg-amber-50/50 border-amber-200 text-amber-950'
                  : 'bg-[#faf9f5] border-zinc-200 text-zinc-900'
              }`}
            >
              <div className="space-y-0.5 min-w-0 pr-2">
                <span className="font-bold text-zinc-950 truncate block">{engine.engineName}</span>
                <span className="text-[11px] font-mono text-zinc-500 truncate block">
                  {engine.result || (engine.category === 'undetected' ? 'Clean / Undetected' : 'Clean')}
                </span>
              </div>

              <div className="shrink-0">
                {engine.category === 'malicious' ? (
                  <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold font-mono">
                    Threat
                  </span>
                ) : engine.category === 'suspicious' ? (
                  <span className="px-2 py-0.5 rounded-full bg-amber-600 text-white text-[10px] font-bold font-mono">
                    Suspect
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold font-mono">
                    Clean
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
