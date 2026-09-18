import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Alert } from '../../types/student.types';
import { useAlerts } from '../../context/AlertContext';
import { 
  Bell, 
  AlertTriangle, 
  AlertOctagon, 
  Info, 
  CheckCircle2, 
  CheckCheck, 
  ArrowUpRight,
  Filter
} from 'lucide-react';

interface AlertListProps {
  alerts: Alert[];
}

export const AlertList: React.FC<AlertListProps> = ({ alerts }) => {
  const { markAsRead, markAllAsRead } = useAlerts();
  const [filterType, setFilterType] = useState<'ALL' | 'UNREAD' | 'CRITICAL' | 'WARNING' | 'INFO'>('ALL');

  const filteredAlerts = alerts.filter(alert => {
    if (filterType === 'UNREAD') return !alert.isRead;
    if (filterType === 'CRITICAL') return alert.severity === 'CRITICAL';
    if (filterType === 'WARNING') return alert.severity === 'WARNING';
    if (filterType === 'INFO') return alert.severity === 'INFO';
    return true;
  });

  const getSeverityBadge = (severity: Alert['severity']) => {
    switch (severity) {
      case 'CRITICAL':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200">
            <AlertOctagon size={12} />
            <span>CRITICAL</span>
          </span>
        );
      case 'WARNING':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
            <AlertTriangle size={12} />
            <span>WARNING</span>
          </span>
        );
      case 'INFO':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-800 border border-sky-200">
            <Info size={12} />
            <span>INFO / RECOVERY</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
      
      {/* Header with Filters & Actions */}
      <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Faculty Alert Feed</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated notifications for student risk transitions, recovery milestones, and sensor anomalies
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Filter Pills */}
          <div className="flex items-center rounded-lg border border-slate-200 p-0.5 bg-slate-50 text-xs">
            {(['ALL', 'UNREAD', 'CRITICAL', 'WARNING', 'INFO'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilterType(f)}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                  filterType === f
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <button
            onClick={markAllAsRead}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            title="Mark all notifications as read"
          >
            <CheckCheck size={14} />
            <span className="hidden sm:inline">Mark All Read</span>
          </button>
        </div>
      </div>

      {/* Alert Items List */}
      <div className="divide-y divide-slate-100">
        {filteredAlerts.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            <CheckCircle2 size={32} className="mx-auto text-emerald-500 mb-2" />
            <p className="font-semibold text-slate-700">No alerts match the selected filter.</p>
            <p className="text-slate-400 mt-1">All student support notifications are up to date.</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-5 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-4 ${
                alert.isRead ? 'bg-white hover:bg-slate-50/70' : 'bg-slate-50/90 hover:bg-slate-100/80'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="mt-0.5 shrink-0">
                  {getSeverityBadge(alert.severity)}
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      to={`/students/${alert.studentId}`}
                      className="text-sm font-bold text-slate-900 hover:text-indigo-600 transition-colors"
                    >
                      {alert.studentName} ({alert.studentCode})
                    </Link>
                    <span className="text-xs text-slate-400 font-mono">
                      • {new Date(alert.timestamp).toLocaleString()}
                    </span>
                    {!alert.isRead && (
                      <span className="w-2 h-2 rounded-full bg-indigo-600 inline-block" title="Unread notification" />
                    )}
                  </div>

                  <h4 className="text-xs font-semibold text-slate-800 mt-1">
                    {alert.title}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                    {alert.message}
                  </p>
                </div>
              </div>

              {/* Actions: View Student & Acknowledge */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <Link
                  to={`/students/${alert.studentId}`}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors shadow-2xs"
                >
                  <span>View Profile</span>
                  <ArrowUpRight size={13} />
                </Link>

                {!alert.isRead && (
                  <button
                    onClick={() => markAsRead(alert.id)}
                    className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                    title="Mark as read"
                  >
                    <CheckCircle2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
