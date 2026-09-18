import React from 'react';
import { Link } from 'react-router-dom';
import { Student } from '../../types/student.types';
import { StatusBadge } from '../common/StatusBadge';
import { RankChangeIndicator } from '../common/RankChangeIndicator';
import { ArrowUpDown } from 'lucide-react';

interface SignificantRankChangesTableProps {
  students: Student[];
}

export const SignificantRankChangesTable: React.FC<SignificantRankChangesTableProps> = ({
  students,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-200">
            <ArrowUpDown size={16} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Significant Rank Shifts</h3>
            <p className="text-xs text-slate-500">Students with notable rank momentum (both recovery &amp; drop)</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
            <tr>
              <th className="py-2.5 px-3">Student</th>
              <th className="py-2.5 px-3 text-center">Prev Rank</th>
              <th className="py-2.5 px-3 text-center">Current Rank</th>
              <th className="py-2.5 px-3 text-center">Rank Change</th>
              <th className="py-2.5 px-3">Current Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-slate-50/60 transition-colors">
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
                <td className="py-2.5 px-3 text-center text-slate-500 font-medium">
                  #{student.previousRank}
                </td>
                <td className="py-2.5 px-3 text-center font-bold text-slate-900">
                  #{student.currentRank}
                </td>
                <td className="py-2.5 px-3 text-center">
                  <RankChangeIndicator rankChange={student.rankChange} size="sm" showText />
                </td>
                <td className="py-2.5 px-3">
                  <StatusBadge status={student.currentStatus} size="sm" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
