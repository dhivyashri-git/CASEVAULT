import React from 'react';
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  FileCheck,
  Users,
  Package,
  Fingerprint,
  FileSpreadsheet,
  Scale,
  Layers,
  ShieldCheck,
  Cpu,
  History,
  AlertTriangle,
  Share2,
  Sparkles,
  UserCheck,
  Settings,
  LogOut,
  ChevronRight,
  Upload,
  Network,
  Lock,
  Bot,
} from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';
import { SidebarPage } from '../types';

interface NavItem {
  id: SidebarPage;
  label: string;
  icon: React.ElementType;
  badge?: () => string | number | null;
  badgeColor?: string;
}

export const Sidebar: React.FC = () => {
  const {
    activePage,
    setActivePage,
    isPageAllowed,
    logout,
    alerts,
    documents,
    cases,
  } = useSecurity();

  const allNavItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    {
      id: 'documents',
      label: 'Documents',
      icon: FileText,
      badge: () => documents.length,
      badgeColor: 'bg-cyan-950 text-cyan-300 border-cyan-800',
    },
    {
      id: 'cases',
      label: 'Cases',
      icon: Briefcase,
      badge: () => cases.length,
      badgeColor: 'bg-blue-950 text-blue-300 border-blue-800',
    },
    { id: 'secure_upload', label: 'Secure Upload', icon: Upload },
    { id: 'ai_intelligence', label: 'AI Intelligence', icon: Sparkles },
    { id: 'cross_case', label: 'Cross-Case Intel', icon: Share2 },
    { id: 'evidence_graph', label: 'Evidence Graph', icon: Network },
    { id: 'ai_assistant', label: 'Investigation Copilot', icon: Bot },
    { id: 'encryption_portal', label: 'Encryption Portal', icon: Lock },
    { id: 'fir', label: 'FIR', icon: FileCheck },
    { id: 'witness', label: 'Witness Statements', icon: Users },
    { id: 'evidence', label: 'Evidence', icon: Package },
    { id: 'forensic', label: 'Forensic Reports', icon: Fingerprint },
    { id: 'charge_sheets', label: 'Charge Sheets', icon: FileSpreadsheet },
    { id: 'court_filings', label: 'Court Filings', icon: Scale },
    { id: 'version_control', label: 'Version Control', icon: Layers },
    { id: 'integrity', label: 'Document Integrity', icon: ShieldCheck },
    { id: 'adaptive_security', label: 'Adaptive Security', icon: Cpu },
    { id: 'audit_trail', label: 'Audit Trail', icon: History },
    {
      id: 'security_alerts',
      label: 'Security Alerts',
      icon: AlertTriangle,
      badge: () => {
        const activeCount = alerts.filter((a) => a.status === 'ACTIVE').length;
        return activeCount > 0 ? activeCount : null;
      },
      badgeColor: 'bg-red-950 text-red-300 border-red-800 animate-alert-pulse',
    },
    { id: 'secure_sharing', label: 'Secure Sharing', icon: Share2 },
    { id: 'ai_classification', label: 'AI Classification', icon: Sparkles },
    { id: 'users_rbac', label: 'Users & RBAC', icon: UserCheck },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  // Filter according to current user's role per specification
  const allowedNavItems = allNavItems.filter((item) => isPageAllowed(item.id));

  return (
    <aside className="w-64 bg-[#070c18] border-r border-slate-800/80 flex flex-col justify-between shrink-0 h-[calc(100vh-61px)] sticky top-[61px] overflow-y-auto">
      <div className="p-3">
        {/* Navigation Category Label */}
        <div className="px-3 py-2 text-[10px] font-mono-code uppercase tracking-wider text-slate-500 font-semibold flex items-center justify-between">
          <span>OPERATIONAL MODULES</span>
          <span className="text-cyan-500/70">{allowedNavItems.length} PERMITTED</span>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1 mt-1">
          {allowedNavItems.map((item) => {
            const isActive = activePage === item.id;
            const Icon = item.icon;
            const badgeValue = item.badge ? item.badge() : null;

            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-mono-code transition-all duration-150 ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-200 border border-cyan-500/40 shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 border border-transparent'
                }`}
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-cyan-400' : 'text-slate-500'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                <div className="flex items-center space-x-1 shrink-0 ml-2">
                  {badgeValue !== null && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded border font-bold ${
                        item.badgeColor || 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {badgeValue}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />}
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile / Logout action */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
        <button
          onClick={logout}
          className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-mono-code text-slate-400 hover:text-red-400 hover:bg-red-950/20 border border-transparent hover:border-red-900/40 transition"
        >
          <LogOut className="w-4 h-4 text-slate-500" />
          <span>TERMINATE SESSION</span>
        </button>
      </div>
    </aside>
  );
};
