import React, { useState, useCallback } from 'react';
import { Header } from './components/Header.jsx';
import { PatientIntakeForm } from './components/PatientIntakeForm.jsx';
import { DualRiskGauges } from './components/DualRiskGauges.jsx';
import { ShapWaterfall } from './components/ShapWaterfall.jsx';
import { RiskMatrix2D } from './components/RiskMatrix2D.jsx';
import { LongitudinalTrends } from './components/LongitudinalTrends.jsx';
import { ClinicalAlerts } from './components/ClinicalAlerts.jsx';
import { ClinicalGuidelinesHub } from './components/ClinicalGuidelinesHub.jsx';
import { ClinicalReportModal } from './components/ClinicalReportModal.jsx';
import { predictMultiRisk } from './api/client.js';
import {
  ShieldCheck,
  Activity,
  ArrowRight,
  ClipboardCheck,
  Zap,
  TrendingUp,
  FileCheck2,
  Heart,
  Stethoscope,
} from 'lucide-react';

const INITIAL_RECORD = {
  demographics: {
    mrn: 'MRN-78241',
    age: 54,
    gender: 'female',
    pregnancies: 2,
  },
  glycemic: {
    fastingGlucose: 130,
    randomGlucose: 172,
    serumInsulin: 120,
    bmi: 31.2,
    skinThickness: 28,
    diabetesPedigree: 0.54,
  },
  renal: {
    serumCreatinine: 1.48,
    bloodUrea: 48,
    potassium: 4.7,
    sodium: 138,
    hemoglobin: 12.0,
    bloodPressureSystolic: 140,
    bloodPressureDiastolic: 86,
  },
  urinalysis: {
    urineAlbumin: 2,
    specificGravity: 1.018,
  },
};

const INITIAL_HISTORY = [
  { visitDate: '18 mo ago', t2dRisk: 0.35, ckdRisk: 0.22, eGfr: 82.4, fastingGlucose: 104, serumCreatinine: 1.02 },
  { visitDate: '12 mo ago', t2dRisk: 0.51, ckdRisk: 0.38, eGfr: 71.0, fastingGlucose: 118, serumCreatinine: 1.18 },
  { visitDate: '6 mo ago', t2dRisk: 0.68, ckdRisk: 0.55, eGfr: 58.2, fastingGlucose: 124, serumCreatinine: 1.34 },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('intake');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const [patientRecord, setPatientRecord] = useState(INITIAL_RECORD);
  const [history, setHistory] = useState(INITIAL_HISTORY);

  // Assessment results state (initially null until user triggers "Analyze Clinical Data")
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Triggered when user clicks "Analyze Clinical Data"
  const handleAnalyzeClinicalData = useCallback(async (recordToAnalyze) => {
    const record = recordToAnalyze || patientRecord;
    setIsLoading(true);
    setApiError(null);
    try {
      const data = await predictMultiRisk(record);
      setPrediction(data);

      // Append assessment to trajectory
      if (data && data.predictions) {
        const newPoint = {
          visitDate: 'Current',
          t2dRisk: data.predictions.diabetes?.riskProbability || 0,
          ckdRisk: data.predictions.chronicKidneyDisease?.riskProbability || 0,
          eGfr: data.eGfr || 60,
          fastingGlucose: record.glycemic?.fastingGlucose || 120,
          serumCreatinine: record.renal?.serumCreatinine || 1.2,
        };
        setHistory((prev) => {
          const filtered = prev.filter((p) => p.visitDate !== 'Current');
          return [...filtered, newPoint];
        });
      }
    } catch (err) {
      console.error('[Clinical Assessment Error]:', err);
      setApiError(err.message || 'Unable to complete clinical risk evaluation. Please check your connection and retry.');
    } finally {
      setIsLoading(false);
    }
  }, [patientRecord]);

  const handleReset = () => {
    setPatientRecord(INITIAL_RECORD);
    setPrediction(null);
    setApiError(null);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 font-sans flex flex-col text-sm">
      {/* 3-Zone Top Bar Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onReset={handleReset}
      />

      {/* Main Workspace Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-7 space-y-7">
        {/* Workspace Title & Clinical Standard Badges */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Cardiorenal & Metabolic Clinical Decision Support
            </h1>
            <p className="text-sm text-slate-600 mt-1 font-medium">
              Integrated dual-disease evaluation with individual biomarker factor attribution
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-700 font-medium">
            <span className="flex items-center gap-1.5 font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              KDIGO 2024 Guidelines
            </span>
            <span className="flex items-center gap-1.5 font-semibold text-cyan-800 bg-cyan-50 border border-cyan-200 px-3 py-1 rounded-lg">
              <Activity className="w-4 h-4 text-cyan-600" />
              2021 CKD-EPI Formula
            </span>
            <span className="flex items-center gap-1.5 font-semibold text-slate-800 bg-slate-100 border border-slate-200 px-3 py-1 rounded-lg">
              <ClipboardCheck className="w-4 h-4 text-slate-600" />
              ADA Standards of Care
            </span>
          </div>
        </div>

        {/* Assessment Error Notification */}
        {apiError && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs sm:text-sm flex items-center justify-between">
            <div>
              <strong>Assessment Notice:</strong> Unable to complete clinical risk evaluation.
              <div className="text-xs text-amber-700 mt-0.5">{apiError}</div>
            </div>
            <button
              type="button"
              onClick={() => handleAnalyzeClinicalData(patientRecord)}
              className="px-3.5 py-1.5 bg-amber-600 text-white font-semibold rounded-md hover:bg-amber-700 text-xs cursor-pointer transition-colors"
            >
              Retry Assessment
            </button>
          </div>
        )}

        {/* Tab 1: Patient Risk Assessment */}
        {activeTab === 'intake' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
            {/* Left Column: Clinical Parameter Intake Form (7 cols) */}
            <div className="lg:col-span-7 space-y-7">
              <PatientIntakeForm
                record={patientRecord}
                onChange={setPatientRecord}
                onAnalyze={handleAnalyzeClinicalData}
                isLoading={isLoading}
              />
            </div>

            {/* Right Column: Prediction Results or Awaiting Prompt (5 cols) */}
            <div className="lg:col-span-5 space-y-7">
              {prediction ? (
                <>
                  {/* Results Header Status */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                          Clinical Assessment Results
                        </span>
                        <div className="text-[11px] text-slate-500 font-medium">
                          Completed {new Date().toLocaleTimeString()} · Record ID: {prediction.assessmentId}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsReportModalOpen(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                    >
                      <FileCheck2 className="w-3.5 h-3.5 text-slate-600" />
                      <span>Export Report</span>
                    </button>
                  </div>

                  <DualRiskGauges prediction={prediction} />
                  <ShapWaterfall prediction={prediction} />
                  <ClinicalAlerts alerts={prediction?.clinicalAlerts || []} />
                </>
              ) : (
                /* Awaiting Input Prompt Section */
                <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                    <div className="w-11 h-11 rounded-xl bg-cyan-50 border border-cyan-100 text-cyan-600 flex items-center justify-center shrink-0">
                      <Activity className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        Awaiting Clinical Data Submission
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Assessment results will appear here once you analyze the patient&apos;s data.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Enter the patient&apos;s physiological values in the clinical input form on the left, then click{' '}
                      <span className="font-semibold text-slate-900">&quot;Analyze Clinical Data&quot;</span> to evaluate metabolic and renal risk.
                    </p>

                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                        What will be evaluated:
                      </span>
                      <ul className="space-y-2 text-xs text-slate-600">
                        <li className="flex items-start gap-2">
                          <Zap className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                          <span>
                            <strong className="text-slate-800">Dual Disease Classification:</strong> Quantitative risk probabilities and clinical risk categories for Type 2 Diabetes and Chronic Kidney Disease.
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <TrendingUp className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
                          <span>
                            <strong className="text-slate-800">2021 CKD-EPI eGFR & KDIGO Staging:</strong> Exact nephron filtration clearance rate and renal stage classification.
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ClipboardCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>
                            <strong className="text-slate-800">Biomarker Factor Attribution:</strong> Breakdown of specific laboratory drivers elevating or mitigating patient risk.
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                          <span>
                            <strong className="text-slate-800">Evidence-Based Clinical Guidance:</strong> Automated practice recommendations (e.g. SGLT2i, RAAS blockade) and surveillance schedules.
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => handleAnalyzeClinicalData(patientRecord)}
                        disabled={isLoading}
                        className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {isLoading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Analyzing Clinical Data...</span>
                          </>
                        ) : (
                          <>
                            <span>Analyze Current Input Values</span>
                            <ArrowRight className="w-4 h-4 text-cyan-400" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Cardiorenal Risk Matrix */}
        {activeTab === 'matrix' && (
          <div className="space-y-7">
            {prediction ? (
              <>
                <RiskMatrix2D prediction={prediction} />
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
                  <div className="lg:col-span-5">
                    <DualRiskGauges prediction={prediction} />
                  </div>
                  <div className="lg:col-span-7">
                    <ClinicalAlerts alerts={prediction?.clinicalAlerts || []} />
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white p-8 rounded-xl border border-slate-200 text-center space-y-4 max-w-xl mx-auto my-12">
                <Activity className="w-12 h-12 text-slate-400 mx-auto" />
                <h3 className="text-lg font-bold text-slate-900">No Assessment Data Yet</h3>
                <p className="text-sm text-slate-600">
                  Please enter patient clinical values and run an analysis to plot the Cardiorenal Risk Matrix coordinates.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('intake')}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Go to Clinical Intake Form
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Longitudinal Trajectory */}
        {activeTab === 'trajectory' && (
          <div className="space-y-7">
            <LongitudinalTrends history={history} mrn={patientRecord.demographics?.mrn} />
            {prediction && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
                <div className="lg:col-span-6">
                  <DualRiskGauges prediction={prediction} />
                </div>
                <div className="lg:col-span-6">
                  <ShapWaterfall prediction={prediction} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Clinical Practice Guidelines */}
        {activeTab === 'guidelines' && (
          <ClinicalGuidelinesHub />
        )}
      </main>

      {/* Clinical Consultation Report Modal */}
      <ClinicalReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        record={patientRecord}
        prediction={prediction}
      />

      {/* Quiet Medical Disclaimer Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs sm:text-sm text-slate-500">
          <div className="flex items-center gap-2 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>RenalGlyco AI · Clinical Decision Support Platform</span>
          </div>
          <div>
            <span>KDIGO 2024 & ADA Standards of Care compliant. For clinical reference and consultation support.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
