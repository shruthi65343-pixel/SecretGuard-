import React from 'react';
import { History, CheckCircle2, AlertOctagon, FileCode, Clock } from 'lucide-react';

export default function ScanHistoryView({ scanHistory }) {
  const history = scanHistory || [];

  return (
    <div className="space-y-6">
      <div className="cyber-panel p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <History className="w-5 h-5 text-cyan-400" />
              Scan History & Audit Trail ({history.length})
            </h3>
            <p className="text-xs text-slate-400">
              Audit log of previous scanner execution runs.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900/90 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Scan ID</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Target Path</th>
                <th className="py-3 px-4">Files Scanned</th>
                <th className="py-3 px-4">Secrets Found</th>
                <th className="py-3 px-4">Risk Breakdown</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {history.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400">
                    <Clock className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="font-semibold text-slate-300">No scan history recorded yet.</p>
                    <p className="text-xs text-slate-500">Run a secret scan to populate audit records.</p>
                  </td>
                </tr>
              ) : (
                history.map((record) => (
                  <tr key={record.scan_id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-cyan-400">
                      {record.scan_id}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                      {record.timestamp}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-200">
                      {record.target_path}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      {record.files_scanned} files
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold">
                      <span className={record.secrets_detected > 0 ? 'text-rose-400' : 'text-emerald-400'}>
                        {record.secrets_detected} secrets
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-[10px]">
                        {record.critical_risk > 0 && (
                          <span className="px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 font-bold">
                            {record.critical_risk} Crit
                          </span>
                        )}
                        {record.high_risk > 0 && (
                          <span className="px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-bold">
                            {record.high_risk} High
                          </span>
                        )}
                        {record.secrets_detected === 0 && (
                          <span className="text-emerald-400 font-semibold">Clean</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        record.scan_status === 'PASSED' ? 'chip-verified' : 'chip-detected'
                      }`}>
                        {record.scan_status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
