import React from 'react';
import { Link } from 'react-router-dom';
import { Student } from '../../types/student.types';
import { StatusBadge } from '../common/StatusBadge';
import { RankChangeIndicator } from '../common/RankChangeIndicator';
import { Award } from 'lucide-react';

interface TopPerformersTableProps {
  students: Student[];
}

export const TopPerformersTable: React.FC<TopPerformersTableProps> = ({ students }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
            <Award size={16} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Top Performing Students</h3>
            <p className="text-xs text-slate-500">Highest overall academic &amp; engagement composite rank</p>
          </div>
        </div>
        <Link
          to="/students"
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 hover:underline"
        >
          View Full Roster
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
            <tr>
              <th className="py-2.5 px-3 w-12 text-center">Rank</th>
              <th className="py-2.5 px-3">Student</th>
              <th className="py-2.5 px-3 text-center">Score</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-center">Rank Change</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.slice(0, 5).map((student) => (
              <tr key={student.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-2.5 px-3 text-center font-bold text-slate-900">
                  <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs ${
                    student.currentRank === 1 ? 'bg-amber-100 text-amber-900 font-extrabold border border-amber-300' :
                    student.currentRank === 2 ? 'bg-slate-100 text-slate-800 font-bold border border-slate-300' :
                    student.currentRank === 3 ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                    'text-slate-700'
                  }`}>
                    {student.currentRank}
                  </span>
                </td>
                <td className="py-2.5 px-3">
                  <Link
                    to={`/students/${student.id}`}
                    className="font-semibold text-slate-900 hover:text-indigo-600"
                  >
                    {student.fullName}
                  </Link>
                  <span className="text-[11px] text-slate-400 font-mono block">
                    {student.studentCode}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-center font-semibold text-slate-800">
                  {student.academicScore}%
                </td>
                <td className="py-2.5 px-3">
                  <StatusBadge status={student.currentStatus} size="sm" />
                </td>
                <td className="py-2.5 px-3 text-center">
                  <RankChangeIndicator rankChange={student.rankChange} size="sm" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
