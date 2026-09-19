import React, { useState } from 'react';
import { Search, Eye, CheckCircle, RefreshCw, AlertCircle, ShieldAlert, Fingerprint } from 'lucide-react';

export default function FindingsTable({
  findings,
  onInspectFinding,
  onRemediateFinding,
  onVerifyFinding,
  isVerifying
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Filter findings logic
  const filteredFindings = (findings || []).filter((f) => {
    const matchesSearch = 
      f.secret_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.relative_path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.fingerprint.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesRisk = riskFilter === 'ALL' || f.risk_level.toUpperCase() === riskFilter.toUpperCase();
    const matchesStatus = statusFilter === 'ALL' || f.status.toUpperCase() === statusFilter.toUpperCase();

    return matchesSearch && matchesRisk && matchesStatus;
  });

  const getRiskBadgeClass = (risk) => {
    switch (risk?.toUpperCase()) {
      case 'CRITICAL': return 'badge-risk-critical';
      case 'HIGH': return 'badge-risk-high';
      case 'MEDIUM': return 'badge-risk-medium';
      case 'LOW': return 'badge-risk-low';
      default: return 'bg-slate-800 text-slate-300';
    }
  };

  const getStatusChipClass = (status) => {
    switch (status?.toUpperCase()) {
      case 'DETECTED': return 'status-chip-detected';
      case 'REMEDIATED': return 'status-chip-remediated';
      case 'VERIFIED': return 'status-chip-verified';
      case 'REQUIRES ATTENTION': return 'status-chip-attention';
      default: return 'bg-slate-800 text-slate-300';
    }
  };

  return (
    <div className="glass-panel p-5">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-5">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-cyan-400" />
            Detected Secrets Findings ({filteredFindings.length})
          </h3>
          <p className="text-xs text-slate-400">
            Real secret values are strictly masked as <code className="text-cyan-400 font-mono">[HIDDEN]</code>.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-48">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search file or key..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg pl-8 pr-3 py-2 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          {/* Risk Filter */}
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-2 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="CRITICAL">Critical Risk</option>
            <option value="HIGH">High Risk</option>
            <option value="MEDIUM">Medium Risk</option>
            <option value="LOW">Low Risk</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-2 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="DETECTED">DETECTED</option>
            <option value="REMEDIATED">REMEDIATED</option>
            <option value="VERIFIED">VERIFIED</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-900/90 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4">Secret Type</th>
              <th className="py-3 px-4">File & Line</th>
              <th className="py-3 px-4">Risk & Confidence</th>
              <th className="py-3 px-4">Blast Radius</th>
              <th className="py-3 px-4">Fingerprint</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredFindings.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-8 text-center text-slate-400">
                  <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
                  <p className="font-semibold text-slate-200">No secret findings match filters.</p>
                  <p className="text-xs text-slate-500 mt-0.5">Target code is clean or all secrets have been resolved.</p>
                </td>
              </tr>
            ) : (
              filteredFindings.map((f) => (
                <tr key={f.id} className="hover:bg-slate-900/40 transition-colors">
                  
                  {/* Category */}
                  <td className="py-3.5 px-4 font-semibold text-slate-100 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                    {f.secret_type}
                  </td>

                  {/* File & Line */}
                  <td className="py-3.5 px-4 font-mono text-cyan-300">
                    <span className="text-slate-200">{f.relative_path}</span>
                    <span className="text-slate-400 ml-1.5 font-bold">L{f.line_number}</span>
                  </td>

                  {/* Risk Level & Confidence */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${getRiskBadgeClass(f.risk_level)}`}>
                        {f.risk_level}
                      </span>
                      <span className="text-slate-400 font-mono text-[11px]">{f.confidence_score}%</span>
                    </div>
                  </td>

                  {/* Blast Radius */}
                  <td className="py-3.5 px-4">
                    <span className={`text-[11px] font-semibold ${
                      f.blast_radius === 'CRITICAL' ? 'text-rose-400' :
                      f.blast_radius === 'HIGH' ? 'text-amber-400' : 'text-slate-300'
                    }`}>
                      {f.blast_radius}
                    </span>
                  </td>

                  {/* Fingerprint */}
                  <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                    <span className="inline-flex items-center gap-1 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      <Fingerprint className="w-3 h-3 text-cyan-400" />
                      {f.fingerprint}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wide ${getStatusChipClass(f.status)}`}>
                      {f.status}
                    </span>
                  </td>

                  {/* Action Buttons */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Inspect */}
                      <button
                        onClick={() => onInspectFinding(f)}
                        className="btn-secondary text-[11px] py-1 px-2.5"
                        title="Inspect detection signals and safe remediation"
                      >
                        <Eye className="w-3.5 h-3.5 text-cyan-400" />
                        Inspect
                      </button>

                      {/* Remediate Action */}
                      {f.status === 'DETECTED' && (
                        <button
                          onClick={() => onRemediateFinding(f.id)}
                          className="btn-warning text-[11px] py-1 px-2.5"
                          title="Mark finding as remediated"
                        >
                          Remediate
                        </button>
                      )}

                      {/* Verify Action */}
                      {(f.status === 'REMEDIATED' || f.status === 'REQUIRES ATTENTION') && (
                        <button
                          onClick={onVerifyFinding}
                          disabled={isVerifying}
                          className="btn-success text-[11px] py-1 px-2.5"
                          title="Rescan and verify fix in source code"
                        >
                          <RefreshCw className={`w-3 h-3 ${isVerifying ? 'animate-spin' : ''}`} />
                          Verify
                        </button>
                      )}
                    </div>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
