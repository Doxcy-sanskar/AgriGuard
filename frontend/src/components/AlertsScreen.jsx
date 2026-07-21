import React, { useEffect, useState } from "react";
import { Bell, Clock } from "lucide-react";
import { SectionHeading } from "./ui/Shared.jsx";
import { api } from "../api.js";

const LEVEL_COLOR = { high: "#B3452C", medium: "#D9A527", low: "#5B8C51" };

export default function AlertsScreen({ t }) {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAlerts().then(setAlerts).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="px-5 pt-6 pb-4">
      <SectionHeading title={t.alerts.title} />
      <p className="text-sm mb-4 text-[#5C5A4E]">{t.alerts.subtitle}</p>

      {loading && <p className="text-sm text-[#8A8674]">…</p>}
      {!loading && alerts.length === 0 && <p className="text-sm text-[#8A8674]">{t.alerts.none}</p>}

      <div className="space-y-3">
        {alerts.map((a) => (
          <div
            key={a.id}
            className="rounded-2xl p-4 flex gap-3 bg-paper border border-[#E4DFCF]"
            style={{ borderLeft: `4px solid ${LEVEL_COLOR[a.level]}` }}
          >
            <Bell size={18} style={{ color: LEVEL_COLOR[a.level] }} className="mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="font-medium text-sm text-ink">{a.title}</p>
              <p className="text-sm mt-0.5 text-[#5C5A4E]">{a.body}</p>
              <p className="text-xs font-mono mt-1.5 flex items-center gap-1 text-[#8A8674]">
                <Clock size={11} /> {new Date(a.time).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
