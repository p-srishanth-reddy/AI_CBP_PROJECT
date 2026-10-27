import React, { useState } from 'react';
import { BarChart3, TrendingUp, TrendingDown, HelpCircle, CheckCircle2 } from 'lucide-react';

export const ShapWaterfall = ({ prediction }) => {
  const [selectedDisease, setSelectedDisease] = useState('diabetes');

  if (!prediction || !prediction.predictions) return null;

  const diseaseData =
    selectedDisease === 'diabetes'
      ? prediction.predictions.diabetes
      : prediction.predictions.chronicKidneyDisease;

  if (!diseaseData) return null;

  const allDrivers = [
    ...(diseaseData.topRiskDrivers || []),
    ...(diseaseData.protectiveFactors || []),
  ].sort((a, b) => b.shapImpact - a.shapImpact);

  const maxAbsImpact = Math.max(
    ...allDrivers.map((d) => Math.abs(d.shapImpact)),
    0.1
  );

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6">
      {/* Header with Title and Disease Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-600" />
            <h3 className="text-base font-bold text-slate-900">
              Biomarker Influence & Factor Attribution
            </h3>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Individual biomarker contributions driving or mitigating patient risk relative to population baseline
          </p>
        </div>

        {/* Interactive Segmented Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg">
          <button
            type="button"
            onClick={() => setSelectedDisease('diabetes')}
            className={`px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-md transition-all cursor-pointer whitespace-nowrap ${
              selectedDisease === 'diabetes'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Metabolic Factors (T2D)
          </button>
          <button
            type="button"
            onClick={() => setSelectedDisease('ckd')}
            className={`px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-md transition-all cursor-pointer whitespace-nowrap ${
              selectedDisease === 'ckd'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Renal Factors (CKD)
          </button>
        </div>
      </div>

      {/* Clinical Factor Attribution & Baseline Banner */}
      <div className="my-4 p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm">
        <div className="flex items-center gap-2 text-slate-700">
          <HelpCircle className="w-4 h-4 text-slate-400 shrink-0" />
          <span>
            Assessed Risk Score:{' '}
            <strong className="font-mono text-slate-900 font-bold">
              {Math.round((diseaseData.riskProbability || 0) * 100)}%
            </strong>{' '}
            (Population Reference Baseline: {Math.round((diseaseData.baseValue || 0.35) * 100)}%)
          </span>
        </div>
        <div className="text-xs text-slate-500 font-semibold">
          Attribution: Baseline + Net Biomarker Effects
        </div>
      </div>

      {/* Feature Attribution Horizontal Bars */}
      <div className="space-y-3.5 mt-4">
        {allDrivers.map((driver) => {
          const isPositive = driver.shapImpact > 0;
          const barWidthPercent = (Math.abs(driver.shapImpact) / maxAbsImpact) * 100;

          return (
            <div
              key={driver.feature}
              className="p-3 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors bg-white shadow-2xs"
            >
              <div className="flex items-center justify-between text-xs sm:text-sm mb-2">
                <div className="flex items-center gap-2">
                  {isPositive ? (
                    <TrendingUp className="w-4 h-4 text-rose-500 shrink-0" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-emerald-500 shrink-0" />
                  )}
                  <span className="font-semibold text-slate-900">
                    {driver.clinicalName}
                  </span>
                  <span className="text-slate-400 font-mono text-xs">
                    ({driver.value} {driver.unit})
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 hidden sm:inline">
                    Reference: {driver.normalRange}
                  </span>
                  <span
                    className={`font-mono font-bold text-sm ${
                      isPositive ? 'text-rose-600' : 'text-emerald-600'
                    }`}
                  >
                    {isPositive ? `+${driver.shapImpact.toFixed(3)}` : driver.shapImpact.toFixed(3)}
                  </span>
                </div>
              </div>

              {/* Visual Horizontal Impact Bar */}
              <div className="relative h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isPositive ? 'bg-rose-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(5, barWidthPercent))}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Clinical Interpretation Footer */}
      <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <CheckCircle2 className="w-5 h-5 text-cyan-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-900">Clinical Factor Summary: </span>
          {diseaseData.topRiskDrivers && diseaseData.topRiskDrivers.length > 0 ? (
            <span>
              Primary risk elevation is driven by{' '}
              <strong>{diseaseData.topRiskDrivers[0]?.clinicalName}</strong> (relative impact +
              {diseaseData.topRiskDrivers[0]?.shapImpact.toFixed(2)}) and{' '}
              <strong>{diseaseData.topRiskDrivers[1]?.clinicalName}</strong> (relative impact +
              {diseaseData.topRiskDrivers[1]?.shapImpact.toFixed(2)}). Clinical management should prioritize stabilization of these target markers.
            </span>
          ) : (
            <span>Patient biomarkers exert favorable protective or neutral influences relative to reference ranges.</span>
          )}
        </div>
      </div>
    </div>
  );
};
