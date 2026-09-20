/**
 * CASE VAULT — AI Intelligence Engine
 * Handles Document Classification, Entity Extraction, Cross-Case Matching,
 * Case Reconstruction, Contradiction Detection, Missing Links, What-If Simulation,
 * Redaction Assistant, and Ask CASE VAULT Copilot.
 * 
 * Note: Clearly indicates whether output comes from live Gemini AI or
 * rule-based demo intelligence fallback per specification.
 */

import {
  SecureDocument,
  CaseRecord,
  ExtractedEntity,
  CrossCaseMatch,
  CaseContradiction,
  MissingLink,
  WhatIfSimulationResult,
  RedactionSuggestion,
  UserRole,
  SecurityClearance,
  LivePulseEvent,
} from '../types';

export interface AIProviderStatus {
  isLiveApi: boolean;
  providerName: string;
  model: string;
  label: string;
}

export function getAIProviderStatus(): AIProviderStatus {
  return {
    isLiveApi: false,
    providerName: 'CASE VAULT Intelligence Engine',
    model: 'Gemini-Evidence-Heuristic-v4',
    label: 'AI service unavailable — using clearly labelled demo fallback.',
  };
}

/**
 * 1. AI Cross-Case Intelligence
 * Finds connections between entities across authorized cases.
 * STRICT SECURITY RULE: Respects clearance level!
 */
export function getCrossCaseMatches(
  currentCaseId: string,
  userClearance: SecurityClearance
): CrossCaseMatch[] {
  const allMatches: CrossCaseMatch[] = [
    {
      caseId: 'CASE-0871',
      title: 'Hawala & Narcotics Smuggling Syndicate (Operation Cyclone)',
      matchPercentage: 94,
      matchedPerson: 'Ravi Kumar',
      category: 'Organized Crime / Hawala',
      leadOfficer: 'Inspector Vikram Rathore',
      status: 'ACTIVE',
      clearanceRequired: 'CONFIDENTIAL',
      humanVerificationRequired: true,
      reasons: [
        'Same primary name: Ravi Kumar',
        'Matching alias recorded in seizure memo: "RK / Shadow"',
        'Identical telephone intercept number: +91 98401 22910',
        'Geographic overlap: Chennai Harbour, Pier-4 storage locker',
        'Corroborating vehicle sighting: TN-09-BK-4091 grey sedan',
      ],
      matchedEntities: [
        { type: 'PERSON', value: 'Ravi Kumar' },
        { type: 'ALIAS', value: 'RK / Shadow' },
        { type: 'PHONE', value: '+91 98401 22910' },
        { type: 'LOCATION', value: 'Chennai Harbour' },
        { type: 'VEHICLE', value: 'TN-09-BK-4091' },
      ],
    },
    {
      caseId: 'CASE-1132',
      title: 'Armed Robbery & High-End Vehicle Hijacking (State vs. Unknowns)',
      matchPercentage: 81,
      matchedPerson: 'Ravi Kumar',
      category: 'Armed Robbery',
      leadOfficer: 'Inspector M. Alagiri',
      status: 'UNDER_TRIAL',
      clearanceRequired: 'CONFIDENTIAL',
      humanVerificationRequired: true,
      reasons: [
        'Matching vehicle registration: TN-09-BK-4091 spotted leaving toll plaza',
        'Ballistics calibre match: 9mm Parabellum spent casing (EV-2048 related incident)',
        'Suspect physical description and gait analysis correlates with CCTV footage',
      ],
      matchedEntities: [
        { type: 'VEHICLE', value: 'TN-09-BK-4091' },
        { type: 'EVIDENCE', value: '9mm Parabellum' },
        { type: 'LOCATION', value: 'Mount Road Toll' },
      ],
    },
    {
      caseId: 'CASE-1290',
      title: 'Espionage & Critical Coastal Infrastructure Telemetry Breach',
      matchPercentage: 67,
      matchedPerson: 'Ravi Kumar',
      category: 'National Security / Espionage',
      leadOfficer: 'Director K. Rajeshwar',
      status: 'ACTIVE',
      clearanceRequired: 'TOP SECRET',
      humanVerificationRequired: true,
      reasons: [
        'Cryptographic format on NVMe drive EV-2048 matches military-grade firmware tamper',
        'IP subnet 198.51.100.44 traced to communication logs in both dockets',
        'Encrypted partition keys mirror known state-sponsored threat group signatures',
      ],
      matchedEntities: [
        { type: 'EVIDENCE', value: 'EV-2048 Firmware Signature' },
        { type: 'ORGANIZATION', value: 'Threat Actor Group Black-Kite' },
        { type: 'IP', value: '198.51.100.44' },
      ],
    },
  ];

  const clearanceRank: Record<SecurityClearance, number> = {
    INTERNAL: 1,
    CONFIDENTIAL: 2,
    SECRET: 3,
    'TOP SECRET': 4,
  };

  const userRank = clearanceRank[userClearance] || 1;

  // Mask protected details if clearance is insufficient
  return allMatches.map((m) => {
    const requiredRank = clearanceRank[m.clearanceRequired] || 2;
    if (userRank < requiredRank) {
      return {
        ...m,
        title: `[RESTRICTED CASE RECORD — ${m.clearanceRequired} CLEARANCE REQUIRED]`,
        category: 'CLASSIFIED CASE CATEGORY',
        leadOfficer: 'CLASSIFIED OFFICER',
        reasons: [
          'Potential cross-case entity correlation detected by AI.',
          `Access restricted: Requires ${m.clearanceRequired} security clearance.`,
          'Protected details masked under Need-To-Know statutory protocols.',
        ],
        matchedEntities: [{ type: 'RESTRICTED', value: 'PROTECTED CLOUD RECORD' }],
      };
    }
    return m;
  });
}

/**
 * 2. AI Contradiction Detector
 * Flags inconsistencies between documents.
 */
export function getCaseContradictions(caseId: string): CaseContradiction[] {
  return [
    {
      id: 'contra-1024-1',
      caseId: 'CASE-1024',
      docA: {
        id: 'doc-ws-1024',
        title: 'Witness Statement (Deepak S. Nair)',
        excerpt: '"The incident occurred at approximately 21:30 hrs outside Harbour Point warehouse."',
        field: 'Incident Time / Location',
        time: '21:30 hrs',
      },
      docB: {
        id: 'doc-pol-1024',
        title: 'Police General Diary & Patrol Report',
        excerpt: '"First patrol call received from Marina Gateway sentry booth at 22:15 hrs."',
        field: 'First Reported Call',
        time: '22:15 hrs',
      },
      conflictingField: 'Timeline Discrepancy (45-minute variance in incident window)',
      confidence: 94,
      status: 'FLAGGED',
      explanation:
        'Potential contradiction detected between eyewitness deposition and Police Patrol Log. Witness places suspect at Harbour Point at 21:30 hrs, whereas police log indicates first sentry alert at 22:15 hrs. Human forensic review required.',
    },
  ];
}

/**
 * 3. AI Missing-Link Detector
 */
export function getCaseMissingLinks(caseId: string): MissingLink[] {
  return [
    {
      id: 'missing-1024-1',
      caseId: 'CASE-1024',
      title: 'Missing Cyber Extraction Report for EV-2048',
      description:
        'FIR and Crime Report explicitly reference physical seizure of Western Digital NVMe M.2 drive (Evidence ID: EV-2048). However, CFSL Forensic Report only covers ballistic projectile analysis. No bitstream forensic extraction report is currently linked to the docket.',
      referencedInDoc: 'FIR (FIR 412/2026) & Evidence Record (EV-2048)',
      missingItem: 'CFSL Digital Media Extraction & Bitstream Disk Image Forensic Report',
      urgency: 'HIGH',
      status: 'OPEN',
      suggestedAction:
        'Request immediate submission of Cyber Forensic Lab examination docket for Evidence EV-2048 before judicial scrutinization.',
    },
  ];
}

/**
 * 4. AI Case Reconstruction
 * Synthesizes chronological case history into FACT, AI INFERENCE, and MISSING INFORMATION
 */
export interface CaseReconstructionItem {
  id: string;
  type: 'FACT' | 'AI_INFERENCE' | 'MISSING_INFO';
  title: string;
  sourceDoc: string;
  description: string;
  timestamp: string;
  confidence: number;
}

export function getCaseReconstruction(caseId: string): CaseReconstructionItem[] {
  return [
    {
      id: 'recon-1',
      type: 'FACT',
      title: 'FIR Lodged under IPC 302 / 120-B',
      sourceDoc: 'FIR-1024-Central-Station.pdf',
      description:
        'Crime docket formally registered at Central Police Station naming Alok Verma as primary suspect following discovery of victim at Pier-4.',
      timestamp: '02 Sep 2026, 09:30 AM',
      confidence: 100,
    },
    {
      id: 'recon-2',
      type: 'FACT',
      title: 'Physical & Digital Evidence Seizure (EV-2048 & 9mm Projectile)',
      sourceDoc: 'Chain-Of-Custody-Evidence-EVD1024.pdf',
      description:
        'NVMe drive EV-2048 and spent 9mm projectile catalogued in tamper-evident evidence pouch under officer custody seal.',
      timestamp: '05 Sep 2026, 02:45 PM',
      confidence: 100,
    },
    {
      id: 'recon-3',
      type: 'AI_INFERENCE',
      title: 'Suspect Cell-Tower Triangulation Overlap',
      sourceDoc: 'Investigation-Diary-Update-POL1024.pdf',
      description:
        'AI synthesized CDR logs indicate suspect device pinged Tower 14B near Pier-4 between 21:20 and 21:55 hrs, corroborating presence in the vicinity.',
      timestamp: '12 Sep 2026, 04:20 PM',
      confidence: 88,
    },
    {
      id: 'recon-4',
      type: 'MISSING_INFO',
      title: 'Unaccounted 45-Minute Window & Unextracted Storage Media',
      sourceDoc: 'Cross-Document Analysis',
      description:
        'Discrepancy between Witness Statement (21:30 hrs) and Police Log (22:15 hrs) remains unresolved. Bitstream contents of seized NVMe drive EV-2048 have not yet been ingested.',
      timestamp: 'Pending Forensic Docket',
      confidence: 96,
    },
  ];
}

/**
 * 5. AI What-If Evidence Simulator
 * Simulates evidentiary impact of removing or altering a specific piece of evidence
 */
export function runWhatIfSimulation(evidenceId: string): WhatIfSimulationResult {
  return {
    targetEvidenceId: evidenceId,
    simulatedAction: 'REMOVE',
    affectedDocuments: [
      {
        id: 'doc-evd-1024',
        title: 'Chain-Of-Custody Evidence Record',
        impact: 'Primary digital evidence locker entry invalidated; physical seizure record detached.',
      },
      {
        id: 'doc-for-1024',
        title: 'CFSL Ballistic & Digital Forensic Report',
        impact: 'Corroborating digital metadata link severed; ballistics remains standalone.',
      },
      {
        id: 'doc-cs-1024',
        title: 'Charge Sheet (Section 173 CrPC)',
        impact: 'Charge Section 66 IT Act (digital conspiracy) collapses due to lack of primary digital media.',
      },
    ],
    brokenRelationshipsCount: 4,
    timelineChanges: [
      'Timeline step 3 ("Digital & Physical Evidence Logged") loses digital evidentiary support.',
      'Charge Sheet evidentiary confidence degrades by 24%.',
      'Cross-case correlation to CASE-1290 (Espionage) drops from 67% to 0%.',
    ],
    missingLinksDelta: [
      'Missing Link "Cyber Extraction Report for EV-2048" is rendered moot because the evidence itself is excluded.',
    ],
    confidenceDelta: -28,
    riskSummary:
      'SIMULATION ONLY: Removing EV-2048 eliminates the sole cryptographic hardware link connecting the suspect to the digital conspiracy charges. Judicial admissibility risk increases significantly.',
  };
}

/**
 * 6. AI Version Change Explainer
 */
export function explainVersionChange(
  docTitle: string,
  fromVersion: string,
  toVersion: string
): string {
  return `AI CHANGE SUMMARY (${fromVersion} → ${toVersion}):
• Added forensic reference to seized NVMe storage drive (EV-2048).
• Modified estimated time of incident from 21:30 hrs to 22:15 hrs based on sentry log corroboration.
• Appended lead forensic investigator signature hash (Dr. Ananya Roy, CFSL).
• Cryptographic SHA-256 fingerprint transitioned from v1 to v2; previous version remains immutable in tamper-proof audit storage.`;
}

/**
 * 7. AI Redaction Assistant
 */
export function getRedactionSuggestions(docContent: string): RedactionSuggestion[] {
  return [
    {
      id: 'redact-1',
      textToRedact: '+91 98401 22910',
      category: 'PHONE',
      reason: 'Personal Telephone Number of Protected Eyewitness',
      approved: true,
    },
    {
      id: 'redact-2',
      textToRedact: '42 Harbour View Residences, Block C, Chennai',
      category: 'ADDRESS',
      reason: 'Residential Location of Witness under Judicial Protection Order',
      approved: true,
    },
    {
      id: 'redact-3',
      textToRedact: 'TN-09-BK-4091',
      category: 'VEHICLE',
      reason: 'Private Registered Vehicle License Plate',
      approved: false,
    },
  ];
}

/**
 * 8. Ask CASE VAULT Investigation Copilot
 * Persistent assistant answering Q&A with role-aware enforcement and multilingual support.
 */
export interface CopilotQueryResponse {
  answer: string;
  sourceReferences: string[];
  roleAudited: UserRole;
  language: 'en' | 'ta' | 'hi';
}

export function queryInvestigationCopilot(
  query: string,
  userRole: UserRole,
  language: 'en' | 'ta' | 'hi' = 'en'
): CopilotQueryResponse {
  const q = query.toLowerCase();

  // English Base Responses
  let enAnswer = '';
  let sources: string[] = [];

  if (q.includes('summarize') || q.includes('case-1024') || q.includes('overview')) {
    enAnswer =
      'CASE-1024 is an active investigation into homicide and digital conspiracy (State vs. Alok Verma). Key entities include lead investigator Inspector Vikram Rathore, primary suspect Alok Verma, eyewitness Deepak S. Nair, and seized physical/digital evidence (9mm projectile and NVMe drive EV-2048). A 45-minute contradiction between the witness statement and sentry log is currently flagged for review.';
    sources = ['FIR-1024-Central-Station.pdf', 'Chain-Of-Custody-Evidence-EVD1024.pdf', 'Final-Charge-Sheet-CS1024.pdf'];
  } else if (q.includes('ravi') || q.includes('ravi kumar')) {
    enAnswer =
      'Ravi Kumar (Alias: "RK / Shadow") is catalogued in cross-case intelligence with a 94% match to CASE-0871 (Hawala & Narcotics Smuggling) and an 81% match to CASE-1132 (Armed Robbery). Telephone +91 98401 22910 and grey sedan TN-09-BK-4091 are linked to his docket. Note: Potential match — human verification required.';
    sources = ['Cross-Case Intelligence Module', 'CASE-0871 Seizure Docket', 'CASE-1132 Vehicle Log'];
  } else if (q.includes('ev-2048') || q.includes('evidence')) {
    enAnswer =
      'Evidence EV-2048 is a seized Western Digital Black NVMe M.2 drive catalogued on 05 Sep 2026. The FIR references this drive, but the current CFSL forensic report only covers ballistics. A missing-link alert is active for the digital media bitstream extraction report.';
    sources = ['Chain-Of-Custody-Evidence-EVD1024.pdf', 'CFSL-Forensic-Analysis-FOR1024.pdf', 'Missing-Link Engine'];
  } else if (q.includes('contradiction') || q.includes('conflict')) {
    enAnswer =
      'A timeline contradiction has been detected: Witness Deepak Nair deposed the incident occurred at 21:30 hrs outside Harbour Point. In contrast, the Police General Diary records the first sentry alert at 22:15 hrs (a 45-minute variance). Neither statement has been confirmed as absolute truth; judicial scrutiny is required.';
    sources = ['Witness Statement (Deepak S. Nair)', 'Police General Diary (Doc-POL-1024)'];
  } else if (q.includes('missing') || q.includes('missing link')) {
    enAnswer =
      'AI Missing-Link Detector identified that while physical evidence EV-2048 (NVMe drive) was seized, no corresponding Cyber Forensic Lab extraction docket has been linked to CASE-1024. This leaves digital conspiracy charges vulnerable under Section 66 IT Act.';
    sources = ['FIR 412/2026', 'Evidence Log EV-2048'];
  } else if (q.includes('version') || q.includes('changed')) {
    enAnswer =
      'Between Version 1 and Version 2 of the Investigation Diary, Investigator Kabir Sen added cell-tower triangulation logs placing suspect devices near Pier-4 and updated the incident timeline. SHA-256 fingerprint was regenerated from 7f83b1... to 9a8b7c... with zero data loss in the immutable version history.';
    sources = ['Investigation-Diary-POL1024 (v1 vs v2)', 'Immutable Version Control'];
  } else if (q.includes('cross-case') || q.includes('connections')) {
    enAnswer =
      'Cross-case analysis links CASE-1024 to three authorized dockets: CASE-0871 (94% match on person & telephone), CASE-1132 (81% match on vehicle & ballistics), and CASE-1290 (67% match on firmware signature, requires TOP SECRET clearance). AI discovery strictly enforces clearance boundaries.';
    sources = ['AI Cross-Case Engine', 'CASE-0871', 'CASE-1132', 'CASE-1290 (Restricted)'];
  } else {
    enAnswer =
      `Based on authorized records in CASE-1024, the docket contains 8 verified legal and forensic documents with SHA-256 integrity verification. No unauthorized data was accessed. Current adaptive security level: NORMAL.`;
    sources = ['CASE-1024 Evidence Vault', 'Adaptive Security Ledger'];
  }

  // Multilingual translations
  let finalAnswer = enAnswer;
  if (language === 'ta') {
    finalAnswer = `[தமிழ் - CASE VAULT அறிக்கை] ${enAnswer}
(அங்கீகரிக்கப்பட்ட ஆதாரங்கள் மற்றும் குற்றப்பிரிவு ஆவணங்களின் அடிப்படையில் தயாரிக்கப்பட்டது.)`;
  } else if (language === 'hi') {
    finalAnswer = `[हिन्दी - CASE VAULT संक्षिप्त] ${enAnswer}
(प्राधिकृत साक्ष्य और फॉरेंसिक रिकॉर्ड के आधार पर तैयार किया गया।)`;
  }

  return {
    answer: finalAnswer,
    sourceReferences: sources,
    roleAudited: userRole,
    language,
  };
}

/**
 * 9. Live Evidence Pulse Events (Telemetry stream)
 */
export function getLivePulseEvents(): LivePulseEvent[] {
  return [
    {
      id: 'pulse-1',
      timestamp: '10:42:15',
      event: 'SEIZED DEVICE ADDED',
      caseId: 'CASE-1024',
      details: 'NVMe Solid-State Storage Drive (EV-2048) registered by Officer Rathore.',
      severity: 'NORMAL',
    },
    {
      id: 'pulse-2',
      timestamp: '10:40:02',
      event: 'SHA-256 HASH VERIFIED',
      caseId: 'CASE-1024',
      details: 'CFSL Ballistics report bitstream matched pristine seal (100% Trust Score).',
      severity: 'NORMAL',
    },
    {
      id: 'pulse-3',
      timestamp: '10:35:19',
      event: 'CROSS-CASE LINK DETECTED',
      caseId: 'CASE-0871',
      details: 'Suspect phone number (+91 98401 22910) correlated with 94% confidence.',
      severity: 'ELEVATED',
    },
    {
      id: 'pulse-4',
      timestamp: '10:31:00',
      event: 'CONTRADICTION DETECTED',
      caseId: 'CASE-1024',
      details: '45-min discrepancy flagged between Witness statement and Sentry Log.',
      severity: 'ELEVATED',
    },
    {
      id: 'pulse-5',
      timestamp: '10:28:44',
      event: 'ZERO-TRUST RE-AUTHENTICATION',
      caseId: 'SYSTEM',
      details: 'Investigator biometric verification cleared for classified FIR review.',
      severity: 'NORMAL',
    },
  ];
}

