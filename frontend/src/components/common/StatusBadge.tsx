import React from 'react';
import { StudentStatus } from '../../types/student.types';
import { CheckCircle2, AlertTriangle, AlertOctagon } from 'lucide-react';

interface StatusBadgeProps {
  status: StudentStatus;
  size?: 'sm' | 'md' | 'lg';
  showSubtext?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showSubtext = false,
}) => {
  const config = {
    GREEN: {
      label: 'GREEN — Stable',
      shortLabel: 'GREEN',
      subtext: 'Stable',
      bgColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dotColor: 'bg-emerald-500',
      icon: CheckCircle2,
    },
    YELLOW: {
      label: 'YELLOW — Needs Monitoring',
      shortLabel: 'YELLOW',
      subtext: 'Needs Monitoring',
      bgColor: 'bg-amber-50 text-amber-800 border-amber-300',
      dotColor: 'bg-amber-500',
      icon: AlertTriangle,
    },
    RED: {
      label: 'RED — Requires Attention',
      shortLabel: 'RED',
      subtext: 'Requires Attention',
      bgColor: 'bg-rose-50 text-rose-700 border-rose-300',
      dotColor: 'bg-rose-500',
      icon: AlertOctagon,
    },
  }[status];

  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1.5',
    md: 'text-xs font-medium px-2.5 py-1 gap-1.5',
    lg: 'text-sm font-semibold px-3 py-1.5 gap-2',
  }[size];

  const iconSizes = {
    sm: 13,
    md: 15,
    lg: 18,
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-md border font-medium transition-colors ${config.bgColor} ${sizeClasses}`}
      title={config.label}
    >
      <Icon size={iconSizes} className="shrink-0" />
      <span className="font-semibold">{config.shortLabel}</span>
      {showSubtext && (
        <span className="opacity-90 font-normal">({config.subtext})</span>
      )}
      {!showSubtext && (
        <span className="opacity-85 font-normal ml-0.5">— {config.subtext}</span>
      )}
    </span>
  );
};
