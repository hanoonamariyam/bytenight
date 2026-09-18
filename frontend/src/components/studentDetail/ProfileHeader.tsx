import React from 'react';
import { Link } from 'react-router-dom';
import { Student } from '../../types/student.types';
import { StatusBadge } from '../common/StatusBadge';
import { RankChangeIndicator } from '../common/RankChangeIndicator';
import { DataAvailabilityChip } from '../common/DataAvailabilityChip';
import { ArrowLeft, Mail, Calendar, ShieldCheck, Award } from 'lucide-react';

interface ProfileHeaderProps {
  student: Student;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ student }) => {
  const isVisionOffline = student.dataAvailability.vision === 'DATA_UNAVAILABLE';

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 mb-6">
      
      {/* Back to roster breadcrumb */}
      <div className="mb-4">
        <Link
          to="/students"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Students &amp; Ranks</span>
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        
        {/* Left: Avatar & Basic Information */}
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xl shrink-0 shadow-xs">
            {student.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl font-bold text-slate-900">
                {student.fullName}
              </h1>
              <StatusBadge status={student.currentStatus} size="md" />
              {isVisionOffline && (
                <DataAvailabilityChip 
                  status="DATA_UNAVAILABLE" 
                  label="Camera Offline (Neutral)" 
                  size="sm" 
                />
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-xs text-slate-500">
              <span className="font-mono font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                {student.studentCode}
              </span>
              <span>{student.className}</span>
              <span className="flex items-center gap-1">
                <Mail size={12} />
                <span>{student.email}</span>
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                <span>Evaluated: {new Date(student.lastEvaluated).toLocaleDateString()}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right: Quick KPI Badges & Ranking Stat */}
        <div className="flex flex-wrap items-center gap-3 border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100">
          
          {/* Current Rank Box */}
          <div className="bg-slate-50 rounded-lg border border-slate-200 px-4 py-2 text-center min-w-[100px]">
            <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <Award size={13} className="text-amber-600" />
              <span>Rank</span>
            </div>
            <div className="flex items-baseline justify-center gap-1.5 mt-0.5">
              <span className="text-xl font-extrabold text-slate-900">
                #{student.currentRank}
              </span>
              <RankChangeIndicator rankChange={student.rankChange} size="sm" />
            </div>
          </div>

          {/* Academic Score */}
          <div className="bg-slate-50 rounded-lg border border-slate-200 px-4 py-2 text-center min-w-[90px]">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Score
            </span>
            <span className="text-xl font-bold text-slate-900 mt-0.5 block">
              {student.academicScore}%
            </span>
          </div>

          {/* Attendance */}
          <div className="bg-slate-50 rounded-lg border border-slate-200 px-4 py-2 text-center min-w-[90px]">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Attendance
            </span>
            <span className="text-xl font-bold text-slate-900 mt-0.5 block">
              {student.attendancePercentage}%
            </span>
          </div>

          {/* Model Risk Index */}
          <div className="bg-slate-50 rounded-lg border border-slate-200 px-4 py-2 text-center min-w-[100px]">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Model Risk
            </span>
            <span className={`text-xl font-bold mt-0.5 block ${
              student.currentStatus === 'RED' ? 'text-rose-600' :
              student.currentStatus === 'YELLOW' ? 'text-amber-600' :
              'text-emerald-700'
            }`}>
              {(student.riskScore * 100).toFixed(0)}%
            </span>
          </div>

        </div>

      </div>

      {/* Non-punitive banner if camera offline */}
      {isVisionOffline && (
        <div className="mt-4 p-3 bg-sky-50/70 border border-sky-200 rounded-lg flex items-center gap-2.5 text-xs text-sky-900">
          <ShieldCheck size={16} className="text-sky-700 shrink-0" />
          <p>
            <strong>Fairness Guarantee:</strong> Classroom vision sensor is currently offline for this student's seating zone. In compliance with the support model guidelines, status is calculated using academic and attendance records only with zero negative penalty.
          </p>
        </div>
      )}

    </div>
  );
};
