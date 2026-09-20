import React from 'react';
import {
  UserCheck,
  Shield,
  Lock,
  Key,
  Check,
  X,
  Clock,
  User,
  Fingerprint,
} from 'lucide-react';
import { DEMO_USERS } from '../data/mockData';
import { UserRole } from '../types';

const RBAC_PERMISSIONS_MATRIX: {
  capability: string;
  admin: boolean;
  police: boolean;
  legal: boolean;
  investigator: boolean;
  forensic: boolean;
  viewer: boolean;
}[] = [
  { capability: 'View Classified Evidence', admin: true, police: true, legal: true, investigator: true, forensic: true, viewer: false },
  { capability: 'Deposit New Documents', admin: true, police: true, legal: false, investigator: true, forensic: true, viewer: false },
  { capability: 'Create New Revisions (v2, v3)', admin: true, police: false, legal: true, investigator: true, forensic: true, viewer: false },
  { capability: 'Simulate Integrity Tampering', admin: true, police: true, legal: true, investigator: true, forensic: true, viewer: false },
  { capability: 'Export Immutable Audit Reports', admin: true, police: false, legal: true, investigator: true, forensic: false, viewer: false },
  { capability: 'Acknowledge & Resolve SOC Alerts', admin: true, police: false, legal: false, investigator: true, forensic: false, viewer: false },
  { capability: 'Execute Step-Up Biometric Attestation', admin: true, police: true, legal: true, investigator: true, forensic: true, viewer: true },
  { capability: 'Generate Cryptographic Share Tokens', admin: true, police: true, legal: true, investigator: true, forensic: false, viewer: false },
  { capability: 'Configure Adaptive Security Engine', admin: true, police: false, legal: false, investigator: false, forensic: false, viewer: false },
];

export const UsersRbacView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
        <div className="flex items-center space-x-2 text-cyan-400 text-xs font-mono-code mb-1">
          <UserCheck className="w-4 h-4" />
          <span>ZERO-TRUST GOVERNANCE & ACCESS CONTROL</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold font-display text-white">
          ROLE-BASED ACCESS CONTROL (RBAC) MATRIX
        </h1>
        <p className="text-xs text-slate-400 font-mono-code mt-0.5">
          Explicit clearance tiers, session policy lifetimes, and mandatory least-privilege enforcement.
        </p>
      </div>

      {/* User Accounts Grid */}
      <div>
        <h2 className="text-xs font-mono-code font-bold uppercase tracking-wider text-slate-400 mb-3">
          ENROLLED GOVERNMENT PERSONNEL PROFILES ({DEMO_USERS.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 font-mono-code text-xs">
          {DEMO_USERS.map((user) => (
            <div
              key={user.username}
              className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-white text-sm">{user.name}</h3>
                  <span className="text-[11px] text-cyan-400 font-semibold">{user.role}</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold text-[10px]">
                  {user.clearanceLevel}
                </span>
              </div>

              <div className="space-y-1 text-slate-400 text-[11px] pt-1 border-t border-slate-800">
                <div className="flex justify-between">
                  <span>Department:</span>
                  <span className="text-slate-200">{user.department}</span>
                </div>
                <div className="flex justify-between">
                  <span>Username:</span>
                  <span className="text-cyan-300 font-bold">"{user.username}"</span>
                </div>
                <div className="flex justify-between">
                  <span>Passcode:</span>
                  <span className="text-slate-300">"{user.password}"</span>
                </div>
                <div className="flex justify-between">
                  <span>Session Lifetime:</span>
                  <span className="text-amber-400 font-bold">{user.sessionTimeoutSeconds}s timeout</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Permission Matrix Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-xs font-mono-code font-bold uppercase tracking-wider text-slate-300">
            CAPABILITY & ENTITLEMENT PERMISSION MATRIX
          </h3>
          <span className="text-[11px] font-mono-code text-cyan-400">
            Enforced via Hardware Token & Kernel RBAC
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono-code text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 text-[10px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">SECURITY CAPABILITY</th>
                <th className="py-3 px-2 text-center text-purple-400">ADMIN</th>
                <th className="py-3 px-2 text-center text-blue-400">POLICE</th>
                <th className="py-3 px-2 text-center text-emerald-400">LEGAL</th>
                <th className="py-3 px-2 text-center text-amber-400">INVESTIGATOR</th>
                <th className="py-3 px-2 text-center text-cyan-400">FORENSIC</th>
                <th className="py-3 px-2 text-center text-slate-400">VIEWER</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {RBAC_PERMISSIONS_MATRIX.map((row) => (
                <tr key={row.capability} className="hover:bg-slate-800/30 transition">
                  <td className="py-3 px-4 text-white font-semibold">{row.capability}</td>
                  <td className="py-3 px-2 text-center">
                    {row.admin ? (
                      <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-slate-600 mx-auto" />
                    )}
                  </td>
                  <td className="py-3 px-2 text-center">
                    {row.police ? (
                      <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-slate-600 mx-auto" />
                    )}
                  </td>
                  <td className="py-3 px-2 text-center">
                    {row.legal ? (
                      <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-slate-600 mx-auto" />
                    )}
                  </td>
                  <td className="py-3 px-2 text-center">
                    {row.investigator ? (
                      <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-slate-600 mx-auto" />
                    )}
                  </td>
                  <td className="py-3 px-2 text-center">
                    {row.forensic ? (
                      <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-slate-600 mx-auto" />
                    )}
                  </td>
                  <td className="py-3 px-2 text-center">
                    {row.viewer ? (
                      <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-slate-600 mx-auto" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
