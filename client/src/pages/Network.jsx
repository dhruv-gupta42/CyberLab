import { useEffect, useState } from "react";
import axios from "axios";
import { Cpu, Network as NetworkIcon, RadioTower, Wifi } from "lucide-react";

import { DataTable, GlassCard, LoadingState, PageShell } from "../components/CyberUI";

function Network() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDevices = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/network");
        setDevices(response.data);
      } catch (error) {
        console.log(error.response?.data || error);
      } finally {
        setLoading(false);
      }
    };

    loadDevices();
  }, []);

  const columns = [
    { key: "ip", label: "IP Address", render: (row) => <span className="status-pill"><Wifi size={14} />{row.ip}</span> },
    { key: "mac", label: "MAC Address" },
    { key: "vendor", label: "Vendor", render: (row) => row.vendor || "Unknown" },
    { key: "status", label: "Status", render: (row) => <span className="status-pill"><RadioTower size={14} />{row.status}</span> },
  ];

  return (
    <PageShell
      eyebrow="Network discovery"
      title="Network Devices"
      description="Inspect discovered hosts, vendors, and live status across the local security surface."
      icon={NetworkIcon}
    >
      <GlassCard>
        <h2 className="card-title">
          <Cpu size={20} />
          Device Inventory
        </h2>
        {loading ? <LoadingState label="Discovering network devices" /> : <DataTable columns={columns} rows={devices} emptyText="No network devices discovered." />}
      </GlassCard>
    </PageShell>
  );
}

export default Network;
