import React from 'react';
import { EngagementMetrics } from '../../types/student.types';
import { DataAvailabilityChip } from '../common/DataAvailabilityChip';
import { Activity, Laptop, Video, ShieldCheck } from 'lucide-react';

interface EngagementSectionProps {
  engagement: EngagementMetrics;
}

export const EngagementSection: React.FC<EngagementSectionProps> = ({ engagement }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 mb-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center border border-sky-200">
            <Activity size={18} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Classroom &amp; Digital Coursework Engagement</h3>
            <p className="text-xs text-slate-500">Measurable classroom participation and LMS activity indicators</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Index:</span>
          <span className="text-sm font-extrabold px-2.5 py-0.5 rounded-md bg-sky-100 text-sky-900">
            {engagement.overallScore}% ({engagement.participationLevel})
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        
        {/* LMS / Coursework Activity Card */}
        <div className="bg-slate-50/70 border border-slate-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Laptop size={16} className="text-slate-700" />
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Digital Coursework &amp; Portal
            </h4>
          </div>
          
          <div className="space-y-2.5 mt-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Weekly Portal Access:</span>
              <strong className="text-slate-900 font-bold">
                {engagement.lmsLoginsWeekly} days / week
              </strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">On-Time Submissions:</span>
              <strong className="text-slate-900 font-bold">
                {engagement.onTimeSubmissionsRate}%
              </strong>
            </div>
          </div>
        </div>

        {/* Vision Signal Card */}
        <div className="bg-slate-50/70 border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <Video size={16} className="text-slate-700" />
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Classroom Vision Sensor
              </h4>
            </div>
            <DataAvailabilityChip 
              status={engagement.visionStatus} 
              size="sm" 
            />
          </div>

          <div className="mt-3 text-xs">
            {engagement.visionStatus === 'AVAILABLE' ? (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Pose Alertness Index:</span>
                  <strong className="text-slate-900 font-bold">
                    {engagement.visionEngagementIndex}%
                  </strong>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  {engagement.visionNote}
                </p>
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-slate-700 font-semibold text-[11px]">
                  <ShieldCheck size={14} className="text-sky-700" />
                  <span>Camera Offline — Non-Punitive Mode</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  {engagement.visionNote}
                </p>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
