import React, { useState } from 'react';
import {
  History,
  Search,
  Download,
  Filter,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Clock,
  User,
  Globe,
  FileText,
  AlertOctagon,
  Laptop,
  Lock,
  Eye,
  Upload,
  AlertTriangle,
  Key,
  ShieldBan,
  ArrowUpRight,
  Edit3,
} from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';
import { AuditRecord, AuditStatus, SecurityLevelType } from '../types';
import { getRoleIcon, EmptyStateVisual } from './ForensicVisuals';

export const AuditTrailView: React.FC = () => {
  const { auditLogs } = useSecurity();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<AuditStatus | 'ALL'>('ALL');
  const [selectedRecord, setSelectedRecord] = useState<AuditRecord | null>(null);

  const filteredLogs = auditLogs.filter((log) => {
    const matchesStatus = statusFilter === 'ALL' || log.status === statusFilter;
    const matchesSearch =
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.documentTitle || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.caseId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.ip || '').toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const handleExportAudit = () => {
    const jsonContent = JSON.stringify(filteredLogs, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CASEVAULT-AUDIT-REPORT-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: AuditStatus) => {
    switch (status) {
      case 'ALLOWED':
        return 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300';
      case 'BLOCKED':
        return 'bg-red-950/70 border-red-500/50 text-red-300 animate-alert-pulse';
      case 'STEP_UP_REQUIRED':
        return 'bg-amber-950/60 border-amber-500/40 text-amber-300';
      case 'FLAGGED':
        return 'bg-purple-950/60 border-purple-500/40 text-purple-300';
    }
  };

  const getStatusIcon = (status: AuditStatus) => {
    switch (status) {
      case 'ALLOWED':
        return <ShieldCheck className="w-3 h-3 text-emerald-400" />;
      case 'BLOCKED':
        return <ShieldBan className="w-3 h-3 text-red-400" />;
      case 'STEP_UP_REQUIRED':
        return <Key className="w-3 h-3 text-amber-400" />;
      case 'FLAGGED':
        return <ShieldAlert className="w-3 h-3 text-purple-400" />;
    }
  };

  const getActionIcon = (action: string) => {
    const act = action.toUpperCase();
    if (act.includes('VIEW') || act.includes('OPEN') || act.includes('READ')) {
      return <Eye className="w-3.5 h-3.5 text-cyan-400" />;
    }
    if (act.includes('EXPORT') || act.includes('DOWNLOAD')) {
      return <Download className="w-3.5 h-3.5 text-blue-400" />;
    }
    if (act.includes('EDIT') || act.includes('UPDATE') || act.includes('REVISE') || act.includes('MODIFY')) {
      return <Edit3 className="w-3.5 h-3.5 text-amber-400" />;
    }
    if (act.includes('PERMISSION') || act.includes('ROLE') || act.includes('POLICY') || act.includes('AUTH') || act.includes('KEY')) {
      return <Key className="w-3.5 h-3.5 text-cyan-400" />;
    }
    if (act.includes('VERIF') || act.includes('CHECK') || act.includes('INTEGRITY') || act.includes('RESTORE')) {
      return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
    }
    if (act.includes('TAMPER') || act.includes('ALERT') || act.includes('BREACH') || act.includes('BLOCK')) {
      return <AlertTriangle className="w-3.5 h-3.5 text-red-400" />;
    }
    if (act.includes('UPLOAD') || act.includes('CREATE')) {
      return <Upload className="w-3.5 h-3.5 text-emerald-400" />;
    }
    return <FileText className="w-3.5 h-3.5 text-slate-400" />;
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
        <div>
          <div className="flex items-center space-x-2 text-purple-400 text-xs font-mono-code mb-1">
            <History className="w-4 h-4" />
            <span>IMMUTABLE EVIDENCE LEDGER</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-display text-white">
            FORENSIC AUDIT TRAIL
          </h1>
          <p className="text-xs text-slate-400 font-mono-code mt-0.5">
            Cryptographically stamped logs of every viewing, upload, step-up attestation, and block event.
          </p>
        </div>

        <button
          onClick={handleExportAudit}
          className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-mono-code text-xs font-bold rounded-xl transition flex items-center justify-center space-x-2 shrink-0"
        >
          <Download className="w-4 h-4 text-cyan-400" />
          <span>[ EXPORT AUDIT REPORT (JSON) ]</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 font-mono-code text-xs">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by user, action, case, IP, or document..."
            className="w-full pl-9 pr-4 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto pb-1">
          {(['ALL', 'ALLOWED', 'BLOCKED', 'STEP_UP_REQUIRED', 'FLAGGED'] as (AuditStatus | 'ALL')[]).map(
            (status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg border transition whitespace-nowrap ${
                  statusFilter === status
                    ? 'bg-purple-950/80 border-purple-500/50 text-purple-300 font-bold'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {status.replace('_', ' ')}
              </button>
            )
          )}
        </div>
      </div>

      {/* Immutable Audit Ledger Table (Section 34: WHO, WHAT, WHEN, WHERE, STATUS) */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono-code text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">WHO (USER / ROLE)</th>
                <th className="py-3 px-4">WHAT (ACTION / RECORD)</th>
                <th className="py-3 px-4">WHEN (TIMESTAMP)</th>
                <th className="py-3 px-4">WHERE (IP / CLIENT)</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4 text-right">INSPECT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8">
                    <EmptyStateVisual
                      type="history"
                      title="NO MATCHING AUDIT RECORDS"
                      description="No immutable ledger logs matched the selected status category or search query."
                    />
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const RoleIcon = getRoleIcon(log.role);
                  const ActionIcon = getActionIcon(log.action);
                  const statusIcon = getStatusIcon(log.status);

                  return (
                    <tr
                      key={log.id}
                      onClick={() => setSelectedRecord(log)}
                      className="hover:bg-slate-800/40 cursor-pointer transition-colors group"
                    >
                      {/* WHO */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                            <RoleIcon className="w-3.5 h-3.5 text-cyan-400" />
                          </div>
                          <div>
                            <div className="font-semibold text-white group-hover:text-cyan-300 transition-colors">
                              {log.user}
                            </div>
                            <div className="text-[10px] text-cyan-400/90 font-mono-code">{log.role}</div>
                          </div>
                        </div>
                      </td>

                      {/* WHAT */}
                      <td className="py-3 px-4">
                        <div className="flex items-start gap-1.5">
                          <span className="mt-0.5 shrink-0">{ActionIcon}</span>
                          <div>
                            <div className="font-bold text-slate-100">{log.action}</div>
                            <div className="text-[11px] text-slate-400 truncate max-w-[200px]">
                              {log.caseId}: {log.documentTitle}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* WHEN */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-slate-200">
                          <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span>{log.time}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 pl-5">{log.date}</div>
                      </td>

                      {/* WHERE */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-cyan-300">
                          <Globe className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span>{log.ip}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[130px] pl-5">
                          {log.location}
                        </div>
                      </td>

                      {/* STATUS */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getStatusBadge(
                            log.status
                          )}`}
                        >
                          {statusIcon}
                          <span>{log.status.replace('_', ' ')}</span>
                        </span>
                      </td>

                      {/* INSPECT */}
                      <td className="py-3 px-4 text-right">
                        <button className="text-[11px] text-purple-400 hover:text-purple-300 flex items-center justify-end gap-1 ml-auto">
                          <span>Detail</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Inspection Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg bg-slate-950 border border-purple-500/50 rounded-2xl p-6 shadow-2xl glow-purple font-mono-code text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <History className="w-4 h-4 text-purple-400" />
                IMMUTABLE AUDIT RECORD #{selectedRecord.id}
              </h3>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-500">Actor Identity:</span>
                <span className="text-white font-bold">{selectedRecord.user} ({selectedRecord.role})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-500">Operation Action:</span>
                <span className="text-cyan-300 font-bold">{selectedRecord.action}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-500">Document / Docket:</span>
                <span className="text-slate-200">{selectedRecord.documentTitle} ({selectedRecord.caseId})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-500">Execution Status:</span>
                <span className="text-white font-bold">{selectedRecord.status}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-500">Risk Assessment:</span>
                <span className="text-amber-400 font-bold">{selectedRecord.securityLevel} (Score: {selectedRecord.riskScore})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-500">Client Environment:</span>
                <span className="text-slate-300">{selectedRecord.ip} • {selectedRecord.location}</span>
              </div>
              <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-slate-500 text-[10px] block">LEDGER CRYPTOGRAPHIC SIGNATURE:</span>
                <p className="text-[10px] text-purple-300 break-all select-all">
                  SHA-256:{selectedRecord.hash}
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedRecord(null)}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-semibold"
            >
              CLOSE RECORD
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
