export type ScanType = 'file' | 'url' | 'hash';

export type ThreatCategory = 'malicious' | 'suspicious' | 'harmless' | 'undetected';

export interface EngineResult {
  engineName: string;
  category: ThreatCategory;
  result: string | null;
  method?: 'blacklist' | 'heuristic' | 'signature' | 'ai-ml';
  updateDate?: string;
}

export interface DetectionStats {
  malicious: number;
  suspicious: number;
  harmless: number;
  undetected: number;
  total: number;
}

export interface FileDetails {
  fileName: string;
  fileSize: number;
  formattedSize: string;
  fileType: string;
  mimeType: string;
  magicBytes: string;
  md5: string;
  sha1: string;
  sha256: string;
  entropy?: number;
  entropyVerdict?: string;
  suspiciousStrings?: string[];
  riskIndicators?: string[];
  firstSeen?: string;
  lastAnalysis?: string;
}

export interface UrlDetails {
  url: string;
  domain: string;
  finalUrl: string;
  httpStatus?: number;
  responseTimeMs?: number;
  server?: string;
  ipAddress?: string;
  sslValid?: boolean;
  sslIssuer?: string;
  categories: string[];
  securityHeaders?: {
    hsts?: boolean;
    csp?: boolean;
    xframe?: boolean;
    xssProtection?: boolean;
  };
  riskIndicators?: string[];
  firstSeen?: string;
  lastAnalysis?: string;
}

export interface AiThreatReport {
  threatLevel: 'CLEAN' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  threatClassification: string;
  summary: string;
  executiveSummaryId: string;
  technicalDetails: string;
  indicatorsOfCompromise: string[];
  remediationSteps: string[];
  recommendation: string;
  analyzedByModel?: string;
}

export interface ScanReport {
  id: string;
  timestamp: number;
  formattedDate: string;
  type: ScanType;
  target: string;
  status: 'completed' | 'failed';
  reputationScore: number;
  stats: DetectionStats;
  fileDetails?: FileDetails;
  urlDetails?: UrlDetails;
  engineResults: EngineResult[];
  aiReport?: AiThreatReport;
  error?: string;
}
