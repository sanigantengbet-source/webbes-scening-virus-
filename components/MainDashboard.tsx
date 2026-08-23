'use client';

import React, { useState, useEffect, useSyncExternalStore } from 'react';
import Navbar from '@/components/Navbar';
import EditorialHeroPoster from '@/components/EditorialHeroPoster';
import FileScanner from '@/components/FileScanner';
import UrlScanner from '@/components/UrlScanner';
import HashScanner from '@/components/HashScanner';
import TestLab from '@/components/TestLab';
import ScanReportView from '@/components/ScanReportView';
import HistoryDrawer from '@/components/HistoryDrawer';
import Footer from '@/components/Footer';
import { ScanReport, ScanType } from '@/types/scanner';
import { FileCode2, Globe, Hash, FlaskConical } from 'lucide-react';

const STORAGE_KEY = 'virusscan_reports_history_v2';

const EMPTY_HISTORY: ScanReport[] = [];
let memoryHistory: ScanReport[] = EMPTY_HISTORY;
let isInitialized = false;
let listeners: Array<() => void> = [];

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

const historyStore = {
  subscribe(listener: () => void) {
    listeners = [...listeners, listener];
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  },
  getSnapshot() {
    return memoryHistory;
  },
  getServerSnapshot() {
    return EMPTY_HISTORY;
  },
  set(newHistory: ScanReport[]) {
    memoryHistory = newHistory;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
      } catch (e) {
        console.error(e);
      }
    }
    emitChange();
  },
  init() {
    if (typeof window !== 'undefined' && !isInitialized) {
      isInitialized = true;
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          memoryHistory = JSON.parse(raw);
          emitChange();
        }
      } catch (e) {
        console.error(e);
      }
    }
  }
};

export default function MainDashboard() {
  const [activeTab, setActiveTab] = useState<ScanType | 'lab'>('file');
  const [activeReport, setActiveReport] = useState<ScanReport | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);

  useEffect(() => {
    historyStore.init();
  }, []);

  const history = useSyncExternalStore(
    historyStore.subscribe,
    historyStore.getSnapshot,
    historyStore.getServerSnapshot
  );

  const handleScanComplete = (report: ScanReport) => {
    setActiveReport(report);
    const updated = [report, ...history.filter(item => item.id !== report.id)].slice(0, 30);
    historyStore.set(updated);
  };

  const handleClearHistory = () => {
    historyStore.set([]);
  };

  const handleDeleteItem = (id: string) => {
    const updated = history.filter(item => item.id !== id);
    historyStore.set(updated);
  };

  const handleNewScan = () => {
    setActiveReport(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f6f6f2] text-zinc-900 selection:bg-zinc-900 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setActiveReport(null);
        }}
        historyCount={history.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-8 sm:space-y-10">
        {activeReport ? (
          <ScanReportView
            report={activeReport}
            onNewScan={handleNewScan}
          />
        ) : (
          <div className="space-y-8 sm:space-y-10">
            {/* Top Editorial Poster Archetype (Matches User's Reference Image) */}
            <EditorialHeroPoster />

            {/* Interactive Scanner Workspace */}
            <section className="space-y-5">
              {/* Tab Selector Pills - Compact & Responsive */}
              <div className="flex items-center justify-center">
                <div className="inline-flex p-0.5 sm:p-1 rounded-full bg-white border border-zinc-300 shadow-2xs max-w-full overflow-x-auto">
                  <button
                    onClick={() => setActiveTab('file')}
                    className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-bold transition-all shrink-0 ${
                      activeTab === 'file'
                        ? 'bg-zinc-900 text-white shadow-xs'
                        : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
                    }`}
                  >
                    <FileCode2 className="w-3.5 h-3.5" />
                    <span>File</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('url')}
                    className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-bold transition-all shrink-0 ${
                      activeTab === 'url'
                        ? 'bg-zinc-900 text-white shadow-xs'
                        : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>URL</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('hash')}
                    className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-bold transition-all shrink-0 ${
                      activeTab === 'hash'
                        ? 'bg-zinc-900 text-white shadow-xs'
                        : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
                    }`}
                  >
                    <Hash className="w-3.5 h-3.5" />
                    <span>Hash</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('lab')}
                    className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-bold transition-all shrink-0 ${
                      activeTab === 'lab'
                        ? 'bg-zinc-900 text-white shadow-xs'
                        : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
                    }`}
                  >
                    <FlaskConical className="w-3.5 h-3.5" />
                    <span>Test Lab</span>
                  </button>
                </div>
              </div>

              {/* Active Scanner View */}
              <div className="transition-all">
                {activeTab === 'file' && (
                  <FileScanner
                    onScanComplete={handleScanComplete}
                    setIsScanning={setIsScanning}
                    isScanning={isScanning}
                  />
                )}
                {activeTab === 'url' && (
                  <UrlScanner
                    onScanComplete={handleScanComplete}
                    setIsScanning={setIsScanning}
                    isScanning={isScanning}
                  />
                )}
                {activeTab === 'hash' && (
                  <HashScanner
                    onScanComplete={handleScanComplete}
                    setIsScanning={setIsScanning}
                    isScanning={isScanning}
                  />
                )}
                {activeTab === 'lab' && (
                  <TestLab
                    onScanComplete={handleScanComplete}
                    setIsScanning={setIsScanning}
                    isScanning={isScanning}
                  />
                )}
              </div>
            </section>
          </div>
        )}
      </main>

      {/* History Slide-over Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectReport={(report) => {
          setActiveReport(report);
          setIsHistoryOpen(false);
        }}
        onClearHistory={handleClearHistory}
        onDeleteItem={handleDeleteItem}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
