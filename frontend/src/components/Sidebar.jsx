import React from 'react';
import { 
  Shield, 
  LayoutDashboard, 
  Terminal, 
  Search, 
  BarChart3, 
  Award, 
  History, 
  Settings,
  Lock
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'precommit', label: 'Pre-Commit CLI', icon: Terminal },
    { id: 'findings', label: 'Findings', icon: Search },
    { id: 'risks', label: 'Risk Analysis', icon: BarChart3 },
    { id: 'compliance', label: 'Compliance', icon: Award },
    { id: 'history', label: 'Scan History', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between shrink-0 h-screen sticky top-0 z-30">
      
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-white font-bold">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1.5">
              Secret<span className="text-cyan-400">Guard</span>
            </h1>
            <p className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">
              Developer Security
            </p>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="p-3">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2">
            Platform Navigation
          </p>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-400 border border-cyan-500/30 shadow-md shadow-cyan-500/5'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer Info Box */}
      <div className="p-4 border-t border-slate-900">
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
          <div className="flex items-center gap-2 text-emerald-400 font-bold mb-1">
            <Lock className="w-3.5 h-3.5" />
            <span>Defensive Shield Active</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Secrets are automatically masked as <code className="text-cyan-400 font-mono">[HIDDEN]</code>.
          </p>
        </div>
      </div>

    </aside>
  );
}
