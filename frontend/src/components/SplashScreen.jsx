import React, { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";

export default function SplashScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 400);
          return 100;
        }
        return prev + 10;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center z-50 text-white font-mono">
      <div className="relative flex items-center justify-center mb-6">
        <div className="w-20 h-20 border-2 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin"></div>
        <ShieldCheck className="w-10 h-10 text-emerald-400 absolute" />
      </div>

      <h1 className="text-xl font-bold tracking-widest uppercase mb-2">
        PROJECT VYUHA
      </h1>
      <p className="text-xs text-slate-400 mb-6">
        Initializing Defense Grid & AI Engine...
      </p>

      <div className="w-64 bg-slate-900 border border-slate-800 rounded-full h-2 overflow-hidden">
        <div
          className="bg-emerald-500 h-full transition-all duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="text-[10px] text-emerald-400 mt-2">
        {progress}% SYSTEM READY
      </span>
    </div>
  );
}
