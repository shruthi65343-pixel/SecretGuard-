import React from 'react';
import { Key, Lock, Shield, Database, Cpu } from 'lucide-react';

export default function RiskDistribution({ riskSummary }) {
  const riskCounts = riskSummary?.risk_counts || { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };
  const categoryCounts = riskSummary?.category_counts || {
    "API Key": 0,
    "Password": 0,
    "Access Token": 0,
    "Secret Key": 0,
    "Database Credential": 0
  };

  const totalFindings = riskSummary?.total_findings || 0;

  const getPercent = (val) => {
    if (totalFindings === 0) return 0;
    return Math.round((val / totalFindings) * 100);
  };

  const categories = [
    { label: "API Keys", key: "API Key", icon: Key, color: "text-amber-400", border: "border-amber-500/30" },
    { label: "Passwords", key: "Password", icon: Lock, color: "text-rose-400", border: "border-rose-500/30" },
    { label: "Access Tokens", key: "Access Token", icon: Shield, color: "text-cyan-400", border: "border-cyan-500/30" },
    { label: "Secret Keys", key: "Secret Key", icon: Cpu, color: "text-purple-400", border: "border-purple-500/30" },
    { label: "DB Credentials", key: "Database Credential", icon: Database, color: "text-emerald-400", border: "border-emerald-500/30" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      
      {/* Risk Distribution Chart */}
      <div className="glass-panel p-5 lg:col-span-1 flex flex-col justify-between">
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center justify-between">
            <span>Risk Level Distribution</span>
            <span className="text-xs text-slate-400 font-mono font-normal">Total: {totalFindings}</span>
          </h4>

          {/* Combined Progress Bar */}
          <div className="w-full bg-slate-950 h-4 rounded-lg flex overflow-hidden border border-slate-800 mb-6">
            <div 
              style={{ width: `${getPercent(riskCounts.CRITICAL)}%` }} 
              className="bg-rose-500 h-full transition-all duration-300"
              title={`Critical: ${riskCounts.CRITICAL}`}
            ></div>
            <div 
              style={{ width: `${getPercent(riskCounts.HIGH)}%` }} 
              className="bg-amber-500 h-full transition-all duration-300"
              title={`High: ${riskCounts.HIGH}`}
            ></div>
            <div 
              style={{ width: `${getPercent(riskCounts.MEDIUM)}%` }} 
              className="bg-blue-500 h-full transition-all duration-300"
              title={`Medium: ${riskCounts.MEDIUM}`}
            ></div>
            <div 
              style={{ width: `${getPercent(riskCounts.LOW)}%` }} 
              className="bg-emerald-500 h-full transition-all duration-300"
              title={`Low: ${riskCounts.LOW}`}
            ></div>
          </div>

          {/* Breakdown List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-rose-500 inline-block shadow-sm shadow-rose-500/50"></span>
                <span className="text-slate-200 font-medium">Critical Risk (75-100)</span>
              </div>
              <span className="font-mono text-rose-400 font-bold">{riskCounts.CRITICAL} ({getPercent(riskCounts.CRITICAL)}%)</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-amber-500 inline-block shadow-sm shadow-amber-500/50"></span>
                <span className="text-slate-200 font-medium">High Risk (50-74)</span>
              </div>
              <span className="font-mono text-amber-400 font-bold">{riskCounts.HIGH} ({getPercent(riskCounts.HIGH)}%)</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-blue-500 inline-block"></span>
                <span className="text-slate-200 font-medium">Medium Risk (25-49)</span>
              </div>
              <span className="font-mono text-blue-400 font-bold">{riskCounts.MEDIUM} ({getPercent(riskCounts.MEDIUM)}%)</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-emerald-500 inline-block"></span>
                <span className="text-slate-200 font-medium">Low Risk (0-24)</span>
              </div>
              <span className="font-mono text-emerald-400 font-bold">{riskCounts.LOW} ({getPercent(riskCounts.LOW)}%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Secret Category Breakdown */}
      <div className="glass-panel p-5 lg:col-span-2">
        <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
          Secret Categories Detected
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const count = categoryCounts[cat.key] || 0;
            return (
              <div 
                key={cat.key}
                className={`bg-slate-950/60 p-3.5 rounded-xl border ${cat.border} flex flex-col items-center text-center transition-all hover:border-slate-600`}
              >
                <div className={`p-2 rounded-lg bg-slate-900 ${cat.color} mb-2`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-2xl font-bold font-mono text-white">{count}</span>
                <span className="text-[11px] text-slate-400 font-medium mt-1">{cat.label}</span>
              </div>
            );
          })}
        </div>

        <div className="mt-4 p-3 rounded-lg bg-slate-950 border border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            Multi-Signal Analysis: Pattern + Shannon Entropy + Surrounding Code Context
          </span>
          <span className="font-mono text-cyan-400">Avg Confidence: {riskSummary?.average_confidence || 0}%</span>
        </div>
      </div>

    </div>
  );
}
