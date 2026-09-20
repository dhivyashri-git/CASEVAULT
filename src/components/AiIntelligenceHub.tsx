import React, { useState } from 'react';
import {
  Sparkles,
  GitCommit,
  AlertTriangle,
  Link2,
  FileQuestion,
  Layers,
  CheckCircle2,
  Eye,
  Sliders,
  Scissors,
  FileText,
  Clock,
  Shield,
  ArrowRight,
  Info,
} from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';
import {
  getCaseReconstruction,
  getCaseContradictions,
  getCaseMissingLinks,
  runWhatIfSimulation,
  getRedactionSuggestions,
  getAIProviderStatus,
} from '../services/aiIntelligence';
import { WhatIfSimulationResult, RedactionSuggestion } from '../types';

export const AiIntelligenceHub: React.FC = () => {
  const { cases, documents } = useSecurity();
  const [activeTab, setActiveTab] = useState<
    'reconstruction' | 'contradictions' | 'missing_links' | 'what_if' | 'redaction' | 'brief'
  >('reconstruction');

  const selectedCaseId = 'CASE-1024';
  const selectedCase = cases.find((c) => c.id === selectedCaseId) || cases[0];
  const aiStatus = getAIProviderStatus();

  // Sub-features state
  const reconstructionItems = getCaseReconstruction(selectedCaseId);
  const contradictions = getCaseContradictions(selectedCaseId);
  const missingLinks = getCaseMissingLinks(selectedCaseId);

  // What-if state
  const [whatIfTarget, setWhatIfTarget] = useState<string>('EV-2048');
  const [whatIfResult, setWhatIfResult] = useState<WhatIfSimulationResult | null>(
    runWhatIfSimulation('EV-2048')
  );

  // Redaction state
  const [redactionSuggestions, setRedactionSuggestions] = useState<RedactionSuggestion[]>(
    getRedactionSuggestions('Sample deposition text')
  );
  const [redactedApplied, setRedactedApplied] = useState<boolean>(false);

  const toggleRedactionApproval = (id: string) => {
    setRedactionSuggestions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, approved: !s.approved } : s))
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <h1 className="text-xl font-bold font-display text-white tracking-wide">
                AI EVIDENCE & CASE INTELLIGENCE HUB
              </h1>
            </div>
            <p className="text-xs text-slate-400 font-mono-code mt-1.5 max-w-2xl">
              Automated evidentiary synthesis for {selectedCase?.id}: Fact vs. inference taxonomy, timeline
              discrepancy detection, missing link prediction, counterfactual what-if simulation, and PII redaction.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 font-mono-code text-[11px] font-semibold border border-slate-700 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{aiStatus.model}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('reconstruction')}
          className={`px-4 py-2 rounded-xl text-xs font-mono-code font-bold transition flex items-center space-x-2 ${
            activeTab === 'reconstruction'
              ? 'bg-cyan-500/15 text-cyan-200 border border-cyan-500/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <GitCommit className="w-4 h-4" />
          <span>Case Reconstruction</span>
        </button>

        <button
          onClick={() => setActiveTab('contradictions')}
          className={`px-4 py-2 rounded-xl text-xs font-mono-code font-bold transition flex items-center space-x-2 ${
            activeTab === 'contradictions'
              ? 'bg-amber-500/15 text-amber-200 border border-amber-500/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>Contradiction Detector</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-800">
            {contradictions.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('missing_links')}
          className={`px-4 py-2 rounded-xl text-xs font-mono-code font-bold transition flex items-center space-x-2 ${
            activeTab === 'missing_links'
              ? 'bg-blue-500/15 text-blue-200 border border-blue-500/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Link2 className="w-4 h-4 text-blue-400" />
          <span>Missing Links</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-950 text-blue-300 border border-blue-800">
            {missingLinks.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('what_if')}
          className={`px-4 py-2 rounded-xl text-xs font-mono-code font-bold transition flex items-center space-x-2 ${
            activeTab === 'what_if'
              ? 'bg-purple-500/15 text-purple-200 border border-purple-500/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Sliders className="w-4 h-4 text-purple-400" />
          <span>What-If Simulator</span>
        </button>

        <button
          onClick={() => setActiveTab('redaction')}
          className={`px-4 py-2 rounded-xl text-xs font-mono-code font-bold transition flex items-center space-x-2 ${
            activeTab === 'redaction'
              ? 'bg-emerald-500/15 text-emerald-200 border border-emerald-500/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Scissors className="w-4 h-4 text-emerald-400" />
          <span>AI Redaction Assistant</span>
        </button>

        <button
          onClick={() => setActiveTab('brief')}
          className={`px-4 py-2 rounded-xl text-xs font-mono-code font-bold transition flex items-center space-x-2 ${
            activeTab === 'brief'
              ? 'bg-cyan-500/15 text-cyan-200 border border-cyan-500/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Case Intelligence Brief</span>
        </button>
      </div>

      {/* 1. Case Reconstruction Tab */}
      {activeTab === 'reconstruction' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-mono-code text-slate-400">
            <span>SYNTHESIZED EVIDENTIARY CHRONOLOGY</span>
            <div className="flex items-center space-x-3">
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span>FACT (100% Proven)</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                <span>AI INFERENCE</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span>MISSING INFORMATION</span>
              </span>
            </div>
          </div>

          <div className="space-y-3 font-mono-code">
            {reconstructionItems.map((item, idx) => (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition ${
                  item.type === 'FACT'
                    ? 'bg-slate-900/80 border-slate-800'
                    : item.type === 'AI_INFERENCE'
                    ? 'bg-cyan-950/20 border-cyan-800/60'
                    : 'bg-amber-950/20 border-amber-800/60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        item.type === 'FACT'
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                          : item.type === 'AI_INFERENCE'
                          ? 'bg-cyan-950 text-cyan-300 border-cyan-800'
                          : 'bg-amber-950 text-amber-300 border-amber-800'
                      }`}
                    >
                      {item.type}
                    </span>
                    <span className="text-xs font-bold text-slate-200">{item.title}</span>
                  </div>
                  <span className="text-[11px] text-slate-400">{item.timestamp}</span>
                </div>

                <p className="text-xs text-slate-300 mb-2 leading-relaxed">{item.description}</p>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/60">
                  <span>Source: {item.sourceDoc}</span>
                  <span>Confidence: {item.confidence}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Contradiction Detector Tab */}
      {activeTab === 'contradictions' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-900/40 text-amber-200 text-xs font-mono-code flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold uppercase tracking-wider">
                CONTRADICTION DETECTOR: HUMAN SCRUTINY MANDATORY
              </p>
              <p className="text-slate-300 text-[11px] mt-0.5">
                The AI does not pronounce legal verdict on which record is true. Discrepancies are highlighted
                for judicial scrutiny.
              </p>
            </div>
          </div>

          {contradictions.map((c) => (
            <div key={c.id} className="bg-slate-900/80 border border-amber-800/60 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded bg-amber-950 text-amber-300 border border-amber-800 font-mono-code text-xs font-bold">
                  {c.conflictingField}
                </span>
                <span className="text-xs font-mono-code text-amber-400 font-bold">
                  Confidence: {c.confidence}% • Status: {c.status}
                </span>
              </div>

              {/* Side-by-side comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono-code text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-cyan-300">DOCUMENT A</span>
                    <span className="text-slate-500">{c.docA.time}</span>
                  </div>
                  <p className="font-semibold text-slate-200">{c.docA.title}</p>
                  <p className="p-2.5 rounded bg-slate-900 text-slate-300 italic border border-slate-800">
                    {c.docA.excerpt}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono-code text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-300">DOCUMENT B</span>
                    <span className="text-slate-500">{c.docB.time}</span>
                  </div>
                  <p className="font-semibold text-slate-200">{c.docB.title}</p>
                  <p className="p-2.5 rounded bg-slate-900 text-slate-300 italic border border-slate-800">
                    {c.docB.excerpt}
                  </p>
                </div>
              </div>

              <p className="text-xs font-mono-code text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <span className="text-amber-400 font-bold">AI Analytical Explanation: </span>
                {c.explanation}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* 3. Missing Links Tab */}
      {activeTab === 'missing_links' && (
        <div className="space-y-4 font-mono-code">
          {missingLinks.map((ml) => (
            <div key={ml.id} className="bg-slate-900/80 border border-blue-800/60 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="p-1.5 rounded bg-blue-950 text-blue-400 border border-blue-800">
                    <Link2 className="w-4 h-4" />
                  </span>
                  <h3 className="text-sm font-bold text-white">{ml.title}</h3>
                </div>
                <span className="px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800 text-[10px] font-bold">
                  {ml.urgency} URGENCY
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{ml.description}</p>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                <p>
                  <span className="text-slate-500">Referenced In:</span>{' '}
                  <span className="text-cyan-300">{ml.referencedInDoc}</span>
                </p>
                <p>
                  <span className="text-slate-500">Missing Evidence / Report:</span>{' '}
                  <span className="text-amber-300">{ml.missingItem}</span>
                </p>
                <p>
                  <span className="text-slate-500">Recommended Action:</span>{' '}
                  <span className="text-emerald-300">{ml.suggestedAction}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. What-If Evidence Simulator Tab */}
      {activeTab === 'what_if' && (
        <div className="space-y-4 font-mono-code">
          <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-900/40 text-purple-200 text-xs flex items-start space-x-3">
            <Sliders className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold uppercase tracking-wider">
                EVIDENTIARY IMPACT SIMULATOR (SIMULATION ONLY)
              </p>
              <p className="text-slate-300 text-[11px] mt-0.5">
                Simulate how hypothetical exclusion of specific evidence items shifts judicial admissibility,
                weakens related statutory charges, and alters timeline consistency.
              </p>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <span className="text-xs text-slate-400">Target Seizure to Simulate:</span>
                <select
                  value={whatIfTarget}
                  onChange={(e) => {
                    setWhatIfTarget(e.target.value);
                    setWhatIfResult(runWhatIfSimulation(e.target.value));
                  }}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                >
                  <option value="EV-2048">EV-2048 (Seized NVMe M.2 Storage Media)</option>
                  <option value="EV-9MM">EV-9MM (9mm Ballistic Projectile)</option>
                </select>
              </div>

              <span className="text-xs font-bold text-red-400 bg-red-950/50 px-2.5 py-1 rounded border border-red-800">
                Action: SIMULATE EXCLUSION / SUPPRESSION
              </span>
            </div>

            {whatIfResult && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block">Overall Evidentiary Impact</span>
                    <span className="text-red-400 font-bold text-lg">
                      {whatIfResult.confidenceDelta}% Admissibility
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block">Broken Entity Edges</span>
                    <span className="text-amber-400 font-bold text-lg">
                      {whatIfResult.brokenRelationshipsCount} Relationships Severed
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block">Affected Documents</span>
                    <span className="text-slate-200 font-bold text-lg">
                      {whatIfResult.affectedDocuments.length} Records Compromised
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-slate-300 uppercase">Documents Impaired:</h4>
                  <div className="space-y-1.5">
                    {whatIfResult.affectedDocuments.map((doc) => (
                      <div
                        key={doc.id}
                        className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-2"
                      >
                        <div>
                          <span className="font-bold text-slate-200">{doc.title}</span>
                          <p className="text-[11px] text-slate-400 mt-0.5">{doc.impact}</p>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800 shrink-0">
                          SEVERED
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-800/40 text-slate-300 leading-relaxed">
                  <span className="text-purple-400 font-bold block mb-1">Analytical Assessment:</span>
                  {whatIfResult.riskSummary}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. AI Redaction Assistant Tab */}
      {activeTab === 'redaction' && (
        <div className="space-y-4 font-mono-code text-xs">
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/40 text-emerald-200 flex items-start space-x-3">
            <Scissors className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold uppercase tracking-wider">
                AI REDACTION ASSISTANT: PRIVACY & WITNESS PROTECTION
              </p>
              <p className="text-slate-300 text-[11px] mt-0.5">
                Automatically identifies PII, residential addresses, and private mobile contacts in evidence depositions.
                Users review and approve redactions prior to cryptographic version sealing.
              </p>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-slate-200 uppercase">Detected Sensitive Fields for Review:</h3>

            <div className="space-y-2">
              {redactionSuggestions.map((s) => (
                <div
                  key={s.id}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-cyan-300">{s.textToRedact}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                        {s.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">{s.reason}</p>
                  </div>

                  <button
                    onClick={() => toggleRedactionApproval(s.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      s.approved
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {s.approved ? '✓ REDACTION APPROVED' : 'KEEP VISIBLE'}
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-slate-400 text-[11px]">
                {redactionSuggestions.filter((s) => s.approved).length} of {redactionSuggestions.length} items slated for redaction
              </span>
              <button
                onClick={() => setRedactedApplied(true)}
                className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition"
              >
                {redactedApplied ? '✓ REDACTED VERSION SEALED AS v2' : 'APPLY REDACTION & SEAL NEW VERSION'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Case Intelligence Brief Tab */}
      {activeTab === 'brief' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 font-mono-code text-xs space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <span className="text-slate-500">DOCKET INTELLIGENCE EXECUTIVE SUMMARY</span>
              <h2 className="text-base font-bold text-white mt-0.5">{selectedCase?.title}</h2>
            </div>
            <span className="px-2.5 py-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
              CLASSIFIED POLICE BRIEF
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-cyan-400 font-bold block">1. Executive Facts</span>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                Homicide investigation involving primary suspect Alok Verma, eyewitness Deepak Nair, and
                ballistic project evidence. 8 digital dockets lodged with unbroken cryptographic custody.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-amber-400 font-bold block">2. Critical Forensic Gaps</span>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                Missing Cyber extraction report for seized NVMe drive EV-2048 and an unresolved 45-minute
                discrepancy between eyewitness deposition and police sentry log.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
