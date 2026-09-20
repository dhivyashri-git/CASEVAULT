import React from 'react';
import { ShieldX, Clock, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';

export const SessionExpiredModal: React.FC = () => {
  const { isSessionExpired, logout } = useSecurity();

  if (!isSessionExpired) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-950 border-2 border-amber-500/80 rounded-2xl p-6 sm:p-8 shadow-2xl glow-amber text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center text-amber-400">
          <Clock className="w-8 h-8 animate-pulse" />
        </div>

        <div className="inline-block px-3 py-0.5 rounded bg-amber-500/20 text-amber-400 text-xs font-mono-code font-bold uppercase tracking-wider border border-amber-500/30 mb-2">
          SESSION EXPIRED
        </div>

        <h2 className="text-xl font-bold font-display text-white mb-2">
          SECURE TIMEOUT REACHED
        </h2>

        <p className="text-sm text-slate-300 mb-6 leading-relaxed">
          Your secure session has expired due to government credential inactivity policy. Protected in-memory cache has been sanitized. Please authenticate again.
        </p>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-[11px] font-mono-code text-slate-400 mb-6">
          <span className="text-amber-400 font-bold">NOTE: </span>
          Frontend demo implementation with role-specific timers (e.g. Police Officer 30s). Production enforces server-side token revocation and mutual TLS invalidation.
        </div>

        <button
          onClick={logout}
          className="w-full py-3 px-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-mono-code text-sm font-semibold rounded-lg shadow-lg hover:shadow-amber-500/20 transition-all flex items-center justify-center space-x-2"
        >
          <Lock className="w-4 h-4" />
          <span>LOGIN AGAIN</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export const AccessRestrictedModal: React.FC = () => {
  const { accessRestrictedModal, clearAccessRestrictedModal } = useSecurity();

  if (!accessRestrictedModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-slate-950 border-2 border-red-500/70 rounded-2xl p-6 sm:p-8 shadow-2xl glow-red">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-red-950/60 border border-red-500/50 rounded-xl text-red-400">
            <ShieldX className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-red-500/20 text-red-400 font-mono-code font-bold uppercase tracking-wider border border-red-500/30">
              RBAC ENFORCEMENT
            </span>
            <h3 className="text-lg font-bold font-display text-white mt-1">
              ACCESS RESTRICTED
            </h3>
          </div>
        </div>

        <p className="text-sm text-slate-200 mb-4 bg-red-950/30 border border-red-900/40 p-3 rounded-lg">
          You do not have permission to access this resource or perform this action.
        </p>

        <div className="space-y-2 bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs font-mono-code text-slate-400 mb-6">
          <div className="flex justify-between">
            <span className="text-slate-500">Target Action:</span>
            <span className="text-slate-200 font-semibold">{accessRestrictedModal.attemptedAction}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Security Policy:</span>
            <span className="text-red-400">Clearance Mismatch</span>
          </div>
          <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>An immutable audit security event has been logged.</span>
          </div>
        </div>

        <button
          onClick={clearAccessRestrictedModal}
          className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono-code text-xs font-semibold rounded-lg transition"
        >
          [ DISMISS ]
        </button>
      </div>
    </div>
  );
};
