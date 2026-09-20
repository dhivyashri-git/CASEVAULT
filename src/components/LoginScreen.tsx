import React, { useState } from 'react';
import {
  Shield,
  Lock,
  User,
  KeyRound,
  Fingerprint,
  RotateCcw,
  Sparkles,
  FileCheck,
} from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';
import { DEMO_USERS } from '../data/mockData';
import { UserRole } from '../types';
import { getRoleIcon, getRoleTheme, ForensicFingerprintGraphic, ShieldVaultGraphic } from './ForensicVisuals';

interface LoginScreenProps {
  onRestartBoot?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onRestartBoot }) => {
  const { login } = useSecurity();
  const [username, setUsername] = useState('police');
  const [password, setPassword] = useState('police');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      login(username, password);
      setIsLoading(false);
    }, 450);
  };

  const handleSelectDemoUser = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
  };

  return (
    <div className="min-h-screen bg-[#030712] bg-security-grid text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Rings & Scanning line */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] border border-cyan-500/10 rounded-full pointer-events-none animate-radar" />
      <div className="absolute inset-0 scanline-overlay pointer-events-none opacity-40" />

      {/* Top Bar System Indicator */}
      <div className="absolute top-4 left-6 right-6 flex items-center justify-between text-xs font-mono-code text-slate-400">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-400 font-semibold tracking-wider">GATEWAY SECURE</span>
          <span className="hidden sm:inline text-slate-600">| TLS 1.3 / AES-256-GCM / SHA-256</span>
        </div>
        {onRestartBoot && (
          <button
            onClick={onRestartBoot}
            className="flex items-center space-x-1.5 text-slate-400 hover:text-cyan-400 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="text-[11px]">Re-run Boot Sequence</span>
          </button>
        )}
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10 my-8">
        {/* Left Column: Login Form */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl glow-cyan relative overflow-hidden">
          {/* Subtle background forensic watermark */}
          <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
            <ForensicFingerprintGraphic className="w-48 h-48" scanning={false} />
          </div>

          {/* Brand Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3.5">
              <div className="p-3 bg-cyan-500/10 border border-cyan-500/40 rounded-xl text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
                <Shield className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl font-bold font-display tracking-wider text-white">
                    CASEVAULT
                  </h1>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono-code border border-cyan-500/30">
                    GOV PORTAL
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono-code mt-0.5">
                  Secure Digital Document & Evidence Intelligence Platform
                </p>
              </div>
            </div>

            {/* Forensic Mini Scan Graphic */}
            <div className="hidden sm:block">
              <ForensicFingerprintGraphic className="w-12 h-12" scanning={true} />
            </div>
          </div>

          <div className="mb-6 p-3 bg-cyan-950/30 border border-cyan-500/20 rounded-lg text-xs font-mono-code text-cyan-300 flex items-center justify-between">
            <div>
              <span className="font-bold text-cyan-200">RESTRICTED ACCESS: </span>
              Law Enforcement, Judicial Registry, Prosecution & CFSL Forensic Personnel Only.
            </div>
            <Lock className="w-4 h-4 text-cyan-400/80 shrink-0 ml-2" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono-code text-slate-300 mb-1.5 uppercase tracking-wider">
                Government ID / Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username (e.g. police, admin, legal)"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-lg text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono-code transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono-code text-slate-300 mb-1.5 uppercase tracking-wider">
                Cryptographic Passcode / Credentials
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-lg text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono-code transition"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono-code text-sm font-semibold rounded-lg shadow-lg hover:shadow-cyan-500/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>VERIFYING CLEARANCE & ATTESTATION...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>AUTHENTICATE SECURE SESSION</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Prompt Specification Notice */}
          <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] font-mono-code text-slate-500 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3 text-cyan-400" /> NO PUBLIC SIGNUP
            </span>
            <span className="flex items-center gap-1">
              <Fingerprint className="w-3 h-3 text-cyan-400" /> GOV-HSM ATTESTED
            </span>
            <span className="flex items-center gap-1">
              <FileCheck className="w-3 h-3 text-emerald-400" /> TAMPER AUDITED
            </span>
          </div>
        </div>

        {/* Right Column: Pre-configured Demo Accounts */}
        <div className="lg:col-span-5 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold font-display text-cyan-300 tracking-wider flex items-center gap-1.5">
                <Fingerprint className="w-4 h-4" /> PREDEFINED DEMO ACCOUNTS
              </h2>
              <span className="text-[10px] text-slate-400 font-mono-code">
                Click to Auto-Fill
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-4 leading-relaxed font-mono-code">
              Select an authorized government credential below to test role-based access, session timeouts, and security policies.
            </p>

            {/* List of 6 Demo Accounts with designated role icons */}
            <div className="space-y-2.5">
              {DEMO_USERS.map((user) => {
                const isSelected = username === user.username;
                const RoleIcon = getRoleIcon(user.role);
                const roleTheme = getRoleTheme(user.role);

                return (
                  <button
                    key={user.username}
                    type="button"
                    onClick={() => handleSelectDemoUser(user.username, user.password || '')}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all duration-200 flex items-center justify-between ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-400 ring-1 ring-cyan-400/50 shadow-sm'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-semibold text-white">{user.name}</span>
                        {isSelected && (
                          <span className="text-[10px] text-cyan-400 font-mono-code flex items-center gap-0.5">
                            <Sparkles className="w-3 h-3" /> Selected
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 mt-0.5 text-[11px] font-mono-code text-slate-400">
                        <span>User: <strong className="text-slate-200">"{user.username}"</strong></span>
                        <span>•</span>
                        <span>Pass: <strong className="text-slate-200">"{user.password}"</strong></span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`inline-flex items-center space-x-1 text-[10px] px-2 py-0.5 rounded font-mono-code font-bold uppercase border ${roleTheme.badge}`}>
                        <RoleIcon className="w-3 h-3 shrink-0" />
                        <span>{user.role}</span>
                      </span>
                      <div className="text-[9px] text-slate-400 font-mono-code mt-0.5">
                        {user.sessionTimeoutSeconds === 0 ? (
                          <span className="text-cyan-300 font-semibold">NO LIMIT TIME</span>
                        ) : (
                          <span>{user.sessionTimeoutSeconds}s timeout</span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] font-mono-code text-slate-500 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-red-400 shrink-0" />
            <span>
              Tip: Try invalid credentials to trigger the animated <strong className="text-red-400">Unauthorized Access Incident Modal</strong>.
            </span>
          </div>
        </div>
      </div>

      {/* Tagline Footer */}
      <footer className="mt-auto pt-4 text-center text-xs font-mono-code text-slate-500 tracking-wider">
        “Every Document Protected. Every Access Verified. Every Action Traceable.”
      </footer>
    </div>
  );
};
