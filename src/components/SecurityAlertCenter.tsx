import React, { useState } from 'react';
import {
  AlertTriangle,
  AlertOctagon,
  ShieldAlert,
  CheckCircle2,
  Clock,
  User,
  FileText,
  Activity,
  ArrowRight,
  Sparkles,
  Zap,
  Shield,
  Gauge,
  Info,
} from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';
import { SecurityAlert } from '../types';
import { getRoleIcon, EmptyStateVisual } from './ForensicVisuals';

export const SecurityAlertCenter: React.FC = () => {
  const { alerts, dismissAlert, resolveAlert } = useSecurity();
  const [selectedAlert, setSelectedAlert] = useState<SecurityAlert | null>(alerts[0] || null);

  const getSeverityBadge = (severity: SecurityAlert['severity']) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-red-950/80 border-red-500/60 text-red-300 animate-alert-pulse';
      case 'HIGH':
        return 'bg-amber-950/70 border-amber-500/50 text-amber-300';
      case 'MEDIUM':
        return 'bg-blue-950/70 border-blue-500/50 text-blue-300';
      case 'LOW':
        return 'bg-slate-800 border-slate-700 text-slate-300';
    }
  };

  const getSeverityIcon = (severity: SecurityAlert['severity']) => {
    switch (severity) {
      case 'CRITICAL':
        return <AlertOctagon className="w-3 h-3 text-red-400 shrink-0" />;
      case 'HIGH':
        return <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />;
      case 'MEDIUM':
        return <Info className="w-3 h-3 text-blue-400 shrink-0" />;
      case 'LOW':
        return <CheckCircle2 className="w-3 h-3 text-slate-400 shrink-0" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
        <div>
          <div className="flex items-center space-x-2 text-red-400 text-xs font-mono-code mb-1">
            <ShieldAlert className="w-4 h-4" />
            <span>SECURITY OPERATIONS CENTER (SOC)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-display text-white">
            SECURITY ALERT COMMAND CENTER
          </h1>
          <p className="text-xs text-slate-400 font-mono-code mt-0.5">
            Real-time heuristic threat detection, behavioral velocity tracking, and cryptographic alarms.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono-code text-slate-400">
          <span className="px-2.5 py-1 rounded-lg bg-red-950/60 border border-red-800/60 text-red-300 font-bold">
            {alerts.filter((a) => a.status === 'ACTIVE').length} ACTIVE ALARMS
          </span>
        </div>
      </div>

      {/* Main Split View: Alerts List & Explainable Alert Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Alerts List */}
        <div className="lg:col-span-6 space-y-3">
          <h2 className="text-xs font-mono-code font-bold uppercase tracking-wider text-slate-400">
            DETECTED ANOMALIES & INCIDENTS ({alerts.length})
          </h2>

          <div className="space-y-3">
            {alerts.length === 0 ? (
              <EmptyStateVisual
                type="alerts"
                title="NO ACTIVE SECURITY ALARMS"
                description="Threat heuristics and velocity monitors report normal baseline activity across all sectors."
              />
            ) : (
              alerts.map((alert) => {
                const isSelected = selectedAlert?.id === alert.id;
                const isResolved = alert.status === 'RESOLVED';
                const isCritical = alert.severity === 'CRITICAL' && !isResolved;
                const RoleIcon = getRoleIcon(alert.role);
                const SeverityIcon = getSeverityIcon(alert.severity);

                return (
                  <div
                    key={alert.id}
                    onClick={() => setSelectedAlert(alert)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? isCritical
                          ? 'bg-red-950/40 border-red-500 ring-1 ring-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.2)]'
                          : 'bg-slate-900 border-cyan-400 ring-1 ring-cyan-400/40 shadow-lg'
                        : isResolved
                        ? 'bg-slate-900/40 border-slate-800/60 opacity-60'
                        : isCritical
                        ? 'bg-slate-900/90 border-red-500/50 hover:border-red-400'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5 font-mono-code text-xs">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded font-bold uppercase border ${getSeverityBadge(
                            alert.severity
                          )}`}
                        >
                          {SeverityIcon}
                          <span>{alert.severity}</span>
                        </span>
                        <span className="font-bold text-white text-sm">
                          {alert.title}
                        </span>
                      </div>

                      <span className="text-[10px] text-slate-400 shrink-0 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {alert.timestamp}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 font-mono-code line-clamp-2 mb-2">
                      {alert.description}
                    </p>

                    <div className="flex items-center justify-between text-[11px] font-mono-code text-slate-400 pt-2 border-t border-slate-800/80">
                      <div className="flex items-center gap-1.5">
                        <RoleIcon className="w-3.5 h-3.5 text-cyan-400" />
                        <span>
                          User: <strong className="text-slate-200">{alert.user}</strong> ({alert.role})
                        </span>
                      </div>
                      <div>
                        Status:{' '}
                        <strong className={isResolved ? 'text-emerald-400' : 'text-amber-400'}>
                          {alert.status}
                        </strong>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Explainable Security Alert Dossier (Section 25) */}
        <div className="lg:col-span-6">
          {selectedAlert ? (
            <div className={`bg-slate-900/90 border rounded-2xl p-6 space-y-5 sticky top-20 shadow-xl ${
              selectedAlert.severity === 'CRITICAL' && selectedAlert.status !== 'RESOLVED'
                ? 'border-red-500/50 shadow-[0_0_25px_rgba(239,68,68,0.15)]'
                : 'border-slate-800'
            }`}>
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-mono-code text-cyan-400 uppercase tracking-wider block">
                    INCIDENT EXPLAINABILITY DOSSIER #{selectedAlert.id}
                  </span>
                  <h3 className="text-lg font-bold font-display text-white mt-0.5 flex items-center gap-2">
                    {selectedAlert.severity === 'CRITICAL' && (
                      <AlertOctagon className="w-5 h-5 text-red-400 animate-alert-pulse shrink-0" />
                    )}
                    <span>{selectedAlert.title}</span>
                  </h3>
                </div>

                <span
                  className={`inline-flex items-center gap-1 text-[10px] px-2.5 py-1 rounded font-mono-code font-bold uppercase border ${getSeverityBadge(
                    selectedAlert.severity
                  )}`}
                >
                  {getSeverityIcon(selectedAlert.severity)}
                  <span>{selectedAlert.severity}</span>
                </span>
              </div>

              {/* Section 25: Explainable details */}
              <div className="space-y-3 font-mono-code text-xs">
                {/* Why it happened */}
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] uppercase font-bold block mb-1 flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                    WHY IT HAPPENED (ROOT CAUSE TELEMETRY):
                  </span>
                  <p className="text-white font-semibold leading-relaxed">
                    “{selectedAlert.detectedBehaviour || selectedAlert.description}”
                  </p>
                </div>

                {/* Detected Behaviour */}
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] uppercase font-bold block mb-1 flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5 text-cyan-400" />
                    DETECTED BEHAVIOURAL DRIFT:
                  </span>
                  <p className="text-cyan-300 leading-relaxed">
                    Abnormal query velocity / byte alteration exceeding standard profile baseline for {selectedAlert.role}.
                  </p>
                </div>

                {/* Risk Score Dial & Meter Bar */}
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-xs flex items-center gap-1.5">
                      <Gauge className="w-3.5 h-3.5 text-red-400" />
                      EVALUATED RISK SCORE:
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold font-display text-red-400">
                        {selectedAlert.riskScore} / 100
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800 font-bold">
                        {selectedAlert.riskScore > 75 ? 'CRITICAL ESCALATION' : 'HIGH RISK'}
                      </span>
                    </div>
                  </div>
                  {/* Subtle visual risk meter bar */}
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        selectedAlert.riskScore > 80
                          ? 'bg-gradient-to-r from-red-600 to-red-400'
                          : selectedAlert.riskScore > 50
                          ? 'bg-gradient-to-r from-amber-600 to-amber-400'
                          : 'bg-cyan-500'
                      }`}
                      style={{ width: `${Math.min(100, selectedAlert.riskScore)}%` }}
                    />
                  </div>
                </div>

                {/* Recommended Action */}
                <div className="p-3 bg-amber-950/20 rounded-xl border border-amber-500/30">
                  <span className="text-amber-400 text-[10px] uppercase font-bold block mb-1 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    RECOMMENDED MITIGATION ACTION:
                  </span>
                  <p className="text-amber-200 font-semibold leading-relaxed">
                    {selectedAlert.recommendedAction}
                  </p>
                </div>

                {/* Linked Document & Case */}
                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                  <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                    <span className="text-slate-500 block text-[10px] flex items-center gap-1">
                      <FileText className="w-3 h-3 text-cyan-400" /> CASE DOCKET
                    </span>
                    <span className="text-slate-200 font-bold">{selectedAlert.caseId || 'N/A'}</span>
                  </div>
                  <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                    <span className="text-slate-500 block text-[10px] flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" /> TIMESTAMP
                    </span>
                    <span className="text-slate-200 font-bold">{selectedAlert.timestamp}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-end space-x-2">
                <button
                  onClick={() => dismissAlert(selectedAlert.id)}
                  className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono-code text-xs rounded-lg transition"
                >
                  DISMISS
                </button>

                {selectedAlert.status !== 'RESOLVED' && (
                  <button
                    onClick={() => resolveAlert(selectedAlert.id)}
                    className="py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-mono-code text-xs font-bold rounded-lg shadow-lg hover:shadow-emerald-500/20 transition flex items-center space-x-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>[ MARK RESOLVED ]</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 bg-slate-900/40 border border-slate-800 rounded-2xl text-center text-slate-500 font-mono-code text-xs">
              Select an alert from the left list to view explainability telemetry.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
