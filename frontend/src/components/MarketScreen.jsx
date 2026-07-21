import React, { useEffect, useState } from "react";
import { MapPin, ChevronRight, User, Phone } from "lucide-react";
import { SectionHeading } from "./ui/Shared.jsx";
import { api } from "../api.js";

export default function MarketScreen({ t }) {
  const [suppliers, setSuppliers] = useState([]);
  const [experts, setExperts] = useState([]);

  useEffect(() => {
    api.getSuppliers().then(setSuppliers).catch(() => {});
    api.getExperts().then(setExperts).catch(() => {});
  }, []);

  return (
    <div className="px-5 pt-6 pb-4">
      <SectionHeading title={t.market.title} />

      <h3 className="text-sm font-semibold uppercase tracking-wide mt-2 mb-2 text-sprout">{t.market.suppliersTitle}</h3>
      <div className="space-y-3 mb-6">
        {suppliers.map((s) => (
          <div key={s.id} className="rounded-2xl p-4 bg-paper border border-[#E4DFCF]">
            <div className="flex items-center justify-between">
              <p className="font-medium text-sm text-ink">{s.name}</p>
              <span className="text-xs font-mono flex items-center gap-1 text-[#8A8674]"><MapPin size={11} />{s.distanceKm} km</span>
            </div>
            <p className="text-sm mt-1 text-[#5C5A4E]">{s.item}</p>
            <button className="mt-2 text-sm font-medium flex items-center gap-1 text-sprout">
              {t.market.directions} <ChevronRight size={14} />
            </button>
          </div>
        ))}
      </div>

      <h3 className="text-sm font-semibold uppercase tracking-wide mb-2 text-canopy">{t.market.expertsTitle}</h3>
      <div className="space-y-3">
        {experts.map((e) => (
          <div key={e.id} className="rounded-2xl p-4 flex items-center gap-3 bg-paper border border-[#E4DFCF]">
            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-canopy">
              <User size={18} color="#fff" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm text-ink">{e.name}</p>
              <p className="text-xs text-[#8A8674]">{e.role}</p>
              <p className="text-xs font-mono mt-0.5 text-sprout">{e.availability}</p>
            </div>
            <a href={`tel:${e.phone}`} className="rounded-full p-2.5 bg-sprout">
              <Phone size={15} color="#fff" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
