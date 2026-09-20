import React, { useState } from 'react';
import { SecurityProvider, useSecurity } from './context/SecurityContext';
import { BootSequence } from './components/BootSequence';
import { LoginScreen } from './components/LoginScreen';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardOverview } from './components/DashboardOverview';
import { DocumentVaultView } from './components/DocumentVaultView';
import { AdaptiveSecurityEngineView } from './components/AdaptiveSecurityEngineView';
import { VersionControlView } from './components/VersionControlView';
import { CaseTimelineView } from './components/CaseTimelineView';
import { AuditTrailView } from './components/AuditTrailView';
import { SecurityAlertCenter } from './components/SecurityAlertCenter';
import { UsersRbacView } from './components/UsersRbacView';
import { SettingsView } from './components/SettingsView';
import { UnauthorizedModal } from './components/UnauthorizedModal';
import { SessionExpiredModal, AccessRestrictedModal } from './components/SecurityNoticeModals';
import { BiometricModal } from './components/BiometricModal';
import { SecureDocumentOpenModal } from './components/SecureDocumentOpenModal';
import { DocumentDetailsModal } from './components/DocumentDetailsModal';
import { DocumentTamperModal } from './components/DocumentTamperModal';
import { AiClassificationModal } from './components/AiClassificationModal';
import { SecureSharingModal } from './components/SecureSharingModal';
import { SecureUploadCenter } from './components/SecureUploadCenter';
import { AiIntelligenceHub } from './components/AiIntelligenceHub';
import { CrossCaseIntelligenceView } from './components/CrossCaseIntelligenceView';
import { EvidenceGraphView } from './components/EvidenceGraphView';
import { EncryptionPortalView } from './components/EncryptionPortalView';
import { AskCaseVaultCopilot } from './components/AskCaseVaultCopilot';
import { DemoSimulationRunner } from './components/DemoSimulationRunner';
import { SecureDocument, DocumentType } from './types';

const MainAppContent: React.FC = () => {
  const {
    currentUser,
    activePage,
    setActivePage,
    failedLoginIncident,
    clearFailedLoginIncident,
    requestSecureAction,
  } = useSecurity();

  // App-level view & modal states
  const [hasBooted, setHasBooted] = useState(true); // boot completed
  const [selectedDetailsDoc, setSelectedDetailsDoc] = useState<SecureDocument | null>(null);
  const [selectedSecureDoc, setSelectedSecureDoc] = useState<SecureDocument | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isDemoRunnerOpen, setIsDemoRunnerOpen] = useState(false);

  // Handle document opening with adaptive security check
  const handleOpenSecurely = (doc: SecureDocument) => {
    requestSecureAction(
      () => {
        setSelectedSecureDoc(doc);
      },
      doc.sensitivity === 'HIGHLY CONFIDENTIAL' || doc.sensitivity === 'CONFIDENTIAL'
        ? `Accessing classified evidence record (${doc.title}) requires biometric step-up attestation.`
        : undefined,
      doc.sensitivity
    );
  };

  // If boot sequence is running
  if (!hasBooted) {
    return <BootSequence onComplete={() => setHasBooted(true)} />;
  }

  // If user is not authenticated, show Login Screen
  if (!currentUser) {
    return (
      <>
        <LoginScreen onRestartBoot={() => setHasBooted(false)} />
        <UnauthorizedModal
          data={failedLoginIncident}
          onClose={clearFailedLoginIncident}
        />
        <SessionExpiredModal />
      </>
    );
  }

  // Render main operational page
  const renderActivePage = () => {
    switch (activePage) {
      case 'dashboard':
        return (
          <DashboardOverview
            onOpenDetails={(doc) => setSelectedDetailsDoc(doc)}
            onOpenSecurely={handleOpenSecurely}
            onOpenUpload={() => setIsUploadModalOpen(true)}
          />
        );

      case 'documents':
        return (
          <DocumentVaultView
            onOpenDetails={(doc) => setSelectedDetailsDoc(doc)}
            onOpenSecurely={handleOpenSecurely}
            onOpenUpload={() => setIsUploadModalOpen(true)}
            filterType="ALL"
          />
        );

      case 'fir':
        return (
          <DocumentVaultView
            onOpenDetails={(doc) => setSelectedDetailsDoc(doc)}
            onOpenSecurely={handleOpenSecurely}
            onOpenUpload={() => setIsUploadModalOpen(true)}
            filterType="FIR"
          />
        );

      case 'witness':
        return (
          <DocumentVaultView
            onOpenDetails={(doc) => setSelectedDetailsDoc(doc)}
            onOpenSecurely={handleOpenSecurely}
            onOpenUpload={() => setIsUploadModalOpen(true)}
            filterType="WITNESS STATEMENT"
          />
        );

      case 'evidence':
        return (
          <DocumentVaultView
            onOpenDetails={(doc) => setSelectedDetailsDoc(doc)}
            onOpenSecurely={handleOpenSecurely}
            onOpenUpload={() => setIsUploadModalOpen(true)}
            filterType="EVIDENCE"
          />
        );

      case 'forensic':
        return (
          <DocumentVaultView
            onOpenDetails={(doc) => setSelectedDetailsDoc(doc)}
            onOpenSecurely={handleOpenSecurely}
            onOpenUpload={() => setIsUploadModalOpen(true)}
            filterType="FORENSIC REPORT"
          />
        );

      case 'charge_sheets':
        return (
          <DocumentVaultView
            onOpenDetails={(doc) => setSelectedDetailsDoc(doc)}
            onOpenSecurely={handleOpenSecurely}
            onOpenUpload={() => setIsUploadModalOpen(true)}
            filterType="CHARGE SHEET"
          />
        );

      case 'court_filings':
        return (
          <DocumentVaultView
            onOpenDetails={(doc) => setSelectedDetailsDoc(doc)}
            onOpenSecurely={handleOpenSecurely}
            onOpenUpload={() => setIsUploadModalOpen(true)}
            filterType="COURT FILING"
          />
        );

      case 'integrity':
        return (
          <DocumentVaultView
            onOpenDetails={(doc) => setSelectedDetailsDoc(doc)}
            onOpenSecurely={handleOpenSecurely}
            onOpenUpload={() => setIsUploadModalOpen(true)}
            filterType="ALL"
          />
        );

      case 'adaptive_security':
        return <AdaptiveSecurityEngineView />;

      case 'version_control':
        return <VersionControlView />;

      case 'cases':
        return <CaseTimelineView />;

      case 'audit_trail':
        return <AuditTrailView />;

      case 'security_alerts':
        return <SecurityAlertCenter />;

      case 'secure_sharing':
        return (
          <div className="space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold font-display text-white">
                  SECURE CRYPTOGRAPHIC SHARING CONSOLE
                </h1>
                <p className="text-xs text-slate-400 font-mono-code mt-0.5">
                  Generate ephemeral, watermarked, single-use access links for judicial partners.
                </p>
              </div>
              <button
                onClick={() => setIsShareModalOpen(true)}
                className="py-2.5 px-4 bg-cyan-600 hover:bg-cyan-500 text-white font-mono-code text-xs font-bold rounded-xl transition"
              >
                + NEW SHARING LINK
              </button>
            </div>
            <DocumentVaultView
              onOpenDetails={(doc) => setSelectedDetailsDoc(doc)}
              onOpenSecurely={handleOpenSecurely}
              onOpenUpload={() => setIsUploadModalOpen(true)}
              filterType="ALL"
            />
          </div>
        );

      case 'ai_classification':
        return (
          <div className="space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold font-display text-white">
                  AI DOCUMENT INGESTION & SENSITIVITY CLASSIFIER
                </h1>
                <p className="text-xs text-slate-400 font-mono-code mt-0.5">
                  Automated entity extraction, legal category indexing, and SHA-256 integrity sealing.
                </p>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="py-2.5 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono-code text-xs font-bold rounded-xl transition"
              >
                + INGEST NEW EVIDENCE
              </button>
            </div>
            <DocumentVaultView
              onOpenDetails={(doc) => setSelectedDetailsDoc(doc)}
              onOpenSecurely={handleOpenSecurely}
              onOpenUpload={() => setIsUploadModalOpen(true)}
              filterType="ALL"
            />
          </div>
        );

      case 'secure_upload':
        return (
          <SecureUploadCenter
            onDocumentAdded={(doc) => {
              setSelectedDetailsDoc(doc);
            }}
            onViewDoc={(doc) => setSelectedDetailsDoc(doc)}
          />
        );

      case 'ai_intelligence':
        return <AiIntelligenceHub />;

      case 'cross_case':
        return <CrossCaseIntelligenceView />;

      case 'evidence_graph':
        return <EvidenceGraphView />;

      case 'encryption_portal':
        return <EncryptionPortalView />;

      case 'ai_assistant':
        return <AskCaseVaultCopilot />;

      case 'users_rbac':
        return <UsersRbacView />;

      case 'settings':
        return <SettingsView />;

      default:
        return (
          <DashboardOverview
            onOpenDetails={(doc) => setSelectedDetailsDoc(doc)}
            onOpenSecurely={handleOpenSecurely}
            onOpenUpload={() => setIsUploadModalOpen(true)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Header */}
      <Header
        onOpenDemoSimulation={() => setIsDemoRunnerOpen(true)}
        onOpenCopilot={() => setActivePage('ai_assistant')}
      />

      {/* Main Workspace Layout with Sidebar */}
      <div className="flex-1 flex min-w-0">
        <Sidebar />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 max-w-7xl mx-auto w-full overflow-y-auto">
          {renderActivePage()}
        </main>
      </div>

      {/* Global Security Modals */}
      <UnauthorizedModal
        data={failedLoginIncident}
        onClose={clearFailedLoginIncident}
      />
      <SessionExpiredModal />
      <AccessRestrictedModal />
      <BiometricModal />
      <DocumentTamperModal />

      <SecureDocumentOpenModal
        document={selectedSecureDoc}
        onClose={() => setSelectedSecureDoc(null)}
      />

      <DocumentDetailsModal
        document={selectedDetailsDoc}
        onClose={() => setSelectedDetailsDoc(null)}
        onOpenSecurely={handleOpenSecurely}
      />

      <AiClassificationModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />

      <SecureSharingModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />

      <DemoSimulationRunner
        isOpen={isDemoRunnerOpen}
        onClose={() => setIsDemoRunnerOpen(false)}
        onNavigatePage={(p) => setActivePage(p)}
      />
    </div>
  );
};

export default function App() {
  return (
    <SecurityProvider>
      <MainAppContent />
    </SecurityProvider>
  );
}
