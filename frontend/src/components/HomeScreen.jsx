import React, { useEffect, useState } from "react";
import { ChevronRight, ScanLine } from "lucide-react";
import { SectionHeading, LedgerRow } from "./ui/Shared.jsx";
import { api } from "../api.js";

export default function HomeScreen({ t, user, onScan }) {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getScans().then(setScans).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="pb-4">
      <div className="px-5 pt-6 pb-5 bg-canopy">
        <p className="text-sm text-[#B9CFB4]">{user.village}</p>
        <h1 className="text-2xl mt-1 font-display font-semibold text-white">
          {t.home.greeting}, {user.name.split(" ")[0]}
        </h1>
        <p className="text-sm mt-1 text-[#B9CFB4]">{user.crops.join(" · ")}</p>
      </div>

      <div className="px-5 mt-5">
        <button
          onClick={onScan}
          className="w-full rounded-2xl p-5 flex items-center gap-4 text-left transition-transform active:scale-[0.98] bg-sprout"
        >
          <div className="rounded-xl p-3 bg-white/20">
            <ScanLine size={26} color="#fff" />
          </div>
          <div>
            <p className="text-white font-semibold text-lg leading-tight">{t.home.quickScan}</p>
            <p className="text-sm text-[#E4F0DF]">{t.home.quickScanSub}</p>
          </div>
          <ChevronRight size={20} color="#fff" className="ml-auto shrink-0" />
        </button>
      </div>

      <div className="px-5 mt-6">
        <SectionHeading eyebrow="Field ledger" title={t.home.ledgerTitle} />
        <div className="rounded-2xl overflow-hidden bg-paper border border-[#E4DFCF]">
          <div className="px-4">
            {loading && <p className="py-6 text-sm text-center text-[#8A8674]">…</p>}
            {!loading && scans.length === 0 && <p className="py-6 text-sm text-center text-[#8A8674]">{t.home.noScans}</p>}
            {scans.map((s) => <LedgerRow key={s.id} entry={s} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
