import { useState } from "react";
import axios from "axios";
import { Download, LoaderCircle, Radar, ScanSearch, Server, ShieldAlert, Terminal, Zap } from "lucide-react";

import { AnimatedCounter, DataTable, GlassCard, LoadingState, PageShell, RiskBadge } from "../components/CyberUI";

const API_URL = "http://localhost:5000";

function Scan() {
  const [target, setTarget] = useState("");
  const [scanType, setScanType] = useState("quick");
  const [result, setResult] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const runScan = async () => {
    if (!target.trim()) {
      alert("Enter target");
      return;
    }

    try {
      setLoading(true);
      setResult(null);
      setLogs([]);

      const fakeLogs = [
        "> Initializing scan profile...",
        "> Resolving target identity...",
        "> Running Nmap probe matrix...",
        "> Detecting exposed services...",
        "> Correlating vulnerability signals...",
      ];

      for (const log of fakeLogs) {
        await new Promise((resolve) => setTimeout(resolve, 520));
        setLogs((previous) => [...previous, log]);
      }

      const response = await axios.post(`${API_URL}/api/scan`, { target, scanType });
      setResult(response.data);
      setLogs((previous) => [...previous, "> Scan complete"]);
    } catch (error) {
      console.log(error);
      setLogs((previous) => [...previous, "> Scan failed"]);
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = async () => {
    if (!result) return;

    try {
      const response = await axios.post(`${API_URL}/api/report`, result, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = "security-report.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.log(error);
      alert("Failed to generate report");
    }
  };

  const portColumns = [
    { key: "port", label: "Port" },
    { key: "state", label: "State", render: (row) => <span className="status-pill"><Zap size={14} />{row.state}</span> },
    { key: "service", label: "Service" },
  ];

  const riskColumns = [
    { key: "severity", label: "Severity", render: (row) => <RiskBadge severity={row.severity || "Medium"} /> },
    { key: "issue", label: "Issue" },
    { key: "recommendation", label: "Recommended Fix" },
  ];

  return (
    <PageShell
      eyebrow="Attack surface scanner"
      title="CyberLab Scanner"
      description="Launch targeted reconnaissance, watch terminal activity in real time, and review service exposure with risk-ranked findings."
      icon={Radar}
    >
      <GlassCard>
        <div className="form-row">
          <label className="input-shell">
            <Server size={19} />
            <input
              type="text"
              placeholder="Enter IP address or domain"
              value={target}
              onChange={(event) => setTarget(event.target.value)}
            />
          </label>

          <label className="input-shell">
            <ScanSearch size={19} />
            <select value={scanType} onChange={(event) => setScanType(event.target.value)}>
              <option value="quick">Quick scan</option>
              <option value="full">Full scan</option>
              <option value="service">Service detection</option>
            </select>
          </label>

          <button className="cyber-button" onClick={runScan} disabled={loading}>
            {loading ? <LoaderCircle className="spinning" size={19} /> : <Radar size={19} />}
            Scan
          </button>

          {result && (
            <button className="cyber-button secondary" onClick={downloadReport}>
              <Download size={19} />
              Report
            </button>
          )}
        </div>
      </GlassCard>

      <div className="scan-grid">
        <GlassCard className="terminal">
          <h2 className="card-title">
            <Terminal size={20} />
            Terminal Activity
          </h2>
          <div className="terminal-lines">
            {logs.length ? logs.map((log, index) => <p className="terminal-line" key={`${log}-${index}`}>{log}</p>) : <p className="terminal-placeholder">waiting for scan...</p>}
          </div>
        </GlassCard>

        <GlassCard className="metric-card">
          <p>Current Risk Score</p>
          <strong>
            <AnimatedCounter value={result?.riskScore || 0} />
            /100
          </strong>
          {result ? <RiskBadge value={result.riskScore} /> : <span className="terminal-placeholder">No assessment loaded</span>}
        </GlassCard>
      </div>

      {loading && <LoadingState label="Correlating scan results" />}

      {result && (
        <div className="details-grid">
          <GlassCard>
            <h2 className="card-title">
              <Server size={20} />
              Open Ports
            </h2>
            <DataTable columns={portColumns} rows={result.ports || []} emptyText="No open ports reported." />
          </GlassCard>

          <GlassCard>
            <h2 className="card-title">
              <ShieldAlert size={20} />
              Detected Risks
            </h2>
            <DataTable columns={riskColumns} rows={result.vulnerabilities || []} emptyText="No vulnerabilities detected." />
          </GlassCard>
        </div>
      )}
    </PageShell>
  );
}

export default Scan;
