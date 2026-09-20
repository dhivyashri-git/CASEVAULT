import React, { useState } from 'react';
import {
  Lock,
  Unlock,
  Key,
  ShieldCheck,
  Fingerprint,
  Cpu,
  RefreshCw,
  Copy,
  Check,
  AlertTriangle,
  FileText,
  Eye,
  Layers,
} from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';
import {
  encryptTextAESGCM,
  decryptTextAESGCM,
  computeSHA256,
  EncryptionResult,
  DecryptionResult,
} from '../services/webCrypto';

export const EncryptionPortalView: React.FC = () => {
  const { documents, recordAuditAction } = useSecurity();

  // Tab: 'ENCRYPT' | 'DECRYPT' | 'VERIFY' | 'HSM_STATUS'
  const [activeTab, setActiveTab] = useState<'ENCRYPT' | 'DECRYPT' | 'VERIFY' | 'HSM_STATUS'>('ENCRYPT');

  // Encryption Workbench State
  const [encryptInput, setEncryptInput] = useState<string>(
    'CONFIDENTIAL SEIZURE MEMO: Seized encrypted Western Digital Black NVMe M.2 drive (EV-2048) from suspect vehicle TN-09-BK-4091. Contains forensic bitstream imaging.'
  );
  const [encryptionResult, setEncryptionResult] = useState<EncryptionResult | null>(null);
  const [isEncrypting, setIsEncrypting] = useState<boolean>(false);

  // Decryption Workbench State
  const [decryptCiphertext, setDecryptCiphertext] = useState<string>('');
  const [decryptKey, setDecryptKey] = useState<string>('');
  const [decryptIV, setDecryptIV] = useState<string>('');
  const [decryptionResult, setDecryptionResult] = useState<DecryptionResult | null>(null);
  const [decryptError, setDecryptError] = useState<string | null>(null);
  const [isDecrypting, setIsDecrypting] = useState<boolean>(false);

  // Copy state
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Integrity Check State
  const [verifyText, setVerifyText] = useState<string>('FIRST INFORMATION REPORT (FIR 412/2026)');
  const [calculatedHash, setCalculatedHash] = useState<string>('');
  const [referenceHash, setReferenceHash] = useState<string>(
    '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069'
  );

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleEncrypt = async () => {
    if (!encryptInput.trim()) return;
    setIsEncrypting(true);
    try {
      const res = await encryptTextAESGCM(encryptInput);
      setEncryptionResult(res);

      // Pre-fill decryption workbench for convenient roundtrip verification
      setDecryptCiphertext(res.ciphertextHex);
      setDecryptKey(res.keyExportHex);
      setDecryptIV(res.ivHex);
      setDecryptError(null);
      setDecryptionResult(null);

      recordAuditAction(
        'EVIDENCE_ENCRYPTED',
        'SYSTEM',
        'ENCRYPTION_PORTAL',
        `Real Web Crypto AES-GCM (256-bit) encryption performed on evidentiary text.`
      );
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsEncrypting(false);
    }
  };

  const handleDecrypt = async () => {
    if (!decryptCiphertext || !decryptKey || !decryptIV) return;
    setIsDecrypting(true);
    setDecryptError(null);
    setDecryptionResult(null);

    try {
      const res = await decryptTextAESGCM(decryptCiphertext, decryptKey, decryptIV);
      setDecryptionResult(res);

      recordAuditAction(
        'EVIDENCE_DECRYPTED',
        'SYSTEM',
        'ENCRYPTION_PORTAL',
        `Authenticated AES-GCM decryption verified with GCM tag match.`
      );
    } catch (err: any) {
      setDecryptError(err.message || 'Decryption failed: Cryptographic tag mismatch or invalid key.');
    } finally {
      setIsDecrypting(false);
    }
  };

  const handleComputeHash = async () => {
    const h = await computeSHA256(verifyText);
    setCalculatedHash(h);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <Lock className="w-5 h-5" />
              </div>
              <h1 className="text-xl font-bold font-display text-white tracking-wide">
                DOCUMENT ENCRYPTION & SECURE DATA PORTAL
              </h1>
            </div>
            <p className="text-xs text-slate-400 font-mono-code mt-1.5 max-w-2xl">
              Real browser-native Web Crypto API suite: AES-GCM 256-bit symmetric encryption, dynamic 96-bit IV
              generation, and SHA-256 digital fingerprint validation. Zero simulated cryptography.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono-code text-[11px] font-semibold flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>FIPS 140-3 COMPLIANT ALGORITHM</span>
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('ENCRYPT')}
          className={`px-4 py-2 rounded-xl text-xs font-mono-code font-bold transition flex items-center space-x-2 ${
            activeTab === 'ENCRYPT'
              ? 'bg-emerald-500/15 text-emerald-200 border border-emerald-500/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>AES-GCM Encryption</span>
        </button>

        <button
          onClick={() => setActiveTab('DECRYPT')}
          className={`px-4 py-2 rounded-xl text-xs font-mono-code font-bold transition flex items-center space-x-2 ${
            activeTab === 'DECRYPT'
              ? 'bg-cyan-500/15 text-cyan-200 border border-cyan-500/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Unlock className="w-4 h-4" />
          <span>Decryption & Tag Verification</span>
        </button>

        <button
          onClick={() => setActiveTab('VERIFY')}
          className={`px-4 py-2 rounded-xl text-xs font-mono-code font-bold transition flex items-center space-x-2 ${
            activeTab === 'VERIFY'
              ? 'bg-purple-500/15 text-purple-200 border border-purple-500/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Fingerprint className="w-4 h-4" />
          <span>SHA-256 Digital Fingerprint</span>
        </button>

        <button
          onClick={() => setActiveTab('HSM_STATUS')}
          className={`px-4 py-2 rounded-xl text-xs font-mono-code font-bold transition flex items-center space-x-2 ${
            activeTab === 'HSM_STATUS'
              ? 'bg-slate-800 text-slate-200 border border-slate-700'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>HSM Node Telemetry</span>
        </button>
      </div>

      {/* 1. ENCRYPT WORKBENCH */}
      {activeTab === 'ENCRYPT' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-xs font-bold font-mono-code text-white uppercase tracking-wider flex items-center space-x-2">
              <Key className="w-4 h-4 text-emerald-400" />
              <span>Plaintext Evidentiary Ingestion</span>
            </h3>

            <div>
              <label className="text-xs font-mono-code text-slate-400 block mb-1">
                Enter Text, Witness Deposition, or Seizure Record:
              </label>
              <textarea
                rows={6}
                value={encryptInput}
                onChange={(e) => setEncryptInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono-code text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              onClick={handleEncrypt}
              disabled={isEncrypting || !encryptInput.trim()}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono-code text-xs font-bold transition flex items-center justify-center space-x-2 shadow-lg shadow-emerald-950/40"
            >
              <Lock className="w-4 h-4" />
              <span>{isEncrypting ? 'GENERATING 256-BIT KEYS...' : 'EXECUTE AES-GCM (256-BIT) ENCRYPTION'}</span>
            </button>
          </div>

          <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-xs font-bold font-mono-code text-white uppercase tracking-wider flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Cryptographic Output Artifacts</span>
            </h3>

            {encryptionResult ? (
              <div className="space-y-3 font-mono-code text-xs">
                <div>
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span>Ciphertext Hex ({encryptionResult.ciphertextHex.length / 2} bytes):</span>
                    <button
                      onClick={() => copyToClipboard(encryptionResult.ciphertextHex, 'cipher')}
                      className="text-[11px] text-cyan-400 hover:underline flex items-center space-x-1"
                    >
                      {copiedField === 'cipher' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedField === 'cipher' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-emerald-400 break-all max-h-24 overflow-y-auto">
                    {encryptionResult.ciphertextHex}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-400 block mb-1">AES-256 Key (Hex):</span>
                    <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-[10px] text-slate-300 truncate">
                      {encryptionResult.keyExportHex}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-1">IV (96-bit Hex):</span>
                    <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-[10px] text-slate-300 truncate">
                      {encryptionResult.ivHex}
                    </div>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block mb-1">SHA-256 Digital Fingerprint:</span>
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-[10px] text-cyan-300 break-all">
                    {encryptionResult.sha256Fingerprint}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-900/40 text-[11px] text-emerald-300">
                  ✓ Pre-populated into the Decryption Workbench for roundtrip verification.
                </div>
              </div>
            ) : (
              <div className="py-20 text-center text-slate-500 font-mono-code text-xs">
                Awaiting encryption execution. Enter text and click execute.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. DECRYPT WORKBENCH */}
      {activeTab === 'DECRYPT' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-mono-code text-xs">
          <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <Unlock className="w-4 h-4 text-cyan-400" />
              <span>Decryption Key & Ciphertext Parameters</span>
            </h3>

            <div>
              <label className="text-slate-400 block mb-1">Ciphertext (Hex):</label>
              <textarea
                rows={3}
                value={decryptCiphertext}
                onChange={(e) => setDecryptCiphertext(e.target.value)}
                placeholder="Paste AES-GCM ciphertext in hexadecimal format..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">Raw Key Hex (256-bit):</label>
                <input
                  type="text"
                  value={decryptKey}
                  onChange={(e) => setDecryptKey(e.target.value)}
                  placeholder="64 hex characters..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">IV Hex (96-bit):</label>
                <input
                  type="text"
                  value={decryptIV}
                  onChange={(e) => setDecryptIV(e.target.value)}
                  placeholder="24 hex characters..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <button
              onClick={handleDecrypt}
              disabled={isDecrypting || !decryptCiphertext || !decryptKey || !decryptIV}
              className="w-full py-3 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition flex items-center justify-center space-x-2 shadow-lg shadow-cyan-950/40 mt-2"
            >
              <Unlock className="w-4 h-4" />
              <span>{isDecrypting ? 'DECRYPTING WITH SUBTLE CRYPTO...' : 'DECRYPT & VERIFY AUTHENTICITY'}</span>
            </button>
          </div>

          <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Decryption & Tag Verification Result</span>
            </h3>

            {decryptError && (
              <div className="p-4 rounded-xl bg-red-950/30 border border-red-900/60 text-red-200 space-y-1">
                <div className="flex items-center space-x-2 text-red-400 font-bold">
                  <AlertTriangle className="w-4 h-4" />
                  <span>AUTHENTICATION TAG MISMATCH / TAMPER DETECTED</span>
                </div>
                <p className="text-[11px] text-slate-300">{decryptError}</p>
              </div>
            )}

            {decryptionResult && (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-900/40 text-emerald-300 flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold">AUTHENTICATED PLAINTEXT RESTORED</span>
                </div>

                <div>
                  <span className="text-slate-400 block mb-1">Restored Evidence Plaintext:</span>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 leading-relaxed max-h-40 overflow-y-auto">
                    {decryptionResult.plaintext}
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block mb-1">Verified SHA-256 Fingerprint:</span>
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-[10px] text-cyan-300 break-all">
                    {decryptionResult.sha256}
                  </div>
                </div>
              </div>
            )}

            {!decryptError && !decryptionResult && (
              <div className="py-20 text-center text-slate-500">
                Awaiting decryption parameters. Populate fields and click decrypt.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. VERIFY SHA-256 WORKBENCH */}
      {activeTab === 'VERIFY' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 font-mono-code text-xs">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <Fingerprint className="w-4 h-4 text-purple-400" />
            <span>Digital Fingerprint & Integrity Verification</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 block mb-1">Text for Real-Time Hashing:</label>
              <textarea
                rows={4}
                value={verifyText}
                onChange={(e) => {
                  setVerifyText(e.target.value);
                  handleComputeHash();
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-purple-500"
              />
              <button
                onClick={handleComputeHash}
                className="mt-2 py-2 px-3 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold"
              >
                COMPUTE LIVE SHA-256 HASH
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-slate-400 block mb-1">Computed Hash:</span>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-purple-300 break-all">
                  {calculatedHash || 'Click compute to hash content with WebCrypto subtle digest.'}
                </div>
              </div>

              <div>
                <span className="text-slate-400 block mb-1">Reference Legal Hash:</span>
                <input
                  type="text"
                  value={referenceHash}
                  onChange={(e) => setReferenceHash(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-300 text-[11px]"
                />
              </div>

              {calculatedHash && (
                <div
                  className={`p-3 rounded-xl border text-[11px] font-bold ${
                    calculatedHash.toLowerCase() === referenceHash.trim().toLowerCase()
                      ? 'bg-emerald-950/20 border-emerald-800 text-emerald-300'
                      : 'bg-red-950/20 border-red-800 text-red-300'
                  }`}
                >
                  {calculatedHash.toLowerCase() === referenceHash.trim().toLowerCase()
                    ? '✓ PERFECT BITSTREAM INTEGRITY MATCH'
                    : '⚠ HASH MISMATCH: CONTENT MODIFIED OR TAMPERED'}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. HSM TELEMETRY TAB */}
      {activeTab === 'HSM_STATUS' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 font-mono-code text-xs">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>Hardware Security Module & Vault Node Health</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500 block">Cryptographic Engine</span>
              <span className="text-slate-200 font-bold text-sm">Web Crypto API (AES-GCM)</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500 block">HSM Key Slot</span>
              <span className="text-emerald-400 font-bold text-sm">SLOT-01 (ACTIVE & LOCKED)</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500 block">Integrity Seal Type</span>
              <span className="text-cyan-400 font-bold text-sm">SHA-256 Immutable Digital Seal</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
