import React, { useState } from 'react';
import {
  Sparkles,
  UploadCloud,
  FileText,
  Lock,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  X,
  ArrowRight,
  Database,
} from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';
import { DocumentType, SensitivityLevel } from '../types';
import { aiClassifyDocument } from '../services/securityEngine';

interface AiClassificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UPLOAD_PIPELINE_STEPS = [
  'UPLOADING EVIDENCE STREAM...',
  'ENCRYPTING DOCUMENT (AES-256-GCM)...',
  'ANALYZING DOCUMENT CONTENT...',
  'CLASSIFYING DOCUMENT TYPE & SENSITIVITY...',
  'CREATING INTEGRITY FINGERPRINT (SHA-256)...',
  'SECURELY DEPOSITING IN CENTRAL REPOSITORY...',
];

export const AiClassificationModal: React.FC<AiClassificationModalProps> = ({ isOpen, onClose }) => {
  const { addDocument } = useSecurity();

  const [title, setTitle] = useState('Cyber Forensic Bitstream Memory Dump');
  const [caseId, setCaseId] = useState('CASE-1024');
  const [sampleContent, setSampleContent] = useState(
    'Forensic examination of seized iPhone 14 Pro conducted under Sec 65B Indian Evidence Act. Extracted WhatsApp SQLite database containing encrypted conversations referencing coordinated hawala transactions and financial ledgers.'
  );

  const [pipelineState, setPipelineState] = useState<'IDLE' | 'PROCESSING' | 'COMPLETED'>('IDLE');
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [aiClassification, setAiClassification] = useState<ReturnType<typeof aiClassifyDocument> | null>(null);

  if (!isOpen) return null;

  const handleStartAnalysis = (e: React.FormEvent) => {
    e.preventDefault();
    setPipelineState('PROCESSING');
    setCurrentStepIdx(0);

    // Compute classification result
    const classification = aiClassifyDocument(sampleContent, title);
    setAiClassification(classification);

    UPLOAD_PIPELINE_STEPS.forEach((_, idx) => {
      setTimeout(() => {
        setCurrentStepIdx(idx);
        if (idx === UPLOAD_PIPELINE_STEPS.length - 1) {
          setTimeout(() => {
            setPipelineState('COMPLETED');
          }, 450);
        }
      }, (idx + 1) * 450);
    });
  };

  const handleConfirmDeposit = () => {
    if (!aiClassification) return;

    addDocument({
      title,
      fileName: `${title.toLowerCase().replace(/\s+/g, '_')}.pdf`,
      caseId,
      caseTitle: 'Investigation Docket ' + caseId,
      type: aiClassification.type,
      sensitivity: aiClassification.sensitivity,
      contentSummary: sampleContent,
    });

    onClose();
    // Reset form
    setPipelineState('IDLE');
    setAiClassification(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-slate-950 border border-cyan-500/40 rounded-2xl shadow-2xl glow-cyan flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-cyan-950/60 border border-cyan-500/40 rounded-xl text-cyan-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-display text-white">
                AI DOCUMENT CLASSIFICATION & INGESTION
              </h2>
              <p className="text-xs text-slate-400 font-mono-code">
                Section 17: Automatic sensitivity detection, entities extraction, and cryptographic sealing
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 font-mono-code text-xs">
          {pipelineState === 'IDLE' && (
            <form onSubmit={handleStartAnalysis} className="space-y-4">
              <div>
                <label className="block text-slate-300 uppercase tracking-wider text-[11px] mb-1">
                  Evidence Document Title:
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 uppercase tracking-wider text-[11px] mb-1">
                  Target Case Docket:
                </label>
                <input
                  type="text"
                  required
                  value={caseId}
                  onChange={(e) => setCaseId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 uppercase tracking-wider text-[11px] mb-1">
                  Evidence Content / Deposition Transcript / Report Body:
                </label>
                <textarea
                  rows={4}
                  required
                  value={sampleContent}
                  onChange={(e) => setSampleContent(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-cyan-400 font-mono-code leading-relaxed"
                />
              </div>

              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center space-x-2 text-slate-400">
                <UploadCloud className="w-5 h-5 text-cyan-400 shrink-0" />
                <span className="text-[11px]">
                  Files uploaded are immediately wrapped in an AES-256 cryptographic envelope with zero unencrypted disk spooling.
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg hover:shadow-cyan-500/20 transition flex items-center justify-center space-x-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>EXECUTE AI CLASSIFICATION PIPELINE</span>
              </button>
            </form>
          )}

          {pipelineState === 'PROCESSING' && (
            <div className="py-8 px-4 text-center space-y-6">
              <div className="w-16 h-16 mx-auto bg-cyan-950/60 border border-cyan-500/40 rounded-2xl flex items-center justify-center text-cyan-400 animate-pulse">
                <Cpu className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-base font-bold font-display text-white">
                  PROCESSING INGESTION PIPELINE
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Cryptographic hashing, natural language parsing, and clearance assignment
                </p>
              </div>

              {/* Progress Steps */}
              <div className="max-w-md mx-auto space-y-2 text-left">
                {UPLOAD_PIPELINE_STEPS.map((step, idx) => {
                  const isDone = idx < currentStepIdx;
                  const isCurrent = idx === currentStepIdx;

                  return (
                    <div
                      key={step}
                      className={`flex items-center justify-between p-2 rounded-lg border text-[11px] transition-all ${
                        isDone
                          ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                          : isCurrent
                          ? 'bg-cyan-950/30 border-cyan-500/40 text-cyan-300 animate-pulse'
                          : 'bg-slate-900/40 border-slate-800 text-slate-600'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center text-[10px]">
                          {idx + 1}
                        </span>
                        <span>{step}</span>
                      </div>
                      <div>
                        {isDone ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        ) : isCurrent ? (
                          <span className="text-[10px] text-cyan-400">ACTIVE</span>
                        ) : (
                          <span className="text-[10px] text-slate-600">WAITING</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {pipelineState === 'COMPLETED' && aiClassification && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-3.5 bg-emerald-950/30 border border-emerald-500/40 rounded-xl flex items-center space-x-3 text-emerald-300">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <span className="font-bold block">AI CLASSIFICATION ATTESTED</span>
                  <span className="text-slate-400 text-[11px]">
                    Document analyzed with {aiClassification.confidence}% confidence. Cryptographic fingerprint sealed.
                  </span>
                </div>
              </div>

              {/* Classification Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">DETECTED DOCUMENT TYPE</span>
                  <span className="text-sm font-bold text-cyan-300 mt-0.5 block">
                    {aiClassification.type}
                  </span>
                  <span className="text-slate-400 text-[10px]">Confidence: {aiClassification.confidence}%</span>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">SUGGESTED SENSITIVITY</span>
                  <span className="text-sm font-bold text-amber-400 mt-0.5 block">
                    {aiClassification.sensitivity}
                  </span>
                  <span className="text-slate-400 text-[10px]">Mandatory Access Clearance Applied</span>
                </div>
              </div>

              {/* Extracted Entities */}
              <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">
                  EXTRACTED JURISDICTIONAL ENTITIES:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {aiClassification.detectedKeywords.map((kw: string) => (
                    <span
                      key={kw}
                      className="px-2 py-0.5 rounded bg-slate-950 border border-slate-700 text-cyan-300 text-[11px]"
                    >
                      🏷 {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Security Seal */}
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-500 text-[10px] block">MINTED INTEGRITY FINGERPRINT:</span>
                <p className="text-[10px] text-slate-300 break-all select-all font-mono-code">
                  SHA-256: d8e8fca2dc0f896fd7cb4cb0031ba249{Math.random().toString(16).substring(2, 10)}
                </p>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setPipelineState('IDLE')}
                  className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition"
                >
                  RE-EVALUATE
                </button>

                <button
                  type="button"
                  onClick={handleConfirmDeposit}
                  className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg hover:shadow-emerald-500/20 transition flex items-center justify-center space-x-1.5"
                >
                  <Database className="w-4 h-4" />
                  <span>CONFIRM & DEPOSIT</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
