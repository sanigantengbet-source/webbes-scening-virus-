'use client';

import React, { useState } from 'react';
import { X, Trash2, Clock, ShieldAlert, ShieldCheck, AlertTriangle, FileCode2, Globe, Hash, Search, ArrowRight } from 'lucide-react';
import { ScanReport } from '@/types/scanner';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: ScanReport[];
  onSelectReport: (report: ScanReport) => void;
  onClearHistory: () => void;
  onDeleteItem: (id: string) => void;
}

export default function HistoryDrawer({
  isOpen,
  onClose,
  history,
  onSelectReport,
  onClearHistory,
  onDeleteItem
}: HistoryDrawerProps) {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredHistory = history.filter((item) =>
    item.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.formattedDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-zinc-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#faf9f5] border-l border-zinc-300 text-zinc-900 flex flex-col shadow-2xl">
          {/* Drawer Header */}
          <div className="p-5 border-b border-zinc-200 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-zinc-600" />
              <h2 className="font-editorial text-xl font-bold text-zinc-950">Riwayat Pemindaian</h2>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-zinc-900 text-white">
                {history.length}
              </span>
            </div>

            <button
              id="close-history-drawer-btn"
              onClick={onClose}
              className="p-1.5 rounded-full text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center border border-zinc-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search & Clear Bar */}
          <div className="p-4 border-b border-zinc-200 space-y-2 bg-white">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
              <input
                type="text"
                id="history-search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari berkas, URL, atau hash..."
                className="w-full pl-8 pr-3 py-1.5 bg-[#faf9f5] border border-zinc-300 focus:border-zinc-900 focus:outline-none rounded-full text-xs text-zinc-900 placeholder-zinc-400 font-mono"
              />
            </div>

            {history.length > 0 && (
              <div className="flex justify-end">
                <button
                  id="clear-all-history-btn"
                  onClick={onClearHistory}
                  className="text-[11px] text-zinc-500 hover:text-red-700 transition-colors flex items-center gap-1 font-medium"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Hapus Semua Riwayat</span>
                </button>
              </div>
            )}
          </div>

          {/* History List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
            {filteredHistory.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <Clock className="w-10 h-10 text-zinc-300 mx-auto" />
                <p className="text-xs text-zinc-500">
                  {searchTerm ? 'Tidak ada riwayat yang cocok.' : 'Belum ada riwayat pemindaian. Mulai pindai berkas atau URL sekarang.'}
                </p>
              </div>
            ) : (
              filteredHistory.map((item) => {
                const isItemMalicious = item.stats.malicious > 0;
                const isItemSuspicious = !isItemMalicious && item.stats.suspicious > 0;

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      onSelectReport(item);
                      onClose();
                    }}
                    className="p-3.5 rounded-2xl bg-white border border-zinc-300 hover:border-zinc-900 hover:shadow-xs transition-all cursor-pointer space-y-2 group"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        {item.type === 'file' ? (
                          <FileCode2 className="w-4 h-4 text-zinc-600 shrink-0" />
                        ) : item.type === 'url' ? (
                          <Globe className="w-4 h-4 text-zinc-600 shrink-0" />
                        ) : (
                          <Hash className="w-4 h-4 text-zinc-600 shrink-0" />
                        )}
                        <span className="text-xs font-bold text-zinc-950 truncate">{item.target}</span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteItem(item.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-zinc-400 hover:text-red-600 transition-opacity"
                        title="Hapus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-mono text-zinc-500">{item.formattedDate}</span>

                      <div className="flex items-center gap-1.5">
                        <span
                          className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                            isItemMalicious
                              ? 'bg-red-100 text-red-800'
                              : isItemSuspicious
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {item.stats.malicious}/{item.stats.total} Deteksi
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-900 transition-colors" />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
