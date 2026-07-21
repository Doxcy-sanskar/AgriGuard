import React from "react";
import { User } from "lucide-react";
import { SectionHeading } from "./ui/Shared.jsx";

export default function ProfileScreen({ t, lang, setLang, user, onLogout }) {
  return (
    <div className="px-5 pt-6 pb-4">
      <SectionHeading title={t.profile.title} />
      <div className="rounded-2xl p-5 flex items-center gap-4 bg-paper border border-[#E4DFCF]">
        <div className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 bg-canopy">
          <User size={26} color="#fff" />
        </div>
        <div>
          <p className="font-semibold text-lg font-display text-ink">{user.name}</p>
          <p className="text-sm font-mono text-[#8A8674]">+91 {user.phone}</p>
        </div>
      </div>

      <div className="rounded-2xl mt-4 overflow-hidden bg-paper border border-[#E4DFCF]">
        <div className="px-4 py-3 flex items-center justify-between border-b border-[#E4DFCF]">
          <span className="text-sm text-[#5C5A4E]">{t.profile.village}</span>
          <span className="text-sm font-medium text-ink">{user.village}</span>
        </div>
        <div className="px-4 py-3 flex items-center justify-between border-b border-[#E4DFCF]">
          <span className="text-sm text-[#5C5A4E]">{t.profile.crops}</span>
          <span className="text-sm font-medium text-right text-ink">{(user.crops || []).join(", ")}</span>
        </div>
        <div className="px-4 py-3 flex items-center justify-between">
          <span className="text-sm text-[#5C5A4E]">{t.profile.language}</span>
          <button onClick={() => setLang(lang === "en" ? "hi" : "en")} className="text-sm font-medium px-2 py-1 rounded-full bg-husk text-sprout">
            {lang === "en" ? "English" : "हिंदी"}
          </button>
        </div>
      </div>

      <button onClick={onLogout} className="w-full mt-6 rounded-xl py-3 text-sm font-medium border border-rust text-rust">
        {t.profile.logout}
      </button>
    </div>
  );
}
