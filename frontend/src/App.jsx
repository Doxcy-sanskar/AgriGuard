import React, { useEffect, useMemo, useState } from "react";
import { Home, ScanLine, Bell, Store, User, Leaf, Languages, Wifi, WifiOff } from "lucide-react";
import { STRINGS } from "./i18n/strings.js";
import { loadSession, clearSession } from "./api.js";

import AuthScreen from "./components/AuthScreen.jsx";
import HomeScreen from "./components/HomeScreen.jsx";
import ScanScreen from "./components/ScanScreen.jsx";
import AdvisoryScreen from "./components/AdvisoryScreen.jsx";
import AlertsScreen from "./components/AlertsScreen.jsx";
import MarketScreen from "./components/MarketScreen.jsx";
import ProfileScreen from "./components/ProfileScreen.jsx";

export default function App() {
  const [tab, setTab] = useState("home");
  const [lang, setLang] = useState(localStorage.getItem("agriguard_lang") || "en");
  const [online, setOnline] = useState(navigator.onLine);
  const [user, setUser] = useState(null);
  const [lastStatus, setLastStatus] = useState("warning");
  const [booting, setBooting] = useState(true);

  const t = useMemo(() => STRINGS[lang], [lang]);

  useEffect(() => {
    const session = loadSession();
    if (session) setUser(session.user);
    setBooting(false);
  }, []);

  useEffect(() => {
    localStorage.setItem("agriguard_lang", lang);
  }, [lang]);

  useEffect(() => {
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  if (booting) return null;

  if (!user) {
    return <AuthScreen t={t} lang={lang} setLang={setLang} onAuth={(u) => { setUser(u); setTab("home"); }} />;
  }

  const handleLogout = () => {
    clearSession();
    setUser(null);
    setTab("home");
  };

  const navItems = [
    { key: "home", icon: Home, label: t.nav.home },
    { key: "scan", icon: ScanLine, label: t.nav.scan },
    { key: "advisory", icon: Leaf, label: t.nav.advisory },
    { key: "alerts", icon: Bell, label: t.nav.alerts },
    { key: "market", icon: Store, label: t.nav.market },
  ];

  return (
    <div className="min-h-screen w-full flex justify-center bg-[#DCD6C2] font-body">
      <div className="w-full lg:max-w-5xl lg:my-6 lg:rounded-3xl lg:overflow-hidden lg:shadow-xl flex flex-col lg:flex-row bg-husk" style={{ minHeight: "100vh" }}>
        {/* Desktop sidebar */}
        <div className="hidden lg:flex flex-col w-60 shrink-0 py-6 px-4 bg-canopy">
          <div className="flex items-center gap-2 px-2 mb-8">
            <Leaf size={22} className="text-turmeric" />
            <span className="text-xl font-display font-semibold text-white">{t.appName}</span>
          </div>
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setTab(item.key)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-left ${tab === item.key ? "bg-white/10 text-white" : "text-[#B9CFB4]"}`}
            >
              <item.icon size={18} />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
          <button
            onClick={() => setTab("profile")}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-left ${tab === "profile" ? "bg-white/10 text-white" : "text-[#B9CFB4]"}`}
          >
            <User size={18} />
            <span className="text-sm font-medium">{user.name.split(" ")[0]}</span>
          </button>
          <div className="mt-auto px-2">
            <span className={`flex items-center gap-2 text-xs font-mono ${online ? "text-[#9FC79A]" : "text-turmeric"}`}>
              {online ? <Wifi size={13} /> : <WifiOff size={13} />}
              {online ? "Connected" : "Offline"}
            </span>
          </div>
        </div>

        {/* Main column */}
        <div className="flex-1 flex flex-col">
          <div className="lg:hidden flex items-center justify-between px-5 py-3 bg-canopy">
            <div className="flex items-center gap-2">
              <Leaf size={18} className="text-turmeric" />
              <span className="font-display font-semibold text-white">{t.appName}</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setLang(lang === "en" ? "hi" : "en")} className="flex items-center gap-1 text-xs font-mono px-2 py-1 rounded-full bg-white/10 text-white">
                <Languages size={12} /> {lang === "en" ? "हिं" : "EN"}
              </button>
              <button onClick={() => setTab("profile")} className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: tab === "profile" ? "#D9A527" : "#ffffff1A" }}>
                <User size={14} color="#fff" />
              </button>
            </div>
          </div>

          {!online && (
            <div className="flex items-center gap-2 px-5 py-2 text-xs font-mono" style={{ backgroundColor: "#FDF3DC", color: "#5A4413" }}>
              <WifiOff size={13} /> Offline — some features need a connection
            </div>
          )}

          <div className="hidden lg:flex justify-end px-6 pt-4">
            <button onClick={() => setLang(lang === "en" ? "hi" : "en")} className="flex items-center gap-1 text-xs font-mono px-3 py-1.5 rounded-full bg-paper text-canopy border border-[#D8D2BE]">
              <Languages size={12} /> {lang === "en" ? "हिंदी" : "English"}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pb-24 lg:pb-6">
            {tab === "home" && <HomeScreen t={t} user={user} onScan={() => setTab("scan")} />}
            {tab === "scan" && (
              <ScanScreen
                t={t}
                onDiagnosed={(result) => {
                  setLastStatus(result.status);
                  setTab("advisory");
                }}
              />
            )}
            {tab === "advisory" && <AdvisoryScreen t={t} lastStatus={lastStatus} />}
            {tab === "alerts" && <AlertsScreen t={t} />}
            {tab === "market" && <MarketScreen t={t} />}
            {tab === "profile" && <ProfileScreen t={t} lang={lang} setLang={setLang} user={user} onLogout={handleLogout} />}
          </div>

          <div className="lg:hidden fixed bottom-0 left-0 right-0 flex justify-around items-center py-2 px-2 bg-paper border-t border-[#E4DFCF]">
            {navItems.map((item) => (
              <button key={item.key} onClick={() => setTab(item.key)} className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl">
                <item.icon size={20} color={tab === item.key ? "#5B8C51" : "#9C9682"} />
                <span className="text-[10px] font-medium" style={{ color: tab === item.key ? "#5B8C51" : "#9C9682" }}>
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
