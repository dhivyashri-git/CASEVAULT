import React from 'react';
import { ShieldAlert, AlertOctagon, MapPin, Globe, Laptop, Clock, X, Hash } from 'lucide-react';
import { FailedLoginIncident } from '../types';

interface UnauthorizedModalProps {
  data: FailedLoginIncident | null;
  onClose: () => void;
}

export const UnauthorizedModal: React.FC<UnauthorizedModalProps> = ({ data, onClose }) => {
  if (!data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-950 border-2 border-red-500/80 rounded-xl p-6 md:p-8 shadow-2xl glow-red overflow-hidden">
        {/* Warning Accent Banner */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-amber-500 to-red-600 animate-pulse" />

        {/* Header with Red Warning Pulse */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-center space-x-3.5">
            <div className="relative p-3 bg-red-950/60 border border-red-500/50 rounded-xl text-red-400 shrink-0">
              <ShieldAlert className="w-8 h-8 animate-bounce" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600" />
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 text-[11px] font-mono-code font-bold uppercase tracking-wider border border-red-500/30">
                  STATUS: BLOCKED
                </span>
                <span className="text-xs text-slate-400 font-mono-code">
                  ATTEMPT #{data.attemptNumber}
                </span>
              </div>
              <h2 className="text-lg md:text-xl font-bold font-display text-white mt-1">
                ⚠ UNAUTHORIZED ACCESS DETECTED
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message */}
        <p className="text-sm text-slate-300 mb-6 bg-red-950/30 border border-red-500/20 p-3.5 rounded-lg leading-relaxed">
          “Unknown or invalid credentials detected. Access has been denied and the incident has been recorded in the immutable audit ledger.”
        </p>

        {/* Technical Incident Dossier Grid */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-4 mb-6 space-y-3 font-mono-code text-xs">
          <div className="flex items-center justify-between py-1 border-b border-slate-800/80">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-red-400" /> Incident Dossier ID
            </span>
            <span className="font-bold text-red-400 bg-red-950/50 px-2 py-0.5 rounded border border-red-900/50">
              {data.id}
            </span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-slate-800/80">
            <span className="text-slate-400 flex items-center gap-1.5">
              <AlertOctagon className="w-3.5 h-3.5 text-amber-400" /> Attempted User
            </span>
            <span className="text-slate-200">{data.usernameAttempted || 'Unknown'}</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-slate-800/80">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" /> Timestamp
            </span>
            <span className="text-slate-200">{data.timestamp}</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-slate-800/80">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-blue-400" /> Origin IP Address
            </span>
            <span className="text-cyan-300 font-semibold">{data.ip}</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-slate-800/80">
            <span className="text-slate-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Geolocation
            </span>
            <span className="text-slate-200">{data.location}</span>
          </div>

          <div className="flex items-center justify-between py-1">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Laptop className="w-3.5 h-3.5 text-purple-400" /> Client Hardware
            </span>
            <span className="text-slate-300 truncate max-w-[200px]" title={data.device}>
              {data.device}
            </span>
          </div>
        </div>

        {/* Security Alert Notice */}
        <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-950/20 border border-amber-500/20 px-3 py-2 rounded-lg mb-6">
          <AlertOctagon className="w-4 h-4 shrink-0 text-amber-400" />
          <span>Security Operations Center (SOC) alerted. IP telemetry flagged for rate limiting.</span>
        </div>

        {/* Action button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 px-4 bg-red-600/90 hover:bg-red-500 text-white font-mono-code text-sm font-semibold rounded-lg shadow-lg hover:shadow-red-500/30 transition-all border border-red-400/30 flex items-center justify-center space-x-2"
        >
          <span>[ ACKNOWLEDGE & CLOSE ]</span>
        </button>
      </div>
    </div>
  );
};
