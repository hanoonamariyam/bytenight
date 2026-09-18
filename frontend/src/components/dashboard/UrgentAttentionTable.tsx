import React from 'react';
import { Link } from 'react-router-dom';
import { Student } from '../../types/student.types';
import { StatusBadge } from '../common/StatusBadge';
import { RankChangeIndicator } from '../common/RankChangeIndicator';
import { DataAvailabilityChip } from '../common/DataAvailabilityChip';
import { ArrowUpRight, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface UrgentAttentionTableProps {
  students: Student[];
}

export const UrgentAttentionTable: React.FC<UrgentAttentionTableProps> = ({ students }) => {
  const getTrendIcon = (trend: Student['trend']) => {
    switch (trend) {
      case 'IMPROVING':
        return <span title="Improving trend"><TrendingUp size={14} className="text-emerald-600 inline" /></span>;
      case 'DECLINING':
        return <span title="Declining trend"><TrendingDown size={14} className="text-rose-600 inline" /></span>;
      case 'STABLE':
        return <span title="Stable trend"><Minus size={14} className="text-slate-400 inline" /></span>;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Students Requiring Support &amp; Attention
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Ranked by compound risk score combining assessment trends, attendance, and activity
          </p>
        </div>
        <Link
          to="/students?status=RED"
          className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1 hover:underline"
        >
          <span>View All Attention Needed</span>
          <ArrowUpRight size={14} />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/80 text-slate-600 font-semibold border-b border-slate-200">
            <tr>
              <th className="py-3 px-4 w-12 text-center">Rank</th>
              <th className="py-3 px-4">Student</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-center">Academic</th>
              <th className="py-3 px-4 text-center">Attendance</th>
              <th className="py-3 px-4 text-center">Engagement</th>
              <th className="py-3 px-4 text-center">Trend</th>
              <th className="py-3 px-4 text-center">Data Health</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.slice(0, 6).map((student) => {
              const isCameraOffline = student.dataAvailability.vision === 'DATA_UNAVAILABLE';

              return (
                <tr
                  key={student.id}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  {/* Current Rank & Change */}
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <div className="flex flex-col items-center">
                      <span className="font-bold text-slate-800 text-sm">
                        #{student.currentRank}
                      </span>
                      <RankChangeIndicator rankChange={student.rankChange} size="sm" />
                    </div>
                  </td>

                  {/* Student Details */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-[11px] shrink-0 border border-slate-200">
                        {student.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <Link
                          to={`/students/${student.id}`}
                          className="font-semibold text-slate-900 hover:text-indigo-600 transition-colors"
                        >
                          {student.fullName}
                        </Link>
                        <div className="text-[11px] font-mono text-slate-400">
                          {student.studentCode} • {student.className}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Dual Encoded Status Badge */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <StatusBadge status={student.currentStatus} size="sm" />
                  </td>

                  {/* Academic Score */}
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <span className={`font-semibold ${student.academicScore < 60 ? 'text-rose-600 font-bold' : student.academicScore < 75 ? 'text-amber-700' : 'text-slate-800'}`}>
                      {student.academicScore}%
                    </span>
                  </td>

                  {/* Attendance */}
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <span className={`font-semibold ${student.attendancePercentage < 75 ? 'text-rose-600 font-bold' : student.attendancePercentage < 85 ? 'text-amber-700' : 'text-slate-800'}`}>
                      {student.attendancePercentage}%
                    </span>
                  </td>

                  {/* Engagement */}
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <span className="font-medium text-slate-700">
                      {student.engagementScore}%
                    </span>
                  </td>

                  {/* Trend */}
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1">
                      {getTrendIcon(student.trend)}
                      <span className="text-[11px] font-medium text-slate-600 capitalize">
                        {student.trend.toLowerCase()}
                      </span>
                    </div>
                  </td>

                  {/* Data Health / Availability */}
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    {isCameraOffline ? (
                      <DataAvailabilityChip status="DATA_UNAVAILABLE" label="Cam Offline" size="sm" />
                    ) : (
                      <DataAvailabilityChip status="AVAILABLE" label="All Signals" size="sm" />
                    )}
                  </td>

                  {/* Quick Profile View Button */}
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <Link
                      to={`/students/${student.id}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded border border-slate-200 transition-colors"
                    >
                      <span>Explain</span>
                      <ArrowUpRight size={12} />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
