import React, { useState } from 'react';
import {
  FolderLock,
  Search,
  Plus,
  ShieldCheck,
  ShieldAlert,
  Copy,
  Check,
  Eye,
  Lock,
  AlertTriangle,
  RefreshCw,
  Filter,
  FileText,
  Fingerprint,
} from 'lucide-react';
import { SecureDocument, DocumentType, SensitivityLevel } from '../types';
import { useSecurity } from '../context/SecurityContext';
import { getDocumentTypeIcon, EmptyStateVisual } from './ForensicVisuals';

interface DocumentVaultViewProps {
  onOpenDetails: (doc: SecureDocument) => void;
  onOpenSecurely: (doc: SecureDocument) => void;
  onOpenUpload: () => void;
  filterType?: DocumentType | 'ALL';
}

const CATEGORY_TABS: { id: DocumentType | 'ALL'; label: string; sensitivity?: SensitivityLevel }[] = [
  { id: 'ALL', label: 'All Documents' },
  { id: 'FIR', label: 'FIR', sensitivity: 'CONFIDENTIAL' },
  { id: 'WITNESS STATEMENT', label: 'Witness Statements', sensitivity: 'HIGHLY CONFIDENTIAL' },
  { id: 'EVIDENCE', label: 'Evidence', sensitivity: 'CONFIDENTIAL' },
  { id: 'FORENSIC REPORT', label: 'Forensic Reports', sensitivity: 'HIGHLY CONFIDENTIAL' },
  { id: 'CHARGE SHEET', label: 'Charge Sheets', sensitivity: 'HIGHLY CONFIDENTIAL' },
  { id: 'COURT FILING', label: 'Court Filings', sensitivity: 'CONFIDENTIAL' },
  { id: 'POLICE REPORT', label: 'Police Reports', sensitivity: 'INTERNAL' },
  { id: 'JUDGMENT', label: 'Judgments', sensitivity: 'CONFIDENTIAL' },
];

export const DocumentVaultView: React.FC<DocumentVaultViewProps> = ({
  onOpenDetails,
  onOpenSecurely,
  onOpenUpload,
  filterType = 'ALL',
}) => {
  const { documents, simulateTampering, restoreDocumentIntegrity } = useSecurity();
  const [activeTab, setActiveTab] = useState<DocumentType | 'ALL'>(filterType);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Sync if filterType prop changes
  React.useEffect(() => {
    setActiveTab(filterType);
  }, [filterType]);

  const filteredDocs = documents.filter((doc) => {
    const matchesTab = activeTab === 'ALL' || doc.type === activeTab;
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.caseId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.currentHash.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleCopyHash = (doc: SecureDocument, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(doc.currentHash);
    setCopiedId(doc.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const getSensitivityBadge = (s: SensitivityLevel) => {
    switch (s) {
      case 'HIGHLY CONFIDENTIAL':
        return 'bg-red-950/60 border-red-700/60 text-red-300';
      case 'CONFIDENTIAL':
        return 'bg-amber-950/60 border-amber-700/60 text-amber-300';
      case 'INTERNAL':
        return 'bg-blue-950/60 border-blue-700/60 text-blue-300';
      case 'PUBLIC':
        return 'bg-slate-800 border-slate-700 text-slate-300';
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Banner & Upload Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-mono-code mb-1">
            <FolderLock className="w-4 h-4" />
            <span>CENTRALIZED EVIDENCE REPOSITORY</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-display text-white">
            SECURE REPOSITORY VAULT
          </h1>
          <p className="text-xs text-slate-400 font-mono-code mt-0.5">
            Single unified ledger for all criminal, forensic, and judicial records. Zero fragmented silos.
          </p>
        </div>

        <button
          onClick={onOpenUpload}
          className="py-2.5 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono-code text-xs font-bold rounded-xl shadow-lg hover:shadow-cyan-500/20 transition flex items-center justify-center space-x-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>DEPOSIT NEW EVIDENCE (AI CLASSIFIED)</span>
        </button>
      </div>

      {/* Category Pills (Section 15) */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORY_TABS.map((tab) => {
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono-code whitespace-nowrap transition flex items-center space-x-1.5 border ${
                isSelected
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 font-bold shadow-sm'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <span>{tab.label}</span>
              {tab.sensitivity && (
                <span className="text-[9px] px-1 py-0.2 rounded bg-slate-950 text-slate-400 border border-slate-700">
                  {tab.sensitivity === 'HIGHLY CONFIDENTIAL' ? 'HIGH CONF' : tab.sensitivity}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Search Bar & Result Count */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, case docket, filename, or SHA-256 hash..."
            className="w-full pl-9 pr-4 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono-code"
          />
        </div>
        <div className="text-xs font-mono-code text-slate-400">
          Showing <strong className="text-cyan-400">{filteredDocs.length}</strong> authenticated records
        </div>
      </div>

      {/* Document Grid (Section 18 Cards) */}
      {filteredDocs.length === 0 ? (
        <EmptyStateVisual
          type="documents"
          title="NO MATCHING DOCUMENTS FOUND"
          description="Adjust your search query or sensitivity category filter to retrieve authenticated records from the ledger."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.map((doc) => {
            const isTampered = doc.isTampered;
            const isCopied = copiedId === doc.id;
            const DocIcon = getDocumentTypeIcon(doc.type);

            return (
              <div
                key={doc.id}
                className={`bg-slate-900/80 hover:bg-slate-900 border rounded-2xl p-4 transition-all duration-200 shadow-sm flex flex-col justify-between relative overflow-hidden ${
                  isTampered
                    ? 'border-red-500/70 glow-red'
                    : 'border-slate-800 hover:border-cyan-500/40'
                }`}
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/80 text-cyan-300 font-mono-code font-bold uppercase truncate max-w-[150px] flex items-center gap-1">
                      <DocIcon className="w-3 h-3 shrink-0 text-cyan-400" />
                      <span className="truncate">{doc.type}</span>
                    </span>

                    <div className="flex items-center space-x-1.5 shrink-0">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 font-mono-code font-bold">
                        {doc.currentVersion}
                      </span>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-mono-code font-bold border uppercase ${getSensitivityBadge(
                          doc.sensitivity
                        )}`}
                      >
                        {doc.sensitivity === 'HIGHLY CONFIDENTIAL' ? 'HIGH CONF' : doc.sensitivity}
                      </span>
                    </div>
                  </div>

                  {/* Title & Case */}
                  <h3 className="text-sm font-bold font-display text-white line-clamp-1 mb-1">
                    {doc.title}
                  </h3>
                  <div className="flex items-center space-x-2 text-[11px] font-mono-code text-slate-400 mb-3">
                    <span className="text-cyan-400 font-semibold">{doc.caseId}</span>
                    <span>•</span>
                    <span>{doc.owner}</span>
                  </div>

                  {/* SHA-256 Hash Snippet */}
                  <div className="p-2 bg-slate-950/90 rounded-lg border border-slate-800/90 font-mono-code text-[11px] mb-3">
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mb-0.5">
                      <span className="flex items-center gap-1">
                        <Fingerprint className="w-3 h-3 text-cyan-500" /> SHA-256 FINGERPRINT:
                      </span>
                      <button
                        onClick={(e) => handleCopyHash(doc, e)}
                        className="text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
                      >
                        {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{isCopied ? 'COPIED' : 'COPY'}</span>
                      </button>
                    </div>
                    <p className="truncate text-slate-300 font-mono-code text-[10px]">
                      {doc.currentHash}
                    </p>
                  </div>

                  {/* Integrity & Trust Score Indicator */}
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/60 text-xs font-mono-code mb-4">
                    <div className="flex items-center space-x-1.5">
                      {isTampered ? (
                        <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
                      ) : (
                        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                      <span
                        className={`font-bold text-[11px] ${
                          isTampered ? 'text-red-400' : 'text-emerald-400'
                        }`}
                      >
                        {isTampered ? 'TAMPERING SUSPECTED' : 'VERIFIED MATCH'}
                      </span>
                    </div>

                    <span className="text-[11px] text-slate-400">
                      Trust: <strong className={isTampered ? 'text-red-400' : 'text-cyan-300'}>{doc.trustScore}%</strong>
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onOpenDetails(doc)}
                      className="py-1.5 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono-code text-[11px] rounded-lg transition flex items-center justify-center space-x-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>VIEW DETAILS</span>
                    </button>

                    <button
                      onClick={() => onOpenSecurely(doc)}
                      className="py-1.5 px-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-mono-code text-[11px] font-bold rounded-lg transition flex items-center justify-center space-x-1 shadow-sm"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>OPEN SECURELY</span>
                    </button>
                  </div>

                  {/* Tampering Simulation Button */}
                  {isTampered ? (
                    <button
                      onClick={() => restoreDocumentIntegrity(doc.id)}
                      className="w-full py-1.5 px-2 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900 font-mono-code text-[10px] font-bold transition flex items-center justify-center space-x-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>[ RESTORE ORIGINAL INTEGRITY HASH ]</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => simulateTampering(doc.id)}
                      className="w-full py-1.5 px-2 rounded-lg bg-red-950/30 hover:bg-red-950/60 border border-red-900/40 hover:border-red-500/40 text-red-400 font-mono-code text-[10px] transition flex items-center justify-center space-x-1"
                    >
                      <AlertTriangle className="w-3 h-3" />
                      <span>[ SIMULATE TAMPERING ]</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
