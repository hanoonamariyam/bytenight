import React from 'react';
import { DataAvailabilityStatus } from '../../types/student.types';
import { Info, Check, AlertCircle } from 'lucide-react';

interface DataAvailabilityChipProps {
  status: DataAvailabilityStatus;
  label?: string;
  sourceName?: string;
  size?: 'sm' | 'md';
}

export const DataAvailabilityChip: React.FC<DataAvailabilityChipProps> = ({
  status,
  label,
  sourceName,
  size = 'md',
}) => {
  const config = {
    AVAILABLE: {
      defaultLabel: 'Available',
      icon: Check,
      className: 'bg-slate-100 text-slate-700 border-slate-200',
      tooltip: 'Signal verified and actively ingested.',
    },
    DATA_UNAVAILABLE: {
      defaultLabel: 'Data Unavailable',
      icon: Info,
      // Neutral slate/sky tone - never red/alarming!
      className: 'bg-sky-50 text-sky-800 border-sky-200',
      tooltip: 'Signal unrecorded or sensor offline. Evaluated neutrally without risk penalty.',
    },
    LOW_CONFIDENCE: {
      defaultLabel: 'Low Confidence',
      icon: AlertCircle,
      className: 'bg-amber-50 text-amber-700 border-amber-200',
      tooltip: 'Signal captured below confidence threshold. Discounted in model weight.',
    },
  }[status];

  const Icon = config.icon;
  const displayLabel = label || `${sourceName ? sourceName + ': ' : ''}${config.defaultLabel}`;

  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded border font-medium transition-colors ${config.className} ${sizeClasses}`}
      title={config.tooltip}
    >
      <Icon size={12} className="shrink-0" />
      <span>{displayLabel}</span>
      {status === 'DATA_UNAVAILABLE' && (
        <span className="text-[10px] font-normal opacity-75">(Neutral)</span>
      )}
    </span>
  );
};
