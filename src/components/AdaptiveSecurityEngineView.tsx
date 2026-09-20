import React, { useState } from 'react';
import {
  Cpu,
  Shield,
  ShieldAlert,
  Fingerprint,
  AlertTriangle,
  Lock,
  UserCheck,
  Clock,
  ArrowRight,
  Activity,
  Layers,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';
import { SecurityLevelType, SensitivityLevel } from '../types';
import { evaluateRisk } from '../services/securityEngine';

export const AdaptiveSecurityEngineView: React.FC = () => {
  const {
    currentUser,
    securityLevel,
    recentConfidentialAccessCount,
    failedLoginAttempts,
    documents,
    runDemoScenario,
  } = useSecurity();

  // Test simulation overrides
  const [overrideConfidentialCount, setOverrideConfidentialCount] = useState<number>(recentConfidentialAccessCount);
  const [overrideFailedLogins, setOverrideFailedLogins] = useState<number>(failedLoginAttempts);
  const [overrideSensitivity, setOverrideSensitivity] = useState<SensitivityLevel>('CONFIDENTIAL');
  const [overrideTamperFlag, setOverrideTamperFlag] = useState<boolean>(
    documents.some((d) => d.isTampered)
  );
  const [overrideGeofence, setOverrideGeofence] = useState<boolean>(false);

  // Compute risk score in real time based on active or slider values
  const riskResult = evaluateRisk({
    userRole: currentUser?.role || 'INVESTIGATOR',
    documentSensitivity: overrideSensitivity,
    recentConfidentialAccessCount: overrideConfidentialCount,
    failedLoginAttempts: overrideFailedLogins,
    isDocumentTampered: overrideTamperFlag,
    isOutsideGeofence: overrideGeofence,
  });

  const getLevelBadge = (level: SecurityLevelType) => {
    switch (level) {
      case 'LEVEL 1 — NORMAL':
        return {
          title: 'LEVEL 1 — NORMAL',
          color: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/20',
          dot: 'bg-emerald-400',
          desc: 'Normal user behaviour. Access granted with Password + RBAC verification.',
        };
      case 'LEVEL 2 — ELEVATED':
        return {
          title: 'LEVEL 2 — ELEVATED',
          color: 'text-blue-400 border-blue-500/40 bg-blue-950/20',
          dot: 'bg-blue-400',
          desc: 'Suspicious access pattern detected. Password + RBAC + Step-Up Biometric Authentication.',
        };
      case 'LEVEL 3 — RESTRICTED':
        return {
          title: 'LEVEL 3 — RESTRICTED',
          color: 'text-amber-400 border-amber-500/40 bg-amber-950/20',
          dot: 'bg-amber-400 animate-pulse',
          desc: 'Integrity warning / rapid confidential querying. Additional Verification + Integrity Check + Restricted sensitive actions.',
        };
      case 'LEVEL 4 — CRITICAL':
        return {
          title: 'LEVEL 4 — CRITICAL',
          color: 'text-red-400 border-red-500/50 bg-red-950/30',
          dot: 'bg-red-400 animate-ping',
          desc: 'High-risk or tampered behavior. BLOCK SENSITIVE ACTION + SECURITY ALERT + AUDIT EVENT + ADMIN REVIEW.',
        };
    }
  };

  const currentLevelBadge = getLevelBadge(riskResult.securityLevel);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden shadow-lg glow-cyan">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 text-xs font-mono-code mb-1">
              <Cpu className="w-4 h-4" />
              <span>PRIMARY INNOVATION ENGINE</span>
            </div>
            <h1 className="text-2xl font-bold font-display text-white">
              ADAPTIVE DOCUMENT SECURITY ENGINE
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Dynamically evaluates user role, document sensitivity, session context, access velocity, and cryptographic integrity to calibrate real-time security thresholds.
            </p>
          </div>

          {/* Current Dynamic Level Pill */}
          <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center space-x-4 shrink-0">
            <div className="text-right">
              <span className="text-[10px] font-mono-code text-slate-400 uppercase tracking-wider block">
                CURRENT EVALUATED STATE
              </span>
              <span className={`text-sm font-bold font-mono-code ${currentLevelBadge.color}`}>
                {riskResult.securityLevel}
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center font-display font-bold text-lg text-white">
              <span className={riskResult.riskScore > 75 ? 'text-red-400' : riskResult.riskScore > 40 ? 'text-amber-400' : 'text-emerald-400'}>
                {riskResult.riskScore}
              </span>
            </div>
          </div>
        </div>

        {/* Formula Diagram Flow */}
        <div className="mt-6 pt-5 border-t border-slate-800/90">
          <div className="text-[11px] font-mono-code text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            ENGINE DECISION FORMULA ARCHITECTURE
          </div>
          <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl overflow-x-auto text-xs font-mono-code text-slate-300 flex items-center justify-between gap-2">
            <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-cyan-300">USER ({currentUser?.name?.split(' ')[0] || 'Officer'})</span>
            <span>+</span>
            <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-blue-300">ROLE ({currentUser?.role || 'INVESTIGATOR'})</span>
            <span>+</span>
            <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-purple-300">SENSITIVITY ({overrideSensitivity})</span>
            <span>+</span>
            <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-emerald-300">SESSION CONTEXT</span>
            <span>+</span>
            <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-amber-300">ACCESS VELOCITY</span>
            <span>+</span>
            <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-red-300">HASH INTEGRITY</span>
            <ArrowRight className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="px-3 py-1 rounded bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 font-bold">
              RISK ENGINE ({riskResult.riskScore}/100)
            </span>
            <ArrowRight className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className={`px-3 py-1 rounded border font-bold ${currentLevelBadge.color}`}>
              {riskResult.securityLevel}
            </span>
          </div>
        </div>
      </div>

      {/* Demo Scenario Launchers (Section 28) */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-mono-code font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            ONE-CLICK ADAPTIVE SCENARIOS (SECTION 28)
          </h2>
          <span className="text-[11px] font-mono-code text-slate-400">
            Simulate end-to-end policy execution
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Scenario A */}
          <button
            onClick={() => runDemoScenario('normal')}
            className="p-3 rounded-lg border border-emerald-500/30 bg-emerald-950/10 hover:bg-emerald-950/30 text-left transition group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold font-mono-code text-emerald-400">
                SCENARIO A — NORMAL
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                LOW RISK
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              Police Officer → FIR → RBAC Pass → Risk Low (Score 10) → Frictionless Access.
            </p>
            <div className="mt-2 text-[10px] font-mono-code text-emerald-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Execute Normal Flow →</span>
            </div>
          </button>

          {/* Scenario B */}
          <button
            onClick={() => runDemoScenario('suspicious')}
            className="p-3 rounded-lg border border-amber-500/30 bg-amber-950/10 hover:bg-amber-950/30 text-left transition group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold font-mono-code text-amber-400">
                SCENARIO B — SUSPICIOUS
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-800">
                RISK 82/100
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              Investigator → 12 Confidential Docs in 30s → Velocity Anomaly → Step-Up Biometric Required.
            </p>
            <div className="mt-2 text-[10px] font-mono-code text-amber-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Trigger Anomaly Escalation →</span>
            </div>
          </button>

          {/* Scenario C */}
          <button
            onClick={() => runDemoScenario('critical')}
            className="p-3 rounded-lg border border-red-500/30 bg-red-950/10 hover:bg-red-950/30 text-left transition group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold font-mono-code text-red-400">
                SCENARIO C — CRITICAL
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-red-950 text-red-300 border border-red-800 animate-pulse">
                RISK 95/100
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              Repeated failed logins + Byte Tampering → Block sensitive action → Security Alert → Admin Review.
            </p>
            <div className="mt-2 text-[10px] font-mono-code text-red-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Simulate Critical Lockdown →</span>
            </div>
          </button>
        </div>
      </div>

      {/* Interactive Simulation Tuning & Explainable Factors */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Tuning Panel */}
        <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-xl p-5">
          <h2 className="text-xs font-mono-code font-bold uppercase tracking-wider text-cyan-400 mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4" />
            REAL-TIME PARAMETER TUNING
          </h2>

          <div className="space-y-4 text-xs font-mono-code">
            {/* Target Sensitivity */}
            <div>
              <div className="flex justify-between text-slate-300 mb-1.5">
                <span>Document Sensitivity Level:</span>
                <span className="font-bold text-cyan-300">{overrideSensitivity}</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {(['PUBLIC', 'INTERNAL', 'CONFIDENTIAL', 'HIGHLY CONFIDENTIAL'] as SensitivityLevel[]).map(
                  (s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setOverrideSensitivity(s)}
                      className={`py-1.5 px-2 rounded border text-[10px] font-bold uppercase transition ${
                        overrideSensitivity === s
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                          : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {s.replace('HIGHLY CONFIDENTIAL', 'HIGHLY CONF')}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Confidential Access Velocity Slider */}
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Recent Confidential Accesses (30s Window):</span>
                <span className={`font-bold ${overrideConfidentialCount >= 10 ? 'text-red-400' : 'text-cyan-300'}`}>
                  {overrideConfidentialCount} documents
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="20"
                value={overrideConfidentialCount}
                onChange={(e) => setOverrideConfidentialCount(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                <span>0 (Normal baseline)</span>
                <span>10+ (Anomaly threshold)</span>
                <span>20 (Mass harvest)</span>
              </div>
            </div>

            {/* Failed Login Attempts Slider */}
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Subnet Failed Authentication Events:</span>
                <span className={`font-bold ${overrideFailedLogins >= 3 ? 'text-red-400' : 'text-cyan-300'}`}>
                  {overrideFailedLogins} attempts
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="6"
                value={overrideFailedLogins}
                onChange={(e) => setOverrideFailedLogins(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* Tampering & Geofence Toggles */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setOverrideTamperFlag(!overrideTamperFlag)}
                className={`p-2.5 rounded-lg border text-left flex items-center justify-between transition ${
                  overrideTamperFlag
                    ? 'bg-red-950/60 border-red-500/70 text-red-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div>
                  <span className="block font-bold">Document Tampering</span>
                  <span className="text-[10px] text-slate-500">Hash Mismatch</span>
                </div>
                <span className={`text-[11px] font-bold ${overrideTamperFlag ? 'text-red-400' : 'text-slate-600'}`}>
                  {overrideTamperFlag ? 'ON' : 'OFF'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setOverrideGeofence(!overrideGeofence)}
                className={`p-2.5 rounded-lg border text-left flex items-center justify-between transition ${
                  overrideGeofence
                    ? 'bg-amber-950/60 border-amber-500/70 text-amber-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div>
                  <span className="block font-bold">Outside Geofence</span>
                  <span className="text-[10px] text-slate-500">Unapproved Subnet</span>
                </div>
                <span className={`text-[11px] font-bold ${overrideGeofence ? 'text-amber-400' : 'text-slate-600'}`}>
                  {overrideGeofence ? 'ON' : 'OFF'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Explainable Decision & 4 Security Levels */}
        <div className="lg:col-span-6 space-y-4">
          {/* Explainable Security Assessment */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
            <h2 className="text-xs font-mono-code font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-cyan-400" />
              EXPLAINABLE RISK AUDIT
            </h2>

            <div className="space-y-2 mb-4">
              {riskResult.reasons.length === 0 ? (
                <div className="p-2.5 bg-emerald-950/20 border border-emerald-500/20 rounded-lg text-xs font-mono-code text-emerald-300 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <span>Access metrics conform to standard operational baseline. Zero anomalies detected.</span>
                </div>
              ) : (
                riskResult.reasons.map((r, i) => (
                  <div
                    key={i}
                    className="p-2 bg-slate-950 border border-slate-800/80 rounded text-xs font-mono-code text-slate-300 flex items-center justify-between"
                  >
                    <span>• {r}</span>
                    <span className="text-[10px] text-amber-400 font-bold">+Risk</span>
                  </div>
                ))
              )}
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono-code">
              <span className="text-slate-400 block mb-1">Recommended System Response:</span>
              <span className="text-cyan-300 font-bold">{riskResult.recommendedAction}</span>
            </div>
          </div>

          {/* 4 Security Levels Specification (Section 23) */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-2">
            <span className="text-[10px] font-mono-code uppercase text-slate-500 font-bold tracking-wider block">
              ADAPTIVE SECURITY TIER MATRIX
            </span>

            {(['LEVEL 1 — NORMAL', 'LEVEL 2 — ELEVATED', 'LEVEL 3 — RESTRICTED', 'LEVEL 4 — CRITICAL'] as SecurityLevelType[]).map(
              (lvl) => {
                const isSelected = riskResult.securityLevel === lvl;
                const b = getLevelBadge(lvl);

                return (
                  <div
                    key={lvl}
                    className={`p-2.5 rounded-lg border text-xs font-mono-code transition-all ${
                      isSelected
                        ? `${b.color} ring-1 ring-cyan-500/50`
                        : 'bg-slate-950/40 border-slate-800/60 text-slate-500 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className={`w-2 h-2 rounded-full ${b.dot}`} />
                        <span className="font-bold">{lvl}</span>
                      </div>
                      {isSelected && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300">
                          CURRENT TIER
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-300 mt-1 pl-4 leading-relaxed">
                      {b.desc}
                    </p>
                  </div>
                );
              }
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
