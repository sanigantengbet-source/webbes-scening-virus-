import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import {
  generateEngineResults,
  findKnownThreatByHash,
  formatBytes,
  generateFallbackAiReport
} from '@/lib/threat-engine';
import { ScanReport, FileDetails } from '@/types/scanner';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let { hash } = body;

    if (!hash || typeof hash !== 'string' || hash.trim().length === 0) {
      return NextResponse.json({ error: 'Hash tidak boleh kosong' }, { status: 400 });
    }

    hash = hash.trim().toLowerCase();
    const isMd5 = /^[a-f0-9]{32}$/i.test(hash);
    const isSha1 = /^[a-f0-9]{40}$/i.test(hash);
    const isSha256 = /^[a-f0-9]{64}$/i.test(hash);

    if (!isMd5 && !isSha1 && !isSha256) {
      return NextResponse.json({ error: 'Format hash tidak valid. Masukkan hash MD5 (32 hex), SHA-1 (40 hex), atau SHA-256 (64 hex).' }, { status: 400 });
    }

    const knownThreat = findKnownThreatByHash(hash);

    let isMalicious = false;
    let threatName = 'Clean';
    let category = 'Harmless';
    let suspiciousScore = 0;
    let engineOverrides: Record<string, string> | undefined = undefined;
    const riskIndicators: string[] = [];

    if (knownThreat) {
      isMalicious = true;
      threatName = knownThreat.name;
      category = knownThreat.category;
      suspiciousScore = knownThreat.detectionRate;
      engineOverrides = knownThreat.engineDetections;
      riskIndicators.push(`Teridentifikasi sebagai ancaman berbahaya dalam database: ${knownThreat.name}`);
      riskIndicators.push(knownThreat.description);
    } else {
      // Unknown or clean hash
      isMalicious = false;
      threatName = 'Undetected Hash';
      category = 'Clean';
    }

    const { engineResults, stats, reputation } = generateEngineResults(
      isMalicious,
      threatName,
      category,
      suspiciousScore,
      engineOverrides
    );

    const targetSha256 = isSha256 ? hash : (knownThreat?.hashes.find(h => h.length === 64) || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
    const targetMd5 = isMd5 ? hash : (knownThreat?.hashes.find(h => h.length === 32) || 'd41d8cd98f00b204e9800998ecf8427e');
    const targetSha1 = isSha1 ? hash : (knownThreat?.hashes.find(h => h.length === 40) || 'da39a3ee5e6b4b0d3255bfef95601890afd80709');

    const fileDetails: FileDetails = {
      fileName: knownThreat ? `${knownThreat.name}.bin` : `sample_${hash.slice(0, 8)}.dat`,
      fileSize: knownThreat ? 3518464 : 1048576,
      formattedSize: knownThreat ? formatBytes(3518464) : formatBytes(1048576),
      fileType: knownThreat ? 'Win32 Executable (PE32 / MS-DOS)' : 'Binary Executable / Archive',
      mimeType: 'application/octet-stream',
      magicBytes: '4D 5A 90 00 03 00 00 00',
      md5: targetMd5,
      sha1: targetSha1,
      sha256: targetSha256,
      entropy: isMalicious ? 7.64 : 4.82,
      entropyVerdict: isMalicious ? 'High entropy (Obfuscated payload)' : 'Normal distribution',
      suspiciousStrings: knownThreat ? [knownThreat.name, 'Cryptor Payload', 'Anti-Analysis Hooks'] : [],
      riskIndicators,
      firstSeen: new Date(Date.now() - 86400000 * 60).toISOString(),
      lastAnalysis: new Date().toISOString()
    };

    const aiReport = generateFallbackAiReport(
      hash,
      'hash',
      stats.malicious,
      stats.suspicious,
      threatName
    );

    const report: ScanReport = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      formattedDate: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }),
      type: 'hash',
      target: hash,
      status: 'completed',
      reputationScore: reputation,
      stats,
      fileDetails,
      engineResults,
      aiReport
    };

    return NextResponse.json({ success: true, report });
  } catch (error: any) {
    console.error('Hash scan error:', error);
    return NextResponse.json({ error: error?.message || 'Gagal memproses analisis hash' }, { status: 500 });
  }
}
