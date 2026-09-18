import React from 'react';
import { RankHistoryEntry, Student } from '../../types/student.types';
import { RankChangeIndicator } from '../common/RankChangeIndicator';
import { Trophy, TrendingUp, Award, Calendar } from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';

interface PerformanceRankHistorySectionProps {
  student: Student;
  rankHistory: RankHistoryEntry[];
}

export const PerformanceRankHistorySection: React.FC<PerformanceRankHistorySectionProps> = ({
  student,
  rankHistory,
}) => {
  // Invert rank axis for intuitive chart (Rank 1 at the top!)
  const chartData = rankHistory.map((item) => ({
    term: item.term,
    rank: item.rank,
    score: item.score,
    invertedRank: 15 - item.rank, // for visualization so rank 1 is highest on Y axis
  }));

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 mb-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
            <Trophy size={18} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Performance &amp; Rank Progression History</h3>
            <p className="text-xs text-slate-500">Term-by-term cohort ranking momentum and score tracking</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Momentum:</span>
          <RankChangeIndicator rankChange={student.rankChange} size="md" showText />
        </div>
      </div>

      {/* KPI Highlight Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
          <span className="text-[11px] font-semibold uppercase text-slate-500 block">Current Rank</span>
          <span className="text-xl font-extrabold text-slate-900 mt-0.5 block">#{student.currentRank}</span>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
          <span className="text-[11px] font-semibold uppercase text-slate-500 block">Previous Rank</span>
          <span className="text-xl font-bold text-slate-600 mt-0.5 block">#{student.previousRank}</span>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
          <span className="text-[11px] font-semibold uppercase text-slate-500 block">Best Rank</span>
          <span className="text-xl font-bold text-emerald-700 mt-0.5 block">#{student.bestRank}</span>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
          <span className="text-[11px] font-semibold uppercase text-slate-500 block">Rank Delta</span>
          <div className="mt-1 flex items-center justify-center">
            <RankChangeIndicator rankChange={student.rankChange} size="sm" />
          </div>
        </div>
      </div>

      {/* Historical Table Matching Prompt Specification */}
      <div className="mt-4 border-t border-slate-100 pt-4 overflow-x-auto">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
          Term Assessment &amp; Rank Log
        </h4>
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
            <tr>
              <th className="py-2.5 px-3">Assessment / Term</th>
              <th className="py-2.5 px-3">Date</th>
              <th className="py-2.5 px-3 text-center">Cohort Rank</th>
              <th className="py-2.5 px-3 text-center">Academic Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rankHistory.map((entry, idx) => (
              <tr key={idx} className="hover:bg-slate-50/60">
                <td className="py-2.5 px-3 font-semibold text-slate-900">{entry.term}</td>
                <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">{entry.date}</td>
                <td className="py-2.5 px-3 text-center font-extrabold text-slate-800">
                  <span className="inline-flex items-center justify-center px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-xs">
                    #{entry.rank}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-center font-bold text-indigo-700">
                  {entry.score}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
