import React from 'react';
import { AttendanceRecord } from '../../types/student.types';
import { CalendarCheck, AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface AttendanceSectionProps {
  records: AttendanceRecord[];
  attendancePercentage: number;
}

export const AttendanceSection: React.FC<AttendanceSectionProps> = ({
  records,
  attendancePercentage,
}) => {
  const presentCount = records.filter(r => r.status === 'PRESENT').length;
  const absentCount = records.filter(r => r.status === 'ABSENT').length;
  const lateCount = records.filter(r => r.status === 'LATE').length;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 mb-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
            <CalendarCheck size={18} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Attendance Monitoring &amp; Consistency</h3>
            <p className="text-xs text-slate-500">Class participation presence and recent absence tracking</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-600">Rate:</span>
          <span className={`text-sm font-extrabold px-2.5 py-0.5 rounded-md ${
            attendancePercentage < 75 ? 'bg-rose-100 text-rose-800' :
            attendancePercentage < 85 ? 'bg-amber-100 text-amber-800' :
            'bg-emerald-100 text-emerald-800'
          }`}>
            {attendancePercentage}%
          </span>
        </div>
      </div>

      {/* Visual Indicator Bar */}
      <div className="mt-2">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1 font-medium">
          <span>Minimum Guidance Threshold: 75%</span>
          <span>Target: 90%+</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden flex border border-slate-200">
          <div
            className={`h-full transition-all rounded-full ${
              attendancePercentage < 75 ? 'bg-rose-500' :
              attendancePercentage < 85 ? 'bg-amber-500' :
              'bg-emerald-500'
            }`}
            style={{ width: `${Math.min(100, attendancePercentage)}%` }}
          />
        </div>
      </div>

      {/* Quick Summary Counts */}
      <div className="grid grid-cols-3 gap-3 mt-4 pt-3 border-t border-slate-100 text-center text-xs">
        <div className="bg-emerald-50/50 border border-emerald-100 rounded-lg p-2">
          <span className="text-slate-500 block text-[11px]">Sessions Present</span>
          <span className="text-sm font-bold text-emerald-700">{presentCount}</span>
        </div>
        <div className="bg-rose-50/50 border border-rose-100 rounded-lg p-2">
          <span className="text-slate-500 block text-[11px]">Absences Logged</span>
          <span className="text-sm font-bold text-rose-700">{absentCount}</span>
        </div>
        <div className="bg-amber-50/50 border border-amber-100 rounded-lg p-2">
          <span className="text-slate-500 block text-[11px]">Late Arrivals</span>
          <span className="text-sm font-bold text-amber-700">{lateCount}</span>
        </div>
      </div>

      {/* Recent Log Table */}
      <div className="mt-5 border-t border-slate-100 pt-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Recent Classroom Sessions
        </h4>
        <div className="space-y-2">
          {records.slice(0, 5).map((rec) => (
            <div
              key={rec.id}
              className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 bg-slate-50/40 text-xs"
            >
              <div className="flex items-center gap-2">
                {rec.status === 'PRESENT' && (
                  <CheckCircle size={14} className="text-emerald-600 shrink-0" />
                )}
                {rec.status === 'ABSENT' && (
                  <AlertCircle size={14} className="text-rose-600 shrink-0" />
                )}
                {rec.status === 'LATE' && (
                  <Clock size={14} className="text-amber-600 shrink-0" />
                )}
                <span className="font-semibold text-slate-800">{rec.sessionName}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-slate-400 font-mono text-[11px]">{rec.date}</span>
                <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                  rec.status === 'PRESENT' ? 'bg-emerald-100 text-emerald-800' :
                  rec.status === 'ABSENT' ? 'bg-rose-100 text-rose-800' :
                  'bg-amber-100 text-amber-800'
                }`}>
                  {rec.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
