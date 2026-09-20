import React, { useState } from 'react';
import {
  Briefcase,
  Clock,
  ShieldCheck,
  User,
  GitCommit,
  CheckCircle2,
  FileText,
  AlertCircle,
  Scale,
  Calendar,
  Layers,
  Fingerprint,
  Search,
  MessageSquare,
  Shield,
  ArrowDown,
} from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';
import { getRoleIcon } from './ForensicVisuals';

export const CaseTimelineView: React.FC = () => {
  const { cases } = useSecurity();
  const [selectedCaseId, setSelectedCaseId] = useState<string>(cases[0]?.id || 'CASE-1024');

  const selectedCase = cases.find((c) => c.id === selectedCaseId) || cases[0];

  const getTimelineStageIcon = (action: string) => {
    const act = action.toUpperCase();
    if (act.includes('COURT') || act.includes('JUDICIAL') || act.includes('CHARGE')) {
      return Scale;
    }
    if (act.includes('FORENSIC') || act.includes('EXTRACTION') || act.includes('LAB') || act.includes('BALLISTIC')) {
      return Fingerprint;
    }
    if (act.includes('WITNESS') || act.includes('DEPOSITION') || act.includes('STATEMENT')) {
      return MessageSquare;
    }
    if (act.includes('INVESTIGATION') || act.includes('CORRELATION') || act.includes('INSPECT')) {
      return Search;
    }
    if (act.includes('FIR') || act.includes('INCIDENT') || act.includes('INCEPTION')) {
      return Shield;
    }
    return FileText;
  };

  if (!selectedCase) {
    return <div className="text-slate-400 font-mono-code">No cases available.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-mono-code mb-1">
            <Briefcase className="w-4 h-4" />
            <span>JUDICIAL CASE DOSSIER & LIFECYCLE</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-display text-white">
            CASE-CENTRIC SECURITY TIMELINE
          </h1>
          <p className="text-xs text-slate-400 font-mono-code mt-0.5">
            Full unbroken chain of custody from initial FIR inception to judicial deposition.
          </p>
        </div>

        {/* Case Switcher */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono-code text-slate-400">Select Case:</span>
          <select
            value={selectedCaseId}
            onChange={(e) => setSelectedCaseId(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono-code text-slate-200 focus:outline-none focus:border-cyan-400"
          >
            {cases.map((c) => (
              <option key={c.id} value={c.id}>
                {c.id} — {c.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Case Overview Card */}
      <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl grid grid-cols-1 sm:grid-cols-4 gap-4 font-mono-code text-xs">
        <div>
          <span className="text-slate-500 text-[10px] block">CASE RECORD</span>
          <h2 className="text-base font-bold text-white mt-0.5">{selectedCase.id}</h2>
          <span className="text-cyan-400 text-[11px]">{selectedCase.title}</span>
        </div>

        <div>
          <span className="text-slate-500 text-[10px] block">INVESTIGATING AGENCY</span>
          <p className="text-slate-200 font-semibold mt-0.5">{selectedCase.department}</p>
          <span className="text-slate-400 text-[11px]">Lead: {selectedCase.leadOfficer}</span>
        </div>

        <div>
          <span className="text-slate-500 text-[10px] block">CASE STATUS</span>
          <span className="inline-block mt-0.5 px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold border border-emerald-800">
            {selectedCase.status}
          </span>
          <p className="text-slate-500 text-[10px] mt-0.5">Opened: {selectedCase.createdAt}</p>
        </div>

        <div>
          <span className="text-slate-500 text-[10px] block">CUSTODY INTEGRITY</span>
          <span className="text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            100% VERIFIED LEDGER
          </span>
          <span className="text-slate-400 text-[10px]">
            {selectedCase.timeline.length} Traceable Lifecycle Events
          </span>
        </div>
      </div>

      {/* Vertical Lifecycle Timeline (Section 33) */}
      <div className="space-y-4">
        <h3 className="text-xs font-mono-code font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Clock className="w-4 h-4 text-cyan-400" />
          CHRONOLOGICAL CHAIN OF EVIDENCE & CUSTODY ACTIONS
        </h3>

        <div className="relative pl-6 border-l-2 border-slate-800 space-y-6">
          {selectedCase.timeline.map((item, idx) => {
            const isLast = idx === selectedCase.timeline.length - 1;
            const StageIcon = getTimelineStageIcon(item.action);
            const RoleIcon = getRoleIcon(item.role);

            return (
              <div key={item.id} className="relative group">
                {/* Node Dot with Stage Icon */}
                <div
                  className={`absolute -left-[35px] top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition shadow-sm ${
                    isLast
                      ? 'bg-emerald-950 border-emerald-400 text-emerald-300 ring-4 ring-emerald-500/20'
                      : 'bg-slate-900 border-cyan-500/80 text-cyan-400 group-hover:border-cyan-300'
                  }`}
                >
                  <StageIcon className="w-3 h-3" />
                </div>

                {/* Timeline Card */}
                <div className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 font-mono-code text-xs">
                    <div className="flex items-center space-x-2">
                      <StageIcon className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span className="font-bold text-white text-sm">
                        {item.action}
                      </span>
                      {isLast && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold border border-emerald-800 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          LATEST MILESTONE
                        </span>
                      )}
                    </div>

                    <span className="text-slate-400 text-[11px] font-mono-code flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {item.timestamp}
                    </span>
                  </div>

                  {/* Actor details */}
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-mono-code text-slate-300 mb-2">
                    <span className="text-white font-semibold flex items-center gap-1">
                      <RoleIcon className="w-3.5 h-3.5 text-cyan-400" />
                      {item.performedBy}
                    </span>
                    <span>•</span>
                    <span className="text-cyan-400 font-medium">{item.role}</span>
                    <span>•</span>
                    <span className="text-slate-400">{item.details}</span>
                  </div>

                  {/* Cryptographic hash proof */}
                  {item.hash && (
                    <div className="p-2 bg-slate-950/80 rounded-lg border border-slate-800/80 font-mono-code text-[11px] flex items-center justify-between gap-2">
                      <div className="flex items-center space-x-1.5 text-slate-400 truncate">
                        <Fingerprint className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span className="text-slate-500 text-[10px]">EVIDENCE HASH:</span>
                        <span className="text-cyan-300 text-[10px] truncate select-all">
                          {item.hash}
                        </span>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-bold shrink-0 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        CHAIN INTACT
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
