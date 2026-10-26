import React, { useState } from 'react';
import { HistoricalVisit } from '../types/clinical';
import { History, Calendar } from 'lucide-react';

interface LongitudinalTrendsProps {
  history: HistoricalVisit[];
  mrn: string;
}

export const LongitudinalTrends: React.FC<LongitudinalTrendsProps> = ({ history, mrn }) => {
  const [selectedMetric, setSelectedMetric] = useState<'risk' | 'egfr' | 'glucose' | 'creatinine'>('risk');

  const width = 600;
  const height = 210;
  const paddingX = 65;
  const paddingY = 35;
  const innerW = width - paddingX * 2;
  const innerH = height - paddingY * 2;

  const points = history.map((h, i) => {
    const x = paddingX + (i / (history.length - 1)) * innerW;
    return { ...h, x };
  });

  let renderSeries: { label: string; stroke: string; dataPoints: { x: number; y: number; val: number }[] }[] = [];

  if (selectedMetric === 'risk') {
    const t2dPts = points.map((p) => ({
      x: p.x,
      y: height - paddingY - p.t2dRisk * innerH,
      val: Math.round(p.t2dRisk * 100),
    }));
    const ckdPts = points.map((p) => ({
      x: p.x,
      y: height - paddingY - p.ckdRisk * innerH,
      val: Math.round(p.ckdRisk * 100),
    }));
    renderSeries = [
      { label: 'T2D Risk (%)', stroke: '#F59E0B', dataPoints: t2dPts },
      { label: 'CKD Risk (%)', stroke: '#06B6D4', dataPoints: ckdPts },
    ];
  } else if (selectedMetric === 'egfr') {
    const maxVal = 120;
    const minVal = 10;
    const egfrPts = points.map((p) => ({
      x: p.x,
      y: height - paddingY - ((p.eGfr - minVal) / (maxVal - minVal)) * innerH,
      val: p.eGfr,
    }));
    renderSeries = [{ label: 'eGFR (mL/min/1.73m²)', stroke: '#10B981', dataPoints: egfrPts }];
  } else if (selectedMetric === 'glucose') {
    const maxVal = 250;
    const minVal = 70;
    const gPts = points.map((p) => ({
      x: p.x,
      y: height - paddingY - ((p.fastingGlucose - minVal) / (maxVal - minVal)) * innerH,
      val: p.fastingGlucose,
    }));
    renderSeries = [{ label: 'Fasting Glucose (mg/dL)', stroke: '#E11D48', dataPoints: gPts }];
  } else {
    const maxVal = 3.5;
    const minVal = 0.5;
    const crPts = points.map((p) => ({
      x: p.x,
      y: height - paddingY - ((p.serumCreatinine - minVal) / (maxVal - minVal)) * innerH,
      val: p.serumCreatinine,
    }));
    renderSeries = [{ label: 'Serum Creatinine (mg/dL)', stroke: '#6366F1', dataPoints: crPts }];
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-cyan-600" />
            <h3 className="text-base font-bold text-slate-900">
              Longitudinal Clinical Trajectory
            </h3>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Historical laboratory and risk progression for {mrn}
          </p>
        </div>

        {/* Metric Selector Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg">
          <button
            type="button"
            onClick={() => setSelectedMetric('risk')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-md transition-all cursor-pointer whitespace-nowrap ${
              selectedMetric === 'risk' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Disease Risks
          </button>
          <button
            type="button"
            onClick={() => setSelectedMetric('egfr')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-md transition-all cursor-pointer whitespace-nowrap ${
              selectedMetric === 'egfr' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            eGFR Rate
          </button>
          <button
            type="button"
            onClick={() => setSelectedMetric('creatinine')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-md transition-all cursor-pointer whitespace-nowrap ${
              selectedMetric === 'creatinine' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Creatinine
          </button>
          <button
            type="button"
            onClick={() => setSelectedMetric('glucose')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-md transition-all cursor-pointer whitespace-nowrap ${
              selectedMetric === 'glucose' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Glucose
          </button>
        </div>
      </div>

      {/* Trajectory Trend SVG Line Chart */}
      <div className="w-full overflow-x-auto">
        <div className="min-w-[500px]">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-52 bg-slate-50/80 rounded-xl border border-slate-100">
            {[0.25, 0.5, 0.75].map((ratio) => (
              <line
                key={ratio}
                x1={paddingX}
                y1={paddingY + ratio * innerH}
                x2={width - paddingX}
                y2={paddingY + ratio * innerH}
                stroke="#E2E8F0"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
            ))}

            {renderSeries.map((series) => {
              const pathD = series.dataPoints.reduce((acc, pt, i) => {
                return i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
              }, '');

              return (
                <g key={series.label}>
                  <path
                    d={pathD}
                    fill="none"
                    stroke={series.stroke}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {series.dataPoints.map((pt, i) => (
                    <g key={i}>
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="5"
                        fill="#FFFFFF"
                        stroke={series.stroke}
                        strokeWidth="2.5"
                      />
                      <text
                        x={pt.x}
                        y={pt.y - 10}
                        textAnchor="middle"
                        className="text-xs font-mono font-bold fill-slate-900"
                      >
                        {pt.val}
                      </text>
                    </g>
                  ))}
                </g>
              );
            })}

            {points.map((p, i) => (
              <text
                key={i}
                x={p.x}
                y={height - 10}
                textAnchor="middle"
                className="text-xs font-mono fill-slate-600 font-semibold"
              >
                {p.visitDate}
              </text>
            ))}
          </svg>
        </div>
      </div>

      {/* Legend & Historical Data Table */}
      <div className="mt-5 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-5 text-sm mb-4">
          {renderSeries.map((s) => (
            <div key={s.label} className="flex items-center gap-2 font-semibold text-slate-800">
              <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: s.stroke }} />
              <span>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Tabular Records with increased font size */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm font-mono">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold text-xs uppercase tracking-wider">
                <th className="py-2.5 pr-4 font-bold">Timeline</th>
                <th className="py-2.5 px-4 font-bold">FPG (mg/dL)</th>
                <th className="py-2.5 px-4 font-bold">Serum Cr (mg/dL)</th>
                <th className="py-2.5 px-4 font-bold">eGFR (mL/min)</th>
                <th className="py-2.5 px-4 font-bold">T2D Risk</th>
                <th className="py-2.5 pl-4 font-bold">CKD Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800 tabular-nums font-medium">
              {history.map((row, idx) => (
                <tr key={idx} className={idx === history.length - 1 ? 'bg-cyan-50/60 font-bold text-slate-900' : ''}>
                  <td className="py-2.5 pr-4 font-sans flex items-center gap-1.5 font-semibold">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    {row.visitDate}
                  </td>
                  <td className="py-2.5 px-4">{row.fastingGlucose}</td>
                  <td className="py-2.5 px-4">{row.serumCreatinine.toFixed(2)}</td>
                  <td className="py-2.5 px-4">{row.eGfr}</td>
                  <td className="py-2.5 px-4 text-amber-600 font-bold">{Math.round(row.t2dRisk * 100)}%</td>
                  <td className="py-2.5 pl-4 text-cyan-600 font-bold">{Math.round(row.ckdRisk * 100)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
