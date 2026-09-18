import React from 'react';
import { ContributingFactor, StudentStatus } from '../../types/student.types';
import { DataAvailabilityChip } from '../common/DataAvailabilityChip';
import { HelpCircle, AlertTriangle, ShieldCheck, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface ContributingFactorsSectionProps {
  factors: ContributingFactor[];
  currentStatus: StudentStatus;
  riskScore: number;
}

export const ContributingFactorsSection: React.FC<ContributingFactorsSectionProps> = ({
  factors,
  currentStatus,
  riskScore,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 mb-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center border border-amber-200">
            <HelpCircle size={18} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Explainable Model Indicators</h3>
            <p className="text-xs text-slate-500">Measurable contributing factors informing the early support evaluation</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Evaluated Risk:</span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded ${
            currentStatus === 'RED' ? 'bg-rose-100 text-rose-800' :
            currentStatus === 'YELLOW' ? 'bg-amber-100 text-amber-800' :
            'bg-emerald-100 text-emerald-800'
          }`}>
            {(riskScore * 100).toFixed(0)}% ({currentStatus})
          </span>
        </div>
      </div>

      {/* Mandatory PRD Disclaimer Banner */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 my-3 text-xs text-slate-600 flex items-start gap-2">
        <AlertTriangle size={15} className="text-slate-400 shrink-0 mt-0.5" />
        <p>
          <strong>Interpretability Note:</strong> The items below represent <strong>measurable model indicators</strong> and <strong>contributing factors</strong> identified by the multi-factor tabular prediction model. These are not deterministic proven causes, but contextual signals intended to assist faculty intervention.
        </p>
      </div>

      {/* Factors List / Attribution Cards */}
      <div className="space-y-3 mt-4">
        {factors.map((factor) => {
          const isNeutral = factor.direction === 'NEUTRAL' || factor.dataAvailability === 'DATA_UNAVAILABLE';
          const isRiskRiser = factor.direction === 'INCREASES_RISK';

          return (
            <div
              key={factor.id}
              className={`p-4 rounded-xl border transition-all ${
                isNeutral
                  ? 'bg-slate-50/70 border-slate-200'
                  : isRiskRiser
                  ? 'bg-rose-50/25 border-rose-200'
                  : 'bg-emerald-50/25 border-emerald-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {isNeutral ? (
                    <Minus size={16} className="text-slate-400 shrink-0" />
                  ) : isRiskRiser ? (
                    <ArrowUpRight size={16} className="text-rose-600 shrink-0" />
                  ) : (
                    <ArrowDownRight size={16} className="text-emerald-600 shrink-0" />
                  )}
                  <h4 className="text-sm font-bold text-slate-900">
                    {factor.factorName}
                  </h4>
                  {factor.featureValue && (
                    <span className="text-xs font-mono bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700">
                      {factor.featureValue}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <DataAvailabilityChip status={factor.dataAvailability} size="sm" />
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                    isNeutral
                      ? 'bg-slate-100 text-slate-600'
                      : isRiskRiser
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {isNeutral ? 'Neutral Weight (0.00)' : isRiskRiser ? `+${factor.shapValue.toFixed(2)} Risk Weight` : `${factor.shapValue.toFixed(2)} Protective Weight`}
                  </span>
                </div>
              </div>

              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                {factor.description}
              </p>
            </div>
          );
        })}
      </div>

    </div>
  );
};
