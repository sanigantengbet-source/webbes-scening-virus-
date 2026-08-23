import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import {
  calculateEntropy,
  detectMagicBytes,
  scanSuspiciousStrings,
  formatBytes,
  generateEngineResults,
  findKnownThreatByHash,
  generateFallbackAiReport
} from '@/lib/threat-engine';
import { ScanReport, FileDetails } from '@/types/scanner';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Compute Hashes
    const md5 = crypto.createHash('md5').update(buffer).digest('hex');
    const sha1 = crypto.createHash('sha1').update(buffer).digest('hex');
    const sha256 = crypto.createHash('sha256').update(buffer).digest('hex');

    // Static Analysis
    const entropy = calculateEntropy(buffer);
    let entropyVerdict = 'Normal distribution';
    if (entropy > 7.2) entropyVerdict = 'High entropy (Possible obfuscation / packer / crypto payload)';
    else if (entropy < 1.5) entropyVerdict = 'Extremely low entropy (Sparse/repetitive data)';

    const { magic, type: fileType, mime } = detectMagicBytes(buffer, file.name);
    const { foundStrings, riskIndicators } = scanSuspiciousStrings(buffer);

    // Check if known threat hash
    const knownThreat = findKnownThreatByHash(sha256) || findKnownThreatByHash(md5) || findKnownThreatByHash(sha1);

    // Check if EICAR string directly in content
    const isEicarText = buffer.slice(0, 128).toString('utf8').includes('EICAR-STANDARD-ANTIVIRUS-TEST-FILE');

    let isMalicious = false;
    let threatName = 'Clean';
    let category = 'Harmless';
    let suspiciousScore = 0;
    let engineOverrides: Record<string, string> | undefined = undefined;

    if (knownThreat) {
      isMalicious = true;
      threatName = knownThreat.name;
      category = knownThreat.category;
      suspiciousScore = knownThreat.detectionRate;
      engineOverrides = knownThreat.engineDetections;
      riskIndicators.push(`Matched known threat signature: ${knownThreat.name}`);
    } else if (isEicarText) {
      isMalicious = true;
      threatName = 'EICAR-Standard-AV-Test-File';
      category = 'Test Virus';
      suspiciousScore = 0.95;
      riskIndicators.push('Standard EICAR Anti-Malware test string detected.');
    } else if (foundStrings.length > 0) {
      if (foundStrings.includes('WannaCry Ransomware Artifact') || foundStrings.includes('Credential Dumper Artifacts')) {
        isMalicious = true;
        threatName = `Malware.${foundStrings[0].replace(/\s+/g, '')}`;
        category = 'Trojan';
        suspiciousScore = 0.88;
      } else if (foundStrings.length >= 2 || (entropy > 7.0 && foundStrings.length >= 1)) {
        isMalicious = true;
        threatName = `Heuristic.${foundStrings[0].replace(/\s+/g, '')}`;
        category = 'Suspicious Payload';
        suspiciousScore = 0.72;
      } else {
        // Mild suspicious
        suspiciousScore = 0.45;
        threatName = 'Heuristic.SuspiciousStrings';
        category = 'Potential Risk';
      }
    }

    const { engineResults, stats, reputation } = generateEngineResults(
      isMalicious,
      threatName,
      category,
      suspiciousScore,
      engineOverrides
    );

    const fileDetails: FileDetails = {
      fileName: file.name,
      fileSize: file.size,
      formattedSize: formatBytes(file.size),
      fileType,
      mimeType: mime,
      magicBytes: magic,
      md5,
      sha1,
      sha256,
      entropy,
      entropyVerdict,
      suspiciousStrings: foundStrings,
      riskIndicators,
      firstSeen: new Date(Date.now() - 86400000 * 14).toISOString(),
      lastAnalysis: new Date().toISOString()
    };

    const aiReport = generateFallbackAiReport(
      file.name,
      'file',
      stats.malicious,
      stats.suspicious,
      threatName
    );

    const report: ScanReport = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      formattedDate: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }),
      type: 'file',
      target: file.name,
      status: 'completed',
      reputationScore: reputation,
      stats,
      fileDetails,
      engineResults,
      aiReport
    };

    return NextResponse.json({ success: true, report });
  } catch (error: any) {
    console.error('File scan error:', error);
    return NextResponse.json({ error: error?.message || 'Gagal memproses analisis file' }, { status: 500 });
  }
}
