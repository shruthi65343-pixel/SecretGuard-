import React from 'react';
import { X, ShieldAlert, Lock, CheckCircle2, AlertTriangle, Fingerprint, Code, Cpu, RefreshCw } from 'lucide-react';

export default function FindingDetailModal({
  finding,
  onClose,
  onRemediate,
  onVerify,
  isVerifying
}) {
  if (!finding) return null;

  const signals = finding.signals || {};

  return (
    <div className="modal-overlay">
      <div className="glass-panel w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative border-cyan-500/30 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-xs font-extrabold uppercase badge-risk-critical">
                {finding.risk_level} RISK
              </span>
              <span className="text-xs font-mono text-cyan-400 font-semibold">
                Confidence: {finding.confidence_score}%
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mt-1.5 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-cyan-400" />
              {finding.secret_type} Finding
            </h3>
            <p className="text-xs font-mono text-slate-300 mt-1">
              File: <span className="text-cyan-300">{finding.relative_path}</span> (Line {finding.line_number})
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="space-y-5 text-xs text-slate-300">
          
          {/* Privacy Protection Banner */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Lock className="w-4 h-4 text-emerald-400" />
              <div>
                <p className="font-bold text-slate-200">Zero Disclosure Privacy Guarantee</p>
                <p className="text-[11px] text-slate-400">Raw secret string is masked as [HIDDEN].</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-cyan-400 bg-slate-900 px-3 py-1 rounded border border-slate-800 text-[11px]">
              <Fingerprint className="w-3.5 h-3.5 text-cyan-400" />
              {finding.fingerprint}
            </div>
          </div>

          {/* Masked Code Snippet */}
          <div>
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-1.5 flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5 text-cyan-400" />
              Detected Code Snippet
            </h4>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-rose-300 overflow-x-auto">
              {finding.line_content_masked}
            </div>
          </div>

          {/* Multi-Signal Breakdown */}
          <div>
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-2 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              Multi-Signal Detection Weights
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-2">
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <p className="text-slate-400 text-[10px]">Pattern Signal</p>
                <p className="text-base font-bold font-mono text-cyan-400">+{signals.pattern_score || 0} pts</p>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <p className="text-slate-400 text-[10px]">Shannon Entropy</p>
                <p className="text-base font-bold font-mono text-cyan-400">+{signals.entropy_score || 0} pts</p>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <p className="text-slate-400 text-[10px]">Code Context</p>
                <p className="text-base font-bold font-mono text-cyan-400">+{signals.context_score || 0} pts</p>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <p className="text-slate-400 text-[10px]">Sensitive File</p>
                <p className="text-base font-bold font-mono text-cyan-400">+{signals.file_type_score || 0} pts</p>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 sm:col-span-2">
                <p className="text-slate-400 text-[10px]">Credential Severity</p>
                <p className="text-base font-bold font-mono text-cyan-400">+{signals.type_severity_score || 0} pts</p>
              </div>
            </div>

            {/* Signals Reasoning List */}
            {signals.details && signals.details.length > 0 && (
              <ul className="space-y-1 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 text-[11px] text-slate-300">
                {signals.details.map((d, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                    {d}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Blast Radius Assessment */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-1 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              Blast Radius Impact: <span className="text-amber-400 font-mono font-extrabold">{finding.blast_radius}</span>
            </h4>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              {finding.blast_radius_explanation}
            </p>
          </div>

          {/* Safe Code Remediation Recommendation */}
          <div>
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-1.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Safe Remediation Recommendation
            </h4>
            <p className="text-slate-300 mb-2">{finding.remediation_recommendation}</p>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-400">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Recommended Code Pattern:</p>
              <pre className="whitespace-pre-wrap">{finding.safe_replacement_example}</pre>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-4 mt-6">
          <span className="text-xs text-slate-400">
            Status: <span className="font-bold text-cyan-400">{finding.status}</span>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="btn-secondary text-xs"
            >
              Close
            </button>

            {finding.status === 'DETECTED' && (
              <button
                onClick={() => {
                  onRemediate(finding.id);
                  onClose();
                }}
                className="btn-warning text-xs"
              >
                Mark as Remediated
              </button>
            )}

            {(finding.status === 'REMEDIATED' || finding.status === 'REQUIRES ATTENTION') && (
              <button
                onClick={() => {
                  onVerify();
                  onClose();
                }}
                disabled={isVerifying}
                className="btn-success text-xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
                Verify Rescan
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
