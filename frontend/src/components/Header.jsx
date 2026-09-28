import React from "react";
import { ShieldAlert, Activity } from "lucide-react";

export default function Header({ targetUrl, setTargetUrl, onScan, loading }) {
  return (
    <header className="bg-slate-800 border-b border-slate-700 p-4 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <ShieldAlert className="w-8 h-8 text-emerald-400" />
          <div>
            <h1 className="text-xl font-bold tracking-wide text-white">
              PROJECT VYUHA
            </h1>
            <p className="text-xs text-slate-400">
              AI-Powered Autonomous Remediation System
            </p>
          </div>
        </div>

        <form
          onSubmit={onScan}
          className="flex items-center w-full md:w-auto space-x-2"
        >
          <input
            type="text"
            placeholder="https://example.com or local endpoint..."
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-sm rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full md:w-80"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center space-x-2 transition"
          >
            {loading ? (
              <Activity className="w-4 h-4 animate-spin" />
            ) : (
              <span>Scan</span>
            )}
          </button>
        </form>
      </div>
    </header>
  );
}
