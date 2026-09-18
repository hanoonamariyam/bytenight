import React from 'react';

interface RankChangeIndicatorProps {
  rankChange: number;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const RankChangeIndicator: React.FC<RankChangeIndicatorProps> = ({
  rankChange,
  showText = false,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm font-medium',
    lg: 'text-base font-semibold',
  }[size];

  if (rankChange > 0) {
    // Improved rank (e.g. climbed 2 positions)
    return (
      <span
        className={`inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 ${sizeClasses}`}
        title={`Rank improved by ${rankChange} position${rankChange > 1 ? 's' : ''}`}
      >
        <span aria-hidden="true">↑</span>
        <span>{rankChange}</span>
        {showText && <span className="text-xs font-normal opacity-90">Improved</span>}
      </span>
    );
  }

  if (rankChange < 0) {
    // Declined rank (e.g. dropped 2 positions)
    const absChange = Math.abs(rankChange);
    return (
      <span
        className={`inline-flex items-center gap-1 font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-300 ${sizeClasses}`}
        title={`Rank dropped by ${absChange} position${absChange > 1 ? 's' : ''}`}
      >
        <span aria-hidden="true" className="text-amber-700">↓</span>
        <span>{absChange}</span>
        {showText && <span className="text-xs font-normal opacity-75">Dropped</span>}
      </span>
    );
  }

  // Unchanged rank
  return (
    <span
      className={`inline-flex items-center gap-1 text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200 ${sizeClasses}`}
      title="Rank unchanged"
    >
      <span aria-hidden="true">—</span>
      <span>{showText ? 'No Change' : '0'}</span>
    </span>
  );
};
