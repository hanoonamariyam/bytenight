import React from 'react';
import { Student } from '../../types/student.types';
import { DataAvailabilityChip } from '../common/DataAvailabilityChip';
import { Shield, CheckCircle2, AlertCircle, Info } from 'lucide-react';

interface DataAvailabilitySectionProps {
  student: Student;
}

export const DataAvailabilitySection: React.FC<DataAvailabilitySectionProps> = ({ student }) => {
  const sources = [
    {
      name: 'Academic Assessments',
      status: student.dataAvailability.academic,
      description: 'Standardized grading logs from class midterm, assignments, and quizzes.',
    },
    {
      name: 'Session Attendance',
      status: student.dataAvailability.attendance,
      description: 'Physical lecture and lab attendance logs verified by instructor.',
    },
    {
      name: 'LMS Digital Coursework',
      status: student.dataAvailability.engagement,
      description: 'Weekly student portal access frequency and homework submission timestamps.',
    },
    {
      name: 'Classroom Vision Sensor',
      status: student.dataAvailability.vision,
      description: student.dataAvailability.vision === 'DATA_UNAVAILABLE'
        ? 'Classroom camera stream unavailable or insufficient detection confidence. Non-punitive neutrality applied.'
        : 'Active learning head-pose stability heuristic processed in memory.',
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 mb-6">
      
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center border border-slate-200">
          <Shield size={18} />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">Input Data Availability &amp; Quality Audit</h3>
          <p className="text-xs text-slate-500">Explicit transparency regarding data sources and non-punitive missing-data handling</p>
        </div>
      </div>

      <div className="bg-sky-50/60 border border-sky-200 rounded-lg p-3 my-3 text-xs text-sky-900 flex items-start gap-2">
        <Info size={16} className="text-sky-700 shrink-0 mt-0.5" />
        <p>
          <strong>Non-Punitive Academic Standard:</strong> In accordance with our support architecture guidelines, missing, unrecorded, or dropped sensor inputs are explicitly marked as <strong>DATA_UNAVAILABLE</strong>. They are never interpreted as negative student behavior or risk escalation.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
        {sources.map((src, i) => (
          <div key={i} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-xs font-bold text-slate-800">{src.name}</span>
              <DataAvailabilityChip status={src.status} size="sm" />
            </div>
            <p className="text-[11px] text-slate-500 leading-normal">
              {src.description}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
};
