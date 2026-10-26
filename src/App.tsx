import { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { PatientIntakeForm } from './components/PatientIntakeForm';
import { DualRiskGauges } from './components/DualRiskGauges';
import { ShapWaterfall } from './components/ShapWaterfall';
import { RiskMatrix2D } from './components/RiskMatrix2D';
import { LongitudinalTrends } from './components/LongitudinalTrends';
import { ClinicalAlerts } from './components/ClinicalAlerts';
import { PythonFastApiHub } from './components/PythonFastApiHub';
import { ApiExplorerModal } from './components/ApiExplorerModal';
import { ClinicalReportModal } from './components/ClinicalReportModal';
import { CLINICAL_PRESETS } from './data/patientPresets';
import { ClinicalPatientRecord } from './types/clinical';
import { runMultiRiskPrediction } from './utils/mlEngine';
import { ShieldCheck, Cpu, Database, Activity } from 'lucide-react';

export default function App() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('silent-nephropathy');
  const [activeTab, setActiveTab] = useState<'intake' | 'matrix' | 'trajectory' | 'python_hub'>('intake');
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const defaultPreset = CLINICAL_PRESETS[0];
  const [patientRecord, setPatientRecord] = useState<ClinicalPatientRecord>(defaultPreset.record);
  const [history, setHistory] = useState(defaultPreset.history);

  const handleSelectPreset = (presetId: string) => {
    const found = CLINICAL_PRESETS.find((p) => p.id === presetId);
    if (found) {
      setSelectedPresetId(presetId);
      setPatientRecord(found.record);
      setHistory(found.history);
    }
  };

  const handleReset = () => {
    handleSelectPreset('healthy-control');
  };

  const prediction = useMemo(() => {
    return runMultiRiskPrediction(patientRecord);
  }, [patientRecord]);

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 font-sans flex flex-col text-sm">
      {/* 3-Zone Top Bar Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenApiModal={() => setIsApiModalOpen(true)}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onReset={handleReset}
      />

      {/* Main Workspace Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-7 space-y-7">
        {/* Workspace Title & Metadata Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Cardiorenal & Metabolic Clinical Decision Support
            </h1>
            <p className="text-sm text-slate-600 mt-1 font-medium">
              Dual-disease classification with exact TreeSHAP biological risk attributions
            </p>
          </div>

          <div className="flex items-center gap-3.5 text-xs sm:text-sm text-slate-600 font-mono">
            <span className="flex items-center gap-1.5 font-semibold text-slate-800">
              <Cpu className="w-4 h-4 text-cyan-600" />
              XGBoost & RF Core
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5 font-semibold text-slate-800">
              <Database className="w-4 h-4 text-slate-500" />
              UCI Calibrated
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5 font-semibold text-emerald-700">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              KDIGO / ADA 2024
            </span>
          </div>
        </div>

        {/* Tab 1: Diagnostic Intake & XAI */}
        {activeTab === 'intake' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
            {/* Left Column: Biomarker Intake Form (7 cols) */}
            <div className="lg:col-span-7 space-y-7">
              <PatientIntakeForm
                record={patientRecord}
                onChange={setPatientRecord}
                onSelectPreset={handleSelectPreset}
                selectedPresetId={selectedPresetId}
              />
            </div>

            {/* Right Column: Gauges, XAI Waterfall & Alerts (5 cols) */}
            <div className="lg:col-span-5 space-y-7">
              <DualRiskGauges prediction={prediction} />
              <ShapWaterfall prediction={prediction} />
              <ClinicalAlerts alerts={prediction.clinicalAlerts} />
            </div>
          </div>
        )}

        {/* Tab 2: Cardiorenal 2D Matrix */}
        {activeTab === 'matrix' && (
          <div className="space-y-7">
            <RiskMatrix2D prediction={prediction} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
              <div className="lg:col-span-5">
                <DualRiskGauges prediction={prediction} />
              </div>
              <div className="lg:col-span-7">
                <ClinicalAlerts alerts={prediction.clinicalAlerts} />
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Longitudinal Trajectory */}
        {activeTab === 'trajectory' && (
          <div className="space-y-7">
            <LongitudinalTrends history={history} mrn={patientRecord.demographics.mrn} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
              <div className="lg:col-span-6">
                <DualRiskGauges prediction={prediction} />
              </div>
              <div className="lg:col-span-6">
                <ShapWaterfall prediction={prediction} />
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Python ML & FastAPI Hub */}
        {activeTab === 'python_hub' && (
          <PythonFastApiHub record={patientRecord} prediction={prediction} />
        )}
      </main>

      {/* Modals */}
      <ApiExplorerModal
        isOpen={isApiModalOpen}
        onClose={() => setIsApiModalOpen(false)}
        record={patientRecord}
        prediction={prediction}
      />

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
            <Activity className="w-4 h-4 text-slate-400" />
            <span>RenalGlyco AI · Clinical Decision Support System</span>
          </div>
          <div>
            <span>For investigational and educational use. Compliant with 2021 CKD-EPI & KDIGO 2024 guidance.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
