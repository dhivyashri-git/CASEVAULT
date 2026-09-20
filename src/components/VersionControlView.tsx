import React, { useState } from 'react';
import {
  GitBranch,
  CheckCircle2,
  Clock,
  User,
  ShieldCheck,
  Eye,
  Columns,
  X,
  ArrowRight,
  ArrowDown,
  Sparkles,
  Lock,
  Fingerprint,
  FileText,
  Layers,
  Copy,
  Check,
} from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';
import { SecureDocument, DocumentVersion } from '../types';
import { getRoleIcon } from './ForensicVisuals';

export const VersionControlView: React.FC = () => {
  const { documents } = useSecurity();
  const [selectedDocId, setSelectedDocId] = useState<string>(documents[0]?.id || '');
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [activeViewVersion, setActiveViewVersion] = useState<DocumentVersion | null>(null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const currentDoc = documents.find((d) => d.id === selectedDocId) || documents[0];

  const handleCopy = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  if (!currentDoc) {
    return <div className="text-slate-400 font-mono-code">No documents available.</div>;
  }

  const v2 = currentDoc.versions.find((v) => v.versionNumber === 'v2') || currentDoc.versions[1];
  const v3 = currentDoc.versions.find((v) => v.versionNumber === 'v3') || currentDoc.versions[2];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
        <div>
          <div className="flex items-center space-x-2 text-blue-400 text-xs font-mono-code mb-1">
            <GitBranch className="w-4 h-4" />
            <span>IMMUTABLE REVISION CONTROL</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-display text-white">
            DOCUMENT VERSION LINEAGE & DIFF
          </h1>
          <p className="text-xs text-slate-400 font-mono-code mt-0.5">
            Every amendment retains its historic cryptographic seed. Overwrites are strictly prohibited.
          </p>
        </div>

        {/* Document Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono-code text-slate-400">Target Document:</span>
          <select
            value={selectedDocId}
            onChange={(e) => setSelectedDocId(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono-code text-slate-200 focus:outline-none focus:border-cyan-400"
          >
            {documents.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.caseId} — {doc.title} ({doc.currentVersion})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Target Document Highlight Bar */}
      <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl flex flex-wrap items-center justify-between gap-4 font-mono-code text-xs">
        <div>
          <span className="text-slate-500 text-[10px] block">INSPECTING LINEAGE</span>
          <h2 className="text-base font-bold text-white mt-0.5">{currentDoc.title}</h2>
          <span className="text-cyan-400 text-[11px]">{currentDoc.caseId} • {currentDoc.type}</span>
        </div>

        <div className="flex items-center space-x-3">
          <div className="p-2 bg-emerald-950/40 border border-emerald-500/40 rounded-lg text-emerald-300">
            <span className="text-[10px] text-slate-400 block">CURRENT STATE:</span>
            <span className="font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              {currentDoc.currentVersion} — FINALIZED
            </span>
          </div>

          <button
            onClick={() => setCompareModalOpen(true)}
            className="py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold transition flex items-center space-x-1.5 shadow-lg hover:shadow-blue-500/20"
          >
            <Columns className="w-4 h-4" />
            <span>[ COMPARE VERSIONS v2 vs v3 ]</span>
          </button>
        </div>
      </div>

      {/* Version Lineage Timeline (Section 31 & Section 14 Visuals) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono-code font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            CHRONOLOGICAL REVISION TREE (v1 → v2 → v3)
          </h3>
          <span className="text-[11px] font-mono-code text-cyan-400">
            {currentDoc.versions.length} Signed Revisions
          </span>
        </div>

        <div className="space-y-0">
          {currentDoc.versions.map((ver, idx) => {
            const vNum = ver.versionNumber || ver.version;
            const isLatest = vNum === currentDoc.currentVersion;
            const RoleIcon = getRoleIcon(ver.creatorRole || ver.userRole);
            const isLastInList = idx === currentDoc.versions.length - 1;

            const stageLabel =
              vNum === 'v1'
                ? 'ORIGINAL / INITIAL RECORD'
                : vNum === 'v2'
                ? 'INVESTIGATION & EVIDENCE UPDATE'
                : 'FINAL LEGAL REVIEW & COURT PACKAGING';

            return (
              <React.Fragment key={vNum}>
                <div
                  className={`p-4 rounded-xl border transition-all ${
                    isLatest
                      ? 'bg-slate-900/90 border-cyan-500/50 shadow-md ring-1 ring-cyan-500/20'
                      : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-900/70'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono-code text-xs">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center font-bold text-xs border ${
                          isLatest
                            ? 'bg-cyan-950 text-cyan-300 border-cyan-500 shadow-sm'
                            : 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}
                      >
                        <FileText className="w-3.5 h-3.5 mb-0.5 opacity-80" />
                        <span>{vNum}</span>
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-white text-sm">
                            {vNum.toUpperCase()} — {stageLabel}
                          </span>
                          {isLatest ? (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold border border-emerald-700 flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3" />
                              FINAL / APPROVED
                            </span>
                          ) : (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950/70 text-blue-300 font-bold border border-blue-800/60 flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3 text-cyan-400" />
                              VERIFIED BASELINE
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-slate-400 mt-1">
                          <span className="text-slate-200 flex items-center gap-1">
                            <RoleIcon className="w-3 h-3 text-cyan-400" />
                            {ver.createdBy}
                          </span>
                          <span>•</span>
                          <span className="text-cyan-400">{ver.creatorRole}</span>
                          <span>•</span>
                          <span className="text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-500" />
                            {ver.createdAt}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setActiveViewVersion(ver)}
                        className="py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1.5 transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>VIEW VERSION</span>
                      </button>
                    </div>
                  </div>

                  {/* Reason & Hash */}
                  <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs font-mono-code">
                    <div className="sm:col-span-5 text-slate-300">
                      <span className="text-slate-500 text-[10px] block">CHANGE NOTES / REASON:</span>
                      <p className="mt-0.5 text-slate-300">{ver.reasonForUpdate}</p>
                    </div>

                    <div className="sm:col-span-7 p-2.5 bg-slate-950/90 rounded-lg border border-slate-800 flex items-center justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <span className="text-slate-500 text-[10px] flex items-center gap-1">
                          <Fingerprint className="w-3 h-3 text-cyan-400" />
                          VERSION SHA-256 HASH:
                        </span>
                        <p className="text-[10px] text-cyan-300 truncate font-mono-code select-all mt-0.5">
                          {ver.hash}
                        </p>
                      </div>
                      <button
                        onClick={() => handleCopy(ver.hash)}
                        className="shrink-0 p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-cyan-300 transition flex items-center gap-1 text-[10px]"
                        title="Copy Hash"
                      >
                        {copiedHash === ver.hash ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span className="hidden sm:inline">
                          {copiedHash === ver.hash ? 'COPIED' : 'COPY'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Lineage Connector */}
                {!isLastInList && (
                  <div className="flex justify-center py-2 relative">
                    <div className="flex items-center gap-2 text-slate-500 text-[10px] font-mono-code bg-slate-950/80 border border-slate-800 px-3 py-1 rounded-full shadow-inner">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                      <span>CRYPTOGRAPHIC CONTINUITY PASS</span>
                      <ArrowDown className="w-3.5 h-3.5 text-cyan-400" />
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Side-by-Side Version Comparison Modal (Section 32) */}
      {compareModalOpen && v2 && v3 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-5xl bg-slate-950 border border-blue-500/50 rounded-2xl shadow-2xl glow-blue flex flex-col max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-950/60 border border-blue-500/40 rounded-xl text-blue-400">
                  <Columns className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold font-display text-white">
                    CRYPTOGRAPHIC VERSION COMPARISON (v2 vs v3)
                  </h3>
                  <p className="text-xs text-slate-400 font-mono-code">
                    {currentDoc.title} ({currentDoc.caseId})
                  </p>
                </div>
              </div>

              <button
                onClick={() => setCompareModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Split Comparison Columns */}
            <div className="p-4 sm:p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4 font-mono-code text-xs">
              {/* Left: Version 2 */}
              <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-slate-300 bg-slate-800 px-2 py-0.5 rounded">
                    VERSION v2 (PREVIOUS)
                  </span>
                  <span className="text-slate-400 text-[11px]">{v2.createdAt}</span>
                </div>

                <div>
                  <span className="text-slate-500 text-[10px] block">AUTHOR:</span>
                  <p className="text-white font-semibold">{v2.createdBy} ({v2.creatorRole})</p>
                </div>

                <div>
                  <span className="text-slate-500 text-[10px] block">REVISION OBJECTIVE:</span>
                  <p className="text-slate-300">{v2.reasonForUpdate}</p>
                </div>

                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                  <span className="text-slate-500 text-[10px] block">DEPOSITION CONTENT SUMMARY:</span>
                  <p className="text-slate-300 leading-relaxed">
                    Preliminary ballistic angle trajectory mapped between 18° and 22°. Shell casing extraction completed. Awaiting chemical propellant mass spectrometry confirmation.
                  </p>
                </div>

                <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">SHA-256 HASH:</span>
                  <p className="text-[10px] text-slate-400 break-all">{v2.hash}</p>
                </div>
              </div>

              {/* Right: Version 3 */}
              <div className="p-4 bg-slate-900/90 border border-cyan-500/40 rounded-xl space-y-3 ring-1 ring-cyan-500/20">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-cyan-300 bg-cyan-950 border border-cyan-800 px-2 py-0.5 rounded">
                    VERSION v3 (FINALIZED)
                  </span>
                  <span className="text-emerald-400 text-[11px] font-bold">✓ FINAL EXHIBIT</span>
                </div>

                <div>
                  <span className="text-slate-500 text-[10px] block">AUTHOR:</span>
                  <p className="text-white font-semibold">{v3.createdBy} ({v3.creatorRole})</p>
                </div>

                <div>
                  <span className="text-slate-500 text-[10px] block">REVISION OBJECTIVE:</span>
                  <p className="text-cyan-300 font-semibold">{v3.reasonForUpdate}</p>
                </div>

                <div className="p-3 bg-cyan-950/20 rounded-lg border border-cyan-500/30 space-y-1">
                  <span className="text-cyan-400 text-[10px] block font-bold">AMENDED & FINALIZED TRANSCRIPT:</span>
                  <p className="text-slate-200 leading-relaxed">
                    Trajectory conclusively affirmed at 20.4°. Chemical mass spectrometry matches propellant residue to suspect weapon. <mark className="bg-cyan-500/30 text-cyan-200 px-1 rounded">Certified for formal submission to Sessions Court pursuant to Sec 293 CrPC.</mark>
                  </p>
                </div>

                <div className="p-2.5 bg-slate-950 rounded-lg border border-cyan-500/30">
                  <span className="text-slate-500 text-[10px] block">SHA-256 HASH:</span>
                  <p className="text-[10px] text-cyan-300 break-all">{v3.hash}</p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between font-mono-code text-xs">
              <span className="text-slate-400">
                Diff Result: <strong className="text-emerald-400">+1 Addendum, +1 Court Attestation Certificate</strong>
              </span>
              <button
                onClick={() => setCompareModalOpen(false)}
                className="py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition"
              >
                CLOSE DIFF VIEWER
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Single Version View Modal */}
      {activeViewVersion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg bg-slate-950 border border-cyan-500/40 rounded-2xl p-6 shadow-2xl font-mono-code text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-base font-bold text-white">
                HISTORIC SNAPSHOT: REVISION {activeViewVersion.versionNumber}
              </h3>
              <button
                onClick={() => setActiveViewVersion(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 mb-6">
              <div>
                <span className="text-slate-500 text-[10px] block">RECORDED TIMESTAMP:</span>
                <p className="text-slate-200">{activeViewVersion.createdAt}</p>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">RESPONSIBLE OFFICER:</span>
                <p className="text-slate-200">{activeViewVersion.createdBy} ({activeViewVersion.creatorRole})</p>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">COMMIT PURPOSE:</span>
                <p className="text-cyan-300">{activeViewVersion.reasonForUpdate}</p>
              </div>
              <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-slate-500 text-[10px] block">CRYPTO ATTESTATION HASH:</span>
                <p className="text-[10px] text-slate-300 break-all">{activeViewVersion.hash}</p>
              </div>
            </div>

            <button
              onClick={() => setActiveViewVersion(null)}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold"
            >
              CLOSE SNAPSHOT
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
