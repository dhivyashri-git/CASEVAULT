import React, { useState } from 'react';
import {
  Share2,
  Lock,
  Clock,
  User,
  ShieldCheck,
  Check,
  Copy,
  X,
  FileText,
  AlertTriangle,
  QrCode,
  Link,
} from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';
import { UserRole } from '../types';

interface SecureSharingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SecureSharingModal: React.FC<SecureSharingModalProps> = ({ isOpen, onClose }) => {
  const { documents, shareTokens, createShareToken, currentUser } = useSecurity();

  const [selectedDocId, setSelectedDocId] = useState(documents[0]?.id || '');
  const [recipient, setRecipient] = useState('advocate.sharma@delhi-bar.gov.in');
  const [recipientRole, setRecipientRole] = useState<UserRole>('LEGAL OFFICER');
  const [allowDownload, setAllowDownload] = useState(false);
  const [expiryMinutes, setExpiryMinutes] = useState(60);
  const [oneTimeAccess, setOneTimeAccess] = useState(true);
  const [requireStepUp, setRequireStepUp] = useState(true);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const targetDoc = documents.find((d) => d.id === selectedDocId) || documents[0];

  const handleGenerateShare = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetDoc) return;

    const token = createShareToken({
      documentId: targetDoc.id,
      documentTitle: targetDoc.title,
      caseId: targetDoc.caseId,
      recipient,
      recipientRole,
      allowDownload,
      expiresInMinutes: expiryMinutes,
      oneTimeAccess,
      requireStepUp,
    });

    const link = `https://casevault.gov.in/gate/v4/verify?token=${token.token}&exp=${encodeURIComponent(
      token.expiresAt
    )}`;
    setGeneratedLink(link);
  };

  const handleCopyLink = () => {
    if (!generatedLink) return;
    navigator.clipboard.writeText(generatedLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-slate-950 border border-cyan-500/40 rounded-2xl shadow-2xl glow-cyan flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-cyan-950/60 border border-cyan-500/40 rounded-xl text-cyan-400">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-display text-white">
                TIME-BOUND CRYPTOGRAPHIC SHARING
              </h2>
              <p className="text-xs text-slate-400 font-mono-code">
                Section 38: Ephemeral, watermarked, zero-trust authorized link generation
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

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 font-mono-code text-xs">
          {!generatedLink ? (
            <form onSubmit={handleGenerateShare} className="space-y-4">
              {/* Document select */}
              <div>
                <label className="block text-slate-300 uppercase tracking-wider text-[11px] mb-1">
                  Select Document to Share:
                </label>
                <select
                  value={selectedDocId}
                  onChange={(e) => setSelectedDocId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-400"
                >
                  {documents.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.caseId} — {doc.title} ({doc.sensitivity})
                    </option>
                  ))}
                </select>
              </div>

              {/* Recipient email & Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 uppercase tracking-wider text-[11px] mb-1">
                    Authorized Recipient (Gov Email):
                  </label>
                  <input
                    type="email"
                    required
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="official@agency.gov.in"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 uppercase tracking-wider text-[11px] mb-1">
                    Target Role Clearance:
                  </label>
                  <select
                    value={recipientRole}
                    onChange={(e) => setRecipientRole(e.target.value as UserRole)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="LEGAL OFFICER">LEGAL OFFICER</option>
                    <option value="INVESTIGATOR">INVESTIGATOR</option>
                    <option value="FORENSIC OFFICER">FORENSIC OFFICER</option>
                    <option value="POLICE OFFICER">POLICE OFFICER</option>
                    <option value="VIEWER">VIEWER (READ ONLY)</option>
                  </select>
                </div>
              </div>

              {/* Expiry Window */}
              <div>
                <label className="block text-slate-300 uppercase tracking-wider text-[11px] mb-1">
                  Cryptographic Token Expiry:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: '10 Mins', val: 10 },
                    { label: '1 Hour', val: 60 },
                    { label: '24 Hours', val: 1440 },
                    { label: '48 Hours', val: 2880 },
                  ].map((t) => (
                    <button
                      key={t.val}
                      type="button"
                      onClick={() => setExpiryMinutes(t.val)}
                      className={`p-2 rounded-lg border text-center transition ${
                        expiryMinutes === t.val
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Security Controls */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="text-slate-400 uppercase tracking-wider text-[10px] font-bold block">
                  ZERO-TRUST ENFORCEMENT POLICIES:
                </span>

                <label className="flex items-center space-x-2.5 p-2 bg-slate-900 rounded-lg border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={oneTimeAccess}
                    onChange={(e) => setOneTimeAccess(e.target.checked)}
                    className="accent-cyan-400"
                  />
                  <div>
                    <span className="text-white font-bold block">One-Time Access Auto-Burn</span>
                    <span className="text-slate-500 text-[10px]">
                      Token immediately self-destructs after single successful view.
                    </span>
                  </div>
                </label>

                <label className="flex items-center space-x-2.5 p-2 bg-slate-900 rounded-lg border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={requireStepUp}
                    onChange={(e) => setRequireStepUp(e.target.checked)}
                    className="accent-cyan-400"
                  />
                  <div>
                    <span className="text-white font-bold block">Enforce Biometric Step-Up Attestation</span>
                    <span className="text-slate-500 text-[10px]">
                      Recipient must verify hardware passkey/fingerprint before decryption.
                    </span>
                  </div>
                </label>

                <label className="flex items-center space-x-2.5 p-2 bg-slate-900 rounded-lg border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allowDownload}
                    onChange={(e) => setAllowDownload(e.target.checked)}
                    className="accent-cyan-400"
                  />
                  <div>
                    <span className="text-white font-bold block">Allow Encrypted File Download</span>
                    <span className="text-slate-500 text-[10px]">
                      If disabled, document is strictly constrained to sandboxed browser viewer.
                    </span>
                  </div>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg hover:shadow-cyan-500/20 transition flex items-center justify-center space-x-2"
              >
                <Lock className="w-4 h-4" />
                <span>GENERATE SECURE ENCRYPTED SHARE TOKEN</span>
              </button>
            </form>
          ) : (
            /* Generated Token Result */
            <div className="space-y-4 animate-in fade-in">
              <div className="p-3.5 bg-emerald-950/30 border border-emerald-500/40 rounded-xl flex items-center space-x-3 text-emerald-300">
                <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <span className="font-bold block">SECURE SHARE TOKEN GENERATED</span>
                  <span className="text-slate-400 text-[11px]">
                    Single-use cryptographic envelope sealed with AES-256 ephemeral keys.
                  </span>
                </div>
              </div>

              <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                <span className="text-slate-400 text-[10px] block uppercase">
                  Encrypted Share URL:
                </span>
                <p className="text-cyan-300 break-all select-all text-[11px] bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  {generatedLink}
                </p>

                <div className="flex justify-end pt-1">
                  <button
                    onClick={handleCopyLink}
                    className="py-1.5 px-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg flex items-center space-x-1.5 font-bold transition"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'LINK COPIED' : 'COPY SECURE LINK'}</span>
                  </button>
                </div>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1.5 text-[11px] text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500">Authorized Recipient:</span>
                  <span className="text-white font-bold">{recipient}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Target Role:</span>
                  <span className="text-cyan-400">{recipientRole}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Token Duration:</span>
                  <span className="text-amber-400">{expiryMinutes} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Step-Up Biometric:</span>
                  <span className="text-emerald-400 font-bold">REQUIRED</span>
                </div>
              </div>

              <button
                onClick={() => setGeneratedLink(null)}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition font-semibold"
              >
                CREATE ANOTHER SHARE TOKEN
              </button>
            </div>
          )}

          {/* Active Tokens List */}
          {shareTokens.length > 0 && (
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">
                ACTIVE SHARE TOKENS ({shareTokens.length})
              </span>
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {shareTokens.map((t: any) => (
                  <div
                    key={t.id}
                    className="p-2 bg-slate-900/60 rounded-lg border border-slate-800 flex items-center justify-between text-[11px]"
                  >
                    <div>
                      <span className="text-white font-bold">{t.recipient}</span>
                      <span className="text-slate-500 ml-1.5">({t.documentTitle})</span>
                    </div>
                    <span className="text-amber-400 font-bold">Expires: {t.expiresAt}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
