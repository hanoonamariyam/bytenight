import React from 'react';
import { VisionStudio } from '../components/vision/VisionStudio';
import { Video, Shield } from 'lucide-react';

export const ClassroomVisionPage: React.FC = () => {
  return (
    <div className="space-y-6">
      
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">
              Live Classroom Vision Diagnostics
            </h1>
            <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full border border-slate-200">
              Optical Telemetry Preview
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time classroom presence verification, head pose attention modeling, and sensor health checks
          </p>
        </div>
      </div>

      {/* Main Studio View */}
      <VisionStudio />

    </div>
  );
};
