import React from 'react';
import {
  Shield,
  ShieldAlert,
  FolderLock,
  Plus,
  Cpu,
  ArrowRight,
  Eye,
  Lock,
  CheckCircle2,
  Clock,
  Briefcase,
  AlertTriangle,
  Zap,
  Network,
  Share2,
  Bot,
  Sparkles,
  Activity,
  Radio,
} from 'lucide-react';
import { FiveProblemCards } from './FiveProblemCards';
import { useSecurity } from '../context/SecurityContext';
import { SecureDocument } from '../types';
import { getLivePulseEvents } from '../services/aiIntelligence';

interface DashboardOverviewProps {
  onOpenDetails: (doc: SecureDocument) => void;
  onOpenSecurely: (doc: SecureDocument) => void;
  onOpenUpload: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  onOpenDetails,
  onOpenSecurely,
  onOpenUpload,
}) => {
  const {
    currentUser,
    documents,
    alerts,
    cases,
    securityLevel,
    setActivePage,
    runDemoScenario,
    currentRiskScore,
  } = useSecurity();

  const recentDocs = documents.slice(0, 4);
  const activeAlerts = alerts.filter((a) => a.status === 'ACTIVE').slice(0, 3);
  const livePulseEvents = getLivePulseEvents();

  return (
    <div className="space-y-6">
      {/* Top Welcome & Quick Actions Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono-code text-cyan-400 mb-1">
            <Shield className="w-4 h-4" />
            <span>CASE VAULT — DIGITAL EVIDENCE COMMAND CENTER</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-display text-white">
            FORENSIC INTELLIGENCE & ZERO-TRUST VAULT
          </h1>
          <p className="text-xs text-slate-400 font-mono-code mt-0.5">
            Clearance: <strong className="text-cyan-300">{currentUser?.clearanceLevel}</strong> | Role: <strong className="text-white">{currentUser?.role}</strong> | Dept: <strong className="text-slate-300">{currentUser?.department}</strong>
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2 font-mono-code text-xs">
          <button
            onClick={() => setActivePage('secure_upload')}
            className="py-2 px-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg hover:shadow-cyan-500/20 transition flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>10-STEP INGESTION PIPELINE</span>
          </button>

          <button
            onClick={() => setActivePage('ai_assistant')}
            className="py-2 px-3 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 text-cyan-300 font-bold rounded-xl transition flex items-center space-x-1.5"
          >
            <Bot className="w-4 h-4 text-cyan-400" />
            <span>ASK CASE VAULT</span>
          </button>

          <button
            onClick={() => setActivePage('adaptive_security')}
            className="py-2 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold rounded-xl transition flex items-center space-x-1.5"
          >
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>ADAPTIVE ENGINE</span>
          </button>
        </div>
      </div>

      {/* Live Evidence Pulse Telemetry Bar (Section 10) */}
      <div className="bg-slate-950/90 border border-slate-800/90 rounded-xl p-3 flex items-center space-x-3 overflow-hidden">
        <div className="flex items-center space-x-2 shrink-0 pr-3 border-r border-slate-800">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] font-mono-code font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
            <Radio className="w-3 h-3 text-emerald-400" />
            LIVE EVIDENCE PULSE
          </span>
        </div>

        <div className="flex items-center space-x-4 overflow-x-auto scrollbar-none font-mono-code text-[11px] text-slate-300 whitespace-nowrap">
          {livePulseEvents.map((event) => (
            <div key={event.id} className="flex items-center space-x-1.5">
              <span className="text-slate-500">[{event.timestamp}]</span>
              <span className="font-bold text-cyan-400">{event.event}</span>
              <span className="text-slate-400">({event.caseId}):</span>
              <span className="text-slate-200">{event.details}</span>
              <span className="text-slate-700 mx-2">•</span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Intelligence Modules Quick Launch Bento */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => setActivePage('cross_case')}
          className="p-4 rounded-xl bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:scale-105 transition">
              <Share2 className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-mono-code text-cyan-400 font-bold">RBAC-AWARE</span>
          </div>
          <h3 className="font-bold font-display text-white text-sm">Cross-Case Intelligence</h3>
          <p className="text-[11px] font-mono-code text-slate-400 mt-1">
            Discover hidden entity correlations, IMEI overlaps, and vehicle matches across closed & active dockets.
          </p>
        </div>

        <div
          onClick={() => setActivePage('evidence_graph')}
          className="p-4 rounded-xl bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 group-hover:scale-105 transition">
              <Network className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-mono-code text-blue-400 font-bold">TOPOLOGY</span>
          </div>
          <h3 className="font-bold font-display text-white text-sm">AI Evidence Graph</h3>
          <p className="text-[11px] font-mono-code text-slate-400 mt-1">
            Interactive visual network connecting suspects, seized devices, firearms, and forensic timelines.
          </p>
        </div>

        <div
          onClick={() => setActivePage('ai_intelligence')}
          className="p-4 rounded-xl bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 group-hover:scale-105 transition">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-mono-code text-purple-400 font-bold">RECONSTRUCT</span>
          </div>
          <h3 className="font-bold font-display text-white text-sm">AI Investigation Hub</h3>
          <p className="text-[11px] font-mono-code text-slate-400 mt-1">
            Incident reconstruction, contradiction detection between witness statements, and what-if simulation.
          </p>
        </div>

        <div
          onClick={() => setActivePage('encryption_portal')}
          className="p-4 rounded-xl bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-105 transition">
              <Lock className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-mono-code text-emerald-400 font-bold">AES-GCM 256</span>
          </div>
          <h3 className="font-bold font-display text-white text-sm">Encryption Portal</h3>
          <p className="text-[11px] font-mono-code text-slate-400 mt-1">
            Native cryptographic workbench: test live AES-GCM 256 bit encryption, decryptions, and SHA-256 seal verifications.
          </p>
        </div>
      </div>

      {/* Section 14: Five Problem Cards */}
      <FiveProblemCards />

      {/* Two Column Grid: Critical Alerts & Active Cases */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Security Threat & Alert Stream */}
        <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-mono-code font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-400" />
                ACTIVE SECURITY ALERTS & TELEMETRY ({activeAlerts.length})
              </h2>
              <button
                onClick={() => setActivePage('security_alerts')}
                className="text-[11px] font-mono-code text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-3">
              {activeAlerts.map((alert) => (
                <div
                  key={alert.id}
                  onClick={() => setActivePage('security_alerts')}
                  className="p-3 bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-red-500/40 rounded-xl cursor-pointer transition font-mono-code text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase border ${
                        alert.severity === 'CRITICAL'
                          ? 'bg-red-950 text-red-300 border-red-700'
                          : 'bg-amber-950 text-amber-300 border-amber-700'
                      }`}
                    >
                      {alert.severity}
                    </span>
                    <span className="text-[10px] text-slate-500">{alert.timestamp}</span>
                  </div>

                  <h3 className="font-bold text-white text-sm">{alert.title}</h3>
                  <p className="text-slate-300 text-[11px] line-clamp-1">{alert.description}</p>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800/80">
                    <span>Actor: <strong className="text-slate-300">{alert.user}</strong></span>
                    <span className="text-red-400 font-bold">Risk: {alert.riskScore}/100</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono-code text-slate-500 flex items-center justify-between">
            <span>SOC Telemetry: Online</span>
            <span className="text-cyan-400">Adaptive Threshold: {securityLevel}</span>
          </div>
        </div>

        {/* Right: Active Cases Dossiers */}
        <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-mono-code font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-cyan-400" />
                ACTIVE INVESTIGATION DOSSIERS
              </h2>
              <button
                onClick={() => setActivePage('cases')}
                className="text-[11px] font-mono-code text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <span>Full Timeline</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-3 font-mono-code text-xs">
              {cases.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setActivePage('cases')}
                  className="p-3 bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-cyan-500/40 rounded-xl cursor-pointer transition space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-cyan-400">{c.id}</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                      {c.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-white text-sm">{c.title}</h3>
                  <p className="text-slate-400 text-[11px]">{c.department} • Lead: {c.leadOfficer}</p>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800/80">
                    <span>Opened: {c.createdAt}</span>
                    <span className="text-emerald-400 font-semibold">{c.timeline.length} Custody Events</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono-code text-slate-500 flex items-center justify-between">
            <span>Judicial WAN Synced</span>
            <span className="text-emerald-400">✓ SHA-256 Ledger Verified</span>
          </div>
        </div>
      </div>

      {/* Recent Evidence Records (Table with quick actions) */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xs font-mono-code font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <FolderLock className="w-4 h-4 text-cyan-400" />
              RECENT CENTRALIZED EVIDENCE VAULT ENTRIES
            </h2>
            <p className="text-[11px] text-slate-500 font-mono-code mt-0.5">
              Encrypted at rest with AES-256-GCM. Double-click or click action to verify credentials.
            </p>
          </div>

          <button
            onClick={() => setActivePage('documents')}
            className="text-xs font-mono-code text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <span>All Documents</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {recentDocs.map((doc) => (
            <div
              key={doc.id}
              className={`p-4 rounded-xl border transition-all font-mono-code text-xs flex flex-col justify-between ${
                doc.isTampered
                  ? 'bg-red-950/20 border-red-500/60 glow-red'
                  : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold uppercase">
                    {doc.type}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 font-bold">
                    {doc.sensitivity}
                  </span>
                </div>

                <h3 className="font-bold text-white text-sm line-clamp-1 mb-1">{doc.title}</h3>
                <p className="text-[11px] text-slate-400 line-clamp-2 mb-2">{doc.contentSummary}</p>

                <div className="p-2 bg-slate-900 rounded-lg border border-slate-800/80 text-[10px] mb-3 flex items-center justify-between">
                  <span className="text-slate-500">SHA-256:</span>
                  <span className="text-cyan-300 truncate max-w-[200px]">{doc.currentHash}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80">
                <button
                  onClick={() => onOpenDetails(doc)}
                  className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] rounded-lg transition flex items-center justify-center space-x-1"
                >
                  <Eye className="w-3 h-3" />
                  <span>DETAILS</span>
                </button>
                <button
                  onClick={() => onOpenSecurely(doc)}
                  className="py-1.5 px-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-[11px] rounded-lg transition flex items-center justify-center space-x-1"
                >
                  <Lock className="w-3 h-3" />
                  <span>OPEN SECURELY</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
