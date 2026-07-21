import React, { useEffect, useState } from "react";
import { Sprout, ShieldCheck, TrendingUp } from "lucide-react";
import { SectionHeading } from "./ui/Shared.jsx";
import { api } from "../api.js";

export default function AdvisoryScreen({ t, lastStatus }) {
  const [advisory, setAdvisory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAdvisory(lastStatus || "warning")
      .then((res) => setAdvisory(res.advisory))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [lastStatus]);

  const groups = [
    { key: "organic", icon: Sprout, colorClass: "text-sprout" },
    { key: "chemical", icon: ShieldCheck, colorClass: "text-turmeric" },
    { key: "preventive", icon: TrendingUp, colorClass: "text-canopy" },
  ];

  return (
    <div className="px-5 pt-6 pb-4">
      <SectionHeading title={t.advisory.title} />
      {loading && <p className="text-sm text-[#8A8674]">…</p>}
      {advisory && (
        <div className="space-y-5 mt-2">
          {groups.map((g) => (
            <div key={g.key}>
              <div className="flex items-center gap-2 mb-2">
                <g.icon size={16} className={g.colorClass} />
                <h3 className={`text-sm font-semibold uppercase tracking-wide ${g.colorClass}`}>{t.advisory[g.key]}</h3>
              </div>
              <div className="rounded-2xl overflow-hidden bg-paper border border-[#E4DFCF]">
                {advisory[g.key].map((item, i) => (
                  <div key={i} className={`px-4 py-3 ${i < advisory[g.key].length - 1 ? "border-b border-[#E4DFCF]" : ""}`}>
                    <p className="font-medium text-sm text-ink">{item.title}</p>
                    <p className="text-sm mt-0.5 text-[#5C5A4E]">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
