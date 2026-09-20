import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle2, Terminal, Cpu, Lock, FileCheck, AlertTriangle } from 'lucide-react';

interface BootSequenceProps {
  onComplete: () => void;
}

const BOOT_STEPS = [
  { label: '1. Power On & Hardware Telemetry Handshake', icon: Shield, delay: 350 },
  { label: '2. Zero-Trust Security Handshake & Role Tokenizer', icon: Lock, delay: 700 },
  { label: '3. Load Cryptographic Engine (AES-GCM 256-bit)', icon: Cpu, delay: 1050 },
  { label: '4. Load Evidence Integrity Engine (SHA-256 Verifier)', icon: CheckCircle2, delay: 1400 },
  { label: '5. Verify Document Signatures & Chain of Custody', icon: FileCheck, delay: 1750 },
  { label: '6. Initialize Dynamic Adaptive Security & Threat Ledger', icon: AlertTriangle, delay: 2100 },
  { label: '7. Establish Ephemeral Tamper-Resistant Session', icon: Terminal, delay: 2450 },
  { label: '8. Launch CASE VAULT Intelligence Core', icon: Shield, delay: 2800 },
];

export const BootSequence: React.FC<BootSequenceProps> = ({ onComplete }) => {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    BOOT_STEPS.forEach((step, index) => {
      const timer = setTimeout(() => {
        setCompletedSteps((prev) => [...prev, index]);
        if (index === BOOT_STEPS.length - 1) {
          setTimeout(() => {
            setIsReady(true);
            setTimeout(() => {
              onComplete();
            }, 900);
          }, 400);
        }
      }, step.delay);

      return () => clearTimeout(timer);
    });
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-[#030712] bg-security-grid flex flex-col items-center justify-center p-6 text-slate-100">
      <div className="absolute inset-0 bg-radial from-cyan-950/20 via-transparent to-black pointer-events-none" />

      <div className="relative w-full max-w-lg bg-slate-900/90 border border-cyan-500/30 rounded-xl p-8 backdrop-blur-md shadow-2xl glow-cyan">
        {/* Header Branding */}
        <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-800">
          <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-cyan-400">
            <Shield className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold font-display tracking-wider text-slate-100">
                CASEVAULT
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono-code border border-cyan-500/30">
                v4.8.2-GOV
              </span>
            </div>
            <p className="text-xs text-cyan-400 font-mono-code uppercase tracking-wider mt-0.5">
              SECURE SYSTEM INITIALIZATION
            </p>
          </div>
        </div>

        {/* Step-by-Step Checklist */}
        <div className="space-y-3 font-mono-code text-sm">
          {BOOT_STEPS.map((step, idx) => {
            const isDone = completedSteps.includes(idx);
            const StepIcon = step.icon;

            return (
              <div
                key={step.label}
                className={`flex items-center justify-between p-2 rounded transition-all duration-300 ${
                  isDone
                    ? 'bg-cyan-950/20 text-cyan-300 border border-cyan-500/20'
                    : 'text-slate-600'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <StepIcon
                    className={`w-4 h-4 ${
                      isDone ? 'text-cyan-400' : 'text-slate-600'
                    }`}
                  />
                  <span>{step.label}</span>
                </div>
                <div>
                  {isDone ? (
                    <span className="text-emerald-400 font-bold flex items-center space-x-1">
                      <span>✓</span>
                      <span className="text-[11px] text-emerald-500/80">ONLINE</span>
                    </span>
                  ) : (
                    <span className="text-slate-600 text-xs animate-pulse">
                      STARTING...
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Final Status */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isReady
                  ? 'bg-emerald-400 animate-ping'
                  : 'bg-amber-400 animate-pulse'
              }`}
            />
            <span className="font-mono-code text-xs font-semibold text-slate-300">
              STATUS:{' '}
              <span
                className={
                  isReady ? 'text-emerald-400 font-bold' : 'text-amber-400'
                }
              >
                {isReady ? 'READY FOR AUTHENTICATION' : 'BOOTING KERNEL...'}
              </span>
            </span>
          </div>

          <button
            onClick={onComplete}
            className="text-xs text-slate-400 hover:text-cyan-300 underline underline-offset-4 font-mono-code"
          >
            Skip Boot Sequence →
          </button>
        </div>
      </div>
    </div>
  );
};
