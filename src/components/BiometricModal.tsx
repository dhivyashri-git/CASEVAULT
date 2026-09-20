import React, { useState, useEffect } from 'react';
import { Fingerprint, ShieldCheck, Lock, CheckCircle2, X } from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';

export const BiometricModal: React.FC = () => {
  const { biometricPrompt, closeBiometricPrompt } = useSecurity();
  const [scanState, setScanState] = useState<'IDLE' | 'SCANNING' | 'VERIFYING' | 'VERIFIED'>('IDLE');

  useEffect(() => {
    if (biometricPrompt?.isOpen) {
      setScanState('IDLE');
    }
  }, [biometricPrompt?.isOpen]);

  if (!biometricPrompt || !biometricPrompt.isOpen) return null;

  const handleStartScan = () => {
    setScanState('SCANNING');

    setTimeout(() => {
      setScanState('VERIFYING');
      setTimeout(() => {
        setScanState('VERIFIED');
        setTimeout(() => {
          biometricPrompt.onComplete(true);
        }, 800);
      }, 900);
    }, 1100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-950 border-2 border-cyan-500/80 rounded-2xl p-6 sm:p-8 shadow-2xl glow-cyan text-center overflow-hidden">
        {/* Close */}
        <button
          onClick={() => {
            biometricPrompt.onComplete(false);
            closeBiometricPrompt();
          }}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-cyan-950/60 text-cyan-300 border border-cyan-500/40 text-xs font-mono-code font-bold uppercase mb-3">
          <Lock className="w-3.5 h-3.5" />
          <span>STEP-UP AUTHENTICATION REQUIRED</span>
        </div>

        <h2 className="text-xl font-bold font-display text-white mb-2">
          BIOMETRIC IDENTITY VERIFICATION
        </h2>

        <p className="text-xs text-slate-400 mb-6 px-2">
          {biometricPrompt.reason || 'Additional identity verification is required for this action.'}
        </p>

        {/* Biometric Sensor Visual */}
        <div className="relative w-36 h-36 mx-auto mb-6 bg-slate-900 border-2 border-cyan-500/40 rounded-2xl flex items-center justify-center overflow-hidden shadow-inner">
          {/* Laser scanning beam */}
          {(scanState === 'SCANNING' || scanState === 'VERIFYING') && (
            <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-laser shadow-[0_0_15px_#22d3ee] z-20" />
          )}

          {/* Fingerprint Icon with reactive colors */}
          <Fingerprint
            className={`w-24 h-24 transition-all duration-300 ${
              scanState === 'VERIFIED'
                ? 'text-emerald-400 scale-105'
                : scanState === 'SCANNING' || scanState === 'VERIFYING'
                ? 'text-cyan-400 animate-pulse scale-100'
                : 'text-slate-600'
            }`}
          />

          {/* Verification Checkmark Badge */}
          {scanState === 'VERIFIED' && (
            <div className="absolute inset-0 bg-emerald-950/80 flex flex-col items-center justify-center text-emerald-400 backdrop-blur-xs animate-in zoom-in-90">
              <CheckCircle2 className="w-12 h-12 mb-1 animate-bounce" />
              <span className="text-[11px] font-mono-code font-bold uppercase">
                IDENTITY VERIFIED
              </span>
            </div>
          )}
        </div>

        {/* Dynamic Status Text */}
        <div className="font-mono-code text-xs mb-6 h-5">
          {scanState === 'IDLE' && (
            <span className="text-slate-400">Place enrolled finger on sensor / tap to simulate</span>
          )}
          {scanState === 'SCANNING' && (
            <span className="text-cyan-400 font-bold animate-pulse">
              SCANNING DERMAL RIDGES & BIOMETRIC MESH...
            </span>
          )}
          {scanState === 'VERIFYING' && (
            <span className="text-cyan-300 font-bold animate-pulse">
              CRYPTOGRAPHIC HSM CHALLENGE VERIFICATION...
            </span>
          )}
          {scanState === 'VERIFIED' && (
            <span className="text-emerald-400 font-bold">
              ✓ ACCESS GRANTED — AUTHORIZATION CACHED
            </span>
          )}
        </div>

        {/* Actions */}
        {scanState === 'IDLE' ? (
          <button
            onClick={handleStartScan}
            className="w-full py-3 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono-code text-xs font-bold rounded-lg shadow-lg hover:shadow-cyan-500/20 transition-all flex items-center justify-center space-x-2"
          >
            <Fingerprint className="w-4 h-4" />
            <span>[ SIMULATE BIOMETRIC SCAN ]</span>
          </button>
        ) : (
          <div className="w-full py-2.5 px-4 bg-slate-900/80 border border-slate-800 text-slate-400 font-mono-code text-xs rounded-lg flex items-center justify-center space-x-2">
            <span className="w-3.5 h-3.5 border-2 border-cyan-400/40 border-t-cyan-400 rounded-full animate-spin" />
            <span>PROCESSING ATTESTATION...</span>
          </div>
        )}

        {/* Prototype Disclaimer */}
        <div className="mt-4 pt-3 border-t border-slate-900 text-[10px] font-mono-code text-slate-500 text-left">
          <span className="text-slate-400 font-semibold">WebAuthn / FIDO2 Ready: </span>
          Frontend prototype simulator. Production builds bind to government hardware security tokens and platform biometric authenticators.
        </div>
      </div>
    </div>
  );
};
