import React from 'react';
import { MultiRiskPredictionResponse } from '../types/clinical';
import { ShieldAlert, Zap } from 'lucide-react';

interface DualRiskGaugesProps {
  prediction: MultiRiskPredictionResponse;
}

export const DualRiskGauges: React.FC<DualRiskGaugesProps> = ({ prediction }) => {
  const { diabetes, chronicKidneyDisease } = prediction.predictions;

  const renderGauge = (
    title: string,
    probability: number,
    category: string,
    baseValue: number,
    icon: React.ReactNode,
    subtitle: string
  ) => {
    const percentage = Math.round(probability * 100);

    const radius = 70;
    const strokeWidth = 13;
    const circumference = Math.PI * radius;
    const strokeDashoffset = circumference * (1 - probability);

    let colorClass = '#10B981';
    let badgeBg = 'text-emerald-800 bg-emerald-50 border-emerald-300';
    if (percentage >= 85) {
      colorClass = '#E11D48';
      badgeBg = 'text-rose-800 bg-rose-50 border-rose-300';
    } else if (percentage >= 65) {
      colorClass = '#F97316';
      badgeBg = 'text-orange-800 bg-orange-50 border-orange-300';
    } else if (percentage >= 30) {
      colorClass = '#F59E0B';
      badgeBg = 'text-amber-800 bg-amber-50 border-amber-300';
    }

    return (
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col items-center">
        <div className="w-full flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-slate-100 text-slate-800">
              {icon}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{title}</h3>
              <p className="text-xs text-slate-500 font-medium">{subtitle}</p>
            </div>
          </div>
          <span
            className={`px-2.5 py-1 text-xs sm:text-sm font-bold rounded-lg border ${badgeBg}`}
          >
            {category} Risk
          </span>
        </div>

        {/* SVG Dial Meter */}
        <div className="relative w-52 h-32 my-2 flex items-center justify-center">
          <svg className="w-52 h-32" viewBox="0 0 200 110">
            <path
              d="M 30 90 A 70 70 0 0 1 170 90"
              fill="none"
              stroke="#E2E8F0"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <path
              d="M 30 90 A 70 70 0 0 1 170 90"
              fill="none"
              stroke={colorClass}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}
            />
          </svg>

          {/* Central Metric Value with increased typography */}
          <div className="absolute bottom-2 flex flex-col items-center">
            <span className="text-4xl font-mono font-bold text-slate-900 tracking-tight">
              {percentage}
              <span className="text-xl text-slate-500 font-normal">%</span>
            </span>
            <span className="text-xs font-mono text-slate-500 uppercase tracking-wider font-semibold">
              Calculated Probability
            </span>
          </div>
        </div>

        {/* Population Baseline Offset Reference */}
        <div className="w-full mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm text-slate-600">
          <span>Population Base Rate $E[f(x)]$</span>
          <span className="font-mono text-slate-900 font-bold">
            {Math.round(baseValue * 100)}%
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Dual Gauges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderGauge(
          'Type 2 Diabetes Risk',
          diabetes.riskProbability,
          diabetes.riskCategory,
          diabetes.baseValue,
          <Zap className="w-5 h-5 text-amber-500" />,
          'XGBoost Clinical Pipeline'
        )}

        {renderGauge(
          'Chronic Kidney Disease',
          chronicKidneyDisease.riskProbability,
          chronicKidneyDisease.riskCategory,
          chronicKidneyDisease.baseValue,
          <ShieldAlert className="w-5 h-5 text-cyan-600" />,
          'Random Forest Renal Ensemble'
        )}
      </div>

      {/* Calculated Clinical Context Banner with larger font */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm">
        <div>
          <span className="text-slate-500 font-medium block text-xs">2021 CKD-EPI eGFR</span>
          <span className="font-mono font-bold text-slate-900 text-base">
            {prediction.eGfr}{' '}
            <span className="text-xs text-slate-500 font-normal">mL/min/1.73m²</span>
          </span>
          <div className="text-xs text-slate-700 font-medium mt-0.5">
            Stage {prediction.kdigoStage}
          </div>
        </div>

        <div>
          <span className="text-slate-500 font-medium block text-xs">ADA Glycemic Status</span>
          <span className="font-semibold text-slate-900 text-xs sm:text-sm line-clamp-1 mt-0.5">
            {prediction.glycemicStatus}
          </span>
          <div className="text-xs text-slate-500 mt-0.5">
            Surrogate threshold audit
          </div>
        </div>

        <div>
          <span className="text-slate-500 font-medium block text-xs">Inference Engine Audit</span>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="font-mono text-xs font-bold text-slate-800">
              TreeSHAP: {prediction.executionTimeMs} ms
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-emerald-700 font-bold text-xs">Validated</span>
          </div>
          <div className="text-xs text-slate-400 font-mono mt-0.5 truncate">
            ID: {prediction.assessmentId.substring(0, 16)}...
          </div>
        </div>
      </div>
    </div>
  );
};
