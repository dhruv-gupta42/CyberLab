import { useEffect, useState } from "react";
import axios from "axios";
import { Crosshair, Gauge, Radar, ShieldAlert } from "lucide-react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { AnimatedCounter, GlassCard, LoadingState, PageShell, RiskBadge } from "../components/CyberUI";

function Dashboard() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/history");
        setHistory(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const totalScans = history.length;
  const averageRisk = totalScans ? Math.round(history.reduce((sum, item) => sum + item.riskScore, 0) / totalScans) : 0;
  const targetCounts = history.reduce((counts, item) => ({ ...counts, [item.target]: (counts[item.target] || 0) + 1 }), {});
  const mostScanned = Object.entries(targetCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "None";
  const chartData = history.map((item, index) => ({ scan: index + 1, risk: item.riskScore }));

  return (
    <PageShell
      eyebrow="Security intelligence"
      title="Operations Dashboard"
      description="Track scan volume, average exposure, and risk trend movement across recent targets."
      icon={Gauge}
    >
      {loading ? (
        <LoadingState />
      ) : (
        <>
          <div className="grid-3">
            <GlassCard className="metric-card">
              <p>Total Scans</p>
              <strong><AnimatedCounter value={totalScans} /></strong>
            </GlassCard>

            <GlassCard className="metric-card">
              <p>Average Risk</p>
              <strong><AnimatedCounter value={averageRisk} /></strong>
              <RiskBadge value={averageRisk} />
            </GlassCard>

            <GlassCard className="metric-card">
              <p>Most Scanned</p>
              <strong style={{ fontSize: "28px" }}>{mostScanned}</strong>
            </GlassCard>
          </div>

          <GlassCard className="chart-card">
            <h2 className="card-title">
              <ShieldAlert size={20} />
              Risk Trend
            </h2>
            <div className="chart-area">
              <ResponsiveContainer>
                <LineChart data={chartData}>
                  <CartesianGrid stroke="rgba(107, 240, 255, 0.12)" vertical={false} />
                  <XAxis dataKey="scan" stroke="#83a3b7" tickLine={false} />
                  <YAxis stroke="#83a3b7" tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(5, 12, 21, 0.96)",
                      border: "1px solid rgba(86, 255, 184, 0.35)",
                      borderRadius: 8,
                      color: "#d5e7f4",
                    }}
                  />
                  <Line type="monotone" dataKey="risk" stroke="#56ffb8" strokeWidth={3} dot={{ fill: "#42c8ff", r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          <div className="details-grid">
            <GlassCard>
              <h2 className="card-title">
                <Radar size={20} />
                Signal Summary
              </h2>
              <p className="terminal-placeholder">Latest telemetry is grouped by scan order and scored on a 0-100 exposure scale.</p>
            </GlassCard>
            <GlassCard>
              <h2 className="card-title">
                <Crosshair size={20} />
                Priority
              </h2>
              <RiskBadge value={averageRisk} />
            </GlassCard>
          </div>
        </>
      )}
    </PageShell>
  );
}

export default Dashboard;
