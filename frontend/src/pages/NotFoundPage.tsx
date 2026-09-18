import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mb-4">
        <FileQuestion size={32} />
      </div>
      <h1 className="text-2xl font-bold text-slate-900">404 — Screen Not Found</h1>
      <p className="text-sm text-slate-500 mt-2 max-w-md">
        The academic route you requested does not exist or has been relocated within the portal.
      </p>
      <Link
        to="/dashboard"
        className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-colors"
      >
        <ArrowLeft size={14} />
        <span>Return to Faculty Dashboard</span>
      </Link>
    </div>
  );
};
