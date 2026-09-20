export type UserRole =
  | 'ADMIN'
  | 'POLICE OFFICER'
  | 'LEGAL OFFICER'
  | 'INVESTIGATOR'
  | 'FORENSIC OFFICER'
  | 'VIEWER';

export type SecurityClearance =
  | 'INTERNAL'
  | 'CONFIDENTIAL'
  | 'SECRET'
  | 'TOP SECRET';

export type DocumentType =
  | 'FIR'
  | 'WITNESS STATEMENT'
  | 'EVIDENCE'
  | 'FORENSIC REPORT'
  | 'CHARGE SHEET'
  | 'COURT FILING'
  | 'POLICE REPORT'
  | 'JUDGMENT';

export type SensitivityLevel =
  | 'PUBLIC'
  | 'INTERNAL'
  | 'CONFIDENTIAL'
  | 'HIGHLY CONFIDENTIAL';

export type SecurityLevelType =
  | 'LEVEL 1 — NORMAL'
  | 'LEVEL 2 — ELEVATED'
  | 'LEVEL 3 — RESTRICTED'
  | 'LEVEL 4 — CRITICAL';

export type AlertSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type AlertStatus = 'ACTIVE' | 'INVESTIGATING' | 'RESOLVED';

export type AuditStatus =
  | 'SUCCESS'
  | 'BLOCKED'
  | 'WARNING'
  | 'FAILED'
  | 'SUSPICIOUS'
  | 'ALLOWED'
  | 'STEP_UP_REQUIRED'
  | 'FLAGGED';

export interface UserAccount {
  username: string;
  name: string;
  role: UserRole;
  password?: string;
  badgeNumber: string;
  department: string;
  clearanceLevel: SecurityClearance;
  sessionTimeoutSeconds: number;
  avatar?: string;
}

export interface DocumentVersion {
  version: string;
  versionNumber?: string;
  uploadedBy: string;
  createdBy?: string;
  userRole: UserRole;
  creatorRole?: UserRole;
  action: string;
  timestamp: string;
  createdAt?: string;
  reasonForUpdate?: string;
  hash: string;
  status: 'ORIGINAL' | 'REVISED' | 'FINAL';
  comments: string;
  fileSize: string;
  integrityVerified: boolean;
  metadataChanges?: {
    field: string;
    previous: string;
    updated: string;
  }[];
}

export interface DocumentTrustBreakdown {
  integrityStatus: number;       // e.g. 100 or 0
  versionConsistency: number;    // e.g. 95
  authorizationHistory: number;  // e.g. 92
  verificationStatus: number;    // e.g. 96
  securityAlertPenalty: number;  // e.g. -60 if alert
}

export interface SecureDocument {
  id: string;
  title: string;
  fileName: string;
  caseId: string;
  caseTitle: string;
  type: DocumentType;
  sensitivity: SensitivityLevel;
  owner: string;
  ownerRole: UserRole;
  department?: string;
  createdAt: string;
  lastModified: string;
  currentVersion: string;
  versions: DocumentVersion[];
  originalHash: string;
  currentHash: string;
  isTampered: boolean;
  trustScore: number;
  encryptionAlgorithm: string; // e.g. 'AES-256-GCM'
  storageRepository: string;   // e.g. 'GOV-VAULT-PRIMARY-01'
  encryptionStatus: 'ENCRYPTED' | 'DECRYPTED_IN_MEM';
  allowedRoles: UserRole[];
  contentSummary: string;
  evidenceTags: string[];
  fileSize: string;
}

export interface CaseRecord {
  id: string; // e.g. 'CASE-1024'
  title: string;
  description: string;
  category: string;
  status: 'ACTIVE' | 'UNDER_TRIAL' | 'CLOSED' | 'EXPEDITED';
  priority: 'ROUTINE' | 'HIGH' | 'CRITICAL';
  leadOfficer: string;
  department: string;
  createdAt: string;
  documentsCount: number;
  documentIds: string[];
  timeline: CaseTimelineEvent[];
}

export interface CaseTimelineEvent {
  id: string;
  step: string;
  title: string;
  who: string;
  performedBy?: string;
  role: UserRole;
  action: string;
  date: string;
  time: string;
  timestamp?: string;
  documentTitle: string;
  version: string;
  hash: string;
  securityStatus: 'VERIFIED' | 'SECURED' | 'TAMPER_ALERT' | 'FINALIZED';
  details?: string;
}

export interface AuditRecord {
  id: string;
  timestamp: string;
  date: string;
  time: string;
  user: string;
  role: UserRole | 'UNKNOWN';
  action: string;
  documentTitle?: string;
  caseId?: string;
  version?: string;
  location: string;
  device: string;
  sessionId: string;
  securityLevel: string;
  status: AuditStatus;
  details?: string;
  ip?: string;
  hash?: string;
  riskScore?: number;
}

export interface SecurityAlert {
  id: string;
  severity: AlertSeverity;
  title: string;
  timestamp: string;
  date: string;
  time: string;
  user: string;
  userRole?: UserRole;
  role?: string;
  caseId?: string;
  documentId?: string;
  documentName?: string;
  reason: string;
  description?: string;
  detectedBehaviour: string[];
  riskScore: number;
  recommendedAction: string;
  status: AlertStatus;
}

export interface SecureShareRecord {
  id: string;
  documentId: string;
  documentTitle: string;
  caseId: string;
  createdBy: string;
  recipient: string;
  recipientRole: UserRole;
  permission: 'VIEW' | 'VIEW + DOWNLOAD' | 'EDIT';
  accessType: 'ONE TIME' | 'TIME BOUND';
  expiresAt: string;
  expiresInMinutes: number;
  active: boolean;
  accessCount: number;
  tokenFingerprint: string;
}

export interface FailedLoginIncident {
  id: string;
  attemptNumber: number;
  timestamp: string;
  usernameAttempted: string;
  ip: string;
  location: string;
  device: string;
}

export interface ExtractedEntity {
  id: string;
  type: 'PERSON' | 'ALIAS' | 'CASE' | 'PHONE' | 'LOCATION' | 'ORGANIZATION' | 'EVIDENCE' | 'DATE' | 'VEHICLE' | 'FORENSIC_REF' | 'DOCUMENT_REF';
  value: string;
  confidence: number;
  mentionsCount: number;
  contextSnippet?: string;
  documentId?: string;
}

export interface CrossCaseMatch {
  caseId: string;
  title: string;
  matchPercentage: number;
  matchedPerson: string;
  reasons: string[];
  matchedEntities: { type: string; value: string }[];
  clearanceRequired: SecurityClearance;
  category: string;
  leadOfficer: string;
  status: string;
  humanVerificationRequired: boolean;
}

export interface CaseContradiction {
  id: string;
  caseId: string;
  docA: { id: string; title: string; excerpt: string; field: string; time?: string };
  docB: { id: string; title: string; excerpt: string; field: string; time?: string };
  conflictingField: string;
  confidence: number;
  status: 'FLAGGED' | 'RESOLVED' | 'UNDER_REVIEW';
  explanation: string;
}

export interface MissingLink {
  id: string;
  caseId: string;
  title: string;
  description: string;
  referencedInDoc: string;
  missingItem: string;
  urgency: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  status: 'OPEN' | 'RESOLVED';
  suggestedAction: string;
}

export interface EvidenceGraphNode {
  id: string;
  label: string;
  category: 'PERSON' | 'CASE' | 'DOCUMENT' | 'EVIDENCE' | 'LOCATION' | 'ORGANIZATION' | 'EVENT';
  subLabel?: string;
  clearanceRequired: SecurityClearance;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  degree?: number;
}

export interface EvidenceGraphEdge {
  id: string;
  source: string;
  target: string;
  relation:
    | 'MENTIONED_IN'
    | 'RELATED_TO'
    | 'EVIDENCE_OF'
    | 'LOCATED_AT'
    | 'SUBMITTED_IN'
    | 'REFERENCED_BY'
    | 'ASSOCIATED_WITH';
  confidence?: number;
}

export interface WhatIfSimulationResult {
  targetEvidenceId: string;
  simulatedAction: 'REMOVE' | 'ALTER' | 'ADD';
  affectedDocuments: { id: string; title: string; impact: string }[];
  brokenRelationshipsCount: number;
  timelineChanges: string[];
  missingLinksDelta: string[];
  confidenceDelta: number; // e.g. -24%
  riskSummary: string;
}

export interface RedactionSuggestion {
  id: string;
  textToRedact: string;
  category: 'PII_NAME' | 'PHONE' | 'ADDRESS' | 'VEHICLE' | 'WITNESS_PROTECTION';
  reason: string;
  approved: boolean;
}

export interface LivePulseEvent {
  id: string;
  timestamp: string;
  type?: 'UPLOAD' | 'AI_ANALYSIS' | 'EVIDENCE_LINK' | 'VERSION_CREATE' | 'ACCESS' | 'RISK_CHANGE' | 'ALERT' | 'VERIFY';
  message?: string;
  severity: 'NORMAL' | 'ELEVATED' | 'CRITICAL';
  user?: string;
  event: string;
  caseId: string;
  details: string;
}

export type SidebarPage =
  | 'dashboard'
  | 'documents'
  | 'cases'
  | 'secure_upload'
  | 'ai_intelligence'
  | 'cross_case'
  | 'evidence_graph'
  | 'encryption_portal'
  | 'version_control'
  | 'adaptive_security'
  | 'security_alerts'
  | 'audit_trail'
  | 'secure_sharing'
  | 'ai_assistant'
  | 'fir'
  | 'witness'
  | 'evidence'
  | 'forensic'
  | 'charge_sheets'
  | 'court_filings'
  | 'integrity'
  | 'ai_classification'
  | 'users_rbac'
  | 'settings';
