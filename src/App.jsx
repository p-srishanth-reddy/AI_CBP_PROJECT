import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header.jsx';
import { PatientIntakeForm } from './components/PatientIntakeForm.jsx';
import { DualRiskGauges } from './components/DualRiskGauges.jsx';
import { ShapWaterfall } from './components/ShapWaterfall.jsx';
import { RiskMatrix2D } from './components/RiskMatrix2D.jsx';
import { LongitudinalTrends } from './components/LongitudinalTrends.jsx';
import { ClinicalAlerts } from './components/ClinicalAlerts.jsx';
import { PythonFastApiHub } from './components/PythonFastApiHub.jsx';
import { ApiExplorerModal } from './components/ApiExplorerModal.jsx';
import { ClinicalReportModal } from './components/ClinicalReportModal.jsx';
import { CLINICAL_PRESETS } from './data/patientPresets.js';
import { predictMultiRisk } from './api/client.js';
import { ShieldCheck, Cpu, Database, Server } from 'lucide-react';

export default function App() {
  const [selectedPresetId, setSelectedPresetId] = useState('silent-nephropathy');
  const [activeTab, setActiveTab] = useState('intake');
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const defaultPreset = CLINICAL_PRESETS[0];
  const [patientRecord, setPatientRecord] = useState(defaultPreset.record);
  const [history, setHistory] = useState(defaultPreset.history);

  // Python backend prediction state
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Fetch prediction directly from Python FastAPI backend
  const fetchPythonPrediction = useCallback(async (record) => {
    setIsLoading(true);
    setApiError(null);
    try {
      const data = await predictMultiRisk(record);
      setPrediction(data);
    } catch (err) {
      console.error('[Python API Fetch Error]:', err);
      setApiError(err.message || 'Failed to connect to Python FastAPI backend');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Trigger Python API prediction on record changes (debounced by 150ms for smooth sliding)
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPythonPrediction(patientRecord);
    }, 150);
    return () => clearTimeout(timer);
  }, [patientRecord, fetchPythonPrediction]);

  const handleSelectPreset = (presetId) => {
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
            <span className="flex items-center gap-1.5 font-semibold text-emerald-700">
              <Server className="w-4 h-4 text-emerald-600" />
              Python FastAPI Backend
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5 font-semibold text-slate-800">
              <Cpu className="w-4 h-4 text-cyan-600" />
              Python TreeSHAP
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5 font-semibold text-slate-800">
              <Database className="w-4 h-4 text-slate-500" />
              React JavaScript UI
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5 font-semibold text-emerald-700">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              KDIGO / ADA 2024
            </span>
          </div>
        </div>

        {/* API Error Notification */}
        {apiError && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs sm:text-sm flex items-center justify-between">
            <div>
              <strong>Python API Status:</strong> Connecting to Python FastAPI backend (<code>/api/v1/predict/multi-risk</code>)...
              <div className="text-xs text-amber-700 mt-0.5">{apiError}</div>
            </div>
            <button
              type="button"
              onClick={() => fetchPythonPrediction(patientRecord)}
              className="px-3 py-1 bg-amber-600 text-white font-semibold rounded-md hover:bg-amber-700 text-xs"
            >
              Retry
            </button>
          </div>
        )}

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
              <ClinicalAlerts alerts={prediction?.clinicalAlerts || []} />
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
                <ClinicalAlerts alerts={prediction?.clinicalAlerts || []} />
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Longitudinal Trajectory */}
        {activeTab === 'trajectory' && (
          <div className="space-y-7">
            <LongitudinalTrends history={history} mrn={patientRecord.demographics?.mrn} />

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
            <Server className="w-4 h-4 text-emerald-600" />
            <span>RenalGlyco AI · React JavaScript (JSX) + Python FastAPI Backend</span>
          </div>
          <div>
            <span>Backend single source of truth for all clinical risk predictions and TreeSHAP.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
