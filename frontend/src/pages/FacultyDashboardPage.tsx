import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardService } from '../services/dashboardService';
import { DashboardSummary } from '../types/student.types';
import { KpiCard } from '../components/dashboard/KpiCard';
import { UrgentAttentionTable } from '../components/dashboard/UrgentAttentionTable';
import { TopPerformersTable } from '../components/dashboard/TopPerformersTable';
import { SignificantRankChangesTable } from '../components/dashboard/SignificantRankChangesTable';
import { ClassPerformanceOverview } from '../components/dashboard/ClassPerformanceOverview';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  AlertOctagon, 
  Bell, 
  ArrowRight, 
  Video, 
  FileText,
  Sparkles
} from 'lucide-react';

export const FacultyDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const data = await dashboardService.getDashboardSummary();
        setSummary(data);
      } finally {
        setIsLoading(false);
      }
    };
    loadSummary();
  }, []);

  if (isLoading || !summary) {
    return <LoadingSpinner message="Aggregating Class Performance Signals..." />;
  }

  return (
    <div className="space-y-6">
      
      {/* Header Greeting Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">
              Welcome back, {user?.fullName || 'Faculty Instructor'}
            </h1>
            <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
              Term Active
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Section: <strong className="text-slate-700">{user?.assignedClasses[0] || 'CS-101: Data Structures'}</strong> • Showing multi-factor early intervention alerts
          </p>
        </div>

        {/* Quick Actions Strip */}
        <div className="flex items-center gap-2.5">
          <Link
            to="/students"
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
          >
            <Users size={14} />
            <span>Class Roster &amp; Ranks</span>
          </Link>
          <Link
            to="/vision"
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-2xs"
          >
            <Video size={14} />
            <span>Vision Monitor</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Cohort"
          value={summary.totalStudents}
          subtext="Active enrolled students in section"
          icon={Users}
          variant="default"
          badgeText={`Avg: ${summary.classAverageScore}%`}
        />
        <KpiCard
          title="GREEN — Stable"
          value={summary.statusDistribution.GREEN}
          subtext="Consistent performance & attendance"
          icon={CheckCircle2}
          variant="green"
          badgeText={`${((summary.statusDistribution.GREEN / summary.totalStudents) * 100).toFixed(0)}%`}
        />
        <KpiCard
          title="YELLOW — Monitoring"
          value={summary.statusDistribution.YELLOW}
          subtext="Early attendance dip or quiz fluctuation"
          icon={AlertTriangle}
          variant="yellow"
          badgeText={`${((summary.statusDistribution.YELLOW / summary.totalStudents) * 100).toFixed(0)}%`}
        />
        <KpiCard
          title="RED — Support Needed"
          value={summary.statusDistribution.RED}
          subtext="Multi-factor decline requiring attention"
          icon={AlertOctagon}
          variant="red"
          badgeText={`${((summary.statusDistribution.RED / summary.totalStudents) * 100).toFixed(0)}%`}
        />
      </div>

      {/* Primary Section: Students Requiring Immediate Attention */}
      <div>
        <UrgentAttentionTable students={summary.urgentStudents} />
      </div>

      {/* Secondary Grid: Top Performers & Significant Rank Shifts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopPerformersTable students={summary.topPerformers} />
        <SignificantRankChangesTable students={summary.significantRankChanges} />
      </div>

      {/* Class Overview Chart & Recent Alerts Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Cohort Distribution Chart */}
        <div className="lg:col-span-2">
          <ClassPerformanceOverview summary={summary} />
        </div>

        {/* Right 1 Col: Recent Alerts Mini Feed */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Bell size={16} className="text-slate-700" />
                <h3 className="text-sm font-bold text-slate-900">Recent Alerts</h3>
              </div>
              <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                {summary.activeAlertsCount} Unread
              </span>
            </div>

            <div className="space-y-2.5">
              {summary.recentAlerts.slice(0, 3).map((alert) => (
                <Link
                  key={alert.id}
                  to="/alerts"
                  className="block p-3 rounded-lg border border-slate-100 bg-slate-50/60 hover:bg-slate-100/80 transition-colors text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 truncate max-w-[150px]">
                      {alert.studentName}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(alert.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-slate-600 line-clamp-2 mt-1 text-[11px]">
                    {alert.message}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          <Link
            to="/alerts"
            className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-700 hover:text-slate-900"
          >
            <span>View All Notifications</span>
            <ArrowRight size={14} />
          </Link>
        </div>

      </div>

    </div>
  );
};
