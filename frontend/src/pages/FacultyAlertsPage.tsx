import React from 'react';
import { useAlerts } from '../context/AlertContext';
import { AlertList } from '../components/alerts/AlertList';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Bell, ShieldCheck } from 'lucide-react';

export const FacultyAlertsPage: React.FC = () => {
  const { alerts, unreadCount, isLoading } = useAlerts();

  if (isLoading) {
    return <LoadingSpinner message="Retrieving Faculty Notification Stream..." />;
  }

  return (
    <div className="space-y-6">
      
      {/* Alerts Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">
              Faculty Alert &amp; Support Notifications
            </h1>
            {unreadCount > 0 && (
              <span className="text-xs font-bold bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded-full border border-rose-200">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time status transitions, recovery milestones, and sensory data anomaly alerts
          </p>
        </div>
      </div>

      {/* Alert Feed Component */}
      <AlertList alerts={alerts} />

    </div>
  );
};
