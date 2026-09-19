import React from 'react';
import { Settings, Cpu, Shield, FileText, Sliders } from 'lucide-react';

export default function SettingsView() {
  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="cyber-panel p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Scanner Engine Settings</h3>
            <p className="text-xs text-slate-400">
              Configure multi-signal detection weights, supported file extensions, and directory exclusions.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Signal Weight Matrix Config */}
        <div className="cyber-panel p-5">
          <h4 className="font-bold text-white uppercase text-xs tracking-wider mb-4 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            Multi-Signal Detection Weights (Max: 100)
          </h4>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800">
              <div>
                <p className="font-semibold text-slate-200">Pattern Signal Weight</p>
                <p className="text-[11px] text-slate-500">Known regex credential formats</p>
              </div>
              <span className="font-mono font-bold text-cyan-400 text-sm">30 pts</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800">
              <div>
                <p className="font-semibold text-slate-200">Shannon Entropy Weight</p>
                <p className="text-[11px] text-slate-500">Calculates candidate string randomness</p>
              </div>
              <span className="font-mono font-bold text-cyan-400 text-sm">25 pts</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800">
              <div>
                <p className="font-semibold text-slate-200">Code Context Weight</p>
                <p className="text-[11px] text-slate-500">Assignment syntax and variable keywords</p>
              </div>
              <span className="font-mono font-bold text-cyan-400 text-sm">20 pts</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800">
              <div>
                <p className="font-semibold text-slate-200">Credential Type Severity Weight</p>
                <p className="text-[11px] text-slate-500">Database & secret key risk weighting</p>
              </div>
              <span className="font-mono font-bold text-cyan-400 text-sm">15 pts</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800">
              <div>
                <p className="font-semibold text-slate-200">Sensitive File Type Weight</p>
                <p className="text-[11px] text-slate-500">.env, .config, .ini Sensitivity</p>
              </div>
              <span className="font-mono font-bold text-cyan-400 text-sm">10 pts</span>
            </div>
          </div>
        </div>

        {/* Supported File Extensions & Exclusions */}
        <div className="cyber-panel p-5">
          <h4 className="font-bold text-white uppercase text-xs tracking-wider mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            Scanner Rules & Exclusions
          </h4>

          <div className="space-y-4 text-xs">
            <div>
              <p className="font-semibold text-slate-300 mb-1.5">Supported File Extensions:</p>
              <div className="flex flex-wrap gap-1.5 font-mono">
                {['.py', '.js', '.java', '.json', '.yaml', '.yml', '.env', '.txt', '.config', '.ini'].map((ext) => (
                  <span key={ext} className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-cyan-300 text-[11px]">
                    {ext}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="font-semibold text-slate-300 mb-1.5">Ignored Directories:</p>
              <div className="flex flex-wrap gap-1.5 font-mono">
                {['.git', 'node_modules', '__pycache__', '.venv', 'venv'].map((dir) => (
                  <span key={dir} className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-slate-400 text-[11px]">
                    {dir}/
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 leading-relaxed text-[11px]">
              <span className="text-cyan-400 font-bold">Privacy Guarantee:</span> Real detected credentials are never logged or exported. Values are strictly replaced with <code className="text-cyan-300">[HIDDEN]</code>.
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
