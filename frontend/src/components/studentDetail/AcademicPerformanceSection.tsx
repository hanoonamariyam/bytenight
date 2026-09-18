import React from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { AcademicRecord } from '../../types/student.types';
import { BookOpen, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface AcademicPerformanceSectionProps {
  records: AcademicRecord[];
  overallScore: number;
}

export const AcademicPerformanceSection: React.FC<AcademicPerformanceSectionProps> = ({
  records,
  overallScore,
}) => {
  const chartData = records.map((r) => ({
    name: r.assessmentType,
    date: r.assessmentDate,
    studentScore: r.score,
    classAverage: r.classAverage,
  }));

  const isDeclining = records.length >= 2 && records[records.length - 1].score < records[0].score;
  const isImproving = records.length >= 2 && records[records.length - 1].score > records[0].score;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-200">
            <BookOpen size={18} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Academic Performance &amp; Assessment History</h3>
            <p className="text-xs text-slate-500">Continuous scoring progression compared against class cohort average</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 text-xs font-semibold text-slate-700">
            <span>Overall Score:</span>
            <strong className="text-slate-900 font-bold">{overallScore}%</strong>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-medium text-slate-600">
            {isImproving ? (
              <>
                <TrendingUp size={14} className="text-emerald-600" />
                <span>Improving</span>
              </>
            ) : isDeclining ? (
              <>
                <TrendingDown size={14} className="text-rose-600" />
                <span>Declining</span>
              </>
            ) : (
              <>
                <Minus size={14} className="text-slate-400" />
                <span>Stable</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Recharts Assessment Line Chart */}
      <div className="h-64 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 11, fill: '#64748b' }} 
              axisLine={{ stroke: '#e2e8f0' }} 
            />
            <YAxis 
              domain={[0, 100]} 
              tick={{ fontSize: 11, fill: '#64748b' }} 
              axisLine={{ stroke: '#e2e8f0' }} 
            />
            <Tooltip 
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-slate-900 text-white text-xs rounded-lg p-3 shadow-lg border border-slate-700">
                      <p className="font-bold text-slate-200">{label}</p>
                      <div className="mt-1 space-y-1">
                        <p className="text-indigo-400 font-semibold">
                          Student Score: {payload[0]?.value}%
                        </p>
                        <p className="text-slate-400">
                          Class Average: {payload[1]?.value}%
                        </p>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend 
              wrapperStyle={{ fontSize: 12, paddingTop: 10 }} 
              formatter={(value) => (value === 'studentScore' ? 'Student Score' : 'Class Cohort Average')}
            />
            <Line 
              type="monotone" 
              dataKey="studentScore" 
              stroke="#4f46e5" 
              strokeWidth={3} 
              dot={{ r: 5, fill: '#4f46e5' }} 
              activeDot={{ r: 7 }} 
            />
            <Line 
              type="monotone" 
              dataKey="classAverage" 
              stroke="#94a3b8" 
              strokeWidth={2} 
              strokeDasharray="4 4" 
              dot={false} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Assessment Table Breakdown */}
      <div className="mt-6 border-t border-slate-100 pt-4 overflow-x-auto">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
          Recorded Assessments Breakdown
        </h4>
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
            <tr>
              <th className="py-2.5 px-3">Subject</th>
              <th className="py-2.5 px-3">Assessment</th>
              <th className="py-2.5 px-3">Date</th>
              <th className="py-2.5 px-3 text-center">Score</th>
              <th className="py-2.5 px-3 text-center">Class Average</th>
              <th className="py-2.5 px-3 text-center">Grade</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {records.map((record) => (
              <tr key={record.id} className="hover:bg-slate-50/60">
                <td className="py-2 px-3 font-medium text-slate-800">{record.subject}</td>
                <td className="py-2 px-3 font-semibold text-slate-900">{record.assessmentType}</td>
                <td className="py-2 px-3 text-slate-500">{record.assessmentDate}</td>
                <td className="py-2 px-3 text-center font-bold text-slate-900">
                  {record.score}%
                </td>
                <td className="py-2 px-3 text-center text-slate-500">{record.classAverage}%</td>
                <td className="py-2 px-3 text-center">
                  <span className="px-2 py-0.5 font-bold rounded bg-slate-100 text-slate-800 text-[11px]">
                    {record.gradeLabel}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
