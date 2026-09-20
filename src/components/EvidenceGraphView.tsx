import React, { useState } from 'react';
import {
  Share2,
  Filter,
  Eye,
  Lock,
  Layers,
  Search,
  User,
  FolderOpen,
  FileText,
  Fingerprint,
  MapPin,
  Building,
  Calendar,
  Sparkles,
  Info,
} from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';
import { EvidenceGraphNode, EvidenceGraphEdge } from '../types';

export const EvidenceGraphView: React.FC = () => {
  const { currentUser } = useSecurity();
  const userClearance = currentUser?.clearanceLevel || 'INTERNAL';

  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedNode, setSelectedNode] = useState<EvidenceGraphNode | null>(null);

  // Nodes for CASE-1024 ecosystem
  const initialNodes: EvidenceGraphNode[] = [
    { id: 'case-1024', label: 'CASE-1024 (Homicide)', category: 'CASE', subLabel: 'State vs. Alok Verma', clearanceRequired: 'INTERNAL', x: 400, y: 220 },
    { id: 'person-alok', label: 'Alok Verma', category: 'PERSON', subLabel: 'Primary Accused', clearanceRequired: 'CONFIDENTIAL', x: 220, y: 120 },
    { id: 'person-ravi', label: 'Ravi Kumar', category: 'PERSON', subLabel: 'Associate / "RK"', clearanceRequired: 'CONFIDENTIAL', x: 580, y: 120 },
    { id: 'person-deepak', label: 'Deepak S. Nair', category: 'PERSON', subLabel: 'Eyewitness', clearanceRequired: 'CONFIDENTIAL', x: 220, y: 320 },
    { id: 'evd-2048', label: 'EV-2048 (NVMe Drive)', category: 'EVIDENCE', subLabel: 'Encrypted Digital Media', clearanceRequired: 'CONFIDENTIAL', x: 400, y: 80 },
    { id: 'evd-9mm', label: '9mm Projectile', category: 'EVIDENCE', subLabel: 'Ballistic Strike Marker', clearanceRequired: 'CONFIDENTIAL', x: 380, y: 360 },
    { id: 'loc-pier4', label: 'Pier-4, Harbour', category: 'LOCATION', subLabel: 'Crime Scene', clearanceRequired: 'INTERNAL', x: 120, y: 220 },
    { id: 'loc-marina', label: 'Marina Gateway', category: 'LOCATION', subLabel: 'Sentry Call Origin', clearanceRequired: 'INTERNAL', x: 680, y: 220 },
    { id: 'doc-fir', label: 'FIR 412/2026', category: 'DOCUMENT', subLabel: 'Initial Information', clearanceRequired: 'CONFIDENTIAL', x: 280, y: 220 },
    { id: 'doc-cs', label: 'Final Charge Sheet', category: 'DOCUMENT', subLabel: 'CrPC 173 Scrutiny', clearanceRequired: 'CONFIDENTIAL', x: 520, y: 220 },
    { id: 'case-0871', label: 'CASE-0871 (Hawala)', category: 'CASE', subLabel: '94% Person Match', clearanceRequired: 'CONFIDENTIAL', x: 700, y: 90 },
    { id: 'case-1290', label: 'CASE-1290 (Espionage)', category: 'CASE', subLabel: 'Restricted Top Secret', clearanceRequired: 'TOP SECRET', x: 580, y: 340 },
  ];

  const edges: EvidenceGraphEdge[] = [
    { id: 'e1', source: 'case-1024', target: 'person-alok', relation: 'RELATED_TO' },
    { id: 'e2', source: 'case-1024', target: 'person-ravi', relation: 'ASSOCIATED_WITH' },
    { id: 'e3', source: 'case-1024', target: 'person-deepak', relation: 'MENTIONED_IN' },
    { id: 'e4', source: 'case-1024', target: 'evd-2048', relation: 'EVIDENCE_OF' },
    { id: 'e5', source: 'case-1024', target: 'evd-9mm', relation: 'EVIDENCE_OF' },
    { id: 'e6', source: 'case-1024', target: 'loc-pier4', relation: 'LOCATED_AT' },
    { id: 'e7', source: 'doc-fir', target: 'case-1024', relation: 'SUBMITTED_IN' },
    { id: 'e8', source: 'doc-cs', target: 'case-1024', relation: 'SUBMITTED_IN' },
    { id: 'e9', source: 'person-ravi', target: 'case-0871', relation: 'RELATED_TO' },
    { id: 'e10', source: 'evd-2048', target: 'case-1290', relation: 'REFERENCED_BY' },
  ];

  const filteredNodes = initialNodes.filter((n) => {
    const matchesCat = filterCategory === 'ALL' || n.category === filterCategory;
    const matchesSearch =
      n.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.subLabel?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'PERSON':
        return 'text-amber-400 border-amber-500/40 bg-amber-950/20';
      case 'CASE':
        return 'text-cyan-400 border-cyan-500/40 bg-cyan-950/20';
      case 'DOCUMENT':
        return 'text-blue-400 border-blue-500/40 bg-blue-950/20';
      case 'EVIDENCE':
        return 'text-emerald-400 border-emerald-500/40 bg-emerald-950/20';
      case 'LOCATION':
        return 'text-purple-400 border-purple-500/40 bg-purple-950/20';
      default:
        return 'text-slate-400 border-slate-700 bg-slate-900';
    }
  };

  const isRestricted = (node: EvidenceGraphNode) => {
    if (node.clearanceRequired === 'TOP SECRET' && userClearance !== 'TOP SECRET') {
      return true;
    }
    return false;
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Share2 className="w-5 h-5" />
              </div>
              <h1 className="text-xl font-bold font-display text-white tracking-wide">
                AI EVIDENCE RELATIONSHIP GRAPH
              </h1>
            </div>
            <p className="text-xs text-slate-400 font-mono-code mt-1.5 max-w-2xl">
              Multidimensional associative network mapping Persons, Dockets, Forensic Evidence, Locations, and
              Statutory Charge Filings. Strict clearance controls ensure unauthorized nodes stay masked.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono-code text-[11px] font-semibold">
              DYNAMIC SVG TOPOLOGY
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono-code">
          {['ALL', 'CASE', 'PERSON', 'EVIDENCE', 'DOCUMENT', 'LOCATION'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                filterCategory === cat
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search nodes or entities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs font-mono-code text-slate-200 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Graph Visual Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-2xl p-4 relative overflow-hidden min-h-[460px] flex items-center justify-center">
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:24px_24px]" />

          {/* Interactive SVG Render */}
          <svg className="w-full h-full min-h-[420px] relative z-10">
            {/* Draw connecting edges */}
            {edges.map((e) => {
              const src = initialNodes.find((n) => n.id === e.source);
              const tgt = initialNodes.find((n) => n.id === e.target);
              if (!src || !tgt || !src.x || !src.y || !tgt.x || !tgt.y) return null;

              return (
                <g key={e.id}>
                  <line
                    x1={src.x}
                    y1={src.y}
                    x2={tgt.x}
                    y2={tgt.y}
                    stroke="#334155"
                    strokeWidth="1.5"
                    strokeDasharray={e.relation === 'REFERENCED_BY' ? '4,4' : undefined}
                  />
                  <text
                    x={(src.x + tgt.x) / 2}
                    y={(src.y + tgt.y) / 2 - 4}
                    fill="#64748b"
                    fontSize="9"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    {e.relation}
                  </text>
                </g>
              );
            })}

            {/* Draw nodes */}
            {filteredNodes.map((n) => {
              const restricted = isRestricted(n);
              const isSelected = selectedNode?.id === n.id;

              return (
                <g
                  key={n.id}
                  transform={`translate(${n.x || 0}, ${n.y || 0})`}
                  onClick={() => setSelectedNode(n)}
                  className="cursor-pointer transition-transform duration-150 hover:scale-110"
                >
                  <circle
                    r={isSelected ? 26 : 22}
                    fill="#0f172a"
                    stroke={
                      restricted
                        ? '#ef4444'
                        : isSelected
                        ? '#06b6d4'
                        : n.category === 'CASE'
                        ? '#0284c7'
                        : n.category === 'PERSON'
                        ? '#f59e0b'
                        : n.category === 'EVIDENCE'
                        ? '#10b981'
                        : '#64748b'
                    }
                    strokeWidth={isSelected ? 3 : 2}
                  />
                  {restricted ? (
                    <text
                      y="4"
                      textAnchor="middle"
                      fill="#ef4444"
                      fontSize="10"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      LOCK
                    </text>
                  ) : (
                    <text
                      y="4"
                      textAnchor="middle"
                      fill="#e2e8f0"
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {n.category.slice(0, 3)}
                    </text>
                  )}

                  <text
                    y="36"
                    textAnchor="middle"
                    fill={restricted ? '#f87171' : '#cbd5e1'}
                    fontSize="10"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {restricted ? '[TOP SECRET]' : n.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Node Inspection Drawer */}
        <div className="lg:col-span-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-xs font-bold font-mono-code text-white uppercase tracking-wider flex items-center space-x-2">
              <Info className="w-4 h-4 text-cyan-400" />
              <span>Node Inspector</span>
            </h3>
            {selectedNode && (
              <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                {selectedNode.category}
              </span>
            )}
          </div>

          {selectedNode ? (
            <div className="space-y-4 font-mono-code text-xs">
              {isRestricted(selectedNode) ? (
                <div className="p-4 rounded-xl bg-red-950/30 border border-red-900/60 space-y-2 text-red-200">
                  <div className="flex items-center space-x-2">
                    <Lock className="w-4 h-4 text-red-400" />
                    <span className="font-bold">CLASSIFIED NODE: ACCESS DENIED</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    This entity belongs to a {selectedNode.clearanceRequired} docket. Your current role clearance (
                    {userClearance}) is insufficient to inspect relationship telemetry.
                  </p>
                </div>
              ) : (
                <>
                  <div>
                    <h4 className="text-sm font-bold text-slate-100">{selectedNode.label}</h4>
                    <p className="text-slate-400 text-[11px] mt-0.5">{selectedNode.subLabel}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <p>
                      <span className="text-slate-500">Node ID:</span>{' '}
                      <span className="text-cyan-300">{selectedNode.id}</span>
                    </p>
                    <p>
                      <span className="text-slate-500">Classification:</span>{' '}
                      <span className="text-emerald-400">{selectedNode.clearanceRequired}</span>
                    </p>
                    <p>
                      <span className="text-slate-500">Primary Docket:</span>{' '}
                      <span className="text-slate-300">CASE-1024</span>
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-slate-400 uppercase text-[10px] font-bold block">
                      Connected Association Edges:
                    </span>
                    {edges
                      .filter((e) => e.source === selectedNode.id || e.target === selectedNode.id)
                      .map((e) => (
                        <div
                          key={e.id}
                          className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-[11px] flex items-center justify-between"
                        >
                          <span className="text-slate-300">{e.relation}</span>
                          <span className="text-cyan-400">{e.source === selectedNode.id ? e.target : e.source}</span>
                        </div>
                      ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="py-16 text-center space-y-2">
              <Sparkles className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-xs font-mono-code text-slate-400">
                Click any node in the canvas to inspect evidentiary attributes, clearance level, and relationship links.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
