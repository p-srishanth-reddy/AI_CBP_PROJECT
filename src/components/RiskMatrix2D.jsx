import React from 'react';
import { Grid, Crosshair, AlertCircle } from 'lucide-react';

export const RiskMatrix2D = ({ prediction }) => {
  if (!prediction || !prediction.predictions) return null;

  const xRisk = prediction.predictions.diabetes?.riskProbability || 0;
  const yRisk = prediction.predictions.chronicKidneyDisease?.riskProbability || 0;

  const isHighT2d = xRisk >= 0.50;
  const isHighCkd = yRisk >= 0.50;

  let quadrantTitle = 'Quadrant III: Cardiorenal Homeostasis';
  let quadrantSummary = 'Preserved metabolic glucose tolerance and intact renal nephron clearance. Standard annual surveillance.';
  let quadrantColor = 'text-emerald-900 bg-emerald-50/90 border-emerald-300';

  if (isHighT2d && isHighCkd) {
    quadrantTitle = 'Quadrant I: Dual Cardiorenal Diabetic Glomerulosclerosis';
    quadrantSummary = 'Elevated concurrent metabolic and renal risks. Accelerated microvascular damage requiring coordinated endocrinology and nephrology comanagement (e.g., SGLT2i + RAAS blockade).';
    quadrantColor = 'text-rose-950 bg-rose-50/90 border-rose-300';
  } else if (!isHighT2d && isHighCkd) {
    quadrantTitle = 'Quadrant II: Isolated Renal Impairment (Non-Diabetic Etiology)';
    quadrantSummary = 'Renal clearance decline independent of glycemic overload. Investigate primary glomerulonephritis, renovascular hypertension, or tubulointerstitial insult.';
    quadrantColor = 'text-amber-950 bg-amber-50/90 border-amber-300';
  } else if (isHighT2d && !isHighCkd) {
    quadrantTitle = 'Quadrant IV: Isolated Metabolic Dysregulation (Pre-Nephropathic)';
    quadrantSummary = 'High diabetic conversion risk but preserved glomerular filtration rate. Crucial therapeutic window to arrest future microalbuminuria and renal hyperfiltration.';
    quadrantColor = 'text-orange-950 bg-orange-50/90 border-orange-300';
  }

  const size = 340;
  const padding = 42;
  const innerSize = size - padding * 2;
  const posX = padding + xRisk * innerSize;
  const posY = size - padding - yRisk * innerSize;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
        <div className="flex items-center gap-2.5">
          <Grid className="w-5 h-5 text-cyan-600" />
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Cardiorenal Metabolic-Renal Risk Matrix
            </h3>
            <p className="text-sm text-slate-500">
              Cross-disciplinary risk mapping of glycemic vs. renal burden
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm font-mono text-slate-700 font-bold bg-slate-100 px-3 py-1 rounded-lg">
          <Crosshair className="w-4 h-4 text-cyan-600" />
          <span>({Math.round(xRisk * 100)}%, {Math.round(yRisk * 100)}%)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Interactive 2D Coordinate Canvas */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="relative">
            <svg
              width={size}
              height={size}
              className="bg-slate-50/90 rounded-2xl border border-slate-200 shadow-2xs"
            >
              {/* Q2 (Top-Left): Isolated CKD */}
              <rect
                x={padding}
                y={padding}
                width={innerSize / 2}
                height={innerSize / 2}
                fill="#FEF3C7"
                fillOpacity="0.3"
              />
              {/* Q1 (Top-Right): Dual Disease */}
              <rect
                x={padding + innerSize / 2}
                y={padding}
                width={innerSize / 2}
                height={innerSize / 2}
                fill="#FEE2E2"
                fillOpacity="0.4"
              />
              {/* Q3 (Bottom-Left): Homeostasis */}
              <rect
                x={padding}
                y={padding + innerSize / 2}
                width={innerSize / 2}
                height={innerSize / 2}
                fill="#D1FAE5"
                fillOpacity="0.3"
              />
              {/* Q4 (Bottom-Right): Isolated T2D */}
              <rect
                x={padding + innerSize / 2}
                y={padding + innerSize / 2}
                width={innerSize / 2}
                height={innerSize / 2}
                fill="#FFEDD5"
                fillOpacity="0.3"
              />

              {/* Threshold Divider Lines */}
              <line
                x1={padding + innerSize / 2}
                y1={padding}
                x2={padding + innerSize / 2}
                y2={size - padding}
                stroke="#94A3B8"
                strokeWidth="1.5"
                strokeDasharray="4 3"
              />
              <line
                x1={padding}
                y1={padding + innerSize / 2}
                x2={size - padding}
                y2={padding + innerSize / 2}
                stroke="#94A3B8"
                strokeWidth="1.5"
                strokeDasharray="4 3"
              />

              {/* Axes Labels */}
              <text
                x={size / 2}
                y={size - 12}
                textAnchor="middle"
                className="text-[11px] font-bold fill-slate-700 uppercase tracking-wider"
              >
                Type 2 Diabetes Risk →
              </text>
              <text
                x={-size / 2}
                y={16}
                transform="rotate(-90)"
                textAnchor="middle"
                className="text-[11px] font-bold fill-slate-700 uppercase tracking-wider"
              >
                Chronic Kidney Disease Risk →
              </text>

              {/* Quadrant Labels */}
              <text x={padding + 8} y={padding + 18} className="text-[10px] fill-amber-800 font-bold">
                Q2: Isolated CKD
              </text>
              <text x={size - padding - 8} y={padding + 18} textAnchor="end" className="text-[10px] fill-rose-800 font-bold">
                Q1: Dual Synergy
              </text>
              <text x={padding + 8} y={size - padding - 10} className="text-[10px] fill-emerald-800 font-bold">
                Q3: Homeostasis
              </text>
              <text x={size - padding - 8} y={size - padding - 10} textAnchor="end" className="text-[10px] fill-orange-800 font-bold">
                Q4: Isolated T2D
              </text>

              {/* Projection Guidelines */}
              <line
                x1={posX}
                y1={size - padding}
                x2={posX}
                y2={posY}
                stroke="#0284C7"
                strokeWidth="1.5"
                strokeDasharray="2 2"
              />
              <line
                x1={padding}
                y1={posY}
                x2={posX}
                y2={posY}
                stroke="#0284C7"
                strokeWidth="1.5"
                strokeDasharray="2 2"
              />

              {/* Patient Location Marker */}
              <circle
                cx={posX}
                cy={posY}
                r="8"
                className="fill-slate-900 stroke-cyan-400"
                strokeWidth="3"
              />
            </svg>
          </div>
        </div>

        {/* Quadrant Clinical Interpretation */}
        <div className="lg:col-span-6 space-y-4">
          <div className={`p-5 rounded-xl border ${quadrantColor}`}>
            <span className="text-xs font-bold uppercase tracking-wider block mb-1.5 opacity-80">
              Active Patient Classification
            </span>
            <h4 className="text-base font-bold">{quadrantTitle}</h4>
            <p className="text-sm mt-2 leading-relaxed font-medium">
              {quadrantSummary}
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <AlertCircle className="w-4 h-4 text-cyan-600" />
              <span>Diagnostic Takeaway</span>
            </div>
            <p className="text-slate-600 leading-relaxed text-xs sm:text-sm">
              Managing diabetes and renal damage in silos leads to late referral. RenalGlyco AI maps both vectors simultaneously to prevent asymptomatic transitions from Quadrant IV into Quadrant I.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
