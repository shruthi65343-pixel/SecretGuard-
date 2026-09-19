import React, { useState } from 'react';
import { Terminal, Play, CheckCircle2, AlertOctagon, Copy, Check } from 'lucide-react';

export default function PreCommitTerminal({ currentTarget, onTriggerScan, scanData }) {
  const [selectedTarget, setSelectedTarget] = useState(currentTarget || 'demo_project');
  const [copied, setCopied] = useState(false);

  const isClean = scanData?.scan_status === 'PASSED' && selectedTarget === currentTarget;
  const secretsCount = selectedTarget === currentTarget ? (scanData?.secrets_detected || 0) : 8;

  const copyHookCommand = () => {
    navigator.clipboard.writeText('python -m backend.cli ' + selectedTarget);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Intro Box */}
      <div className="glass-panel p-5 border-cyan-500/30">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-cyan-400" />
              Pre-Commit Hook Simulation (Git Security Shield)
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Demonstrates how SecretGuard intercepts local Git commits in terminal workflows before secrets reach remote repositories.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedTarget}
              onChange={(e) => setSelectedTarget(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 font-mono"
            >
              <option value="demo_project">Target: demo_project (8 Secrets)</option>
              <option value="clean_demo_project">Target: clean_demo_project (0 Secrets)</option>
            </select>

            <button
              onClick={() => onTriggerScan(selectedTarget)}
              className="btn-primary text-xs"
            >
              <Play className="w-3.5 h-3.5 fill-current text-white" />
              Simulate Commit Scan
            </button>
          </div>
        </div>
      </div>

      {/* Terminal Viewport */}
      <div className="rounded-xl border border-slate-800 bg-slate-950 shadow-2xl overflow-hidden font-mono text-xs">
        
        {/* Terminal Header */}
        <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
            <span className="text-slate-400 text-[11px] ml-2 font-semibold">Git Pre-Commit Terminal Simulator</span>
          </div>

          <button
            onClick={copyHookCommand}
            className="flex items-center gap-1.5 text-slate-400 hover:text-cyan-400 text-[11px] transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied CLI Command' : 'Copy CLI Command'}
          </button>
        </div>

        {/* Terminal Output Body */}
        <div className="p-5 text-slate-200 space-y-2 leading-relaxed selection:bg-cyan-500 selection:text-slate-950">
          
          <div className="text-cyan-400 font-bold">
            $ git commit -m "feat: update project settings"
          </div>

          <div className="text-slate-400 italic">
            [Hook] Executing SecretGuard pre-commit scanner on target: <span className="text-white font-bold">{selectedTarget}</span>...
          </div>

          <div className="text-slate-500 my-2">============================================================</div>
          <div className="text-cyan-400 font-bold">              SECRETGUARD SECURITY SCANNER              </div>
          <div className="text-slate-500 my-2">============================================================</div>

          <div className="text-slate-300">
            Scanning directory: <span className="text-yellow-300">{selectedTarget}</span>
          </div>

          <div className="text-slate-300">
            Files scanned: <span className="text-cyan-400 font-bold">{selectedTarget === 'clean_demo_project' ? 1 : 5}</span>
          </div>
          
          <div className="text-slate-300">
            Secrets detected: <span className={`font-bold ${secretsCount > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>{secretsCount}</span>
          </div>

          {secretsCount > 0 ? (
            <>
              <div className="my-3 space-y-2 text-slate-300">
                <div className="p-2 rounded bg-slate-900 border border-slate-800 text-rose-300">
                  <p className="font-bold">Finding #1 | API Key | app.py:L6 [CRITICAL]</p>
                  <p className="text-slate-400">Snippet: API_KEY = "[HIDDEN]" | Fingerprint: SG-8D8B7828</p>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800 text-rose-300">
                  <p className="font-bold">Finding #2 | Database Credential | config.py:L4 [CRITICAL]</p>
                  <p className="text-slate-400">Snippet: DATABASE_PASSWORD = "[HIDDEN]" | Fingerprint: SG-12D9086A</p>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-400 text-[11px]">
                  ... and 6 additional findings hidden for brevity.
                </div>
              </div>

              <div className="text-slate-500 my-2">============================================================</div>
              <div className="text-rose-500 font-extrabold text-sm tracking-wide">
                SECRETGUARD SCAN FAILED
              </div>
              <div className="text-rose-400">
                Possible exposed secrets detected in source files.
              </div>
              <div className="text-amber-400 font-bold mt-1">
                COMMIT STATUS: BLOCKED [Exit Code: 1]
              </div>
              <div className="text-slate-500 my-2">============================================================</div>
            </>
          ) : (
            <>
              <div className="text-slate-500 my-2">============================================================</div>
              <div className="text-emerald-400 font-extrabold text-sm tracking-wide flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                SECRETGUARD SCAN PASSED
              </div>
              <div className="text-emerald-300">
                No hardcoded secrets detected. Source code is clean.
              </div>
              <div className="text-cyan-400 font-bold mt-1">
                COMMIT STATUS: ALLOWED [Exit Code: 0]
              </div>
              <div className="text-slate-500 my-2">============================================================</div>
            </>
          )}

        </div>

      </div>

      {/* Pre-Commit Installation snippet */}
      <div className="glass-panel p-5">
        <h4 className="font-bold text-white uppercase text-xs tracking-wider mb-2">
          How to install this hook locally (.git/hooks/pre-commit):
        </h4>
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs text-cyan-300">
          <p className="text-slate-500"># Save to .git/hooks/pre-commit and make executable (chmod +x)</p>
          <pre className="mt-1 text-slate-200">py -m backend.cli demo_project</pre>
        </div>
      </div>

    </div>
  );
}
