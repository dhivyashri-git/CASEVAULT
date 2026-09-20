import React, { useState } from 'react';
import {
  Zap,
  Play,
  ShieldAlert,
  AlertTriangle,
  Lock,
  FileCheck,
  CheckCircle2,
  X,
  RefreshCw,
  Cpu,
} from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';

interface DemoSimulationRunnerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigatePage?: (page: any) => void;
}

export const DemoSimulationRunner: React.FC<DemoSimulationRunnerProps> = ({
  isOpen,
  onClose,
  onNavigatePage,
}) => {
  const {
    simulateTampering,
    recordAuditAction,
    addSecurityAlert,
    documents,
    restoreDocumentIntegrity,
    currentRiskScore,
  } = useSecurity();

  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isRunningAll, setIsRunningAll] = useState<boolean>(false);
  const [simulationLog, setSimulationLog] = useState<string[]>([]);

  if (!isOpen) return null;

  const targetDoc = documents.find((d) => d.id === 'doc-for-1024') || documents[0];

  const steps = [
    {
      num: 1,
      title: 'Rapid Cross-Document Access',
      desc: 'Simulate high-frequency access to multiple confidential investigation dockets in under 5 seconds.',
      run: () => {
        recordAuditAction(
          'RAPID_MULTI_ACCESS',
          targetDoc.id,
          targetDoc.title,
          'Unusual access volume: 6 confidential documents requested in 3.8 seconds.'
        );
        setSimulationLog((prev) => [
          ...prev,
          '✓ Step 1: Rapid multi-document access logged in audit ledger.',
        ]);
        setCurrentStep(1);
      },
    },
    {
      num: 2,
      title: 'Simulate Bitstream SHA-256 Tamper',
      desc: 'Simulate bit-flip tampering on CFSL Forensic Report (doc-for-1024). Hash recalculation mismatches.',
      run: () => {
        simulateTampering(targetDoc.id);
        setSimulationLog((prev) => [
          ...prev,
          '✓ Step 2: Bitstream hash altered on doc-for-1024. Trust score dropped to 31%.',
        ]);
        setCurrentStep(2);
      },
    },
    {
      num: 3,
      title: 'Elevate Adaptive Security to CRITICAL (Level 4)',
      desc: 'Security engine detects integrity breach. Dynamic risk score spikes to 95/100.',
      run: () => {
        addSecurityAlert({
          type: 'INTEGRITY_TAMPER',
          severity: 'CRITICAL',
          documentId: targetDoc.id,
          documentTitle: targetDoc.title,
          message: 'CRITICAL: SHA-256 hash mismatch detected on forensic ballistics docket.',
          detectedBehaviour: [
            'SHA-256 signature altered outside of authorized judicial pipeline',
            'Rapid sequential access from atypical IP address',
          ],
          riskScore: 95,
          recommendedAction: 'Lock docket, revoke ephemeral access tokens, require biometric re-verification.',
          status: 'TRIGGERED',
        });
        setSimulationLog((prev) => [
          ...prev,
          '✓ Step 3: CRITICAL security alert generated. Threat level escalated to Level 4.',
        ]);
        setCurrentStep(3);
      },
    },
    {
      num: 4,
      title: 'Enforce Sensitive Action Blockade',
      desc: 'High-risk policy active: Document downloads, edits, and external shares are immediately blocked.',
      run: () => {
        recordAuditAction(
          'ACTION_BLOCKED',
          targetDoc.id,
          targetDoc.title,
          'Export blocked by Adaptive Security Engine due to CRITICAL threat posture (Risk: 95).'
        );
        setSimulationLog((prev) => [
          ...prev,
          '✓ Step 4: Sensitive actions blocked by Adaptive Security Engine.',
        ]);
        setCurrentStep(4);
      },
    },
    {
      num: 5,
      title: 'Restore Document & Re-Verify Integrity',
      desc: 'Revert tamper simulation, recalculate pristine SHA-256 seal, and restore trust score.',
      run: () => {
        restoreDocumentIntegrity(targetDoc.id);
        setSimulationLog((prev) => [
          ...prev,
          '✓ Step 5: Original cryptographic seal restored. Hash verified. System returning to NORMAL.',
        ]);
        setCurrentStep(5);
      },
    },
  ];

  const handleRunFullSequence = async () => {
    setIsRunningAll(true);
    setSimulationLog(['Starting full Hackathon Demo Storyline...']);

    for (let i = 0; i < steps.length; i++) {
      steps[i].run();
      await new Promise((r) => setTimeout(r, 900));
    }
    setIsRunningAll(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-cyan-500/50 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl shadow-cyan-950/50">
        {/* Header */}
        <div className="bg-slate-950 p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold font-display text-white tracking-wide">
                HACKATHON DEMO & SECURITY SIMULATION RUNNER
              </h2>
              <p className="text-[11px] font-mono-code text-slate-400">
                1-Click interactive walkthrough demonstrating real-time threat response and adaptive lockdown.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={handleRunFullSequence}
              disabled={isRunningAll}
              className="py-3 px-5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono-code text-xs font-bold transition flex items-center space-x-2 shadow-lg shadow-cyan-950/40 disabled:opacity-50"
            >
              <Zap className="w-4 h-4" />
              <span>{isRunningAll ? 'RUNNING STORYLINE...' : '⚡ RUN FULL HACKATHON DEMO FLOW'}</span>
            </button>

            <span className="text-xs font-mono-code text-slate-400">
              Current Risk Score:{' '}
              <span
                className={`font-bold ${
                  currentRiskScore > 70
                    ? 'text-red-400'
                    : currentRiskScore > 35
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}
              >
                {currentRiskScore}/100
              </span>
            </span>
          </div>

          {/* Interactive Steps list */}
          <div className="space-y-3 font-mono-code text-xs">
            {steps.map((step) => {
              const isPassed = currentStep >= step.num;
              return (
                <div
                  key={step.num}
                  className={`p-3.5 rounded-xl border flex items-center justify-between transition ${
                    isPassed
                      ? 'bg-slate-950/80 border-cyan-500/40 text-slate-200'
                      : 'bg-slate-950/40 border-slate-800/80 text-slate-400'
                  }`}
                >
                  <div className="space-y-0.5 pr-3">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-cyan-400">Step {step.num}:</span>
                      <span className="font-bold text-white">{step.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-400">{step.desc}</p>
                  </div>

                  <button
                    onClick={step.run}
                    className="shrink-0 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-cyan-600 hover:text-white text-slate-300 font-bold transition text-[11px]"
                  >
                    Execute
                  </button>
                </div>
              );
            })}
          </div>

          {/* Live Execution Logs */}
          {simulationLog.length > 0 && (
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono-code text-[11px] text-cyan-300 space-y-1 max-h-32 overflow-y-auto">
              <span className="text-slate-500 block uppercase font-bold text-[10px]">
                Live Scenario Telemetry:
              </span>
              {simulationLog.map((log, idx) => (
                <p key={idx}>{log}</p>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-950 p-4 border-t border-slate-800 flex items-center justify-between font-mono-code text-xs">
          <span className="text-slate-500">Target Docket: {targetDoc.title}</span>
          <button
            onClick={() => {
              if (onNavigatePage) onNavigatePage('adaptive_security');
              onClose();
            }}
            className="text-cyan-400 hover:underline"
          >
            Inspect Adaptive Security Engine →
          </button>
        </div>
      </div>
    </div>
  );
};
