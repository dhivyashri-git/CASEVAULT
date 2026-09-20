import React from 'react';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Scale,
  Search,
  Fingerprint,
  Eye,
  FileText,
  Lock,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Binary,
  Microscope,
  Briefcase,
  GitBranch,
  History,
  Share2,
  Sparkles,
  Users,
  Settings,
  AlertOctagon,
  FileCheck,
} from 'lucide-react';
import { UserRole } from '../types';

/**
 * Returns the designated icon for a user role per specification:
 * - Police / Police Officer → police badge / officer icon (ShieldCheck)
 * - Admin → shield / administrator icon (Shield)
 * - Legal Officer → legal document / scales icon (Scale)
 * - Investigator → investigation / search icon (Search)
 * - Forensic Officer → fingerprint / forensic icon (Fingerprint)
 * - Viewer → eye / viewing icon (Eye)
 */
export function getRoleIcon(role?: UserRole | string | null): React.ElementType {
  const normalized = (role || '').toUpperCase();
  if (normalized.includes('POLICE')) return ShieldCheck;
  if (normalized.includes('ADMIN')) return Shield;
  if (normalized.includes('LEGAL')) return Scale;
  if (normalized.includes('INVESTIGATOR')) return Search;
  if (normalized.includes('FORENSIC')) return Fingerprint;
  if (normalized.includes('VIEWER')) return Eye;
  return Shield;
}

/**
 * Returns the color scheme for a role
 */
export function getRoleTheme(role?: UserRole | string | null) {
  const normalized = (role || '').toUpperCase();
  if (normalized.includes('POLICE')) {
    return {
      text: 'text-blue-400',
      bg: 'bg-blue-950/40',
      border: 'border-blue-500/40',
      badge: 'bg-blue-950/60 text-blue-300 border-blue-600/50',
    };
  }
  if (normalized.includes('ADMIN')) {
    return {
      text: 'text-purple-400',
      bg: 'bg-purple-950/40',
      border: 'border-purple-500/40',
      badge: 'bg-purple-950/60 text-purple-300 border-purple-600/50',
    };
  }
  if (normalized.includes('LEGAL')) {
    return {
      text: 'text-emerald-400',
      bg: 'bg-emerald-950/40',
      border: 'border-emerald-500/40',
      badge: 'bg-emerald-950/60 text-emerald-300 border-emerald-600/50',
    };
  }
  if (normalized.includes('INVESTIGATOR')) {
    return {
      text: 'text-amber-400',
      bg: 'bg-amber-950/40',
      border: 'border-amber-500/40',
      badge: 'bg-amber-950/60 text-amber-300 border-amber-600/50',
    };
  }
  if (normalized.includes('FORENSIC')) {
    return {
      text: 'text-cyan-400',
      bg: 'bg-cyan-950/40',
      border: 'border-cyan-500/40',
      badge: 'bg-cyan-950/60 text-cyan-300 border-cyan-600/50',
    };
  }
  return {
    text: 'text-slate-400',
    bg: 'bg-slate-900/40',
    border: 'border-slate-700/50',
    badge: 'bg-slate-800 text-slate-300 border-slate-700',
  };
}

/**
 * Renders role with designated icon and styled badge
 */
export const RoleBadge: React.FC<{
  role: UserRole | string;
  showIcon?: boolean;
  size?: 'xs' | 'sm';
  className?: string;
}> = ({ role, showIcon = true, size = 'xs', className = '' }) => {
  const Icon = getRoleIcon(role);
  const theme = getRoleTheme(role);

  const sizeClasses =
    size === 'xs'
      ? 'text-[10px] px-2 py-0.5 gap-1'
      : 'text-xs px-2.5 py-1 gap-1.5';

  const iconSizes = size === 'xs' ? 'w-3 h-3' : 'w-3.5 h-3.5';

  return (
    <span
      className={`inline-flex items-center rounded-md font-mono-code font-bold uppercase border tracking-wider shrink-0 ${theme.badge} ${sizeClasses} ${className}`}
    >
      {showIcon && <Icon className={`${iconSizes} shrink-0`} />}
      <span>{role}</span>
    </span>
  );
};

/**
 * Returns designated icon for document categories
 */
export function getDocumentTypeIcon(type: string): React.ElementType {
  const normalized = (type || '').toUpperCase();
  if (normalized.includes('FIR')) return FileCheck;
  if (normalized.includes('WITNESS')) return Users;
  if (normalized.includes('EVIDENCE')) return Binary;
  if (normalized.includes('FORENSIC')) return Microscope;
  if (normalized.includes('CHARGE SHEET')) return FileSpreadsheet;
  if (normalized.includes('COURT') || normalized.includes('JUDICIAL') || normalized.includes('JUDGMENT'))
    return Scale;
  if (normalized.includes('POLICE')) return ShieldCheck;
  return FileText;
}

/**
 * Minimal vector illustration for Digital Forensics & Fingerprint
 */
export const ForensicFingerprintGraphic: React.FC<{
  className?: string;
  scanning?: boolean;
}> = ({ className = 'w-16 h-16', scanning = true }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full text-cyan-500/40"
      >
        <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
        <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="1" opacity="0.6" />
        {/* Stylized Fingerprint ridges */}
        <path
          d="M50 20C33.4 20 20 33.4 20 50C20 62 27 72 37 77"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M30 50C30 39 39 30 50 30C61 30 70 39 70 50C70 65 58 76 45 78"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M40 50C40 44.5 44.5 40 50 40C55.5 40 60 44.5 60 50C60 60 52 68 44 68"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M50 48V54"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M63 72C68 67 71 60 71 52"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Corner alignment markers */}
        <path d="M12 24V14H22" stroke="currentColor" strokeWidth="1.5" />
        <path d="M78 14H88V24" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 76V86H22" stroke="currentColor" strokeWidth="1.5" />
        <path d="M78 86H88V76" stroke="currentColor" strokeWidth="1.5" />
      </svg>

      {/* Laser Scanning Line */}
      {scanning && (
        <div className="absolute inset-x-2 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_8px_#22d3ee] animate-laser pointer-events-none" />
      )}
    </div>
  );
};

/**
 * Minimal vector illustration for Shield Vault & Data Security
 */
export const ShieldVaultGraphic: React.FC<{
  className?: string;
  isTampered?: boolean;
}> = ({ className = 'w-16 h-16', isTampered = false }) => {
  const color = isTampered ? 'text-red-500' : 'text-cyan-400';
  const glow = isTampered ? 'shadow-[0_0_12px_rgba(239,68,68,0.5)]' : 'shadow-[0_0_12px_rgba(6,182,212,0.3)]';

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full ${color}`}
      >
        <path
          d="M50 12L82 24V48C82 70 68 85 50 92C32 85 18 70 18 48V24L50 12Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
          className={glow}
        />
        <path
          d="M50 22L74 31V48C74 65 63 77 50 83C37 77 26 65 26 48V31L50 22Z"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="2 2"
          opacity="0.6"
        />
        {/* Core Lock / Checkmark */}
        {isTampered ? (
          <>
            <path d="M40 42L60 62" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            <path d="M60 42L40 62" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </>
        ) : (
          <>
            <rect x="42" y="48" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
            <path d="M46 48V42C46 39.8 47.8 38 50 38C52.2 38 54 39.8 54 42V48" stroke="currentColor" strokeWidth="2" />
            <circle cx="50" cy="54" r="1.5" fill="currentColor" />
          </>
        )}
      </svg>
    </div>
  );
};

/**
 * Empty state minimal vector graphics
 */
export const EmptyStateVisual: React.FC<{
  type?: 'documents' | 'alerts' | 'history' | 'cases' | 'search';
  title: string;
  description: string;
  className?: string;
}> = ({ type = 'documents', title, description, className = '' }) => {
  return (
    <div
      className={`p-8 text-center flex flex-col items-center justify-center bg-slate-950/40 border border-slate-800/80 rounded-2xl ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mb-3 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent opacity-50" />
        {type === 'documents' && <FileText className="w-7 h-7 text-cyan-400/70" />}
        {type === 'alerts' && <AlertOctagon className="w-7 h-7 text-red-400/70" />}
        {type === 'history' && <History className="w-7 h-7 text-purple-400/70" />}
        {type === 'cases' && <Briefcase className="w-7 h-7 text-blue-400/70" />}
        {type === 'search' && <Search className="w-7 h-7 text-amber-400/70" />}
      </div>
      <h4 className="text-sm font-bold font-display text-slate-300 tracking-wider mb-1">
        {title}
      </h4>
      <p className="text-xs text-slate-500 font-mono-code max-w-sm">
        {description}
      </p>
    </div>
  );
};
