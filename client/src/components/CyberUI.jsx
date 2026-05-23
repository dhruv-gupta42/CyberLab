import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";
import { Activity, AlertTriangle, LoaderCircle } from "lucide-react";

import { getRiskLabel } from "../utils/risk";

export function PageShell({ eyebrow, title, description, icon: Icon = Activity, children }) {
  return (
    <motion.main
      className="page-shell"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
    >
      <header className="page-header">
        <div className="page-kicker">
          <Icon size={18} />
          <span>{eyebrow}</span>
        </div>
        <div>
          <h1>{title}</h1>
          {description && <p>{description}</p>}
        </div>
      </header>
      {children}
    </motion.main>
  );
}

export function GlassCard({ children, className = "" }) {
  return <section className={`glass-card ${className}`}>{children}</section>;
}

export function AnimatedCounter({ value, suffix = "" }) {
  const spring = useSpring(0, { stiffness: 80, damping: 18, mass: 0.8 });
  const display = useTransform(spring, (latest) => `${Math.round(latest)}${suffix}`);

  useEffect(() => {
    spring.set(Number(value) || 0);
  }, [spring, value]);

  return <motion.span>{display}</motion.span>;
}

export function RiskBadge({ value, severity }) {
  const resolved = severity || getRiskLabel(value);

  return (
    <span className={`risk-badge risk-${resolved.toLowerCase()}`}>
      <AlertTriangle size={14} />
      {resolved}
    </span>
  );
}

export function DataTable({ columns, rows, emptyText }) {
  if (!rows?.length) {
    return <div className="empty-state">{emptyText || "No records found."}</div>;
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.id || index}>
              {columns.map((column) => (
                <td key={column.key}>{column.render ? column.render(row, index) : row[column.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function LoadingState({ label = "Loading security telemetry" }) {
  return (
    <div className="loading-state">
      <LoaderCircle size={22} />
      <span>{label}</span>
    </div>
  );
}
