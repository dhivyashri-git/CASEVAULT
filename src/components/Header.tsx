import React from 'react';
import {
  Shield,
  ShieldAlert,
  Clock,
  LogOut,
  RefreshCw,
  Cpu,
  Database,
  CheckCircle,
  FileCheck,
  Activity,
  Layers,
  Lock,
} from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';
import { getRoleIcon, getRoleTheme } from './ForensicVisuals';

interface HeaderProps {
  onOpenDemoSimulation?: () => void;
  onOpenCopilot?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenDemoSimulation, onOpenCopilot }) => {
  const {
    currentUser,
    logout,
    sessionSecondsRemaining,
    isSessionExpiringSoon,
    resetSessionTimer,
    hasActiveAlert,
    securityLevel,
  } = useSecurity();

  if (!currentUser) return null;

  const RoleIcon = getRoleIcon(currentUser.role);
  const roleTheme = getRoleTheme(currentUser.role);

  // Format seconds to mm:ss
  const minutes = Math.floor(sessionSecondsRemaining / 60);
  const seconds = sessionSecondsRemaining % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const getSecurityBadge = () => {
    if (hasActiveAlert || securityLevel === 'LEVEL 4 — CRITICAL') {
      return {
        text: 'CRITICAL ALERT',
        bg: 'bg-red-950/70 border-red-500/60 text-red-300 animate-alert-pulse',
        dot: 'bg-red-400 animate-ping',
        icon: ShieldAlert,
      };
    }
    if (securityLevel === 'LEVEL 2 — ELEVATED' || securityLevel === 'LEVEL 3 — RESTRICTED') {
      return {
        text: 'ELEVATED RISK',
        bg: 'bg-amber-950/60 border-amber-500/50 text-amber-300',
        dot: 'bg-amber-400 animate-pulse',
        icon: ShieldAlert,
      };
    }
    return {
      text: 'SYSTEM SECURE',
      bg: 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300',
      dot: 'bg-emerald-400',
      icon: Shield,
    };
  };

  const statusBadge = getSecurityBadge();
  const StatusIcon = statusBadge.icon;

  return (
    <header className="sticky top-0 z-30 bg-slate-950/90 border-b border-slate-800 backdrop-blur-md px-4 sm:px-6 py-2.5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Brand & Authenticated User Context */}
        <div className="flex items-center space-x-3.5">
          <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-cyan-400 shrink-0 shadow-[0_0_10px_rgba(6,182,212,0.15)]">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-base font-bold font-display tracking-wider text-white">
                CASEVAULT
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 font-mono-code border border-cyan-800">
                GOV-SEC
              </span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-slate-400">
              <span className="text-slate-200 font-medium">{currentUser.name}</span>
              <span>•</span>
              <span className={`inline-flex items-center space-x-1 font-mono-code uppercase font-semibold text-[11px] px-1.5 py-0.5 rounded border ${roleTheme.badge}`}>
                <RoleIcon className="w-3 h-3 shrink-0" />
                <span>{currentUser.role}</span>
              </span>
              <span>•</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono-code font-bold border border-slate-700">
                {currentUser.clearanceLevel}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Global Micro-Indicators (Section 13) */}
        <div className="hidden xl:flex items-center space-x-3 bg-slate-900/80 border border-slate-800/80 px-3 py-1.5 rounded-lg text-[11px] font-mono-code">
          <div className="flex items-center space-x-1 text-slate-300">
            <Database className="w-3 h-3 text-cyan-400" />
            <span>Encrypted Storage</span>
            <span className="text-emerald-400 font-bold">✓</span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center space-x-1 text-slate-300">
            <CheckCircle className="w-3 h-3 text-cyan-400" />
            <span>Integrity Monitoring</span>
            <span className="text-emerald-400 font-bold">✓</span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center space-x-1 text-slate-300">
            <Activity className="w-3 h-3 text-cyan-400" />
            <span>Audit</span>
            <span className="text-emerald-400 font-bold">✓</span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center space-x-1 text-slate-300">
            <Clock className="w-3 h-3 text-cyan-400" />
            <span>Session</span>
            <span className="text-emerald-400 font-bold">✓</span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center space-x-1">
            <Cpu className="w-3 h-3 text-cyan-400" />
            <span className="text-slate-300">Adaptive Security:</span>
            <span className={`font-bold ${
              securityLevel === 'LEVEL 1 — NORMAL' ? 'text-emerald-400' : 'text-amber-400 animate-pulse'
            }`}>
              {securityLevel.split('—')[1] || 'ACTIVE'}
            </span>
          </div>
        </div>

        {/* Right: Security Status Pill & Session Timer */}
        <div className="flex items-center space-x-2.5">
          {/* Hackathon Demo Storyline Trigger */}
          {onOpenDemoSimulation && (
            <button
              onClick={onOpenDemoSimulation}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-mono-code text-xs font-bold transition shadow-md shadow-amber-950/40"
              title="Run 1-Click Interactive Attack & Adaptive Security Scenario"
            >
              <span>⚡</span>
              <span className="hidden sm:inline">HACKATHON DEMO FLOW</span>
              <span className="sm:hidden">DEMO</span>
            </button>
          )}

          {/* Global Security State Pill */}
          <div
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border text-xs font-mono-code font-bold ${statusBadge.bg}`}
          >
            <span className={`w-2 h-2 rounded-full ${statusBadge.dot}`} />
            <StatusIcon className="w-3.5 h-3.5" />
            <span>{statusBadge.text}</span>
          </div>

          {/* Session Timer (ADMIN: NO LIMIT TIME, OTHERS: 30 SEC) */}
          {currentUser.role === 'ADMIN' || currentUser.sessionTimeoutSeconds === 0 ? (
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg border font-mono-code text-xs bg-slate-900/90 border-cyan-500/40 text-cyan-300 shadow-sm">
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <div>
                <span className="text-slate-400 hidden sm:inline mr-1">ADMIN SESSION:</span>
                <span className="font-bold text-white tracking-wider">NO LIMIT TIME</span>
              </div>
            </div>
          ) : (
            <div
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border font-mono-code text-xs transition-colors ${
                isSessionExpiringSoon
                  ? 'bg-red-950/70 border-red-500/80 text-red-300 animate-alert-pulse'
                  : 'bg-slate-900 border-slate-700 text-slate-300'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <div>
                {isSessionExpiringSoon ? (
                  <span className="font-bold text-red-400 mr-1">⚠ EXPIRING:</span>
                ) : (
                  <span className="text-slate-400 hidden sm:inline mr-1">SESSION:</span>
                )}
                <span className="font-bold text-white tracking-wider">{formattedTime}</span>
              </div>

              <button
                onClick={resetSessionTimer}
                title="Extend / Reset 30s Session Timer"
                className="ml-1 p-0.5 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 rounded transition"
              >
                <RefreshCw className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Logout Button */}
          <button
            onClick={logout}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 hover:bg-red-950/50 hover:border-red-500/40 text-slate-300 hover:text-red-300 border border-slate-700 rounded-lg text-xs font-mono-code transition"
            title="Terminate Active Session"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">LOGOUT</span>
          </button>
        </div>
      </div>

      {/* Demo Session Notice Pill */}
      <div className="mt-1 flex items-center justify-between text-[10px] font-mono-code text-slate-500 border-t border-slate-800/60 pt-1">
        <span>
          Clearance Level: <strong className="text-cyan-400">{currentUser.clearanceLevel}</strong> | Session policy:{' '}
          <strong className="text-slate-300">
            {currentUser.role === 'ADMIN' || currentUser.sessionTimeoutSeconds === 0
              ? 'NO LIMIT TIME (Permanent)'
              : '30s timeout (Auto-Logout)'}
          </strong>
        </span>
        <span className="hidden md:inline text-slate-600">
          [Digital Evidence Vault Policy — Enforced Session Safeguards]
        </span>
      </div>
    </header>
  );
};
