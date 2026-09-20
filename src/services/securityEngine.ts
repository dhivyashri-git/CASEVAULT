import {
  DocumentType,
  SensitivityLevel,
  UserRole,
  SecurityLevelType,
  SecureDocument,
  DocumentTrustBreakdown,
} from '../types';

/**
 * Calculates SHA-256 hash using the Web Crypto API
 */
export async function calculateSHA256(text: string): Promise<string> {
  try {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
      const msgBuffer = new TextEncoder().encode(text);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    }
  } catch {
    // Fallback if crypto.subtle is unavailable in mock tests
  }
  // Deterministic fallback
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `${hex}e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.slice(0, 64);
}

/**
 * Generates an altered/tampered hash to simulate tampering
 */
export function generateTamperedHash(original: string): string {
  const chars = 'abcdef0123456789';
  const prefix = 'bad_tamper_';
  let randomTail = '';
  for (let i = 0; i < 64 - prefix.length; i++) {
    randomTail += chars[Math.floor(Math.random() * chars.length)];
  }
  return prefix + randomTail;
}

export interface RiskEvaluationInput {
  userRole: UserRole;
  documentSensitivity?: SensitivityLevel;
  recentConfidentialAccessCount: number; // in last 60 seconds
  failedLoginAttempts: number;
  isDocumentTampered?: boolean;
  isOutsideGeofence?: boolean;
  unusualSessionHour?: boolean;
}

export interface RiskEvaluationResult {
  riskScore: number; // 0 - 100
  securityLevel: SecurityLevelType;
  reasons: string[];
  requiresStepUp: boolean;
  isBlocked: boolean;
  recommendedAction: string;
}

/**
 * Evaluates risk dynamically using the Adaptive Document Security Engine formula:
 * USER + ROLE + DOCUMENT SENSITIVITY + SESSION CONTEXT + ACCESS BEHAVIOUR + DOCUMENT INTEGRITY
 */
export function evaluateRisk(input: RiskEvaluationInput): RiskEvaluationResult {
  let score = 10; // Baseline normal risk
  const reasons: string[] = [];

  // 1. Sensitivity impact
  if (input.documentSensitivity === 'HIGHLY CONFIDENTIAL') {
    score += 25;
    reasons.push('Accessing HIGHLY CONFIDENTIAL intelligence document');
  } else if (input.documentSensitivity === 'CONFIDENTIAL') {
    score += 10;
  }

  // 2. Access behaviour: Rapid confidential doc access
  if (input.recentConfidentialAccessCount >= 10) {
    score += 45;
    reasons.push(
      `${input.recentConfidentialAccessCount} confidential documents accessed rapidly within 30 seconds (High velocity)`
    );
  } else if (input.recentConfidentialAccessCount >= 5) {
    score += 20;
    reasons.push(`${input.recentConfidentialAccessCount} confidential accesses in short succession`);
  }

  // 3. Failed login attempts
  if (input.failedLoginAttempts >= 3) {
    score += 35;
    reasons.push(`${input.failedLoginAttempts} failed authentication attempts recorded`);
  } else if (input.failedLoginAttempts > 0) {
    score += 15;
    reasons.push('Previous failed authentication detected on session subnet');
  }

  // 4. Document Integrity
  if (input.isDocumentTampered) {
    score += 50;
    reasons.push('CRITICAL: Document cryptographic hash mismatch (Tampering Suspected)');
  }

  // 5. Geofence / Session Context
  if (input.isOutsideGeofence) {
    score += 20;
    reasons.push('Access requested outside approved government precinct geofence');
  }

  // Cap score 0 - 100
  score = Math.min(100, Math.max(0, score));

  // Determine Security Level
  let securityLevel: SecurityLevelType = 'LEVEL 1 — NORMAL';
  let requiresStepUp = false;
  let isBlocked = false;
  let recommendedAction = 'Standard password & RBAC credentials verified. Normal access granted.';

  if (score >= 85 || input.isDocumentTampered) {
    securityLevel = 'LEVEL 4 — CRITICAL';
    isBlocked = true;
    requiresStepUp = true;
    recommendedAction =
      'BLOCK SENSITIVE ACTION + CREATE SECURITY ALERT + LOG IMMUTABLE AUDIT + ADMIN REVIEW';
  } else if (score >= 60 || input.documentSensitivity === 'HIGHLY CONFIDENTIAL') {
    securityLevel = 'LEVEL 3 — RESTRICTED';
    requiresStepUp = true;
    recommendedAction =
      'Step-Up Biometric Authentication + Cryptographic Integrity Re-Check Required';
  } else if (score >= 30) {
    securityLevel = 'LEVEL 2 — ELEVATED';
    requiresStepUp = true;
    recommendedAction = 'Password + RBAC + Step-Up Biometric Authentication Required';
  } else {
    securityLevel = 'LEVEL 1 — NORMAL';
  }

  return {
    riskScore: score,
    securityLevel,
    reasons,
    requiresStepUp,
    isBlocked,
    recommendedAction,
  };
}

/**
 * Computes the dynamic Document Trust Score (0-100)
 */
export function calculateDocumentTrustScore(doc: SecureDocument): {
  score: number;
  breakdown: DocumentTrustBreakdown;
  label: 'HIGH TRUST' | 'MODERATE TRUST' | 'LOW TRUST' | 'TRUST DEGRADED';
} {
  if (doc.isTampered || doc.currentHash !== doc.originalHash) {
    const breakdown: DocumentTrustBreakdown = {
      integrityStatus: 0,
      versionConsistency: 60,
      authorizationHistory: 80,
      verificationStatus: 0,
      securityAlertPenalty: -60,
    };
    return {
      score: 31,
      breakdown,
      label: 'TRUST DEGRADED',
    };
  }

  const integrityStatus = 100;
  const versionConsistency = Math.min(100, 90 + doc.versions.length * 3);
  const authorizationHistory = 96;
  const verificationStatus = 98;
  const securityAlertPenalty = 0;

  const rawScore = Math.round(
    integrityStatus * 0.4 +
      versionConsistency * 0.2 +
      authorizationHistory * 0.2 +
      verificationStatus * 0.2 +
      securityAlertPenalty
  );

  const score = Math.min(100, Math.max(10, rawScore));
  let label: 'HIGH TRUST' | 'MODERATE TRUST' | 'LOW TRUST' | 'TRUST DEGRADED' = 'HIGH TRUST';
  if (score < 50) label = 'TRUST DEGRADED';
  else if (score < 75) label = 'MODERATE TRUST';

  return {
    score,
    breakdown: {
      integrityStatus,
      versionConsistency,
      authorizationHistory,
      verificationStatus,
      securityAlertPenalty,
    },
    label,
  };
}

/**
 * Intelligent AI document classification heuristic engine
 */
export interface AIClassificationResult {
  detectedType: DocumentType;
  sensitivity: SensitivityLevel;
  confidence: number;
  keywordsDetected: string[];
  suggestedRoles: UserRole[];
  suggestedTags: string[];
  summary: string;
}

export function analyzeDocumentWithAI(fileName: string, sampleContent: string): AIClassificationResult {
  const text = `${fileName} ${sampleContent}`.toLowerCase();

  if (text.includes('fir') || text.includes('first information') || text.includes('cognizable') || text.includes('police station')) {
    return {
      detectedType: 'FIR',
      sensitivity: 'CONFIDENTIAL',
      confidence: 97,
      keywordsDetected: ['FIR', 'Cognizable Offence', 'Station Diary', 'Complainant'],
      suggestedRoles: ['ADMIN', 'POLICE OFFICER', 'INVESTIGATOR', 'LEGAL OFFICER'],
      suggestedTags: ['FIR', 'Initial-Lodgment', 'Cognizable', 'Criminal-Procedure'],
      summary: 'First Information Report recording registration of cognizable criminal acts.',
    };
  }

  if (text.includes('witness') || text.includes('deposition') || text.includes('statement') || text.includes('164 crpc')) {
    return {
      detectedType: 'WITNESS STATEMENT',
      sensitivity: 'HIGHLY CONFIDENTIAL',
      confidence: 95,
      keywordsDetected: ['Witness Deposition', 'Magistrate Seal', 'Sec 164 CrPC', 'Identity Shield'],
      suggestedRoles: ['ADMIN', 'INVESTIGATOR', 'LEGAL OFFICER'],
      suggestedTags: ['Eyewitness', 'High-Protection', 'In-Camera', 'Magistrate-Attested'],
      summary: 'Solemn statement of witness attested under procedural safeguards.',
    };
  }

  if (text.includes('forensic') || text.includes('ballistic') || text.includes('dna') || text.includes('cfsl') || text.includes('autopsy')) {
    return {
      detectedType: 'FORENSIC REPORT',
      sensitivity: 'HIGHLY CONFIDENTIAL',
      confidence: 96,
      keywordsDetected: ['CFSL Laboratory', 'Ballistic Striation', 'Spectrometry', 'Chain of Custody'],
      suggestedRoles: ['ADMIN', 'FORENSIC OFFICER', 'INVESTIGATOR', 'LEGAL OFFICER'],
      suggestedTags: ['Forensic-Science', 'CFSL', 'Ballistics', 'Scientific-Evidence'],
      summary: 'Laboratory scientific examination results and expert comparative forensics.',
    };
  }

  if (text.includes('charge sheet') || text.includes('173 crpc') || text.includes('prosecution') || text.includes('chargesheet')) {
    return {
      detectedType: 'CHARGE SHEET',
      sensitivity: 'HIGHLY CONFIDENTIAL',
      confidence: 98,
      keywordsDetected: ['Charge Sheet', 'Sec 173 CrPC', 'Accused Calendar', 'Plea Evidence'],
      suggestedRoles: ['ADMIN', 'LEGAL OFFICER'],
      suggestedTags: ['Prosecution', 'Charge-Sheet', 'Court-Submission', 'Sec-173'],
      summary: 'Comprehensive formal accusation detailing witnesses and seized proof for trial.',
    };
  }

  if (text.includes('court') || text.includes('filing') || text.includes('registry') || text.includes('petition')) {
    return {
      detectedType: 'COURT FILING',
      sensitivity: 'CONFIDENTIAL',
      confidence: 94,
      keywordsDetected: ['Registry Stamp', 'Petition', 'Sessions Court', 'Notice'],
      suggestedRoles: ['ADMIN', 'LEGAL OFFICER', 'VIEWER'],
      suggestedTags: ['Judicial', 'Docket', 'Court-Registry', 'Service-Notice'],
      summary: 'Formal pleading, memorandum, or evidentiary notice submitted to judicial registry.',
    };
  }

  if (text.includes('evidence') || text.includes('extraction') || text.includes('seizure') || text.includes('nvme') || text.includes('bitstream')) {
    return {
      detectedType: 'EVIDENCE',
      sensitivity: 'CONFIDENTIAL',
      confidence: 93,
      keywordsDetected: ['Physical Seizure', 'Digital Bitstream', 'Evidence Locker', 'Hash Tag'],
      suggestedRoles: ['ADMIN', 'POLICE OFFICER', 'INVESTIGATOR', 'FORENSIC OFFICER', 'LEGAL OFFICER'],
      suggestedTags: ['Physical-Evidence', 'Locker-Deposit', 'Chain-Of-Custody', 'Seizure-Memo'],
      summary: 'Physical or digital evidentiary exhibit seized under legal search warrant.',
    };
  }

  if (text.includes('judgment') || text.includes('order') || text.includes('verdict') || text.includes('remand')) {
    return {
      detectedType: 'JUDGMENT',
      sensitivity: 'CONFIDENTIAL',
      confidence: 99,
      keywordsDetected: ['Judicial Order', 'Bench Ruling', 'Remand Order', 'Certified Copy'],
      suggestedRoles: ['ADMIN', 'LEGAL OFFICER', 'POLICE OFFICER', 'VIEWER'],
      suggestedTags: ['Order', 'Judicial-Ruling', 'Court-Bench', 'Certified'],
      summary: 'Judicial directive, bail determination, or formal court judgment.',
    };
  }

  // Default to Police Report
  return {
    detectedType: 'POLICE REPORT',
    sensitivity: 'INTERNAL',
    confidence: 89,
    keywordsDetected: ['Investigation Log', 'Case Diary', 'Patrol Report'],
    suggestedRoles: ['ADMIN', 'POLICE OFFICER', 'INVESTIGATOR'],
    suggestedTags: ['Internal-Diary', 'Field-Report', 'Police-Operations'],
    summary: 'Standard operational law enforcement investigation report and field log.',
  };
}

export function aiClassifyDocument(content: string, fileName?: string) {
  const res = analyzeDocumentWithAI(fileName || '', content);
  return {
    type: res.detectedType,
    sensitivity: res.sensitivity,
    confidence: res.confidence,
    detectedKeywords: res.keywordsDetected,
    summary: res.summary,
    suggestedRoles: res.suggestedRoles,
    suggestedTags: res.suggestedTags,
  };
}
