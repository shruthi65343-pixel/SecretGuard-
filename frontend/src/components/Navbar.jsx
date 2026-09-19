import React from 'react';
import { Shield, Play, RefreshCw, Terminal, CheckCircle2, AlertTriangle, Layers, Award } from 'lucide-react';

export default function Navbar({
  activeTab,
  setActiveTab,
  targetPath,
  setTargetPath,
  onRunScan,
  isScanning,
  backendConnected
}) {
  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand & Status */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-white font-bold">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-xl tracking-tight text-white">
                  Secret<span className="text-cyan-400">Guard</span>
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                  Defensive Prototype
                </span>
              </div>
              <p className="text-xs text-slate-400">Intelligent Secret Detection & Prevention</p>
            </div>
          </div>

          {/* Backend Status Indicator */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-xs">
            <span className={`w-2 h-2 rounded-full ${backendConnected ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`}></span>
            <span className="text-slate-300 font-medium">
              {backendConnected ? 'API Connected' : 'API Offline'}
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-lg border border-slate-800 text-xs sm:text-sm font-medium">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3.5 py-1.5 rounded-md flex items-center gap-2 transition-all ${
              activeTab === 'dashboard'
                ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            Dashboard
          </button>

          <button
            onClick={() => setActiveTab('terminal')}
            className={`px-3.5 py-1.5 rounded-md flex items-center gap-2 transition-all ${
              activeTab === 'terminal'
                ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-4 h-4" />
            Pre-Commit CLI
          </button>

          <button
            onClick={() => setActiveTab('compliance')}
            className={`px-3.5 py-1.5 rounded-md flex items-center gap-2 transition-all ${
              activeTab === 'compliance'
                ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Award className="w-4 h-4" />
            Compliance
          </button>
        </nav>

        {/* Target Path Selector & Action Button */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <select
            value={targetPath}
            onChange={(e) => setTargetPath(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 font-mono focus:outline-none focus:border-cyan-500"
          >
            <option value="demo_project">demo_project (Unsafe Demo)</option>
            <option value="clean_demo_project">clean_demo_project (Clean Safe)</option>
          </select>

          <button
            onClick={onRunScan}
            disabled={isScanning}
            className="btn-primary text-xs sm:text-sm py-2"
          >
            {isScanning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-cyan-200" />
                Scanning...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current text-white" />
                Run Secret Scan
              </>
            )}
          </button>
        </div>

      </div>
    </header>
  );
}
