import React from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Cell 
} from 'recharts';
import { DashboardSummary } from '../../types/student.types';
import { BarChart3 } from 'lucide-react';

interface ClassPerformanceOverviewProps {
  summary: DashboardSummary;
}

export const ClassPerformanceOverview: React.FC<ClassPerformanceOverviewProps> = ({ summary }) => {
  const chartData = [
    {
      category: 'Stable (GREEN)',
      count: summary.statusDistribution.GREEN,
      color: '#10b981', // emerald-500
      description: 'Satisfactory performance & attendance'
    },
    {
      category: 'Monitor (YELLOW)',
      count: summary.statusDistribution.YELLOW,
      color: '#f59e0b', // amber-500
      description: 'Attendance dip or isolated grade decline'
    },
    {
      category: 'Attention (RED)',
      count: summary.statusDistribution.RED,
      color: '#f43f5e', // rose-500
      description: 'Compound multi-factor risk detected'
    }
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center border border-slate-200">
            <BarChart3 size={16} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Cohort Support Distribution</h3>
            <p className="text-xs text-slate-500">
              Class Average: <span className="font-semibold text-slate-800">{summary.classAverageScore}%</span> • 
              Avg Attendance: <span className="font-semibold text-slate-800">{summary.averageAttendance}%</span>
            </p>
          </div>
        </div>
      </div>

      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="category" 
              tick={{ fontSize: 11, fill: '#64748b' }} 
              axisLine={{ stroke: '#e2e8f0' }}
              tickLine={false}
            />
            <YAxis 
              allowDecimals={false} 
              tick={{ fontSize: 11, fill: '#64748b' }} 
              axisLine={{ stroke: '#e2e8f0' }}
              tickLine={false}
            />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-slate-900 text-white text-xs rounded-lg p-2.5 shadow-lg border border-slate-700">
                      <p className="font-bold">{data.category}</p>
                      <p className="text-slate-300 mt-0.5">{data.count} Students</p>
                      <p className="text-[10px] text-slate-400 mt-1">{data.description}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
        <div>
          <span className="text-[11px] text-slate-400 block font-medium">GREEN (Stable)</span>
          <span className="font-bold text-emerald-700 text-sm">{summary.statusDistribution.GREEN} Students</span>
        </div>
        <div>
          <span className="text-[11px] text-slate-400 block font-medium">YELLOW (Monitor)</span>
          <span className="font-bold text-amber-700 text-sm">{summary.statusDistribution.YELLOW} Students</span>
        </div>
        <div>
          <span className="text-[11px] text-slate-400 block font-medium">RED (Attention)</span>
          <span className="font-bold text-rose-700 text-sm">{summary.statusDistribution.RED} Students</span>
        </div>
      </div>
    </div>
  );
};
