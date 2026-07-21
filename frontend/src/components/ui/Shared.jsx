import React from "react";
import { CheckCircle2, AlertTriangle, ChevronRight } from "lucide-react";

export function StatusBadge({ status, size = "sm" }) {
  const map = {
    healthy: { color: "#5B8C51", label: "Healthy", Icon: CheckCircle2 },
    warning: { color: "#D9A527", label: "Watch", Icon: AlertTriangle },
    diseased: { color: "#B3452C", label: "Diseased", Icon: AlertTriangle },
  };
  const entry = map[status] || map.warning;
  const { color, label, Icon } = entry;
  const pad = size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium ${pad}`} style={{ backgroundColor: `${color}1A`, color }}>
      <Icon size={size === "sm" ? 12 : 14} />
      {label}
    </span>
  );
}

export function SectionHeading({ eyebrow, title, action, onAction }) {
  return (
    <div className="flex items-end justify-between mb-3">
      <div>
        {eyebrow && <p className="text-xs font-mono uppercase tracking-wider mb-1 text-sprout">{eyebrow}</p>}
        <h2 className="text-xl font-display font-semibold text-canopy">{title}</h2>
      </div>
      {action && (
        <button onClick={onAction} className="text-sm font-medium flex items-center gap-0.5 text-sprout">
          {action} <ChevronRight size={14} />
        </button>
      )}
    </div>
  );
}

export function LedgerRow({ entry }) {
  const dateStr = new Date(entry.createdAt).toLocaleString();
  return (
    <div className="relative flex items-start gap-3 pl-4 py-3 border-b border-[#E4DFCF]">
      <div className="absolute left-0 top-0 bottom-0 w-px bg-[#C9C2AC]" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="font-medium text-[15px] truncate text-ink">{entry.fieldLabel}</p>
          <StatusBadge status={entry.status} />
        </div>
        <p className="text-sm mt-0.5 text-[#5C5A4E]">{entry.label}</p>
        <p className="text-xs mt-1 font-mono text-[#8A8674]">{dateStr}</p>
      </div>
    </div>
  );
}
