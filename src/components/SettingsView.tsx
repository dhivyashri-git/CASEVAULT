import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Key,
  Fingerprint,
  Globe,
  Bell,
  RotateCcw,
  Check,
  Server,
  Lock,
} from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';

export const SettingsView: React.FC = () => {
  const { currentUser, resetSessionTimer } = useSecurity();

  const [keyRotationInterval, setKeyRotationInterval] = useState('30_DAYS');
  const [geofencingStrict, setGeofencingStrict] = useState(true);
  const [hardwareAttestation, setHardwareAttestation] = useState(true);
  const [auditStreaming, setAuditStreaming] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
        <div className="flex items-center space-x-2 text-cyan-400 text-xs font-mono-code mb-1">
          <Settings className="w-4 h-4" />
          <span>SECURITY GOVERNANCE CONFIGURATION</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold font-display text-white">
          SECURITY POLICIES & HARDENING
        </h1>
        <p className="text-xs text-slate-400 font-mono-code mt-0.5">
          Tune cryptographic key lifespans, hardware WebAuthn policies, and perimeter subnet boundaries.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 font-mono-code text-xs">
        {/* Card 1: Cryptographic Engine Settings */}
        <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-cyan-400" />
            CRYPTOGRAPHIC KEY MANAGEMENT & HSM (AES-256-GCM)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 text-[11px] mb-1">
                HSM Master Key Rotation Frequency:
              </label>
              <select
                value={keyRotationInterval}
                onChange={(e) => setKeyRotationInterval(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-400"
              >
                <option value="7_DAYS">Every 7 Days (Strict Court Order)</option>
                <option value="30_DAYS">Every 30 Days (Standard Judicial Policy)</option>
                <option value="90_DAYS">Every 90 Days</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 text-[11px] mb-1">
                Cryptographic Digest Algorithm:
              </label>
              <input
                type="text"
                readOnly
                value="SHA-256 (FIPS 180-4 Validated)"
                className="w-full bg-slate-950/60 border border-slate-800 rounded-lg p-2.5 text-slate-400 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Adaptive Biometric Policies */}
        <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Fingerprint className="w-4 h-4 text-cyan-400" />
            STEP-UP AUTHENTICATION POLICIES
          </h2>

          <div className="space-y-3">
            <label className="flex items-center space-x-3 p-3 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={hardwareAttestation}
                onChange={(e) => setHardwareAttestation(e.target.checked)}
                className="accent-cyan-400"
              />
              <div>
                <span className="text-white font-bold block">
                  Mandatory Hardware Biometric Attestation for LEVEL 2+ Access
                </span>
                <span className="text-slate-400 text-[11px]">
                  FIDO2 token or biometric fingerprint challenge required whenever confidential files are requested.
                </span>
              </div>
            </label>

            <label className="flex items-center space-x-3 p-3 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={geofencingStrict}
                onChange={(e) => setGeofencingStrict(e.target.checked)}
                className="accent-cyan-400"
              />
              <div>
                <span className="text-white font-bold block">
                  Enforce Indian Judicial WAN Subnet Geofencing (10.0.0.0/8 & NIC CIDR)
                </span>
                <span className="text-slate-400 text-[11px]">
                  Immediately elevate risk to LEVEL 4 (CRITICAL) if access originates outside designated police networks.
                </span>
              </div>
            </label>

            <label className="flex items-center space-x-3 p-3 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={auditStreaming}
                onChange={(e) => setAuditStreaming(e.target.checked)}
                className="accent-cyan-400"
              />
              <div>
                <span className="text-white font-bold block">
                  Real-time Immutable SIEM Log Streaming
                </span>
                <span className="text-slate-400 text-[11px]">
                  Every state transition is dual-committed to government tamper-proof syslog cluster.
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Submit & Confirmation */}
        <div className="flex items-center justify-between pt-2">
          <div>
            {savedSuccess && (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <Check className="w-4 h-4" /> Security policies saved & promulgated to cluster nodes.
              </span>
            )}
          </div>

          <button
            type="submit"
            className="py-2.5 px-6 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl shadow-lg hover:shadow-cyan-500/20 transition flex items-center space-x-2"
          >
            <span>APPLY & ENFORCE POLICIES</span>
          </button>
        </div>
      </form>
    </div>
  );
};
