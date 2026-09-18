import React from 'react';
import { Shield, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        
        <div className="flex items-center gap-2">
          <Shield size={14} className="text-emerald-600" />
          <span>Explainable Student Early Support System</span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-400">24-Hour Hackathon MVP</span>
        </div>

        <div className="flex items-center gap-4 text-slate-500">
          <span className="flex items-center gap-1">
            <Sparkles size={12} className="text-slate-400" />
            <span>Support &amp; Early Intervention Principle (Non-Surveillance)</span>
          </span>
          <span className="text-slate-300">•</span>
          <span className="font-mono text-[11px] text-slate-400">v0.1.0-frontend</span>
        </div>

      </div>
    </footer>
  );
};
