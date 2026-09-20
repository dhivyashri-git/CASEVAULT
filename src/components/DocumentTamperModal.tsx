import React from 'react';
import {
  ShieldAlert,
  AlertOctagon,
  RefreshCw,
  X,
  Lock,
  ArrowRight,
  TrendingDown,
  Hash,
} from 'lucide-react';
import { SecureDocument } from '../types';
import { useSecurity } from '../context/SecurityContext';

export const DocumentTamperModal: React.FC = () => {
  const { tamperedAlertDoc, clearTamperedAlert, restoreDocumentIntegrity } = useSecurity();

  if (!tamperedAlertDoc) return null;

  const handleRestore = () => {
    restoreDocumentIntegrity(tamperedAlertDoc.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-slate-950 border-2 border-red-500 rounded-2xl p-6 sm:p-8 shadow-2xl glow-red overflow-hidden">
        {/* Top Warning Ribbon */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-amber-500 to-red-600 animate-pulse" />

        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="flex items-center space-x-3.5">
            <div className="p-3 bg-red-950/80 border border-red-500/60 rounded-xl text-red-400 shrink-0">
              <ShieldAlert className="w-8 h-8 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 text-[10px] font-mono-code font-bold uppercase border border-red-500/40">
                  CRITICAL INCIDENT
                </span>
                <span className="text-xs text-slate-400 font-mono-code">
                  CASE: {tamperedAlertDoc.caseId}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold font-display text-white mt-1">
                ⚠ DOCUMENT INTEGRITY ALERT
              </h2>
            </div>
          </div>

          <button
            onClick={clearTamperedAlert}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Core Message */}
        <p className="text-sm text-slate-200 mb-5 bg-red-950/40 border border-red-500/30 p-3.5 rounded-lg leading-relaxed">
          Document content does not match the original integrity fingerprint. Bitstream alteration or unauthorized byte modification detected.
        </p>

        {/* Target Document Details */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 mb-5 space-y-3 font-mono-code text-xs">
          <div className="flex justify-between pb-2 border-b border-slate-800">
            <span className="text-slate-400">Target Document:</span>
            <span className="text-white font-bold truncate max-w-[220px]">{tamperedAlertDoc.title}</span>
          </div>

          <div className="flex justify-between pb-2 border-b border-slate-800">
            <span className="text-slate-400">Integrity Status:</span>
            <span className="text-red-400 font-bold bg-red-950/60 px-2 py-0.5 rounded border border-red-900/60">
              TAMPERING SUSPECTED
            </span>
          </div>

          {/* Side by side Hash Comparison */}
          <div className="space-y-2 pt-1">
            <div className="p-2.5 bg-slate-950 border border-emerald-500/30 rounded-lg">
              <span className="text-[10px] text-emerald-400 uppercase font-bold block mb-0.5">
                ORIGINAL HASH (Stored at Version 1):
              </span>
              <p className="text-emerald-300 break-all text-[11px]">
                {tamperedAlertDoc.originalHash}
              </p>
            </div>

            <div className="p-2.5 bg-slate-950 border border-red-500/40 rounded-lg">
              <span className="text-[10px] text-red-400 uppercase font-bold block mb-0.5">
                CURRENT CALCULATED HASH (Corrupted):
              </span>
              <p className="text-red-300 break-all text-[11px]">
                {tamperedAlertDoc.currentHash}
              </p>
            </div>
          </div>

          {/* Trust Score Degradation Indicator */}
          <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-xs">
            <span className="text-slate-400 flex items-center gap-1.5">
              <TrendingDown className="w-4 h-4 text-red-400" />
              Document Trust Score:
            </span>
            <div className="flex items-center space-x-2">
              <span className="line-through text-slate-500">98/100</span>
              <span className="text-red-400 font-bold">31 / 100 (DEGRADED)</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={handleRestore}
            className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-mono-code text-xs font-semibold rounded-lg shadow-lg hover:shadow-emerald-500/20 transition flex items-center justify-center space-x-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>[ RESTORE ORIGINAL HASH ]</span>
          </button>

          <button
            onClick={clearTamperedAlert}
            className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono-code text-xs font-semibold rounded-lg transition"
          >
            [ ACKNOWLEDGE & ISOLATE ]
          </button>
        </div>
      </div>
    </div>
  );
};
