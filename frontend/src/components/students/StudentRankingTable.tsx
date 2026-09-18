import React from 'react';
import { Link } from 'react-router-dom';
import { Student } from '../../types/student.types';
import { StatusBadge } from '../common/StatusBadge';
import { RankChangeIndicator } from '../common/RankChangeIndicator';
import { DataAvailabilityChip } from '../common/DataAvailabilityChip';
import { ChevronRight } from 'lucide-react';

interface StudentRankingTableProps {
  students: Student[];
}

export const StudentRankingTable: React.FC<StudentRankingTableProps> = ({ students }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-3.5 px-4 w-16 text-center">Rank</th>
              <th className="py-3.5 px-4">Student</th>
              <th className="py-3.5 px-4">ID</th>
              <th className="py-3.5 px-4">Class</th>
              <th className="py-3.5 px-4 text-center">Performance</th>
              <th className="py-3.5 px-4 text-center">Attendance</th>
              <th className="py-3.5 px-4 text-center">Engagement</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-center">Prev Rank</th>
              <th className="py-3.5 px-4 text-center">Change</th>
              <th className="py-3.5 px-4 text-right">Profile</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.map((student) => {
              const isVisionOffline = student.dataAvailability.vision === 'DATA_UNAVAILABLE';

              return (
                <tr
                  key={student.id}
                  className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                >
                  {/* Current Rank Badge */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <span
                      className={`inline-flex items-center justify-center w-7 h-7 rounded-full font-bold text-xs ${
                        student.currentRank === 1
                          ? 'bg-amber-100 text-amber-900 border border-amber-300 font-black'
                          : student.currentRank === 2
                          ? 'bg-slate-200 text-slate-800 border border-slate-300 font-extrabold'
                          : student.currentRank === 3
                          ? 'bg-amber-50 text-amber-800 border border-amber-200 font-bold'
                          : 'bg-slate-100 text-slate-700 font-medium'
                      }`}
                    >
                      {student.currentRank}
                    </span>
                  </td>

                  {/* Student Name */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <Link
                      to={`/students/${student.id}`}
                      className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors block"
                    >
                      {student.fullName}
                    </Link>
                    {isVisionOffline && (
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        <DataAvailabilityChip status="DATA_UNAVAILABLE" label="Cam Offline" size="sm" />
                      </span>
                    )}
                  </td>

                  {/* Student ID */}
                  <td className="py-3.5 px-4 whitespace-nowrap font-mono text-xs text-slate-500">
                    {student.studentCode}
                  </td>

                  {/* Class */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-xs text-slate-600">
                    {student.className}
                  </td>

                  {/* Academic Performance */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <span
                      className={`font-semibold ${
                        student.academicScore < 60
                          ? 'text-rose-600 font-bold'
                          : student.academicScore < 75
                          ? 'text-amber-700'
                          : 'text-slate-900'
                      }`}
                    >
                      {student.academicScore}%
                    </span>
                  </td>

                  {/* Attendance */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <span
                      className={`font-medium ${
                        student.attendancePercentage < 75
                          ? 'text-rose-600 font-bold'
                          : student.attendancePercentage < 85
                          ? 'text-amber-700'
                          : 'text-slate-700'
                      }`}
                    >
                      {student.attendancePercentage}%
                    </span>
                  </td>

                  {/* Engagement */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <span className="text-slate-700 font-medium">
                      {student.engagementScore}%
                    </span>
                  </td>

                  {/* Dual Encoded Status Badge */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <StatusBadge status={student.currentStatus} size="sm" />
                  </td>

                  {/* Previous Rank */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap text-slate-500 font-medium text-xs">
                    #{student.previousRank}
                  </td>

                  {/* Rank Change Indicator */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <RankChangeIndicator rankChange={student.rankChange} size="sm" />
                  </td>

                  {/* Action Link */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <Link
                      to={`/students/${student.id}`}
                      className="text-slate-400 group-hover:text-slate-700 inline-flex items-center p-1 rounded hover:bg-slate-200 transition-colors"
                      title="View Detailed Student Profile"
                    >
                      <ChevronRight size={16} />
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
