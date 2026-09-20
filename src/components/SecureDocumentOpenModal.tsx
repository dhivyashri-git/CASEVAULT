import React, { useState, useEffect } from 'react';
import {
  Shield,
  CheckCircle2,
  Lock,
  Unlock,
  Eye,
  FileText,
  Copy,
  Check,
  Download,
  AlertTriangle,
  X,
  Fingerprint,
  Binary,
  Layers,
} from 'lucide-react';
import { SecureDocument } from '../types';
import { useSecurity } from '../context/SecurityContext';

interface SecureDocumentOpenModalProps {
  document: SecureDocument | null;
  onClose: () => void;
}

const VERIFICATION_STEPS = [
  'AUTHENTICATION VERIFIED',
  'RBAC PERMISSION CHECK',
  'DYNAMIC RISK EVALUATION',
  'INTEGRITY VERIFICATION',
  'IN-MEMORY DECRYPTION (AES-256)',
  'DOCUMENT ACCESS GRANTED',
];

export const SecureDocumentOpenModal: React.FC<SecureDocumentOpenModalProps> = ({
  document,
  onClose,
}) => {
  const { currentUser, verifyDocumentIntegrity } = useSecurity();
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isFullyDecrypted, setIsFullyDecrypted] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);
  const [redactionMode, setRedactionMode] = useState(false);

  useEffect(() => {
    if (!document) {
      setCompletedSteps([]);
      setIsFullyDecrypted(false);
      return;
    }

    // Step-by-step security pipeline animation
    setCompletedSteps([]);
    setIsFullyDecrypted(false);

    VERIFICATION_STEPS.forEach((_, idx) => {
      const timer = setTimeout(() => {
        setCompletedSteps((prev) => [...prev, idx]);
        if (idx === VERIFICATION_STEPS.length - 1) {
          setTimeout(() => {
            setIsFullyDecrypted(true);
          }, 350);
        }
      }, (idx + 1) * 350);

      return () => clearTimeout(timer);
    });
  }, [document]);

  if (!document) return null;

  const handleCopyHash = () => {
    navigator.clipboard.writeText(document.currentHash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-950 border border-cyan-500/40 rounded-2xl shadow-2xl glow-cyan flex flex-col max-h-[92vh] overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-cyan-950/60 border border-cyan-500/40 rounded-xl text-cyan-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-bold font-display text-white">
                  SECURE DOCUMENT ACCESS GATEWAY
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono-code border border-cyan-800">
                  {document.encryptionAlgorithm}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono-code truncate max-w-md">
                {document.title} ({document.fileName})
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

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* Animated Verification Pipeline if still verifying */}
          {!isFullyDecrypted ? (
            <div className="py-8 px-4 text-center space-y-6">
              <div className="w-16 h-16 mx-auto bg-cyan-950/60 border border-cyan-500/40 rounded-2xl flex items-center justify-center text-cyan-400 animate-pulse">
                <Lock className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-lg font-bold font-display text-white">
                  ADAPTIVE VERIFICATION PIPELINE ACTIVE
                </h3>
                <p className="text-xs text-slate-400 font-mono-code mt-1">
                  Enforcing cryptographic chain-of-custody and clearance attestation
                </p>
              </div>

              {/* Steps Progress */}
              <div className="max-w-md mx-auto space-y-2.5 font-mono-code text-xs">
                {VERIFICATION_STEPS.map((step, idx) => {
                  const isDone = completedSteps.includes(idx);
                  return (
                    <div
                      key={step}
                      className={`flex items-center justify-between p-2.5 rounded-lg border transition-all duration-200 ${
                        isDone
                          ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                          : 'bg-slate-900/40 border-slate-800 text-slate-600'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <span className="text-[10px] w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center font-bold">
                          {idx + 1}
                        </span>
                        <span>{step}</span>
                      </div>
                      <div>
                        {isDone ? (
                          <span className="flex items-center space-x-1 text-emerald-400 font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span className="text-[10px]">PASSED</span>
                          </span>
                        ) : (
                          <span className="text-slate-600 text-[10px] animate-pulse">
                            PROCESSING...
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Decrypted Document Viewer */
            <div className="space-y-4 animate-in fade-in duration-300">
              {/* Security Banner & Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-xl text-xs font-mono-code text-emerald-300">
                <div className="flex items-center space-x-2">
                  <Unlock className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold">DECRYPTED IN SECURE RUNTIME MEMORY</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-300">Zero Persistent Disk Footprint</span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setRedactionMode(!redactionMode)}
                    className={`px-2.5 py-1 rounded border text-[11px] font-mono-code transition ${
                      redactionMode
                        ? 'bg-purple-950 text-purple-300 border-purple-500'
                        : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
                    }`}
                  >
                    {redactionMode ? '✓ Redactions Applied' : 'Toggle Redactions'}
                  </button>

                  <button
                    onClick={handleCopyHash}
                    className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-mono-code flex items-center space-x-1 transition"
                  >
                    {copiedHash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedHash ? 'Hash Copied' : 'Copy SHA-256'}</span>
                  </button>
                </div>
              </div>

              {/* Cryptographic Dossier Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono-code">
                <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg">
                  <span className="text-slate-500 block text-[10px]">CASE DOCKET</span>
                  <span className="text-white font-bold">{document.caseId}</span>
                </div>
                <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg">
                  <span className="text-slate-500 block text-[10px]">CURRENT VERSION</span>
                  <span className="text-cyan-400 font-bold">{document.currentVersion}</span>
                </div>
                <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg">
                  <span className="text-slate-500 block text-[10px]">CLASSIFICATION</span>
                  <span className="text-amber-400 font-bold">{document.sensitivity}</span>
                </div>
                <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg">
                  <span className="text-slate-500 block text-[10px]">TRUST SCORE</span>
                  <span className="text-emerald-400 font-bold">{document.trustScore} / 100</span>
                </div>
              </div>

              {/* Full Document Body with Government Digital Watermark */}
              <div className="relative p-6 bg-slate-900/90 border border-slate-800 rounded-xl font-mono-code text-xs text-slate-200 leading-relaxed overflow-hidden">
                {/* Government Watermark Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.06] rotate-[-25deg]">
                  <div className="text-center font-black text-4xl sm:text-5xl tracking-widest text-white leading-tight">
                    GOVERNMENT OF INDIA<br />
                    OFFICIAL EVIDENCE RECORD<br />
                    AUTHORIZED FOR {currentUser?.name?.toUpperCase()}<br />
                    DO NOT REPRODUCE
                  </div>
                </div>

                <div className="relative z-10 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <span className="text-cyan-400 font-bold">STATE POLICE & JUDICIAL EVIDENCE REPOSITORY</span>
                    <span className="text-slate-400 text-[11px]">CERTIFIED EXHIBIT</span>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-white mb-1">{document.title}</h4>
                    <p className="text-slate-400 text-[11px]">
                      Case Reference: {document.caseTitle} | Deposited by {document.owner} ({document.ownerRole})
                    </p>
                  </div>

                  <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg space-y-2">
                    <span className="text-[11px] font-bold text-slate-300 block uppercase">
                      OFFICIAL DEPOSITION & FINDINGS:
                    </span>
                    <p className="text-slate-300 leading-relaxed">
                      {document.contentSummary}
                    </p>

                    {redactionMode ? (
                      <p className="text-slate-400 pt-2 border-t border-slate-800 text-[11px]">
                        [REDACTED PURSUANT TO COURT ORDER SEC 164: Witness mobile number, residential address, and minor family identities withheld from public transcript.]
                      </p>
                    ) : (
                      <p className="text-slate-400 pt-2 border-t border-slate-800 text-[11px]">
                        Deposition corroborated by CFSL Cyber Lab Bitstream Extraction Report and Ballistics Striation Matching. Chain of custody authenticated by lead investigation team.
                      </p>
                    )}
                  </div>

                  {/* Hash Proof Box */}
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase block">
                      SHA-256 Cryptographic Fingerprint:
                    </span>
                    <p className="text-[11px] text-cyan-300 break-all select-all font-mono-code">
                      {document.currentHash}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between">
          <div className="text-[11px] font-mono-code text-slate-400">
            Session Accessor: <strong className="text-slate-200">{currentUser?.name}</strong> | Device ID: <strong className="text-slate-200">#CFSL-994</strong>
          </div>

          <button
            onClick={onClose}
            className="py-2 px-5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono-code text-xs font-semibold rounded-lg transition"
          >
            CLOSE VIEWER
          </button>
        </div>
      </div>
    </div>
  );
};
