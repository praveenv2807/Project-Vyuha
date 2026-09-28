import React from "react";
import { AlertOctagon, AlertTriangle, Info } from "lucide-react";

export default function AnalyticsSummary({ vulnerabilities }) {
  const critical = vulnerabilities.filter(
    (v) => v.severity === "CRITICAL",
  ).length;
  const high = vulnerabilities.filter((v) => v.severity === "HIGH").length;
  const medium = vulnerabilities.filter((v) => v.severity === "MEDIUM").length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400">Critical Threats</p>
          <p className="text-2xl font-bold text-rose-500">{critical}</p>
        </div>
        <AlertOctagon className="w-8 h-8 text-rose-500/30" />
      </div>

      <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400">High Severity</p>
          <p className="text-2xl font-bold text-amber-500">{high}</p>
        </div>
        <AlertTriangle className="w-8 h-8 text-amber-500/30" />
      </div>

      <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400">Medium Severity</p>
          <p className="text-2xl font-bold text-sky-400">{medium}</p>
        </div>
        <Info className="w-8 h-8 text-sky-400/30" />
      </div>
    </div>
  );
}
