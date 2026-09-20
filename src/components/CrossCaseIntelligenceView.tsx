import React, { useState } from 'react';
import {
  Share2,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Eye,
  Lock,
  Search,
  ExternalLink,
  ChevronRight,
  Info,
  Layers,
  Sparkles,
  Fingerprint,
} from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';
import { getCrossCaseMatches } from '../services/aiIntelligence';
import { CrossCaseMatch } from '../types';

export const CrossCaseIntelligenceView: React.FC = () => {
  const { currentUser } = useSecurity();
  const userClearance = currentUser?.clearanceLevel || 'INTERNAL';

  const [selectedCaseId, setSelectedCaseId] = useState<string>('CASE-1024');
  const [selectedMatch, setSelectedMatch] = useState<CrossCaseMatch | null>(null);
  const [minConfidence, setMinConfidence] = useState<number>(50);

  const matches = getCrossCaseMatches(selectedCaseId, userClearance).filter(
    (m) => m.matchPercentage >= minConfidence
  );

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400">
                <Share2 className="w-5 h-5" />
              </div>
              <h1 className="text-xl font-bold font-display text-white tracking-wide">
                AI CROSS-CASE INTELLIGENCE
              </h1>
            </div>
            <p className="text-xs text-slate-400 font-mono-code mt-1.5 max-w-2xl">
              Uncovers probabilistic entity relationships, aliases, telephone overlaps, and forensic ballistic
              links across authorized judicial dockets. AI discovery strictly enforces Need-To-Know statutory clearance.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded bg-blue-950 text-blue-300 border border-blue-800 font-mono-code text-[11px] font-semibold flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>CROSS-CORRELATION ENGINE</span>
            </span>
          </div>
        </div>
      </div>

      {/* Human Verification Notice & Statutory Constraint */}
      <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-900/40 text-amber-200 flex items-start space-x-3 text-xs font-mono-code">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-amber-300 uppercase tracking-wider">
            MANDATORY PROCEDURAL PROTOCOL: POTENTIAL MATCH — HUMAN VERIFICATION REQUIRED
          </p>
          <p className="text-slate-300 text-[11px]">
            Same name alone must NEVER be treated as conclusive legal proof that two records belong to the same person.
            Corroborate phone records, CCTV biometric analysis, and ballistics before judicial submission.
          </p>
        </div>
      </div>

      {/* Primary Docket Selector & Filtering */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <span className="text-xs font-mono-code text-slate-400 font-bold uppercase">Active Case Focus:</span>
          <span className="px-3 py-1.5 rounded-lg bg-cyan-950 text-cyan-200 border border-cyan-800 font-mono-code text-xs font-bold">
            CASE-1024 (State vs. Alok Verma)
          </span>
          <span className="text-xs font-mono-code text-slate-400">Target Entity:</span>
          <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-200 font-mono-code text-xs">
            Ravi Kumar (Alias: RK)
          </span>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono-code">
          <span className="text-slate-400">Min Match Confidence:</span>
          <input
            type="range"
            min="50"
            max="95"
            step="5"
            value={minConfidence}
            onChange={(e) => setMinConfidence(Number(e.target.value))}
            className="w-24 accent-cyan-500 cursor-pointer"
          />
          <span className="text-cyan-300 font-bold w-8">{minConfidence}%</span>
        </div>
      </div>

      {/* Matches Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {matches.map((match) => {
          const isRestricted = match.title.includes('RESTRICTED');
          const isSelected = selectedMatch?.caseId === match.caseId;

          return (
            <div
              key={match.caseId}
              onClick={() => setSelectedMatch(match)}
              className={`rounded-2xl border p-5 cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? 'bg-blue-950/30 border-blue-500 shadow-lg shadow-blue-950/50'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div>
                {/* Header info */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="font-mono-code text-xs font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
                    {match.caseId}
                  </span>
                  <div className="flex items-center space-x-1.5">
                    <span
                      className={`text-[10px] font-mono-code font-bold px-2 py-0.5 rounded border ${
                        match.clearanceRequired === 'TOP SECRET'
                          ? 'bg-red-950 text-red-300 border-red-800'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {match.clearanceRequired}
                    </span>
                    <span className="text-xs font-mono-code font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                      {match.matchPercentage}% MATCH
                    </span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-100 mb-1 leading-snug">
                  {match.title}
                </h3>
                <p className="text-[11px] text-slate-400 font-mono-code mb-4">
                  Category: {match.category} • Lead: {match.leadOfficer}
                </p>

                {/* Why this match? */}
                <div className="space-y-2 mb-4">
                  <div className="text-[11px] font-bold font-mono-code text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                    <Info className="w-3.5 h-3.5 text-blue-400" />
                    <span>WHY THIS MATCH?</span>
                  </div>
                  <ul className="space-y-1 text-[11px] font-mono-code text-slate-400">
                    {match.reasons.map((r, i) => (
                      <li key={i} className="flex items-start space-x-1.5">
                        <span className="text-blue-400 mt-0.5">•</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Correlated Entities */}
                <div className="space-y-1.5 mb-4">
                  <span className="text-[10px] font-bold font-mono-code text-slate-400 uppercase">
                    Overlapping Entities:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {match.matchedEntities.map((ent, i) => (
                      <span
                        key={i}
                        className={`text-[10px] font-mono-code px-2 py-0.5 rounded border ${
                          ent.type === 'RESTRICTED'
                            ? 'bg-red-950/40 text-red-300 border-red-900/60'
                            : 'bg-slate-950 text-slate-300 border-slate-800'
                        }`}
                      >
                        <span className="text-slate-500 mr-1">{ent.type}:</span>
                        {ent.value}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono-code">
                {isRestricted ? (
                  <span className="text-red-400 text-[11px] flex items-center space-x-1">
                    <Lock className="w-3.5 h-3.5" />
                    <span>ADDITIONAL CLEARANCE REQUIRED</span>
                  </span>
                ) : (
                  <span className="text-blue-400 text-[11px] flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>AUTHORIZED FOR SCRUTINY</span>
                  </span>
                )}
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Match Inspection Drawer/Card */}
      {selectedMatch && (
        <div className="bg-slate-900/95 border border-blue-500/40 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <span className="px-2.5 py-1 rounded bg-blue-950 text-blue-300 border border-blue-800 font-mono-code text-xs font-bold">
                {selectedMatch.caseId}
              </span>
              <h2 className="text-base font-bold text-white">{selectedMatch.title}</h2>
            </div>
            <button
              onClick={() => setSelectedMatch(null)}
              className="text-xs font-mono-code text-slate-400 hover:text-white"
            >
              CLOSE DETAILS
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono-code">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500 block">Lead Investigating Officer</span>
              <span className="text-slate-200 font-bold">{selectedMatch.leadOfficer}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500 block">Evidentiary Match Percentage</span>
              <span className="text-blue-400 font-bold text-sm">{selectedMatch.matchPercentage}% Calculated Correlation</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500 block">Clearance Status</span>
              <span className="text-emerald-400 font-bold">
                User Clearance ({userClearance}) vs Required ({selectedMatch.clearanceRequired})
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs font-mono-code">
            <h4 className="font-bold text-slate-300 uppercase tracking-wide">
              Cross-Case Forensic Corroboration Summary
            </h4>
            <p className="text-slate-400 leading-relaxed">
              AI cross-case analysis indicates a high degree of correlation between the weapon ballistic profile (9mm Parabellum)
              and telephone intercept registered under Ravi Kumar in CASE-1024 with the seized narcotics transport logs in {selectedMatch.caseId}.
              A joint investigative conference between Special Crime Branch and State Narcotics Bureau is recommended.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
