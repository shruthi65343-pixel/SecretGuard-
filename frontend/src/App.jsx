import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import OverviewStats from './components/OverviewStats';
import RiskDistribution from './components/RiskDistribution';
import FindingsTable from './components/FindingsTable';
import FindingDetailModal from './components/FindingDetailModal';
import PreCommitTerminal from './components/PreCommitTerminal';
import ComplianceView from './components/ComplianceView';
import ScanHistoryView from './components/ScanHistoryView';
import SettingsView from './components/SettingsView';

const API_BASE = 'http://127.0.0.1:8000';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [targetPath, setTargetPath] = useState('demo_project');
  const [isScanning, setIsScanning] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [backendConnected, setBackendConnected] = useState(false);

  // State objects
  const [scanData, setScanData] = useState(null);
  const [riskSummary, setRiskSummary] = useState(null);
  const [complianceData, setComplianceData] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);
  const [selectedFinding, setSelectedFinding] = useState(null);

  // Check backend health & perform initial scan
  useEffect(() => {
    checkHealthAndScan();
  }, []);

  const checkHealthAndScan = async () => {
    try {
      const res = await fetch(`${API_BASE}/`);
      if (res.ok) {
        setBackendConnected(true);
        handleRunScan('demo_project');
      } else {
        setBackendConnected(false);
      }
    } catch (err) {
      setBackendConnected(false);
    }
  };

  // Run Scan API call
  const handleRunScan = async (overrideTarget) => {
    const target = overrideTarget || targetPath;
    setIsScanning(true);
    try {
      const scanRes = await fetch(`${API_BASE}/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target_path: target })
      });

      if (scanRes.ok) {
        const data = await scanRes.json();
        setScanData(data);
        setBackendConnected(true);
      }

      fetchRiskSummary();
      fetchCompliance();
      fetchScanHistory();
    } catch (err) {
      console.error('Scan error:', err);
    } finally {
      setIsScanning(false);
    }
  };

  const fetchRiskSummary = async () => {
    try {
      const res = await fetch(`${API_BASE}/risk-summary`);
      if (res.ok) {
        const summary = await res.json();
        setRiskSummary(summary);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCompliance = async () => {
    try {
      const res = await fetch(`${API_BASE}/compliance`);
      if (res.ok) {
        const data = await res.json();
        setComplianceData(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchScanHistory = async () => {
    try {
      const res = await fetch(`${API_BASE}/scan-history`);
      if (res.ok) {
        const history = await res.json();
        setScanHistory(history);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Remediate Finding API call
  const handleRemediateFinding = async (findingId) => {
    try {
      const res = await fetch(`${API_BASE}/findings/${findingId}/remediate`, {
        method: 'POST'
      });
      if (res.ok) {
        if (scanData) {
          const updatedFindings = scanData.findings.map((f) =>
            f.id === findingId ? { ...f, status: 'REMEDIATED' } : f
          );
          setScanData({ ...scanData, findings: updatedFindings });
        }
        fetchCompliance();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Verify / Rescan API call
  const handleVerify = async () => {
    setIsVerifying(true);
    try {
      const res = await fetch(`${API_BASE}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target_path: targetPath })
      });
      if (res.ok) {
        const data = await res.json();
        if (scanData) {
          setScanData({ ...scanData, findings: data.findings });
        }
        fetchCompliance();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-row selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Left Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <Header
          targetPath={targetPath}
          setTargetPath={(val) => {
            setTargetPath(val);
            handleRunScan(val);
          }}
          onRunScan={() => handleRunScan(targetPath)}
          isScanning={isScanning}
          backendConnected={backendConnected}
        />

        {/* Dynamic Main Body */}
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
          
          {!backendConnected && (
            <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-800 text-xs text-rose-300 flex items-center justify-between">
              <div>
                <p className="font-bold">FastAPI Backend Offline (http://127.0.0.1:8000)</p>
                <p className="text-rose-400 mt-0.5">
                  Start backend with <code className="font-mono bg-rose-900/60 px-1.5 py-0.5 rounded">py -m uvicorn backend.main:app --reload</code>
                </p>
              </div>
              <button
                onClick={checkHealthAndScan}
                className="px-3 py-1.5 rounded-lg bg-rose-900 hover:bg-rose-800 text-white font-bold text-xs"
              >
                Retry Connection
              </button>
            </div>
          )}

          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <>
              <OverviewStats
                scanData={scanData}
                complianceData={complianceData}
              />

              <RiskDistribution
                riskSummary={riskSummary}
              />

              <FindingsTable
                findings={scanData?.findings || []}
                onInspectFinding={(f) => setSelectedFinding(f)}
                onRemediateFinding={handleRemediateFinding}
                onVerifyFinding={handleVerify}
                isVerifying={isVerifying}
              />
            </>
          )}

          {/* TAB 2: PRE-COMMIT CLI */}
          {activeTab === 'precommit' && (
            <PreCommitTerminal
              currentTarget={targetPath}
              onTriggerScan={(target) => handleRunScan(target)}
              scanData={scanData}
            />
          )}

          {/* TAB 3: FINDINGS */}
          {activeTab === 'findings' && (
            <FindingsTable
              findings={scanData?.findings || []}
              onInspectFinding={(f) => setSelectedFinding(f)}
              onRemediateFinding={handleRemediateFinding}
              onVerifyFinding={handleVerify}
              isVerifying={isVerifying}
            />
          )}

          {/* TAB 4: RISK ANALYSIS */}
          {activeTab === 'risks' && (
            <RiskDistribution
              riskSummary={riskSummary}
            />
          )}

          {/* TAB 5: COMPLIANCE */}
          {activeTab === 'compliance' && (
            <ComplianceView
              complianceData={complianceData}
            />
          )}

          {/* TAB 6: SCAN HISTORY */}
          {activeTab === 'history' && (
            <ScanHistoryView
              scanHistory={scanHistory}
            />
          )}

          {/* TAB 7: SETTINGS */}
          {activeTab === 'settings' && (
            <SettingsView />
          )}

        </main>

        {/* Footer */}
        <footer className="border-t border-slate-900 bg-slate-950 py-3.5 px-6 text-center text-xs text-slate-500">
          <p>SecretGuard — Intelligent Secret Detection & Prevention Platform (Defensive Hackathon Prototype)</p>
        </footer>

      </div>

      {/* Finding Detail Drawer Modal */}
      {selectedFinding && (
        <FindingDetailModal
          finding={selectedFinding}
          onClose={() => setSelectedFinding(null)}
          onRemediate={handleRemediateFinding}
          onVerify={handleVerify}
          isVerifying={isVerifying}
        />
      )}

    </div>
  );
}
