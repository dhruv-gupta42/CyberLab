import { useEffect, useState } from "react";
import axios from "axios";
import { Clock, History as HistoryIcon, ScanLine } from "lucide-react";

import { DataTable, GlassCard, LoadingState, PageShell, RiskBadge } from "../components/CyberUI";

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/history");
        setHistory(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  const columns = [
    { key: "target", label: "Target" },
    { key: "scanType", label: "Scan Type", render: (row) => <span className="status-pill"><ScanLine size={14} />{row.scanType}</span> },
    { key: "riskScore", label: "Risk", render: (row) => <RiskBadge value={row.riskScore} /> },
    { key: "score", label: "Score", render: (row) => `${row.riskScore}/100` },
  ];

  return (
    <PageShell
      eyebrow="Scan archive"
      title="Scan History"
      description="Review previous assessments in a sortable-ready table format with consistent risk labels."
      icon={HistoryIcon}
    >
      <GlassCard>
        <h2 className="card-title">
          <Clock size={20} />
          Assessment Log
        </h2>
        {loading ? <LoadingState label="Loading scan history" /> : <DataTable columns={columns} rows={history} emptyText="No scan history has been recorded yet." />}
      </GlassCard>
    </PageShell>
  );
}

export default History;
