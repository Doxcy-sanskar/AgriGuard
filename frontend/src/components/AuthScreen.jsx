import React, { useState } from "react";
import { Leaf, Languages } from "lucide-react";
import { CROP_OPTIONS } from "../i18n/strings.js";
import { api, saveSession } from "../api.js";

export default function AuthScreen({ t, lang, setLang, onAuth }) {
  const [mode, setMode] = useState("login");
  const [step, setStep] = useState("details");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [village, setVillage] = useState("");
  const [crops, setCrops] = useState([]);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [demoCode, setDemoCode] = useState("");

  const toggleCrop = (c) => setCrops((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));

  const canSendOtp = mode === "login" ? phone.length === 10 : phone.length === 10 && name.trim().length > 1 && village.trim().length > 1;

  const handleSendOtp = async () => {
    if (!canSendOtp) return;
    setError("");
    setLoading(true);
    try {
      const payload = mode === "register" ? { phone, name, village, crops } : { phone, name: undefined, village: undefined };
      const res = await api.sendOtp(payload);
      setDemoCode(res.demoCode || "");
      setStep("otp");
    } catch (e) {
      setError(e.message || t.auth.genericError);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError(lang === "hi" ? "कृपया 6 अंकों का कोड डालें" : "Please enter the 6-digit code");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await api.verifyOtp({ phone, code: otp });
      saveSession(res.token, res.user);
      onAuth(res.user);
    } catch (e) {
      setError(e.message || t.auth.genericError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-canopy">
      <div className="flex justify-end px-5 pt-5">
        <button
          onClick={() => setLang(lang === "en" ? "hi" : "en")}
          className="flex items-center gap-1 text-xs font-mono px-3 py-1.5 rounded-full bg-white/10 text-white"
        >
          <Languages size={12} /> {lang === "en" ? "हिंदी" : "English"}
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-10">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2 justify-center mb-2">
            <Leaf size={28} className="text-turmeric" />
            <span className="text-2xl font-display font-semibold text-white">{t.appName}</span>
          </div>
          <p className="text-center text-sm mb-8 text-[#B9CFB4]">{t.auth.sub}</p>

          <div className="rounded-2xl p-5 bg-paper">
            {step === "details" ? (
              <>
                <div className="flex rounded-xl overflow-hidden mb-5 bg-husk">
                  {["login", "register"].map((m) => (
                    <button
                      key={m}
                      onClick={() => { setMode(m); setError(""); }}
                      className={`flex-1 py-2 text-sm font-medium ${mode === m ? "bg-sprout text-white" : "text-ink"}`}
                    >
                      {m === "login" ? t.auth.loginTab : t.auth.registerTab}
                    </button>
                  ))}
                </div>

                {mode === "register" && (
                  <>
                    <label className="text-xs font-medium block mb-1.5 text-[#5C5A4E]">{t.auth.name}</label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t.auth.namePlaceholder}
                      className="w-full rounded-xl px-3 py-2.5 mb-4 text-sm outline-none bg-husk text-ink border border-[#D8D2BE]"
                    />
                    <label className="text-xs font-medium block mb-1.5 text-[#5C5A4E]">{t.auth.village}</label>
                    <input
                      value={village}
                      onChange={(e) => setVillage(e.target.value)}
                      placeholder={t.auth.villagePlaceholder}
                      className="w-full rounded-xl px-3 py-2.5 mb-4 text-sm outline-none bg-husk text-ink border border-[#D8D2BE]"
                    />
                    <label className="text-xs font-medium block mb-1.5 text-[#5C5A4E]">{t.auth.crops}</label>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {CROP_OPTIONS.map((c) => (
                        <button
                          key={c}
                          onClick={() => toggleCrop(c)}
                          className={`text-xs font-medium px-3 py-1.5 rounded-full border ${
                            crops.includes(c) ? "bg-sprout text-white border-sprout" : "bg-husk text-[#5C5A4E] border-[#D8D2BE]"
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </>
                )}

                <label className="text-xs font-medium block mb-1.5 text-[#5C5A4E]">{t.auth.phone}</label>
                <div className="flex items-center rounded-xl mb-1 overflow-hidden bg-husk border border-[#D8D2BE]">
                  <span className="px-3 text-sm font-mono text-[#8A8674]">+91</span>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder={t.auth.phonePlaceholder}
                    inputMode="numeric"
                    className="flex-1 py-2.5 pr-3 text-sm outline-none bg-transparent text-ink"
                  />
                </div>

                {error && <p className="text-xs mt-2 text-rust">{error}</p>}

                <button
                  onClick={handleSendOtp}
                  disabled={!canSendOtp || loading}
                  className="w-full rounded-xl py-3 text-sm font-semibold mt-4 bg-canopy text-white disabled:opacity-40"
                >
                  {loading ? "…" : t.auth.sendOtp}
                </button>
              </>
            ) : (
              <>
                <p className="text-sm mb-1 text-[#5C5A4E]">{t.auth.otpSentTo}</p>
                <p className="text-sm font-mono font-medium mb-4 text-ink">+91 {phone}</p>

                <input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="••••••"
                  inputMode="numeric"
                  className="w-full rounded-xl px-3 py-3 mb-1 text-center text-lg tracking-[0.5em] font-mono outline-none bg-husk text-ink border border-[#D8D2BE]"
                />
                {error && <p className="text-xs mt-2 text-rust">{error}</p>}
                {demoCode && <p className="text-xs mt-2 font-mono text-[#8A8674]">{t.auth.demoHint} Code: {demoCode}</p>}

                <button
                  onClick={handleVerify}
                  disabled={loading}
                  className="w-full rounded-xl py-3 text-sm font-semibold mt-4 bg-sprout text-white disabled:opacity-60"
                >
                  {loading ? "…" : t.auth.verify}
                </button>

                <div className="flex items-center justify-between mt-3">
                  <button onClick={() => { setStep("details"); setOtp(""); setError(""); }} className="text-xs font-medium text-canopy">
                    {t.auth.changeNumber}
                  </button>
                  <button onClick={handleSendOtp} className="text-xs font-medium text-sprout">
                    {t.auth.resend}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
