import React from 'react';
import { Play, RefreshCw, FolderGit2, Activity, Wifi, WifiOff } from 'lucide-react';

export default function Header({
  targetPath,
  setTargetPath,
  onRunScan,
  isScanning,
  backendConnected
}) {
  return (
    <header className="h-16 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md sticky top-0 z-20 px-6 flex items-center justify-between gap-4">
      
      {/* Left: Backend Status Badge */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold">
          {backendConnected ? (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-emerald-400 flex items-center gap-1.5">
                <Wifi className="w-3.5 h-3.5" /> API Connected (port 8000)
              </span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              <span className="text-rose-400 flex items-center gap-1.5">
                <WifiOff className="w-3.5 h-3.5" /> API Offline
              </span>
            </>
          )}
        </div>

        <span className="text-xs text-slate-500 hidden sm:inline-block">|</span>

        <div className="text-xs text-slate-400 hidden sm:flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span>Defensive Secret Detection Engine</span>
        </div>
      </div>

      {/* Right: Demo Project Selector & Prominent Run Button */}
      <div className="flex items-center gap-3">
        
        {/* Demo Project Selector */}
        <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
          <FolderGit2 className="w-4 h-4 text-cyan-400" />
          <span className="text-slate-400 text-[11px] font-semibold hidden md:inline">Target:</span>
          <select
            value={targetPath}
            onChange={(e) => setTargetPath(e.target.value)}
            className="bg-transparent text-slate-200 text-xs font-mono font-bold focus:outline-none cursor-pointer"
          >
            <option value="demo_project" className="bg-slate-950 text-slate-200">demo_project (Unsafe Demo)</option>
            <option value="clean_demo_project" className="bg-slate-950 text-slate-200">clean_demo_project (Clean Safe)</option>
          </select>
        </div>

        {/* Prominent Run Secret Scan Button */}
        <button
          onClick={onRunScan}
          disabled={isScanning}
          className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs sm:text-sm px-4 py-2 rounded-xl border border-cyan-400/40 shadow-lg shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
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

    </header>
  );
}
