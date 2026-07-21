import React, { useRef, useState, useCallback } from "react";
import { Camera, Upload, Leaf } from "lucide-react";
import { SectionHeading, StatusBadge } from "./ui/Shared.jsx";
import { api } from "../api.js";

export default function ScanScreen({ t, onDiagnosed }) {
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const [fieldLabel, setFieldLabel] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const fileRef = useRef(null);

  const handleFile = useCallback((f) => {
    if (!f) return;
    setFile(f);
    setImage(URL.createObjectURL(f));
    setResult(null);
    setError("");
  }, []);

  const runAnalysis = async () => {
    if (!file) return;
    setAnalyzing(true);
    setError("");
    try {
      const form = new FormData();
      form.append("image", file);
      form.append("fieldLabel", fieldLabel || "Unlabeled field");
      const scan = await api.uploadScan(form);
      setResult(scan);
    } catch (e) {
      setError(e.message || t.scan.error);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="px-5 pt-6 pb-4">
      <SectionHeading title={t.scan.title} />
      <p className="text-sm mb-4 text-[#5C5A4E]">{t.scan.instructions}</p>

      <input
        value={fieldLabel}
        onChange={(e) => setFieldLabel(e.target.value)}
        placeholder={t.scan.fieldLabelPlaceholder}
        className="w-full rounded-xl px-3 py-2.5 mb-4 text-sm outline-none bg-paper text-ink border border-[#E4DFCF]"
      />

      <div
        className="rounded-2xl aspect-square flex items-center justify-center overflow-hidden relative border-2 border-dashed"
        style={{ borderColor: "#5B8C5166", backgroundColor: image ? "transparent" : "#E9E4D4" }}
      >
        {image ? (
          <img src={image} alt="leaf" className="w-full h-full object-cover" />
        ) : (
          <div className="text-center px-6">
            <Leaf size={36} className="mx-auto mb-2 text-sprout" />
            <p className="text-sm text-[#7A755E]">No image selected</p>
          </div>
        )}
        {analyzing && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-canopy/80">
            <div className="w-8 h-8 rounded-full border-2 border-white border-t-transparent animate-spin" />
            <p className="text-white text-sm font-medium">{t.scan.analyzing}</p>
          </div>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      <div className="grid grid-cols-2 gap-3 mt-4">
        <button onClick={() => fileRef.current?.click()} className="rounded-xl py-3 flex items-center justify-center gap-2 font-medium bg-canopy text-white">
          <Camera size={18} /> {t.scan.capture}
        </button>
        <button onClick={() => fileRef.current?.click()} className="rounded-xl py-3 flex items-center justify-center gap-2 font-medium bg-paper text-canopy border border-[#D8D2BE]">
          <Upload size={18} /> {t.scan.upload}
        </button>
      </div>

      {file && !result && !analyzing && (
        <button onClick={runAnalysis} className="w-full mt-4 rounded-xl py-3 text-sm font-semibold bg-sprout text-white">
          {t.scan.title}
        </button>
      )}

      {error && <p className="text-sm mt-3 text-rust">{error}</p>}

      {result && (
        <div className="mt-5 rounded-2xl p-5 relative bg-paper border border-[#E4DFCF]">
          <StatusBadge status={result.status} size="lg" />
          <p className="mt-3 text-lg font-semibold font-display text-ink">{result.label}</p>

          <div className="mt-3 space-y-2">
            <div>
              <div className="flex justify-between text-xs mb-1 text-[#7A755E]">
                <span>{t.scan.confidence}</span><span>{result.confidence}%</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden bg-[#E4DFCF]">
                <div className="h-full rounded-full bg-sprout" style={{ width: `${result.confidence}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1 text-[#7A755E]">
                <span>{t.scan.affected}</span><span>{result.affectedPct}%</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden bg-[#E4DFCF]">
                <div className="h-full rounded-full bg-rust" style={{ width: `${result.affectedPct}%` }} />
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={() => { setImage(null); setFile(null); setResult(null); }}
              className="flex-1 rounded-xl py-2.5 text-sm font-medium border border-canopy text-canopy"
            >
              {t.scan.newScan}
            </button>
            <button onClick={() => onDiagnosed(result)} className="flex-1 rounded-xl py-2.5 text-sm font-medium bg-canopy text-white">
              {t.scan.viewAdvisory}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
