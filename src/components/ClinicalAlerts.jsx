import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle, Info } from 'lucide-react';

export const ClinicalAlerts = ({ alerts = [] }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6">
      <div className="flex items-center gap-2.5 pb-3.5 border-b border-slate-100 mb-3.5">
        <ShieldAlert className="w-5 h-5 text-cyan-600" />
        <h3 className="text-base font-bold text-slate-900">
          Clinical Guidance & Evidence-Based Alerts
        </h3>
        <span className="text-xs text-slate-500 font-medium">· KDIGO 2024 / ADA 2024 (Python Generated)</span>
      </div>

      <div className="space-y-3">
        {alerts.map((alert, idx) => {
          const isCritical = alert.includes('CRITICAL') || alert.includes('URGENT');
          const isWarning = alert.includes('ALERT') || alert.includes('PATHOLOGIC');
          const isGuideline = alert.includes('GUIDELINE');

          let icon = <Info className="w-5 h-5 text-cyan-600 shrink-0 mt-0.5" />;
          let containerStyle = 'bg-cyan-50/60 border-cyan-200 text-cyan-950';

          if (isCritical) {
            icon = <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />;
            containerStyle = 'bg-rose-50/80 border-rose-200 text-rose-950 font-semibold';
          } else if (isWarning) {
            icon = <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />;
            containerStyle = 'bg-amber-50/80 border-amber-200 text-amber-950 font-medium';
          } else if (isGuideline) {
            icon = <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />;
            containerStyle = 'bg-emerald-50/80 border-emerald-200 text-emerald-950 font-medium';
          }

          return (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border text-sm flex items-start gap-3 leading-relaxed shadow-2xs ${containerStyle}`}
            >
              {icon}
              <span>{alert}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
