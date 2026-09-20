import React, { useState } from 'react';
import {
  FileText,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Copy,
  Check,
  X,
  Lock,
  Calendar,
  User,
  GitBranch,
  Key,
  Layers,
  Activity,
  AlertTriangle,
  Briefcase,
  Fingerprint,
  Clock,
  RefreshCw,
  Hash,
  History,
} from 'lucide-react';
import { SecureDocument } from '../types';
import { useSecurity } from '../context/SecurityContext';
import { RoleBadge, getRoleIcon } from './ForensicVisuals';

interface DocumentDetailsModalProps {
  document: SecureDocument | null;
  onClose: () => void;
  onOpenSecurely: (doc: SecureDocument) => void;
}

export const DocumentDetailsModal: React.FC<DocumentDetailsModalProps> = ({
  document,
  onClose,
  onOpenSecurely,
}) => {
  const { simulateTampering, restoreDocumentIntegrity } = useSecurity();
  const [copiedHash, setCopiedHash] = useState(false);

  if (!document) return null;

  const handleCopyHash = () => {
    navigator.clipboard.writeText(document.currentHash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const isTampered = document.isTampered;
  const OwnerRoleIcon = getRoleIcon(document.ownerRole);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-950 border border-cyan-500/40 rounded-2xl shadow-2xl glow-cyan flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-cyan-950/60 border border-cyan-500/30 rounded-xl text-cyan-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-bold font-display text-white">
                  CASEVAULT DOSSIER DETAILS
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono-code border border-cyan-800">
                  {document.id}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono-code truncate max-w-sm sm:max-w-md">
                {document.title}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 font-mono-code text-xs">
          {/* Metadata Grid (Section 40 Requirements) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl space-y-1">
              <span className="text-slate-500 text-[10px] flex items-center gap-1">
                <FileText className="w-3 h-3 text-cyan-400" /> DOCUMENT NAME & FILE
              </span>
              <p className="font-bold text-white text-sm">{document.title}</p>
              <p className="text-slate-400 text-[11px]">{document.fileName} ({document.fileSize})</p>
            </div>

            <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl space-y-1">
              <span className="text-slate-500 text-[10px] flex items-center gap-1">
                <Briefcase className="w-3 h-3 text-cyan-400" /> CASE RECORD LINKAGE
              </span>
              <p className="font-bold text-cyan-400 text-sm">{document.caseId}</p>
              <p className="text-slate-400 text-[11px] truncate">{document.caseTitle}</p>
            </div>

            <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl space-y-1">
              <span className="text-slate-500 text-[10px] flex items-center gap-1">
                <Shield className="w-3 h-3 text-amber-400" /> DOCUMENT TYPE & SENSITIVITY
              </span>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-slate-200">{document.type}</span>
                <span>•</span>
                <span className="text-amber-400 font-bold">{document.sensitivity}</span>
              </div>
              <p className="text-slate-500 text-[10px]">Security Clearance Required: CONFIDENTIAL+</p>
            </div>

            <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl space-y-1">
              <span className="text-slate-500 text-[10px] flex items-center gap-1">
                <User className="w-3 h-3 text-cyan-400" /> OWNER & DEPOSITION AUTHOR
              </span>
              <p className="font-bold text-slate-200">{document.owner}</p>
              <p className="text-cyan-400 text-[11px] flex items-center gap-1">
                <OwnerRoleIcon className="w-3 h-3 text-cyan-400" />
                <span>{document.ownerRole} ({document.department})</span>
              </p>
            </div>

            <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl space-y-1">
              <span className="text-slate-500 text-[10px] flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" /> LIFECYCLE TIMESTAMPS
              </span>
              <div className="flex justify-between text-slate-300 text-[11px]">
                <span>Created:</span>
                <span>{document.createdAt}</span>
              </div>
              <div className="flex justify-between text-slate-300 text-[11px]">
                <span>Last Modified:</span>
                <span>{document.lastModified}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl space-y-1">
              <span className="text-slate-500 text-[10px] flex items-center gap-1">
                <Layers className="w-3 h-3 text-blue-400" /> VERSION & REVISION STATE
              </span>
              <div className="flex items-center justify-between">
                <span className="font-bold text-cyan-300">{document.currentVersion}</span>
                <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 text-[10px] border border-blue-800">
                  {document.versions.length} REVISIONS
                </span>
              </div>
              <p className="text-slate-500 text-[10px]">Finalized for Court Submission</p>
            </div>
          </div>

          {/* Encryption & Integrity Status */}
          <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-[11px] uppercase tracking-wider font-bold flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-cyan-400" />
                CRYPTOGRAPHIC ENCRYPTION & INTEGRITY
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 flex items-center gap-1">
                <Lock className="w-3 h-3" />
                <span>{document.encryptionAlgorithm}</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-500 text-[10px] flex items-center gap-1">
                  <Lock className="w-3 h-3 text-cyan-400" /> ENCRYPTION STATE
                </span>
                <span className="text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
                  <Check className="w-3.5 h-3.5" /> AT-REST & IN-TRANSIT (ENCRYPTED)
                </span>
              </div>

              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-500 text-[10px] flex items-center gap-1">
                  <Fingerprint className="w-3 h-3 text-cyan-400" /> INTEGRITY FINGERPRINT STATUS
                </span>
                <span
                  className={`font-bold flex items-center gap-1 mt-0.5 ${
                    isTampered ? 'text-red-400' : 'text-emerald-400'
                  }`}
                >
                  {isTampered ? (
                    <>
                      <ShieldAlert className="w-3.5 h-3.5" /> TAMPERING SUSPECTED
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5" /> SHA-256 MATCH VERIFIED
                    </>
                  )}
                </span>
              </div>
            </div>

            {/* SHA-256 Hash with Copy */}
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-[10px] uppercase flex items-center gap-1">
                  <Hash className="w-3 h-3 text-cyan-400" /> SHA-256 Cryptographic Hash
                </span>
                <button
                  onClick={handleCopyHash}
                  className="flex items-center space-x-1 text-[11px] text-cyan-400 hover:text-cyan-300 transition"
                >
                  {copiedHash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedHash ? 'Copied' : 'Copy Hash'}</span>
                </button>
              </div>
              <p className="text-[11px] text-cyan-300 break-all select-all font-mono-code">
                {document.currentHash}
              </p>
            </div>
          </div>

          {/* Trust Score & Risk Level Breakdown */}
          <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-[11px] uppercase tracking-wider font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                DOCUMENT TRUST SCORE & RISK LEVEL
              </span>
              <div className="flex items-center space-x-2">
                <span
                  className={`text-xs px-2 py-0.5 rounded font-mono-code font-bold uppercase border flex items-center gap-1 ${
                    isTampered
                      ? 'bg-red-950/80 text-red-300 border-red-800'
                      : document.trustScore > 80
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                      : 'bg-amber-950 text-amber-300 border-amber-800'
                  }`}
                >
                  <AlertTriangle className="w-3 h-3" />
                  <span>{isTampered ? 'CRITICAL RISK' : document.trustScore > 80 ? 'LOW RISK' : 'ELEVATED RISK'}</span>
                </span>
                <span
                  className={`text-sm font-bold ${
                    document.trustScore > 80
                      ? 'text-emerald-400'
                      : document.trustScore > 50
                      ? 'text-amber-400'
                      : 'text-red-400'
                  }`}
                >
                  {document.trustScore} / 100
                </span>
              </div>
            </div>

            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400 flex items-center gap-1">
                  <Hash className="w-3 h-3 text-slate-500" /> Cryptographic Hash Verification:
                </span>
                <span className={isTampered ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                  {isTampered ? '0 / 40 (Tamper Flagged)' : '40 / 40'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 flex items-center gap-1">
                  <History className="w-3 h-3 text-slate-500" /> Chain of Custody Continuity:
                </span>
                <span className="text-emerald-400">30 / 30</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 flex items-center gap-1">
                  <Fingerprint className="w-3 h-3 text-slate-500" /> Attestation & Digital Signature:
                </span>
                <span className="text-emerald-400">20 / 20</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 flex items-center gap-1">
                  <Activity className="w-3 h-3 text-slate-500" /> Access Velocity Regularity:
                </span>
                <span className="text-emerald-400">10 / 10</span>
              </div>
            </div>
          </div>

          {/* Audit History & Provenance Summary */}
          <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-800 text-cyan-400">
                <History className="w-4 h-4" />
              </div>
              <div>
                <span className="text-slate-300 font-bold text-xs block">IMMUTABLE AUDIT TRAIL RECORDED</span>
                <span className="text-slate-500 text-[11px]">
                  All views, cryptographic verifications, and revisions are locked in the digital ledger.
                </span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold shrink-0">
              AUDIT COMPLIANT
            </span>
          </div>

          {/* Access Permissions (RBAC) */}
          <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-2">
            <span className="text-slate-400 text-[11px] uppercase tracking-wider font-bold flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              ROLE PERMISSION CLEARANCE
            </span>
            <div className="flex flex-wrap gap-2 pt-1">
              {document.allowedRoles.map((role) => (
                <RoleBadge key={role} role={role} size="xs" />
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/80 flex flex-wrap items-center justify-between gap-3">
          <div>
            {isTampered ? (
              <button
                onClick={() => restoreDocumentIntegrity(document.id)}
                className="py-2 px-4 bg-emerald-700 hover:bg-emerald-600 text-white font-mono-code text-xs font-semibold rounded-lg transition flex items-center space-x-1.5"
              >
                <span>[ RESTORE ORIGINAL HASH ]</span>
              </button>
            ) : (
              <button
                onClick={() => simulateTampering(document.id)}
                className="py-2 px-4 bg-red-950/60 hover:bg-red-900/70 border border-red-500/40 text-red-300 font-mono-code text-xs font-semibold rounded-lg transition flex items-center space-x-1.5"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                <span>[ SIMULATE TAMPERING ]</span>
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono-code text-xs rounded-lg transition"
            >
              CLOSE
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenSecurely(document);
              }}
              className="py-2 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono-code text-xs font-semibold rounded-lg shadow-lg hover:shadow-cyan-500/20 transition flex items-center space-x-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>OPEN SECURELY</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
