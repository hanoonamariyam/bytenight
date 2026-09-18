import React from 'react';
import { StatusTransition } from '../../types/student.types';
import { StatusBadge } from '../common/StatusBadge';
import { History, ArrowRight, Clock } from 'lucide-react';

interface StatusHistorySectionProps {
  transitions: StatusTransition[];
}

export const StatusHistorySection: React.FC<StatusHistorySectionProps> = ({ transitions }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 mb-6">
      
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center border border-slate-200">
          <History size={18} />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">Support Status History &amp; Transitions</h3>
          <p className="text-xs text-slate-500">Auditable record of status classifications and explanatory rationales over time</p>
        </div>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
        {transitions.map((t, idx) => (
          <div key={t.id || idx} className="relative group">
            
            {/* Timeline Dot */}
            <div className="absolute -left-[1.85rem] top-1.5 w-3 h-3 rounded-full border-2 border-white bg-slate-900 ring-2 ring-slate-200" />

            <div className="bg-slate-50/60 border border-slate-200 rounded-xl p-4 transition-colors hover:bg-slate-50">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  {t.previousStatus ? (
                    <>
                      <StatusBadge status={t.previousStatus} size="sm" showSubtext />
                      <ArrowRight size={14} className="text-slate-400" />
                      <StatusBadge status={t.currentStatus} size="sm" showSubtext />
                    </>
                  ) : (
                    <>
                      <span className="text-xs text-slate-400 font-medium">Initial Evaluation:</span>
                      <StatusBadge status={t.currentStatus} size="sm" showSubtext />
                    </>
                  )}
                </div>

                <div className="flex items-center gap-1 text-xs text-slate-400 font-mono">
                  <Clock size={12} />
                  <span>{new Date(t.changedAt).toLocaleString()}</span>
                </div>
              </div>

              <p className="mt-2.5 text-xs text-slate-700 leading-relaxed font-medium">
                {t.reasonSummary}
              </p>

            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
