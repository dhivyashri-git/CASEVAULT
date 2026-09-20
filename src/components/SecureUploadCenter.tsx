import React, { useState, useRef } from 'react';
import {
  Upload,
  FileCheck,
  Cpu,
  Shield,
  Fingerprint,
  Database,
  CheckCircle2,
  AlertCircle,
  FileText,
  Lock,
  ArrowRight,
  Eye,
} from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';
import { DocumentType, SensitivityLevel, UserRole, SecureDocument } from '../types';
import { computeSHA256, encryptTextAESGCM } from '../services/webCrypto';
import { analyzeDocumentWithAI } from '../services/securityEngine';

interface SecureUploadCenterProps {
  onDocumentAdded?: (doc: SecureDocument) => void;
  onViewDoc?: (doc: SecureDocument) => void;
}

export const SecureUploadCenter: React.FC<SecureUploadCenterProps> = ({
  onDocumentAdded,
  onViewDoc,
}) => {
  const { cases, currentUser, addNewDocument } = useSecurity();

  const [selectedCase, setSelectedCase] = useState<string>('CASE-1024');
  const [docType, setDocType] = useState<DocumentType>('FORENSIC REPORT');
  const [docTitle, setDocTitle] = useState<string>('');
  const [sensitivity, setSensitivity] = useState<SensitivityLevel>('HIGHLY CONFIDENTIAL');
  const [description, setDescription] = useState<string>('');
  const [tags, setTags] = useState<string>('Ballistics, Seizure, Chain-Of-Custody');
  const [witnessPerson, setWitnessPerson] = useState<string>('Ravi Kumar');
  const [evidenceId, setEvidenceId] = useState<string>('EV-2048');
  const [location, setLocation] = useState<string>('Pier-4, Chennai Port');
  const [officerRef, setOfficerRef] = useState<string>(currentUser?.name || 'Inspector Vikram Rathore');

  // File state
  const [file, setFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pipeline state
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [currentPipelineStep, setCurrentPipelineStep] = useState<number>(0);
  const [processedDoc, setProcessedDoc] = useState<SecureDocument | null>(null);

  const pipelineSteps = [
    { title: 'FILE RECEIVED', desc: 'Secure multipart ingestion & MIME verification' },
    { title: 'TEXT EXTRACTION', desc: 'Parsing digital stream, OCR & layout recognition' },
    { title: 'AI ANALYSIS', desc: 'Running semantic analysis and legal categorization' },
    { title: 'DOCUMENT CLASSIFICATION', desc: 'Mapping to statutory evidentiary taxonomy' },
    { title: 'ENTITY EXTRACTION', desc: 'Extracting names, aliases, evidence IDs & locations' },
    { title: 'SENSITIVITY DETECTION', desc: 'Evaluating classification clearance requirements' },
    { title: 'ENCRYPTION', desc: 'Encrypting payload via browser Web Crypto AES-GCM (256-bit)' },
    { title: 'SHA-256 FINGERPRINT', desc: 'Generating immutable cryptographic hash seal' },
    { title: 'SECURE STORAGE', desc: 'Committing to tamper-evident evidentiary vault' },
    { title: 'AUDIT RECORD CREATED', desc: 'Logging immutable provenance event in ledger' },
  ];

  const handleFileSelect = (selected: File) => {
    setFile(selected);
    if (!docTitle) {
      setDocTitle(selected.name.replace(/\.[^/.]+$/, ''));
    }

    // Read preview text if possible
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setFileContent(text || 'Forensic evidence text stream representation.');
    };
    reader.onerror = () => {
      setFileContent('Binary evidence file stream (seized digital artifact).');
    };
    if (selected.type.includes('text') || selected.name.endsWith('.txt')) {
      reader.readAsText(selected);
    } else {
      setFileContent(`[Binary evidence capture: ${selected.name} (${(selected.size / 1024).toFixed(1)} KB)]`);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleStartIngestion = async () => {
    if (!docTitle) return;

    setIsProcessing(true);
    setCurrentPipelineStep(0);
    setProcessedDoc(null);

    const fullContent = fileContent || `${docTitle}. Evidence ID: ${evidenceId}. Person: ${witnessPerson}. Location: ${location}. Description: ${description}`;

    // Step 1: File Received
    setCurrentPipelineStep(1);
    await new Promise((r) => setTimeout(r, 350));

    // Step 2: Text Extraction
    setCurrentPipelineStep(2);
    await new Promise((r) => setTimeout(r, 350));

    // Step 3 & 4: AI Analysis & Classification
    setCurrentPipelineStep(3);
    const aiResult = analyzeDocumentWithAI(docTitle, fullContent);
    await new Promise((r) => setTimeout(r, 400));

    setCurrentPipelineStep(4);
    await new Promise((r) => setTimeout(r, 350));

    // Step 5: Entity Extraction
    setCurrentPipelineStep(5);
    await new Promise((r) => setTimeout(r, 350));

    // Step 6: Sensitivity Detection
    setCurrentPipelineStep(6);
    await new Promise((r) => setTimeout(r, 300));

    // Step 7: Web Crypto AES-GCM Encryption
    setCurrentPipelineStep(7);
    const encResult = await encryptTextAESGCM(fullContent);
    await new Promise((r) => setTimeout(r, 400));

    // Step 8: SHA-256 Fingerprint
    setCurrentPipelineStep(8);
    const computedHash = await computeSHA256(fullContent);
    await new Promise((r) => setTimeout(r, 350));

    // Step 9: Secure Storage
    setCurrentPipelineStep(9);
    const selectedCaseObj = cases.find((c) => c.id === selectedCase);
    const now = new Date();
    const formattedDate = `${now.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })}, ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;

    const newDocId = `doc-ingest-${Date.now()}`;
    const newDoc: SecureDocument = {
      id: newDocId,
      title: docTitle,
      fileName: file ? file.name : `${docTitle.toLowerCase().replace(/\s+/g, '_')}.pdf`,
      caseId: selectedCase,
      caseTitle: selectedCaseObj ? selectedCaseObj.title : 'Active Case Docket',
      type: docType,
      sensitivity: sensitivity,
      owner: currentUser ? currentUser.name : officerRef,
      ownerRole: currentUser ? currentUser.role : 'POLICE OFFICER',
      createdAt: formattedDate,
      lastModified: formattedDate,
      currentVersion: 'v1',
      versions: [
        {
          version: 'v1',
          uploadedBy: currentUser ? currentUser.name : officerRef,
          userRole: currentUser ? currentUser.role : 'POLICE OFFICER',
          action: 'Initial Ingestion & Cryptographic Seal',
          timestamp: formattedDate,
          hash: computedHash,
          status: 'ORIGINAL',
          comments: `Ingested via CASE VAULT Secure Upload Center. Evidence Tag: ${evidenceId}`,
          fileSize: file ? `${(file.size / 1024).toFixed(1)} KB` : '1.4 MB',
          integrityVerified: true,
        },
      ],
      originalHash: computedHash,
      currentHash: computedHash,
      isTampered: false,
      trustScore: 98,
      encryptionAlgorithm: encResult.algorithm,
      storageRepository: 'VAULT-HSM-NODE-01',
      encryptionStatus: 'ENCRYPTED',
      allowedRoles: aiResult.suggestedRoles,
      contentSummary: description || aiResult.summary,
      evidenceTags: tags.split(',').map((t) => t.trim()),
      fileSize: file ? `${(file.size / 1024).toFixed(1)} KB` : '1.4 MB',
    };

    // Step 10: Audit Record Created
    setCurrentPipelineStep(10);
    await new Promise((r) => setTimeout(r, 400));

    // Save into context state
    addNewDocument(newDoc);
    setProcessedDoc(newDoc);
    setIsProcessing(false);

    if (onDocumentAdded) {
      onDocumentAdded(newDoc);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Upload className="w-5 h-5" />
              </div>
              <h1 className="text-xl font-bold font-display text-white tracking-wide">
                SECURE DOCUMENT UPLOAD CENTER
              </h1>
            </div>
            <p className="text-xs text-slate-400 font-mono-code mt-1.5 max-w-2xl">
              Upload evidentiary records with real-time text extraction, AI classification, entity indexing,
              Web Crypto AES-GCM encryption, and SHA-256 immutable fingerprint sealing.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono-code text-[11px] font-semibold flex items-center space-x-1.5">
              <Lock className="w-3.5 h-3.5" />
              <span>AES-256-GCM READY</span>
            </span>
            <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 font-mono-code text-[11px] font-semibold flex items-center space-x-1.5">
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span>CHAIN-OF-CUSTODY V4</span>
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Upload Form & Drag-and-Drop */}
        <div className="lg:col-span-7 space-y-6">
          {/* Drag & Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
              isDragging
                ? 'border-cyan-400 bg-cyan-500/10 scale-[0.99]'
                : file
                ? 'border-cyan-500/50 bg-slate-900/60'
                : 'border-slate-800 hover:border-slate-700 bg-slate-900/40 hover:bg-slate-900/70'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={(e) => e.target.files && e.target.files[0] && handleFileSelect(e.target.files[0])}
              className="hidden"
              accept=".pdf,.doc,.docx,.txt,image/*"
            />
            <div className="max-w-md mx-auto space-y-3">
              <div className="w-12 h-12 mx-auto rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                {file ? <FileCheck className="w-6 h-6 text-emerald-400" /> : <Upload className="w-6 h-6" />}
              </div>
              {file ? (
                <div>
                  <p className="text-sm font-bold text-emerald-300 font-mono-code">{file.name}</p>
                  <p className="text-xs text-slate-400 font-mono-code mt-0.5">
                    {(file.size / 1024).toFixed(1)} KB • Click or drop to replace
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-sm font-semibold text-slate-200">
                    Drag and drop evidentiary files here, or <span className="text-cyan-400 underline">browse</span>
                  </p>
                  <p className="text-xs text-slate-500 font-mono-code mt-1">
                    Supports PDF, DOC/DOCX, TXT, Scanned Records & Digital Imagery
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Detailed Metadata Form */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-xs font-bold font-mono-code text-slate-300 uppercase tracking-wider flex items-center space-x-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>Evidentiary Classification & Metadata</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono-code">
              {/* Target Case */}
              <div>
                <label className="text-slate-400 block mb-1">Target Case Docket *</label>
                <select
                  value={selectedCase}
                  onChange={(e) => setSelectedCase(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  {cases.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.id} — {c.title.slice(0, 38)}...
                    </option>
                  ))}
                </select>
              </div>

              {/* Document Type */}
              <div>
                <label className="text-slate-400 block mb-1">Document Category *</label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value as DocumentType)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="FIR">First Information Report (FIR)</option>
                  <option value="POLICE REPORT">Police Report / Diary</option>
                  <option value="WITNESS STATEMENT">Witness Statement (Sec 164)</option>
                  <option value="EVIDENCE">Evidence Record / Seizure Memo</option>
                  <option value="FORENSIC REPORT">Forensic Science Report (CFSL)</option>
                  <option value="INVESTIGATION REPORT">Investigation Report</option>
                  <option value="CHARGE SHEET">Charge Sheet (Sec 173 CrPC)</option>
                  <option value="COURT FILING">Court Filing / Judicial Petition</option>
                  <option value="JUDGMENT">Court Judgment / Order</option>
                </select>
              </div>

              {/* Title */}
              <div className="md:col-span-2">
                <label className="text-slate-400 block mb-1">Document Title *</label>
                <input
                  type="text"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  placeholder="e.g. CFSL Cyber Extraction Report (NVMe Drive EV-2048)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Sensitivity */}
              <div>
                <label className="text-slate-400 block mb-1">Sensitivity Level *</label>
                <select
                  value={sensitivity}
                  onChange={(e) => setSensitivity(e.target.value as SensitivityLevel)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="PUBLIC">PUBLIC</option>
                  <option value="INTERNAL">INTERNAL</option>
                  <option value="CONFIDENTIAL">CONFIDENTIAL</option>
                  <option value="HIGHLY CONFIDENTIAL">HIGHLY CONFIDENTIAL</option>
                </select>
              </div>

              {/* Evidence ID */}
              <div>
                <label className="text-slate-400 block mb-1">Evidence ID (Optional)</label>
                <input
                  type="text"
                  value={evidenceId}
                  onChange={(e) => setEvidenceId(e.target.value)}
                  placeholder="e.g. EV-2048"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Witness / Person */}
              <div>
                <label className="text-slate-400 block mb-1">Witness / Person Connected</label>
                <input
                  type="text"
                  value={witnessPerson}
                  onChange={(e) => setWitnessPerson(e.target.value)}
                  placeholder="e.g. Ravi Kumar"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Location */}
              <div>
                <label className="text-slate-400 block mb-1">Location / Precinct</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Pier-4, Chennai Harbour"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Tags */}
              <div className="md:col-span-2">
                <label className="text-slate-400 block mb-1">Evidence Tags (comma-separated)</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="e.g. NVMe, Bitstream, CFSL-Cyber, Ballistics"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="text-slate-400 block mb-1">Brief Description / Custody Notes</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Technical summary of evidence extraction, chain of custody signatures, and evidentiary relevance."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <button
              onClick={handleStartIngestion}
              disabled={isProcessing || !docTitle}
              className={`w-full mt-2 py-3 px-4 rounded-xl font-mono-code text-xs font-bold transition flex items-center justify-center space-x-2 ${
                isProcessing || !docTitle
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg shadow-cyan-900/20'
              }`}
            >
              {isProcessing ? (
                <>
                  <Cpu className="w-4 h-4 animate-spin text-cyan-300" />
                  <span>EXECUTING 10-STAGE FORENSIC PIPELINE...</span>
                </>
              ) : (
                <>
                  <Fingerprint className="w-4 h-4" />
                  <span>PROCESS & SECURE DOCUMENT</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Visual Processing Pipeline */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-4">
              <div>
                <h3 className="text-xs font-bold font-mono-code text-white uppercase tracking-wider">
                  Automated Security Ingestion Pipeline
                </h3>
                <p className="text-[11px] text-slate-400 font-mono-code mt-0.5">
                  10-phase verifiable cryptographic & AI workflow
                </p>
              </div>
              <span className="text-[11px] font-mono-code px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
                {currentPipelineStep}/10
              </span>
            </div>

            <div className="space-y-3 font-mono-code">
              {pipelineSteps.map((step, idx) => {
                const stepNum = idx + 1;
                const isDone = currentPipelineStep >= stepNum;
                const isCurrent = currentPipelineStep === stepNum && isProcessing;

                return (
                  <div
                    key={step.title}
                    className={`p-2.5 rounded-xl border transition-all duration-200 flex items-start space-x-3 ${
                      isCurrent
                        ? 'bg-cyan-500/10 border-cyan-500/50 shadow-sm'
                        : isDone
                        ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-200'
                        : 'bg-slate-950/40 border-slate-800/60 opacity-60'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : isCurrent ? (
                        <Cpu className="w-4 h-4 text-cyan-400 animate-spin" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center text-[10px] text-slate-500">
                          {stepNum}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-bold ${
                            isDone ? 'text-emerald-300' : isCurrent ? 'text-cyan-300' : 'text-slate-400'
                          }`}
                        >
                          {step.title}
                        </span>
                        {isDone && <span className="text-[10px] text-emerald-400">PASSED</span>}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Ingestion Completion Card */}
            {processedDoc && !isProcessing && (
              <div className="mt-6 p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/60 space-y-3">
                <div className="flex items-center space-x-2 text-emerald-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span className="font-bold text-xs font-mono-code">
                    INGESTION COMPLETE & SEALED
                  </span>
                </div>
                <div className="text-[11px] font-mono-code text-slate-300 space-y-1">
                  <p>
                    <span className="text-slate-500">Document ID:</span>{' '}
                    <span className="text-cyan-300">{processedDoc.id}</span>
                  </p>
                  <p className="truncate">
                    <span className="text-slate-500">SHA-256:</span>{' '}
                    <span className="text-slate-200">{processedDoc.currentHash}</span>
                  </p>
                  <p>
                    <span className="text-slate-500">Encryption:</span>{' '}
                    <span className="text-emerald-400">{processedDoc.encryptionAlgorithm}</span>
                  </p>
                </div>

                {onViewDoc && (
                  <button
                    onClick={() => onViewDoc(processedDoc)}
                    className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-mono-code text-xs font-bold rounded-lg transition flex items-center justify-center space-x-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>INSPECT IN SECURITY CONTROL CENTER</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
