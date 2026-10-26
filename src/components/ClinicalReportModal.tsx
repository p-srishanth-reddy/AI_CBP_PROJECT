import React from 'react';
import { ClinicalPatientRecord, MultiRiskPredictionResponse } from '../types/clinical';
import { FileText, X, Printer } from 'lucide-react';

interface ClinicalReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: ClinicalPatientRecord;
  prediction: MultiRiskPredictionResponse;
}

export const ClinicalReportModal: React.FC<ClinicalReportModalProps> = ({
  isOpen,
  onClose,
  record,
  prediction,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const t2d = prediction.predictions.diabetes;
  const ckd = prediction.predictions.chronicKidneyDisease;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Top Actions */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-200 bg-slate-50 print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-700" />
            <span className="text-sm font-semibold text-slate-900">
              Clinical Decision Support Summary
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Medical Sheet */}
        <div className="p-8 overflow-y-auto space-y-6 text-slate-800 text-xs">
          {/* Clinic Header */}
          <div className="border-b-2 border-slate-900 pb-4 flex justify-between items-start">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                RenalGlyco AI Clinical Consultation Report
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Dual Cardiorenal Metabolic & Nephropathic Risk Assessment System
              </p>
            </div>
            <div className="text-right font-mono text-[11px] text-slate-500">
              <div>Assessment ID: {prediction.assessmentId}</div>
              <div>Generated: {new Date(prediction.timestamp).toLocaleDateString()}</div>
            </div>
          </div>

          {/* Patient Header Block */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Patient Name</span>
              <span className="font-semibold text-slate-900 text-sm">{record.demographics.name}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Medical Record No.</span>
              <span className="font-mono font-bold text-slate-900">{record.demographics.mrn}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Age / Sex</span>
              <span className="text-slate-900 font-medium">
                {record.demographics.age} yrs · {record.demographics.gender}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">BMI / Blood Pressure</span>
              <span className="font-mono text-slate-900">
                {record.glycemic.bmi} kg/m² · {record.renal.bloodPressureSystolic}/{record.renal.bloodPressureDiastolic}
              </span>
            </div>
          </div>

          {/* Primary Multi-Risk Classifications */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 border border-slate-200 rounded-xl">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Metabolic Surveillance
              </span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-lg font-bold text-slate-900">Type 2 Diabetes Risk</span>
                <span className="text-lg font-mono font-bold text-amber-600">
                  {Math.round(t2d.riskProbability * 100)}%
                </span>
              </div>
              <div className="text-xs text-slate-600 mt-1">
                Tier: <strong>{t2d.riskCategory} Risk</strong> · Status: {prediction.glycemicStatus}
              </div>
            </div>

            <div className="p-4 border border-slate-200 rounded-xl">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Renal Filtration Surveillance
              </span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-lg font-bold text-slate-900">Chronic Kidney Disease</span>
                <span className="text-lg font-mono font-bold text-cyan-600">
                  {Math.round(ckd.riskProbability * 100)}%
                </span>
              </div>
              <div className="text-xs text-slate-600 mt-1">
                Tier: <strong>{ckd.riskCategory} Risk</strong> · 2021 CKD-EPI eGFR: <strong>{prediction.eGfr} mL/min</strong>
              </div>
            </div>
          </div>

          {/* Explainable AI Audit Summary */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
              Explainable AI (TreeSHAP) Primary Biological Drivers
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-semibold text-slate-900 block mb-1">T2D Escalating Drivers:</span>
                <ul className="space-y-1 font-mono text-[11px] text-slate-700">
                  {t2d.topRiskDrivers.slice(0, 3).map((d) => (
                    <li key={d.feature} className="flex justify-between">
                      <span>{d.clinicalName} ({d.value} {d.unit}):</span>
                      <span className="text-rose-600 font-semibold">+{d.shapImpact.toFixed(3)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-semibold text-slate-900 block mb-1">CKD Escalating Drivers:</span>
                <ul className="space-y-1 font-mono text-[11px] text-slate-700">
                  {ckd.topRiskDrivers.slice(0, 3).map((d) => (
                    <li key={d.feature} className="flex justify-between">
                      <span>{d.clinicalName} ({d.value} {d.unit}):</span>
                      <span className="text-cyan-700 font-semibold">+{d.shapImpact.toFixed(3)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Clinical Alerts & Pharmacotherapy Section */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
              Automated Clinical Recommendations (ADA & KDIGO 2024 Guidelines)
            </h3>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs text-slate-700">
              {prediction.clinicalAlerts.map((alert, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <span className="text-slate-400">·</span>
                  <span>{alert}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Physician Attestation & Sign-off */}
          <div className="pt-8 border-t border-slate-200 grid grid-cols-2 gap-8 text-xs text-slate-500">
            <div>
              <div className="border-b border-slate-300 pb-1 mb-1" />
              <span>Reviewing Physician Signature / License ID</span>
            </div>
            <div>
              <div className="border-b border-slate-300 pb-1 mb-1" />
              <span>Clinical Action Taken & Follow-up Date</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
