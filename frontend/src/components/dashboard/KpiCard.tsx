import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtext: string;
  icon: LucideIcon;
  variant?: 'default' | 'green' | 'yellow' | 'red';
  badgeText?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subtext,
  icon: Icon,
  variant = 'default',
  badgeText,
}) => {
  const variantStyles = {
    default: {
      border: 'border-slate-200',
      iconBg: 'bg-slate-100 text-slate-700',
      valueColor: 'text-slate-900',
    },
    green: {
      border: 'border-emerald-200 bg-emerald-50/20',
      iconBg: 'bg-emerald-100 text-emerald-700',
      valueColor: 'text-emerald-700',
    },
    yellow: {
      border: 'border-amber-200 bg-amber-50/20',
      iconBg: 'bg-amber-100 text-amber-800',
      valueColor: 'text-amber-800',
    },
    red: {
      border: 'border-rose-200 bg-rose-50/20',
      iconBg: 'bg-rose-100 text-rose-700',
      valueColor: 'text-rose-700',
    },
  }[variant];

  return (
    <div className={`bg-white rounded-xl border p-5 shadow-2xs transition-all hover:shadow-xs ${variantStyles.border}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${variantStyles.iconBg}`}>
          <Icon size={16} />
        </div>
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className={`text-2xl font-bold tracking-tight ${variantStyles.valueColor}`}>
          {value}
        </span>
        {badgeText && (
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
            {badgeText}
          </span>
        )}
      </div>

      <p className="mt-1 text-xs text-slate-500 leading-normal">
        {subtext}
      </p>
    </div>
  );
};
