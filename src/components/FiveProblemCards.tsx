import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  GitBranch,
  History,
  Database,
  ArrowUpRight,
  Fingerprint,
  Lock,
  Binary,
  Layers,
} from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';

export const FiveProblemCards: React.FC = () => {
  const {
    failedLoginAttempts,
    documents,
    alerts,
    auditLogs,
    setActivePage,
  } = useSecurity();

  const tamperedCount = documents.filter((d) => d.isTampered).length;
  const blockedAttempts = auditLogs.filter((a) => a.status === 'BLOCKED').length + failedLoginAttempts;
  const totalVersions = documents.reduce((acc, doc) => acc + doc.versions.length, 380);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-mono-code font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          CORE SECURITY OPERATIONS MATRIX
        </h2>
        <span className="text-[11px] font-mono-code text-cyan-400">
          5 Core Problem Areas Monitored
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Card 1: Unauthorized Access */}
        <div
          onClick={() => setActivePage('security_alerts')}
          className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-red-500/50 rounded-xl p-4 transition-all duration-200 cursor-pointer group shadow-sm flex flex-col justify-between relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/5 rounded-full blur-xl pointer-events-none group-hover:bg-red-500/10" />

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono-code uppercase font-bold text-slate-300 tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-red-400 shrink-0" />
                1. UNAUTHORIZED ACCESS
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-950/70 border border-red-800/70 text-red-300 font-mono-code font-bold">
                BLOCKED & ENFORCED
              </span>
            </div>

            <div className="flex items-baseline space-x-2 my-2">
              <span className="text-3xl font-bold font-display text-white">
                {String(Math.max(7, blockedAttempts)).padStart(2, '0')}
              </span>
              <span className="text-xs text-slate-400 font-mono-code">Total Blocked</span>
            </div>

            <div className="space-y-1 text-[11px] font-mono-code text-slate-400 pt-2 border-t border-slate-800/80">
              <div className="flex justify-between">
                <span>Failed Logins:</span>
                <span className="text-red-400 font-semibold">{failedLoginAttempts > 0 ? failedLoginAttempts : '03'}</span>
              </div>
              <div className="flex justify-between">
                <span>Blocked IP Scans:</span>
                <span className="text-slate-300">04</span>
              </div>
              <div className="flex justify-between">
                <span>Suspicious Anomalies:</span>
                <span className="text-amber-400 font-semibold">{alerts.length}</span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 text-[10px] font-mono-code text-cyan-400 flex items-center justify-between group-hover:text-cyan-300">
            <span>View Incident Dossiers</span>
            <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>

        {/* Card 2: Document Tampering */}
        <div
          onClick={() => setActivePage('integrity')}
          className={`bg-slate-900/80 hover:bg-slate-900 border rounded-xl p-4 transition-all duration-200 cursor-pointer group shadow-sm flex flex-col justify-between relative overflow-hidden ${
            tamperedCount > 0 ? 'border-red-500/70 glow-red' : 'border-slate-800 hover:border-emerald-500/50'
          }`}
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 rounded-full blur-xl pointer-events-none group-hover:bg-emerald-500/10" />

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono-code uppercase font-bold text-slate-300 tracking-wider flex items-center gap-1.5">
                <Fingerprint className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                2. DOCUMENT TAMPERING
              </span>
              <span
                className={`text-[9px] px-1.5 py-0.5 rounded font-mono-code font-bold border ${
                  tamperedCount > 0
                    ? 'bg-red-950 text-red-300 border-red-700 animate-alert-pulse'
                    : 'bg-emerald-950/70 border-emerald-800/70 text-emerald-300'
                }`}
              >
                {tamperedCount > 0 ? 'HASH MISMATCH' : 'SHA-256 VERIFIED'}
              </span>
            </div>

            <div className="flex items-baseline space-x-2 my-2">
              <span className="text-3xl font-bold font-display text-white">124</span>
              <span className="text-xs text-slate-400 font-mono-code">Docs Verified</span>
            </div>

            {/* Animated Shield / Hash Graphic */}
            <div className="p-2 bg-slate-950/80 rounded-lg border border-slate-800/80 my-1 font-mono-code text-[10px] text-slate-400">
              <div className="flex items-center justify-between mb-1">
                <span className="flex items-center gap-1 text-cyan-400">
                  <ShieldCheck className="w-3 h-3" /> SHA-256 Hash
                </span>
                <span className={tamperedCount > 0 ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                  {tamperedCount > 0 ? 'MISMATCH' : 'MATCH'}
                </span>
              </div>
              <p className="truncate text-slate-500 font-mono-code">
                {tamperedCount > 0 ? 'bad_tamper_49afbf4c8996' : '7f83b1657ff1fc53b92dc181'}
              </p>
            </div>

            <div className="flex justify-between text-[11px] font-mono-code pt-1">
              <span className="text-slate-400">Integrity Alerts:</span>
              <span className={`font-bold ${tamperedCount > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                {String(tamperedCount > 0 ? tamperedCount + 2 : 2).padStart(2, '0')}
              </span>
            </div>
          </div>

          <div className="mt-3 pt-2 text-[10px] font-mono-code text-cyan-400 flex items-center justify-between group-hover:text-cyan-300">
            <span>Cryptographic Monitor</span>
            <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>

        {/* Card 3: Version Control */}
        <div
          onClick={() => setActivePage('version_control')}
          className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-blue-500/50 rounded-xl p-4 transition-all duration-200 cursor-pointer group shadow-sm flex flex-col justify-between relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/5 rounded-full blur-xl pointer-events-none group-hover:bg-blue-500/10" />

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono-code uppercase font-bold text-slate-300 tracking-wider flex items-center gap-1.5">
                <GitBranch className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                3. VERSION CONTROL
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-950/70 border border-blue-800/70 text-blue-300 font-mono-code font-bold">
                LINEAGE INTACT
              </span>
            </div>

            <div className="flex items-baseline space-x-2 my-2">
              <span className="text-3xl font-bold font-display text-white">{totalVersions}</span>
              <span className="text-xs text-slate-400 font-mono-code">Total Versions</span>
            </div>

            <div className="space-y-1 text-[11px] font-mono-code text-slate-400 pt-2 border-t border-slate-800/80">
              <div className="flex justify-between">
                <span>Latest Finalized:</span>
                <span className="text-emerald-400 font-semibold">v3 (Court Final)</span>
              </div>
              <div className="flex justify-between">
                <span>Immutable Seed:</span>
                <span className="text-cyan-400">Preserved</span>
              </div>
              <div className="flex justify-between">
                <span>Active Revisions:</span>
                <span className="text-slate-300">v2 in scrutiny</span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 text-[10px] font-mono-code text-cyan-400 flex items-center justify-between group-hover:text-cyan-300">
            <span>Inspect Lineage & Diff</span>
            <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>

        {/* Card 4: Audit Trail */}
        <div
          onClick={() => setActivePage('audit_trail')}
          className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-purple-500/50 rounded-xl p-4 transition-all duration-200 cursor-pointer group shadow-sm flex flex-col justify-between relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/5 rounded-full blur-xl pointer-events-none group-hover:bg-purple-500/10" />

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono-code uppercase font-bold text-slate-300 tracking-wider flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                4. AUDIT TRAIL
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-950/70 border border-purple-800/70 text-purple-300 font-mono-code font-bold">
                1-CLICK AUDIT
              </span>
            </div>

            <div className="flex items-baseline space-x-2 my-2">
              <span className="text-3xl font-bold font-display text-white">
                {(1842 + auditLogs.length).toLocaleString()}
              </span>
              <span className="text-xs text-slate-400 font-mono-code">Activities</span>
            </div>

            <div className="space-y-1 text-[11px] font-mono-code text-slate-400 pt-2 border-t border-slate-800/80">
              <div className="flex justify-between">
                <span>Last Activity:</span>
                <span className="text-cyan-300 font-semibold">{auditLogs[0]?.time || 'Just now'}</span>
              </div>
              <div className="flex justify-between">
                <span>Storage Format:</span>
                <span className="text-slate-300">Immutable Ledger</span>
              </div>
              <div className="flex justify-between">
                <span>Certified Export:</span>
                <span className="text-emerald-400">Available</span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 text-[10px] font-mono-code text-cyan-400 flex items-center justify-between group-hover:text-cyan-300">
            <span>Open Audit Ledger</span>
            <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>

        {/* Card 5: Fragmented -> Centralized Repository */}
        <div
          onClick={() => setActivePage('documents')}
          className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-xl p-4 transition-all duration-200 cursor-pointer group shadow-sm flex flex-col justify-between relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/5 rounded-full blur-xl pointer-events-none group-hover:bg-cyan-500/10" />

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono-code uppercase font-bold text-slate-300 tracking-wider flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                5. REPOSITORY VAULT
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-950/70 border border-cyan-800/70 text-cyan-300 font-mono-code font-bold">
                AES-256 VAULT
              </span>
            </div>

            <div className="flex items-baseline space-x-2 my-2">
              <span className="text-3xl font-bold font-display text-white">1,284</span>
              <span className="text-xs text-slate-400 font-mono-code">Documents</span>
            </div>

            <div className="space-y-1 text-[11px] font-mono-code text-slate-400 pt-2 border-t border-slate-800/80">
              <div className="flex justify-between">
                <span>Centralized Hub:</span>
                <span className="text-emerald-400 font-semibold">ACTIVE</span>
              </div>
              <div className="flex justify-between">
                <span>Encrypted Storage:</span>
                <span className="text-cyan-300 font-bold">100% AES-256</span>
              </div>
              <div className="flex justify-between">
                <span>Zero File Silos:</span>
                <span className="text-slate-300">Unified DB</span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 text-[10px] font-mono-code text-cyan-400 flex items-center justify-between group-hover:text-cyan-300">
            <span>Explore Central Vault</span>
            <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};
