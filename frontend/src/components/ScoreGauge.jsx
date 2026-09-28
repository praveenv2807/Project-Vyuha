import React from "react";

export default function ScoreGauge({ score }) {
  const getScoreColor = (val) => {
    if (val >= 80) return "text-emerald-400 border-emerald-500";
    if (val >= 50) return "text-amber-400 border-amber-500";
    return "text-rose-500 border-rose-500";
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 flex flex-col items-center justify-center">
      <h3 className="text-sm font-medium text-slate-400 mb-4">
        Security Score
      </h3>
      <div
        className={`w-28 h-28 rounded-full border-4 flex items-center justify-center ${getScoreColor(score)}`}
      >
        <span className="text-3xl font-bold">{score}</span>
        <span className="text-xs text-slate-500">/100</span>
      </div>
    </div>
  );
}
