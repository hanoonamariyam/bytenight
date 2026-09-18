import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  subtext?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Loading academic records...',
  subtext = 'Synchronizing model indicators and multi-factor student signals',
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center my-8">
      <Loader2 className="w-9 h-9 text-slate-600 animate-spin mb-3" />
      <h3 className="text-sm font-semibold text-slate-800">{message}</h3>
      {subtext && <p className="text-xs text-slate-500 mt-1 max-w-sm">{subtext}</p>}
    </div>
  );
};
