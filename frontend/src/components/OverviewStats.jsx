import React from 'react';
import { 
  FileCode, 
  AlertOctagon, 
  CheckCircle2, 
  ShieldAlert, 
  ShieldCheck,
  AlertTriangle,
  Info,
  Check
} from 'lucide-react';

export default function OverviewStats({ scanData, complianceData }) {
  const filesScanned = scanData?.files_scanned || 0;
  const secretsDetected = scanData?.secrets_detected || 0;
  const criticalRisk = scanData?.critical_risk || 0;
  const highRisk = scanData?.high_risk || 0;
  const mediumRisk = scanData?.medium_risk || 0;
  const lowRisk = scanData?.low_risk || 0;

  const remediated = complianceData?.findings_remediated || 0;
  const verified = complianceData?.findings_verified || 0;
  const complianceScore = complianceData?.compliance_score || 0;

  return (
    <div className="space-y-4 mb-6">
      
      {/* Top 4 Core Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. Files Scanned */}
        <div className="cyber-panel p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Files Scanned</p>
              <h3 className="text-3xl font-extrabold text-white mt-1 font-mono">{filesScanned}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-800/60 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/10">
              <FileCode className="w-6 h-6" />
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-3 flex items-center gap-1.5 font-mono">
            <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block"></span>
            Target: <span className="text-slate-200 font-bold">{scanData?.target_path || 'demo_project'}</span>
          </p>
        </div>

        {/* 2. Total Secrets Detected */}
        <div className={`cyber-panel p-5 relative overflow-hidden ${secretsDetected > 0 ? 'cyber-panel-critical' : 'cyber-panel-emerald'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Secrets Detected</p>
              <h3 className="text-3xl font-extrabold text-white mt-1 font-mono">{secretsDetected}</h3>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
              secretsDetected > 0 
                ? 'bg-rose-950/80 border-rose-800/60 text-rose-400 shadow-lg shadow-rose-500/10' 
                : 'bg-emerald-950/80 border-emerald-800/60 text-emerald-400 shadow-lg shadow-emerald-500/10'
            }`}>
              {secretsDetected > 0 ? <AlertOctagon className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
            </div>
          </div>
          
          <div className="mt-3">
            {secretsDetected > 0 ? (
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 inline-flex items-center gap-1">
                <AlertOctagon className="w-3 h-3" /> Commit Intercepted
              </span>
            ) : (
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 inline-flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Clean Project
              </span>
            )}
          </div>
        </div>

        {/* 3. Remediated & Verified */}
        <div className="cyber-panel p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Remediated & Verified</p>
              <h3 className="text-3xl font-extrabold text-white mt-1 font-mono">{remediated + verified}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-800/60 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3 text-xs text-slate-400 font-mono">
            <span className="text-amber-400 font-semibold">{remediated} Remediated</span>
            <span>•</span>
            <span className="text-emerald-400 font-semibold">{verified} Verified</span>
          </div>
        </div>

        {/* 4. Compliance Score */}
        <div className="cyber-panel p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Compliance Index</p>
              <h3 className="text-3xl font-extrabold text-cyan-400 mt-1 font-mono">{complianceScore}%</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-800/60 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/10">
              <ShieldAlert className="w-6 h-6" />
            </div>
          </div>
          
          <div className="w-full bg-slate-950 h-2 rounded-full mt-3 overflow-hidden border border-slate-800">
            <div 
              className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${complianceScore}%` }}
            ></div>
          </div>
        </div>

      </div>

      {/* 4 Risk Level Breakdown Cards: Red (Critical), Orange (High), Yellow (Medium), Green (Low) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        
        {/* Critical Risk (Red) */}
        <div className="bg-slate-950/80 p-3.5 rounded-xl border border-rose-500/30 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-rose-400 uppercase tracking-wider">Critical Risk</p>
            <p className="text-2xl font-extrabold font-mono text-white mt-0.5">{criticalRisk}</p>
          </div>
          <span className="w-3 h-3 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50"></span>
        </div>

        {/* High Risk (Orange) */}
        <div className="bg-slate-950/80 p-3.5 rounded-xl border border-orange-500/30 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-orange-400 uppercase tracking-wider">High Risk</p>
            <p className="text-2xl font-extrabold font-mono text-white mt-0.5">{highRisk}</p>
          </div>
          <span className="w-3 h-3 rounded-full bg-orange-500 shadow-sm shadow-orange-500/50"></span>
        </div>

        {/* Medium Risk (Yellow) */}
        <div className="bg-slate-950/80 p-3.5 rounded-xl border border-yellow-500/30 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-yellow-400 uppercase tracking-wider">Medium Risk</p>
            <p className="text-2xl font-extrabold font-mono text-white mt-0.5">{mediumRisk}</p>
          </div>
          <span className="w-3 h-3 rounded-full bg-yellow-500 shadow-sm shadow-yellow-500/50"></span>
        </div>

        {/* Low Risk (Green) */}
        <div className="bg-slate-950/80 p-3.5 rounded-xl border border-emerald-500/30 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Low Risk</p>
            <p className="text-2xl font-extrabold font-mono text-white mt-0.5">{lowRisk}</p>
          </div>
          <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></span>
        </div>

      </div>

    </div>
  );
}
