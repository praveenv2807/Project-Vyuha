import React from "react";
import { Terminal, X, Check, Copy, Cpu } from "lucide-react";

export default function RemediationModal({ vuln, patch, loading, onClose }) {
  const [copied, setCopied] = React.useState(false);

  if (!vuln) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(patch);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-mono text-xs">
      <div className="bg-[#0b0e14] border border-emerald-500/50 rounded-sm w-full max-w-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* MODAL HEADER */}
        <div className="bg-[#07090e] border-b border-slate-800/80 px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-white uppercase tracking-wider">
              AI REMEDIATION PATCH // {vuln.cve}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* MODAL CONTENT */}
        <div className="p-4 space-y-3">
          <div className="bg-[#05070a] border border-slate-800 p-2.5 rounded-sm">
            <span className="text-slate-500 text-[10px] block uppercase">
              TARGET VECTOR
            </span>
            <span className="text-white font-bold">{vuln.title}</span>
            <span className="text-slate-400 text-[10px] block mt-1">
              Location: {vuln.location}
            </span>
          </div>

          <div className="relative">
            <div className="flex items-center justify-between text-[10px] text-slate-400 bg-[#07090e] border border-b-0 border-slate-800 px-3 py-1">
              <span>PATCH OUTPUT</span>
              <button
                onClick={handleCopy}
                className="text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
              >
                {copied ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                <span>{copied ? "COPIED" : "COPY CODE"}</span>
              </button>
            </div>

            <pre className="bg-[#020304] border border-slate-800 p-3 text-emerald-400 text-[11px] overflow-x-auto min-h-[160px] font-mono leading-relaxed">
              {loading
                ? "// Generating optimal remediation patch with Vyuha AI..."
                : patch}
            </pre>
          </div>
        </div>

        {/* FOOTER */}
        <div className="bg-[#07090e] border-t border-slate-800/80 px-4 py-2 flex items-center justify-between text-[10px] text-slate-500">
          <span>STATUS: AUDITED BY VYUHA ENGINE</span>
          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1 font-bold rounded-sm"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}
