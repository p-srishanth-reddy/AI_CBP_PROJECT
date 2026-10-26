import React, { useState } from 'react';
import { ClinicalPatientRecord, MultiRiskPredictionResponse } from '../types/clinical';
import { Code2, X, Copy, Check, Terminal } from 'lucide-react';

interface ApiExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: ClinicalPatientRecord;
  prediction: MultiRiskPredictionResponse;
}

export const ApiExplorerModal: React.FC<ApiExplorerModalProps> = ({
  isOpen,
  onClose,
  record,
  prediction,
}) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  if (!isOpen) return null;

  // Format matching SRS Section 6.2 exactly
  const requestPayload = {
    mrn: record.demographics.mrn,
    demographics: {
      age: record.demographics.age,
      gender: record.demographics.gender,
      pregnancies: record.demographics.pregnancies,
    },
    t2d_biomarkers: {
      glucose: record.glycemic.fastingGlucose,
      blood_pressure: record.renal.bloodPressureDiastolic,
      skin_thickness: record.glycemic.skinThickness,
      insulin: record.glycemic.serumInsulin,
      bmi: record.glycemic.bmi,
      diabetes_pedigree: record.glycemic.diabetesPedigree,
    },
    ckd_biomarkers: {
      specific_gravity: record.urinalysis.specificGravity,
      urine_albumin: record.urinalysis.urineAlbumin,
      urine_sugar: record.urinalysis.urineSugar,
      blood_glucose_random: record.glycemic.randomGlucose,
      blood_urea: record.renal.bloodUrea,
      serum_creatinine: record.renal.serumCreatinine,
      sodium: record.renal.sodium,
      potassium: record.renal.potassium,
      hemoglobin: record.renal.hemoglobin,
      packed_cell_volume: record.renal.packedCellVolume,
      white_blood_cell_count: record.renal.whiteBloodCellCount,
    },
  };

  const responsePayload = {
    status: 'success',
    assessment_id: prediction.assessmentId,
    predictions: {
      diabetes: {
        risk_probability: prediction.predictions.diabetes.riskProbability,
        risk_category: prediction.predictions.diabetes.riskCategory,
        top_risk_drivers: prediction.predictions.diabetes.topRiskDrivers.map((d) => ({
          feature: d.clinicalName,
          shap_impact: d.shapImpact,
        })),
      },
      chronic_kidney_disease: {
        risk_probability: prediction.predictions.chronicKidneyDisease.riskProbability,
        risk_category: prediction.predictions.chronicKidneyDisease.riskCategory,
        top_risk_drivers: prediction.predictions.chronicKidneyDisease.topRiskDrivers.map((d) => ({
          feature: d.clinicalName,
          shap_impact: d.shapImpact,
        })),
      },
    },
    timestamp: prediction.timestamp,
  };

  const curlSnippet = `curl -X POST "https://api.renalglyco.ai/api/v1/predict/multi-risk" \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(requestPayload)}'`;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-cyan-600" />
            <div>
              <h2 className="text-base font-bold text-slate-900">
                REST API Gateway & OpenAPI Contract
              </h2>
              <span className="text-xs font-mono text-slate-500">
                POST /api/v1/predict/multi-risk · Status 200 OK ({prediction.executionTimeMs} ms)
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* cURL Command */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                <Terminal className="w-3.5 h-3.5 text-slate-500" />
                Terminal cURL Execution
              </span>
              <button
                type="button"
                onClick={() => handleCopy(curlSnippet, 'curl')}
                className="flex items-center gap-1 text-[11px] font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                {copiedSection === 'curl' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedSection === 'curl' ? 'Copied' : 'Copy cURL'}</span>
              </button>
            </div>
            <pre className="p-3 bg-slate-900 text-slate-100 rounded-lg font-mono text-[11px] overflow-x-auto whitespace-pre">
              {curlSnippet}
            </pre>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Request Payload */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-semibold text-slate-700 uppercase tracking-wider text-[11px]">
                  HTTP Request Body (JSON)
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(JSON.stringify(requestPayload, null, 2), 'req')}
                  className="flex items-center gap-1 text-[11px] font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  {copiedSection === 'req' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>Copy</span>
                </button>
              </div>
              <pre className="p-3 bg-slate-950 text-cyan-300 rounded-lg font-mono text-[11px] overflow-x-auto max-h-72">
                {JSON.stringify(requestPayload, null, 2)}
              </pre>
            </div>

            {/* Response Payload */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-semibold text-slate-700 uppercase tracking-wider text-[11px]">
                  HTTP 200 Response Payload (JSON)
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(JSON.stringify(responsePayload, null, 2), 'res')}
                  className="flex items-center gap-1 text-[11px] font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  {copiedSection === 'res' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>Copy</span>
                </button>
              </div>
              <pre className="p-3 bg-slate-950 text-emerald-400 rounded-lg font-mono text-[11px] overflow-x-auto max-h-72">
                {JSON.stringify(responsePayload, null, 2)}
              </pre>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
