import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  UserAccount,
  UserRole,
  SecureDocument,
  CaseRecord,
  AuditRecord,
  SecurityAlert,
  SecureShareRecord,
  SidebarPage,
  FailedLoginIncident,
  SecurityLevelType,
  DocumentVersion,
  SensitivityLevel,
} from '../types';
import {
  DEMO_USERS,
  INITIAL_CASES,
  INITIAL_DOCUMENTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_ALERTS,
  INITIAL_SHARES,
} from '../data/mockData';
import {
  calculateDocumentTrustScore,
  evaluateRisk,
  generateTamperedHash,
} from '../services/securityEngine';

interface SecurityContextType {
  currentUser: UserAccount | null;
  activePage: SidebarPage;
  setActivePage: (page: SidebarPage) => void;
  sessionSecondsRemaining: number;
  isSessionExpiringSoon: boolean;
  isSessionExpired: boolean;
  resetSessionTimer: () => void;
  
  // Security State
  securityLevel: SecurityLevelType;
  currentRiskScore: number;
  hasActiveAlert: boolean;
  recentConfidentialAccessCount: number;
  failedLoginAttempts: number;
  
  // Entities
  documents: SecureDocument[];
  cases: CaseRecord[];
  auditLogs: AuditRecord[];
  alerts: SecurityAlert[];
  shares: SecureShareRecord[];
  
  // Actions
  login: (username: string, password: string) => boolean;
  logout: () => void;
  unauthorizedModalData: FailedLoginIncident | null;
  clearUnauthorizedModal: () => void;
  
  accessRestrictedModal: { attemptedAction: string; reason: string } | null;
  clearAccessRestrictedModal: () => void;
  triggerAccessRestricted: (action: string, reason?: string) => void;
  
  // Tampering & Integrity
  simulateTampering: (docId: string) => void;
  restoreDocumentIntegrity: (docId: string) => void;
  verifyDocumentIntegrity: (docId: string) => { isMatch: boolean; original: string; current: string };
  tamperedAlertDoc: SecureDocument | null;
  clearTamperedAlert: () => void;
  
  // Document Operations
  viewingDocument: SecureDocument | null;
  setViewingDocument: (doc: SecureDocument | null) => void;
  openDocumentSecurely: (doc: SecureDocument) => Promise<boolean>;
  activeSecureModalDoc: SecureDocument | null;
  setActiveSecureModalDoc: (doc: SecureDocument | null) => void;
  
  // Versions
  addDocumentVersion: (docId: string, versionData: Partial<DocumentVersion>) => void;
  
  // Sharing
  createShare: (share: Omit<SecureShareRecord, 'id' | 'tokenFingerprint' | 'active' | 'accessCount'>) => void;
  revokeShare: (shareId: string) => void;
  
  // AI Classification & Upload
  addNewDocument: (doc: SecureDocument) => void;
  
  // Alerts
  resolveAlert: (alertId: string) => void;
  investigateAlert: (alertId: string) => void;
  dismissAlert: (alertId: string) => void;
  
  // Scenarios
  runDemoScenario: (scenario: 'normal' | 'suspicious' | 'critical') => void;
  
  // RBAC check
  isPageAllowed: (page: SidebarPage) => boolean;
  exportAuditReport: (format: 'csv' | 'json') => void;
  
  // Biometric modal state
  biometricPrompt: {
    isOpen: boolean;
    reason: string;
    onComplete: (success: boolean) => void;
  } | null;
  closeBiometricPrompt: () => void;

  // Convenience Aliases
  failedLoginIncident: FailedLoginIncident | null;
  clearFailedLoginIncident: () => void;
  requestSecureAction: (action: () => void, reason?: string, sensitivity?: SensitivityLevel) => void;
  addDocument: (doc: any) => void;
  shareTokens: SecureShareRecord[];
  createShareToken: (params: any) => any;
  recordAuditAction: (action: string, docId: string, docTitle: string, details?: string) => void;
  addSecurityAlert: (alertData: any) => void;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export const SecurityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [activePage, setActivePage] = useState<SidebarPage>('dashboard');
  const [sessionSecondsRemaining, setSessionSecondsRemaining] = useState<number>(120);
  const [isSessionExpired, setIsSessionExpired] = useState<boolean>(false);
  const [unauthorizedModalData, setUnauthorizedModalData] = useState<FailedLoginIncident | null>(null);
  const [accessRestrictedModal, setAccessRestrictedModal] = useState<{ attemptedAction: string; reason: string } | null>(null);
  const [tamperedAlertDoc, setTamperedAlertDoc] = useState<SecureDocument | null>(null);
  const [activeSecureModalDoc, setActiveSecureModalDoc] = useState<SecureDocument | null>(null);
  const [viewingDocument, setViewingDocument] = useState<SecureDocument | null>(null);

  const [biometricPrompt, setBiometricPrompt] = useState<{
    isOpen: boolean;
    reason: string;
    onComplete: (success: boolean) => void;
  } | null>(null);

  // Entities
  const [documents, setDocuments] = useState<SecureDocument[]>(INITIAL_DOCUMENTS);
  const [cases, setCases] = useState<CaseRecord[]>(INITIAL_CASES);
  const [auditLogs, setAuditLogs] = useState<AuditRecord[]>(INITIAL_AUDIT_LOGS);
  const [alerts, setAlerts] = useState<SecurityAlert[]>(INITIAL_ALERTS);
  const [shares, setShares] = useState<SecureShareRecord[]>(INITIAL_SHARES);

  // Risk metrics
  const [recentConfidentialAccessCount, setRecentConfidentialAccessCount] = useState<number>(0);
  const [failedLoginAttempts, setFailedLoginAttempts] = useState<number>(0);

  // Helper to log audit record
  const logAudit = useCallback(
    (record: Partial<AuditRecord>) => {
      const now = new Date();
      const newRecord: AuditRecord = {
        id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        timestamp: now.toISOString(),
        date: now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        user: record.user || (currentUser ? currentUser.name : 'Unknown User'),
        role: record.role || (currentUser ? currentUser.role : 'UNKNOWN'),
        action: record.action || 'ACTIVITY_RECORDED',
        documentTitle: record.documentTitle || '—',
        caseId: record.caseId || '—',
        version: record.version || '—',
        location: record.location || 'Chennai, India',
        device: record.device || 'Secure Terminal / Gov ID Auth',
        sessionId: record.sessionId || (currentUser ? `SES-${currentUser.username.toUpperCase()}-${Date.now().toString().slice(-4)}` : 'UNAUTH-ATTEMPT'),
        securityLevel: record.securityLevel || 'LEVEL 1 — NORMAL',
        status: record.status || 'SUCCESS',
        details: record.details || '',
      };
      setAuditLogs((prev) => [newRecord, ...prev]);
    },
    [currentUser]
  );

  // Determine current active security level
  const anyDocTampered = documents.some((d) => d.isTampered);
  const riskEval = evaluateRisk({
    userRole: currentUser?.role || 'VIEWER',
    recentConfidentialAccessCount,
    failedLoginAttempts,
    isDocumentTampered: anyDocTampered,
  });
  const securityLevel = riskEval.securityLevel;
  const hasActiveAlert = alerts.some((a) => a.status === 'ACTIVE') || anyDocTampered;

  // Session countdown timer (ADMIN - NO LIMIT TIME, OTHER MEMBERS 30 SEC TO LOGOUT)
  useEffect(() => {
    if (!currentUser || isSessionExpired) return;

    // ADMIN has NO LIMIT TIME per specification
    if (currentUser.role === 'ADMIN' || currentUser.sessionTimeoutSeconds === 0) {
      return;
    }

    const timer = setInterval(() => {
      setSessionSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsSessionExpired(true);
          logAudit({
            action: 'SESSION EXPIRED',
            details: `Secure session timed out automatically after ${currentUser.sessionTimeoutSeconds}s.`,
            status: 'WARNING',
            securityLevel: 'LEVEL 1 — NORMAL',
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentUser, isSessionExpired, logAudit]);

  const isSessionExpiringSoon =
    currentUser !== null &&
    currentUser.role !== 'ADMIN' &&
    currentUser.sessionTimeoutSeconds > 0 &&
    sessionSecondsRemaining <= 10 &&
    !isSessionExpired;

  const resetSessionTimer = useCallback(() => {
    if (currentUser) {
      setSessionSecondsRemaining(currentUser.sessionTimeoutSeconds || 0);
      setIsSessionExpired(false);
    }
  }, [currentUser]);

  // Login handler
  const login = (username: string, password: string): boolean => {
    const found = DEMO_USERS.find(
      (u) => u.username.toLowerCase() === username.trim().toLowerCase()
    );

    if (found && found.password === password) {
      setCurrentUser(found);
      setSessionSecondsRemaining(found.sessionTimeoutSeconds);
      setIsSessionExpired(false);
      setActivePage('dashboard');
      logAudit({
        user: found.name,
        role: found.role,
        action: 'AUTHENTICATION SUCCESSFUL',
        details:
          found.role === 'ADMIN' || found.sessionTimeoutSeconds === 0
            ? `Granted clearance: ${found.clearanceLevel}. Session limit: NO LIMIT TIME (Admin Permanent Session).`
            : `Granted clearance: ${found.clearanceLevel}. Session limit: 30s timeout.`,
        status: 'SUCCESS',
        securityLevel: 'LEVEL 1 — NORMAL',
      });
      return true;
    } else {
      // Failed login detection
      const newAttempts = failedLoginAttempts + 1;
      setFailedLoginAttempts(newAttempts);
      const incidentId = `INC-${Math.floor(10000 + Math.random() * 90000)}`;

      const incident: FailedLoginIncident = {
        id: incidentId,
        attemptNumber: newAttempts,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        usernameAttempted: username || 'Unknown',
        ip: '103.21.144.92',
        location: 'Chennai, India',
        device: 'Chromium / Linux x86_64 (Unverified Hardware)',
      };

      setUnauthorizedModalData(incident);

      // Audit event
      logAudit({
        user: username ? `Attempted: ${username}` : 'Unknown User',
        role: 'UNKNOWN',
        action: 'FAILED LOGIN',
        details: `Unknown or invalid credentials detected. Access denied. Incident ${incidentId} recorded.`,
        status: 'BLOCKED',
        securityLevel: 'LEVEL 4 — CRITICAL',
        location: 'Chennai, India',
        device: 'Chromium / Linux x86_64 (Unverified)',
      });

      // Security alert if repeated
      if (newAttempts >= 2) {
        const newAlert: SecurityAlert = {
          id: `alt-${Date.now()}`,
          severity: newAttempts >= 3 ? 'CRITICAL' : 'HIGH',
          title: 'Multiple Failed Login Attempts Detected',
          timestamp: new Date().toISOString(),
          date: new Date().toLocaleDateString('en-GB'),
          time: new Date().toLocaleTimeString(),
          user: username || 'Unknown Subject',
          reason: `${newAttempts} consecutive failed login attempts detected from IP 103.21.144.92`,
          detectedBehaviour: [
            'Invalid credentials supplied consecutively',
            'Subnet: 103.21.144.92 (Chennai, India)',
            'Rate: Above normal credential attempt baseline',
          ],
          riskScore: newAttempts >= 3 ? 92 : 75,
          recommendedAction: 'Lock credentials and enforce Step-Up Biometric verification upon re-entry.',
          status: 'ACTIVE',
        };
        setAlerts((prev) => [newAlert, ...prev]);
      }

      return false;
    }
  };

  const logout = () => {
    if (currentUser) {
      logAudit({
        action: 'USER LOGOUT',
        details: 'User cleanly terminated active secure session.',
        status: 'SUCCESS',
      });
    }
    setCurrentUser(null);
    setIsSessionExpired(false);
    setViewingDocument(null);
    setActiveSecureModalDoc(null);
  };

  const clearUnauthorizedModal = () => setUnauthorizedModalData(null);
  const clearAccessRestrictedModal = () => setAccessRestrictedModal(null);
  const clearTamperedAlert = () => setTamperedAlertDoc(null);
  const closeBiometricPrompt = () => setBiometricPrompt(null);

  const triggerAccessRestricted = (attemptedAction: string, reason = 'You do not have permission to access this resource.') => {
    setAccessRestrictedModal({ attemptedAction, reason });
    logAudit({
      action: 'ACCESS RESTRICTED ATTEMPT',
      details: `Attempted action: ${attemptedAction}. Reason: ${reason}`,
      status: 'BLOCKED',
      securityLevel: 'LEVEL 3 — RESTRICTED',
    });
  };

  // RBAC Matrix
  const isPageAllowed = (page: SidebarPage): boolean => {
    if (!currentUser) return false;
    if (currentUser.role === 'ADMIN') return true;

    switch (page) {
      case 'dashboard':
        return true;
      case 'documents':
        return true;
      case 'cases':
        return ['POLICE OFFICER', 'INVESTIGATOR', 'LEGAL OFFICER'].includes(currentUser.role);
      case 'secure_upload':
        return ['POLICE OFFICER', 'INVESTIGATOR', 'FORENSIC OFFICER', 'LEGAL OFFICER'].includes(currentUser.role);
      case 'ai_intelligence':
        return ['POLICE OFFICER', 'INVESTIGATOR', 'FORENSIC OFFICER', 'LEGAL OFFICER', 'VIEWER'].includes(currentUser.role);
      case 'cross_case':
        return ['POLICE OFFICER', 'INVESTIGATOR', 'FORENSIC OFFICER', 'LEGAL OFFICER'].includes(currentUser.role);
      case 'evidence_graph':
        return ['POLICE OFFICER', 'INVESTIGATOR', 'FORENSIC OFFICER', 'LEGAL OFFICER', 'VIEWER'].includes(currentUser.role);
      case 'encryption_portal':
        return ['POLICE OFFICER', 'INVESTIGATOR', 'FORENSIC OFFICER', 'LEGAL OFFICER', 'VIEWER'].includes(currentUser.role);
      case 'ai_assistant':
        return true;
      case 'fir':
        return ['POLICE OFFICER', 'INVESTIGATOR', 'LEGAL OFFICER', 'VIEWER'].includes(currentUser.role);
      case 'witness':
        return ['INVESTIGATOR', 'LEGAL OFFICER'].includes(currentUser.role);
      case 'evidence':
        return ['POLICE OFFICER', 'INVESTIGATOR', 'FORENSIC OFFICER', 'LEGAL OFFICER'].includes(currentUser.role);
      case 'forensic':
        return ['FORENSIC OFFICER', 'INVESTIGATOR', 'LEGAL OFFICER'].includes(currentUser.role);
      case 'charge_sheets':
        return ['LEGAL OFFICER', 'POLICE OFFICER'].includes(currentUser.role);
      case 'court_filings':
        return ['LEGAL OFFICER', 'VIEWER'].includes(currentUser.role);
      case 'version_control':
        return true;
      case 'integrity':
        return ['FORENSIC OFFICER', 'INVESTIGATOR', 'POLICE OFFICER', 'LEGAL OFFICER'].includes(currentUser.role);
      case 'adaptive_security':
        return ['INVESTIGATOR', 'POLICE OFFICER', 'LEGAL OFFICER'].includes(currentUser.role);
      case 'audit_trail':
        return ['POLICE OFFICER', 'LEGAL OFFICER', 'INVESTIGATOR'].includes(currentUser.role);
      case 'security_alerts':
        return ['POLICE OFFICER', 'INVESTIGATOR', 'FORENSIC OFFICER', 'LEGAL OFFICER'].includes(currentUser.role);
      case 'secure_sharing':
        return ['LEGAL OFFICER', 'INVESTIGATOR'].includes(currentUser.role);
      case 'ai_classification':
        return ['POLICE OFFICER', 'INVESTIGATOR', 'FORENSIC OFFICER', 'LEGAL OFFICER'].includes(currentUser.role);
      case 'users_rbac':
        return false;
      case 'settings':
        return false;
      default:
        return false;
    }
  };

  const recordAuditAction = useCallback(
    (action: string, docId: string, docTitle: string, details?: string) => {
      logAudit({
        action,
        caseId: 'CASE-1024',
        documentTitle: docTitle,
        details: details || `Action ${action} executed on ${docTitle} (${docId})`,
        status: 'SUCCESS',
      });
    },
    [logAudit]
  );

  const addSecurityAlert = useCallback(
    (alertData: any) => {
      const newAlert: SecurityAlert = {
        id: `alt-${Date.now()}`,
        severity: alertData.severity || 'HIGH',
        title: alertData.title || alertData.message || 'Security Telemetry Alert',
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString('en-GB'),
        time: new Date().toLocaleTimeString(),
        user: alertData.user || (currentUser ? currentUser.name : 'Unknown User'),
        reason: alertData.message || 'Automated policy rule triggered',
        detectedBehaviour: alertData.detectedBehaviour || ['Anomalous activity detected'],
        riskScore: alertData.riskScore || 85,
        recommendedAction: alertData.recommendedAction || 'Inspect incident log and review credentials.',
        status: alertData.status || 'ACTIVE',
      };
      setAlerts((prev) => [newAlert, ...prev]);
    },
    [currentUser]
  );

  // Tampering simulation
  const simulateTampering = (docId: string) => {
    setDocuments((prev) =>
      prev.map((doc) => {
        if (doc.id === docId) {
          const alteredHash = generateTamperedHash(doc.originalHash);
          const updatedDoc: SecureDocument = {
            ...doc,
            currentHash: alteredHash,
            isTampered: true,
            trustScore: 31,
          };
          setTamperedAlertDoc(updatedDoc);

          // Create Security Alert
          const newAlert: SecurityAlert = {
            id: `alt-tamper-${Date.now()}`,
            severity: 'CRITICAL',
            title: `Document Tampering Detected: ${doc.title}`,
            timestamp: new Date().toISOString(),
            date: new Date().toLocaleDateString('en-GB'),
            time: new Date().toLocaleTimeString(),
            user: currentUser?.name || 'System Integrity Daemon',
            userRole: currentUser?.role,
            caseId: doc.caseId,
            documentId: doc.id,
            documentName: doc.title,
            reason: `Cryptographic SHA-256 fingerprint mismatch. Content alteration or unauthorized byte tampering detected.`,
            detectedBehaviour: [
              `Original SHA-256: ${doc.originalHash.slice(0, 16)}...`,
              `Current Calculated SHA-256: ${alteredHash.slice(0, 16)}...`,
              `Trust Score plummeted from ${doc.trustScore} to 31 / 100`,
              `Status shifted to TAMPERING SUSPECTED`,
            ],
            riskScore: 98,
            recommendedAction: 'Restrict document download, quarantine replica nodes, and initiate forensic bitstream review.',
            status: 'ACTIVE',
          };
          setAlerts((alts) => [newAlert, ...alts]);

          // Audit record
          logAudit({
            action: 'DOCUMENT TAMPERING DETECTED',
            documentTitle: doc.title,
            caseId: doc.caseId,
            version: doc.currentVersion,
            details: `SHA-256 mismatch: expected ${doc.originalHash.slice(0, 12)}... but got ${alteredHash.slice(0, 12)}...`,
            status: 'FAILED',
            securityLevel: 'LEVEL 4 — CRITICAL',
          });

          return updatedDoc;
        }
        return doc;
      })
    );
  };

  const restoreDocumentIntegrity = (docId: string) => {
    setDocuments((prev) =>
      prev.map((doc) => {
        if (doc.id === docId) {
          const restoredDoc: SecureDocument = {
            ...doc,
            currentHash: doc.originalHash,
            isTampered: false,
            trustScore: 98,
          };
          logAudit({
            action: 'INTEGRITY RESTORED & RE-ATTESTED',
            documentTitle: doc.title,
            caseId: doc.caseId,
            version: doc.currentVersion,
            details: 'Master immutable seed restored from Cold Storage Vault HSM.',
            status: 'SUCCESS',
            securityLevel: 'LEVEL 1 — NORMAL',
          });
          return restoredDoc;
        }
        return doc;
      })
    );
    setTamperedAlertDoc(null);
  };

  const verifyDocumentIntegrity = (docId: string) => {
    const doc = documents.find((d) => d.id === docId);
    if (!doc) return { isMatch: false, original: '', current: '' };
    const isMatch = doc.originalHash === doc.currentHash;

    logAudit({
      action: isMatch ? 'INTEGRITY VERIFICATION PASSED' : 'INTEGRITY VERIFICATION FAILED',
      documentTitle: doc.title,
      caseId: doc.caseId,
      version: doc.currentVersion,
      details: isMatch ? 'SHA-256 hashes match bit-for-bit.' : 'Hash mismatch detected!',
      status: isMatch ? 'SUCCESS' : 'FAILED',
      securityLevel: isMatch ? 'LEVEL 1 — NORMAL' : 'LEVEL 4 — CRITICAL',
    });

    return {
      isMatch,
      original: doc.originalHash,
      current: doc.currentHash,
    };
  };

  // Secure document opening workflow
  const openDocumentSecurely = async (doc: SecureDocument): Promise<boolean> => {
    if (!currentUser) return false;

    // RBAC check
    if (doc.allowedRoles && !doc.allowedRoles.includes(currentUser.role)) {
      triggerAccessRestricted(
        `Open Document "${doc.title}"`,
        `Role "${currentUser.role}" lacks read clearance for ${doc.sensitivity} documents.`
      );
      return false;
    }

    // Check if doc is tampered
    if (doc.isTampered) {
      setTamperedAlertDoc(doc);
      return false;
    }

    // Update confidential counter
    if (doc.sensitivity === 'CONFIDENTIAL' || doc.sensitivity === 'HIGHLY CONFIDENTIAL') {
      setRecentConfidentialAccessCount((prev) => prev + 1);
    }

    // Check if step-up biometric is required
    const requiresStepUp =
      doc.sensitivity === 'HIGHLY CONFIDENTIAL' ||
      securityLevel === 'LEVEL 2 — ELEVATED' ||
      securityLevel === 'LEVEL 3 — RESTRICTED' ||
      securityLevel === 'LEVEL 4 — CRITICAL';

    if (requiresStepUp) {
      return new Promise<boolean>((resolve) => {
        setBiometricPrompt({
          isOpen: true,
          reason: `Document "${doc.title}" is ${doc.sensitivity}. Step-Up Identity Verification Required.`,
          onComplete: (success) => {
            setBiometricPrompt(null);
            if (success) {
              logAudit({
                action: 'STEP-UP BIOMETRIC PASSED',
                documentTitle: doc.title,
                caseId: doc.caseId,
                version: doc.currentVersion,
                details: 'Simulated biometric identity match confirmed; access granted.',
                status: 'SUCCESS',
                securityLevel: 'LEVEL 2 — ELEVATED',
              });
              setActiveSecureModalDoc(doc);
              resolve(true);
            } else {
              logAudit({
                action: 'STEP-UP BIOMETRIC FAILED',
                documentTitle: doc.title,
                caseId: doc.caseId,
                status: 'BLOCKED',
                securityLevel: 'LEVEL 3 — RESTRICTED',
              });
              resolve(false);
            }
          },
        });
      });
    }

    // Normal access
    setActiveSecureModalDoc(doc);
    return true;
  };

  const addDocumentVersion = (docId: string, versionData: Partial<DocumentVersion>) => {
    setDocuments((prev) =>
      prev.map((doc) => {
        if (doc.id === docId) {
          const nextVersionNum = `v${doc.versions.length + 1}`;
          const newVersion: DocumentVersion = {
            version: nextVersionNum,
            uploadedBy: currentUser?.name || 'Authorized Officer',
            userRole: currentUser?.role || 'INVESTIGATOR',
            action: versionData.action || 'Document Version Revised',
            timestamp: new Date().toLocaleDateString('en-GB') + ', ' + new Date().toLocaleTimeString(),
            hash: versionData.hash || generateTamperedHash(doc.originalHash).replace('bad_tamper_', '7f83b1'),
            status: versionData.status || 'REVISED',
            comments: versionData.comments || 'Updated per case docket requirements.',
            fileSize: versionData.fileSize || '3.5 MB',
            integrityVerified: true,
            metadataChanges: versionData.metadataChanges || [
              { field: 'Review Status', previous: 'Pending', updated: 'Certified' },
            ],
          };

          const updatedDoc: SecureDocument = {
            ...doc,
            currentVersion: nextVersionNum,
            currentHash: newVersion.hash,
            lastModified: newVersion.timestamp,
            versions: [...doc.versions, newVersion],
          };

          logAudit({
            action: 'NEW VERSION CREATED',
            documentTitle: doc.title,
            caseId: doc.caseId,
            version: nextVersionNum,
            details: `Version ${nextVersionNum} published by ${currentUser?.name}. Previous versions preserved.`,
            status: 'SUCCESS',
          });

          return updatedDoc;
        }
        return doc;
      })
    );
  };

  const createShare = (
    shareData: Omit<SecureShareRecord, 'id' | 'tokenFingerprint' | 'active' | 'accessCount'>
  ) => {
    const token = `SEC-TOKEN-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 6)}`;
    const newShare: SecureShareRecord = {
      ...shareData,
      id: `sh-${Date.now()}`,
      tokenFingerprint: token,
      active: true,
      accessCount: 0,
    };
    setShares((prev) => [newShare, ...prev]);

    logAudit({
      action: 'CREATED SECURE SHARE',
      documentTitle: shareData.documentTitle,
      caseId: shareData.caseId,
      details: `Issued ${shareData.accessType} share to ${shareData.recipient} (${shareData.recipientRole}). Expires in ${shareData.expiresInMinutes}m.`,
      status: 'SUCCESS',
    });
  };

  const revokeShare = (shareId: string) => {
    setShares((prev) =>
      prev.map((s) => (s.id === shareId ? { ...s, active: false } : s))
    );
    logAudit({
      action: 'REVOKED SECURE SHARE',
      details: `Share ID ${shareId} manually revoked by authorized officer.`,
      status: 'WARNING',
    });
  };

  const addNewDocument = (newDoc: SecureDocument) => {
    setDocuments((prev) => [newDoc, ...prev]);
    logAudit({
      action: 'DOCUMENT UPLOADED & AI CLASSIFIED',
      documentTitle: newDoc.title,
      caseId: newDoc.caseId,
      version: newDoc.currentVersion,
      details: `Type: ${newDoc.type} | Sensitivity: ${newDoc.sensitivity} | SHA-256 fingerprint generated.`,
      status: 'SUCCESS',
    });
  };

  const resolveAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: 'RESOLVED' } : a))
    );
    logAudit({
      action: 'SECURITY ALERT RESOLVED',
      details: `Alert ${alertId} reviewed and marked RESOLVED.`,
      status: 'SUCCESS',
    });
  };

  const investigateAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: 'INVESTIGATING' } : a))
    );
    logAudit({
      action: 'INVESTIGATION OPENED ON ALERT',
      details: `Forensic audit initiated for Alert ${alertId}.`,
      status: 'WARNING',
      securityLevel: 'LEVEL 2 — ELEVATED',
    });
  };

  // Demo Scenarios requested in section 28
  const runDemoScenario = (scenario: 'normal' | 'suspicious' | 'critical') => {
    if (scenario === 'normal') {
      // Normal: Police Officer -> FIR -> RBAC Pass -> Low Risk -> Access Granted
      const policeUser = DEMO_USERS.find((u) => u.role === 'POLICE OFFICER')!;
      setCurrentUser(policeUser);
      setSessionSecondsRemaining(policeUser.sessionTimeoutSeconds);
      setIsSessionExpired(false);
      setRecentConfidentialAccessCount(0);
      setFailedLoginAttempts(0);
      const firDoc = documents.find((d) => d.type === 'FIR') || documents[0];
      setActivePage('documents');
      openDocumentSecurely(firDoc);
    } else if (scenario === 'suspicious') {
      // Suspicious: Investigator -> 12 Confidential Docs in 30s -> Anomaly -> Risk 82 -> Step-Up Biometric
      const invUser = DEMO_USERS.find((u) => u.role === 'INVESTIGATOR')!;
      setCurrentUser(invUser);
      setSessionSecondsRemaining(invUser.sessionTimeoutSeconds);
      setIsSessionExpired(false);
      setRecentConfidentialAccessCount(12);

      const highConfDoc =
        documents.find((d) => d.sensitivity === 'HIGHLY CONFIDENTIAL') || documents[1];

      // Add explainable security alert
      const anomalyAlert: SecurityAlert = {
        id: `alt-anomaly-${Date.now()}`,
        severity: 'HIGH',
        title: 'High-Risk Activity: Rapid Confidential Access Anomaly',
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString('en-GB'),
        time: new Date().toLocaleTimeString(),
        user: invUser.name,
        userRole: invUser.role,
        caseId: 'CASE-1024',
        documentName: highConfDoc.title,
        reason: '12 confidential documents accessed across 4 different cases within 30 seconds.',
        detectedBehaviour: [
          '12 confidential documents accessed',
          '4 different cases queried simultaneously',
          '30 seconds elapsed window',
          'Access frequency 480% above baseline normal profile',
        ],
        riskScore: 82,
        recommendedAction: 'Enforce Step-Up Biometric Authentication & Restrict Mass Downloads',
        status: 'ACTIVE',
      };
      setAlerts((prev) => [anomalyAlert, ...prev]);

      logAudit({
        user: invUser.name,
        role: invUser.role,
        action: 'RAPID ACCESS ANOMALY DETECTED',
        documentTitle: highConfDoc.title,
        caseId: highConfDoc.caseId,
        details: '12 confidential records queried in 30s. Risk Score escalated to 82/100.',
        status: 'SUSPICIOUS',
        securityLevel: 'LEVEL 3 — RESTRICTED',
      });

      setActivePage('adaptive_security');
      openDocumentSecurely(highConfDoc);
    } else if (scenario === 'critical') {
      // Critical: Repeated suspicious activity -> Risk 95 -> Blocked -> Security Alert -> Admin Review
      setFailedLoginAttempts(4);
      setRecentConfidentialAccessCount(15);
      const targetDoc = documents[0];
      simulateTampering(targetDoc.id);
      setActivePage('security_alerts');
    }
  };

  const exportAuditReport = (format: 'csv' | 'json') => {
    let content = '';
    let filename = `SECURE_DOCS_AUDIT_REPORT_${Date.now()}`;

    if (format === 'json') {
      content = JSON.stringify(auditLogs, null, 2);
      filename += '.json';
    } else {
      filename += '.csv';
      const headers = ['ID', 'DATE', 'TIME', 'USER', 'ROLE', 'ACTION', 'DOCUMENT', 'CASE_ID', 'LOCATION', 'SECURITY_LEVEL', 'STATUS', 'DETAILS'];
      const rows = auditLogs.map((log) => [
        log.id,
        `"${log.date}"`,
        `"${log.time}"`,
        `"${log.user}"`,
        `"${log.role}"`,
        `"${log.action}"`,
        `"${log.documentTitle || ''}"`,
        `"${log.caseId || ''}"`,
        `"${log.location}"`,
        `"${log.securityLevel}"`,
        `"${log.status}"`,
        `"${(log.details || '').replace(/"/g, '""')}"`,
      ]);
      content = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    }

    const blob = new Blob([content], { type: format === 'json' ? 'application/json' : 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    logAudit({
      action: 'EXPORTED AUDIT REPORT',
      details: `Cryptographic audit ledger exported in ${format.toUpperCase()} format.`,
      status: 'SUCCESS',
    });
  };

  const dismissAlert = useCallback((alertId: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== alertId));
  }, []);

  const requestSecureAction = useCallback(
    (action: () => void, reason?: string, sensitivity?: any) => {
      if (
        securityLevel === 'LEVEL 3 — RESTRICTED' ||
        securityLevel === 'LEVEL 4 — CRITICAL' ||
        sensitivity === 'HIGHLY CONFIDENTIAL' ||
        reason
      ) {
        setBiometricPrompt({
          isOpen: true,
          reason: reason || 'Biometric hardware attestation required for classified evidentiary action.',
          onComplete: (success: boolean) => {
            if (success) {
              action();
            }
          },
        });
      } else {
        action();
      }
    },
    [securityLevel]
  );

  const addDocument = useCallback(
    (doc: any) => {
      addNewDocument({
        id: `doc-${Date.now()}`,
        title: doc.title || 'Untitled Document',
        fileName: doc.fileName || 'document.pdf',
        caseId: doc.caseId || 'CASE-1024',
        caseTitle: doc.caseTitle || 'Investigative Docket',
        type: doc.type || 'EVIDENCE',
        sensitivity: doc.sensitivity || 'CONFIDENTIAL',
        owner: currentUser?.name || 'Officer In-Charge',
        ownerRole: currentUser?.role || 'INVESTIGATOR',
        createdAt: new Date().toISOString().split('T')[0],
        lastModified: new Date().toISOString().split('T')[0],
        currentVersion: 'v1.0',
        versions: [
          {
            version: 'v1.0',
            uploadedBy: currentUser?.name || 'Officer',
            userRole: currentUser?.role || 'INVESTIGATOR',
            action: 'Initial Ingestion & Sealing',
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
            hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
            status: 'ORIGINAL',
            comments: 'Initial secure ingest via AI Classifier.',
            fileSize: '2.4 MB',
            integrityVerified: true,
          },
        ],
        originalHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        currentHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        isTampered: false,
        trustScore: 98,
        encryptionAlgorithm: 'AES-256-GCM',
        storageRepository: 'GOV-VAULT-PRIMARY-01',
        encryptionStatus: 'ENCRYPTED',
        allowedRoles: ['ADMIN', 'INVESTIGATOR', 'LEGAL OFFICER', 'POLICE OFFICER', 'FORENSIC OFFICER'],
        contentSummary: doc.contentSummary || 'Evidentiary record securely deposited.',
        evidenceTags: ['AI-Classified', doc.type || 'EVIDENCE'],
        fileSize: '2.4 MB',
      });
    },
    [addNewDocument, currentUser]
  );

  const createShareToken = useCallback(
    (params: any) => {
      const token = `SHR-${Date.now().toString(36).toUpperCase()}-${Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase()}`;
      const expDate = new Date(Date.now() + (params.expiresInMinutes || 60) * 60000);
      const newShare: SecureShareRecord = {
        id: `share-${Date.now()}`,
        documentId: params.documentId,
        documentTitle: params.documentTitle,
        caseId: params.caseId,
        createdBy: currentUser?.name || 'Authorized Officer',
        recipient: params.recipient,
        recipientRole: params.recipientRole,
        permission: params.allowDownload ? 'VIEW + DOWNLOAD' : 'VIEW',
        accessType: params.oneTimeAccess ? 'ONE TIME' : 'TIME BOUND',
        expiresAt: expDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        expiresInMinutes: params.expiresInMinutes || 60,
        active: true,
        accessCount: 0,
        tokenFingerprint: token,
      };
      createShare(newShare);
      return {
        token,
        ...newShare,
      };
    },
    [createShare, currentUser]
  );

  return (
    <SecurityContext.Provider
      value={{
        currentUser,
        activePage,
        setActivePage,
        sessionSecondsRemaining,
        isSessionExpiringSoon,
        isSessionExpired,
        resetSessionTimer,
        securityLevel,
        currentRiskScore: riskEval.riskScore,
        hasActiveAlert,
        recentConfidentialAccessCount,
        failedLoginAttempts,
        documents,
        cases,
        auditLogs,
        alerts,
        shares,
        login,
        logout,
        unauthorizedModalData,
        clearUnauthorizedModal,
        failedLoginIncident: unauthorizedModalData,
        clearFailedLoginIncident: clearUnauthorizedModal,
        accessRestrictedModal,
        clearAccessRestrictedModal,
        triggerAccessRestricted,
        simulateTampering,
        restoreDocumentIntegrity,
        verifyDocumentIntegrity,
        tamperedAlertDoc,
        clearTamperedAlert,
        viewingDocument,
        setViewingDocument,
        openDocumentSecurely,
        activeSecureModalDoc,
        setActiveSecureModalDoc,
        addDocumentVersion,
        createShare,
        revokeShare,
        addNewDocument,
        resolveAlert,
        investigateAlert,
        dismissAlert,
        requestSecureAction,
        addDocument,
        shareTokens: shares,
        createShareToken,
        runDemoScenario,
        isPageAllowed,
        exportAuditReport,
        biometricPrompt,
        closeBiometricPrompt,
        recordAuditAction,
        addSecurityAlert,
      }}
    >
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurity = (): SecurityContextType => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
};
