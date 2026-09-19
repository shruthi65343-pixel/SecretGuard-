import React from 'react';
import { Award, ShieldCheck, CheckCircle2, AlertTriangle, RefreshCw, BarChart2 } from 'lucide-react';

export default function ComplianceView({ complianceData }) {
  const score = complianceData?.compliance_score || 0;
  const totalScans = complianceData?.total_scans || 0;
  const cleanScans = complianceData?.clean_scans || 0;
  const findingsDetected = complianceData?.findings_detected || 0;
  const findingsRemediated = complianceData?.findings_remediated || 0;
  const findingsVerified = complianceData?.findings_verified || 0;
  const remediationRate = complianceData?.remediation_rate || 0;
  const verificationRate = complianceData?.verification_rate || 0;

  return (
    <div className="space-y-6">
      
      {/* Compliance Header Card */}
      <div className="glass-panel p-6 glass-panel-glow-cyan flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/20">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-extrabold text-white">Developer Security Compliance</h3>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                PROTOTYPE METRICS
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Calculates defensive posture using scan cleanliness, remediation response speed, and code rescan verification ratios.
            </p>
          </div>
        </div>

        {/* Score Gauge Badge */}
        <div className="bg-slate-950 px-6 py-4 rounded-xl border border-slate-800 text-center min-w-[160px]">
          <p className="text-xs uppercase font-bold text-slate-400 tracking-wider">Compliance Index</p>
          <div className="text-4xl font-extrabold font-mono text-cyan-400 mt-1">{score}%</div>
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide">
            {score >= 80 ? 'EXCELLENT POSTURE' : score >= 50 ? 'MODERATE POSTURE' : 'REQUIRES REMEDIATION'}
          </span>
        </div>
      </div>

      {/* Metrics Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Metric 1 */}
        <div className="glass-panel p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase">Clean Scan Ratio</span>
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <h4 className="text-2xl font-extrabold text-white font-mono">
            {totalScans > 0 ? Math.round((cleanScans / totalScans) * 100) : 100}%
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            {cleanScans} clean scans out of {totalScans} total execution runs.
          </p>
        </div>

        {/* Metric 2 */}
        <div className="glass-panel p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase">Remediation Rate</span>
            <CheckCircle2 className="w-5 h-5 text-amber-400" />
          </div>
          <h4 className="text-2xl font-extrabold text-white font-mono">{remediationRate}%</h4>
          <p className="text-xs text-slate-400 mt-1">
            {findingsRemediated + findingsVerified} of {findingsDetected} findings addressed.
          </p>
        </div>

        {/* Metric 3 */}
        <div className="glass-panel p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase">Verification Rate</span>
            <RefreshCw className="w-5 h-5 text-cyan-400" />
          </div>
          <h4 className="text-2xl font-extrabold text-white font-mono">{verificationRate}%</h4>
          <p className="text-xs text-slate-400 mt-1">
            {findingsVerified} findings confirmed safe via source rescan.
          </p>
        </div>

      </div>

      {/* Disclaimer Box */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-slate-200">Prototype Disclaimer:</p>
          <p className="mt-0.5">
            {complianceData?.disclaimer || "This compliance score is an experimental prototype metric designed for hackathon demonstration. It does not constitute formal SOC 2, ISO 27001, or PCI-DSS certification."}
          </p>
        </div>
      </div>

    </div>
  );
}
