import { BrowserRouter, NavLink, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Activity, Gauge, History as HistoryIcon, Network as NetworkIcon, Radar, ShieldCheck } from "lucide-react";

import Scan from "./pages/Scan";
import History from "./pages/History";
import Dashboard from "./pages/Dashboard";
import Network from "./pages/Network";

const navItems = [
  { to: "/", label: "Scanner", icon: Radar },
  { to: "/dashboard", label: "Dashboard", icon: Gauge },
  { to: "/history", label: "History", icon: HistoryIcon },
  { to: "/network", label: "Network", icon: NetworkIcon },
];

function AppFrame() {
  const location = useLocation();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <ShieldCheck size={25} />
          </div>
          <div>
            <strong>CyberLab</strong>
            <span>Threat Console</span>
          </div>
        </div>

        <nav className="sidebar-nav" aria-label="Primary navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink key={item.to} to={item.to} end={item.to === "/"}>
                <Icon size={19} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-status">
          <Activity size={17} />
          <div>
            <span>System Online</span>
            <strong>Live monitoring</strong>
          </div>
        </div>
      </aside>

      <section className="content-pane">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Scan />} />
            <Route path="/history" element={<History />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/network" element={<Network />} />
          </Routes>
        </AnimatePresence>
      </section>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppFrame />
    </BrowserRouter>
  );
}

export default App;
