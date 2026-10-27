import React from 'react';
import { Activity, FileText, Code2, RefreshCw, Terminal } from 'lucide-react';

export const Header = ({
  activeTab,
  setActiveTab,
  onOpenApiModal,
  onOpenReportModal,
  onReset,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-18">
          {/* Zone 1: Brand wordmark */}
          <div className="flex items-center gap-3.5 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-xs">
              <Activity className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap">
                RenalGlyco AI
              </span>
              <span className="hidden sm:inline-block ml-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Clinical Decision Support
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-600">
            <button
              type="button"
              onClick={() => setActiveTab('intake')}
              className={`whitespace-nowrap transition-colors cursor-pointer py-1.5 ${
                activeTab === 'intake'
                  ? 'text-slate-900 font-bold border-b-2 border-slate-900'
                  : 'hover:text-slate-900'
              }`}
            >
              Diagnostic Intake & XAI
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('matrix')}
              className={`whitespace-nowrap transition-colors cursor-pointer py-1.5 ${
                activeTab === 'matrix'
                  ? 'text-slate-900 font-bold border-b-2 border-slate-900'
                  : 'hover:text-slate-900'
              }`}
            >
              Cardiorenal 2D Matrix
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('trajectory')}
              className={`whitespace-nowrap transition-colors cursor-pointer py-1.5 ${
                activeTab === 'trajectory'
                  ? 'text-slate-900 font-bold border-b-2 border-slate-900'
                  : 'hover:text-slate-900'
              }`}
            >
              Longitudinal Trajectory
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('python_hub')}
              className={`flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer py-1.5 ${
                activeTab === 'python_hub'
                  ? 'text-cyan-700 font-bold border-b-2 border-cyan-600'
                  : 'hover:text-slate-900 text-slate-600'
              }`}
            >
              <Terminal className="w-4 h-4 text-cyan-600" />
              <span>Python & FastAPI</span>
            </button>
          </nav>

          {/* Zone 3: Actions */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onOpenApiModal}
              className="flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
              title="Inspect OpenAPI Schema and live JSON payload"
            >
              <Code2 className="w-4 h-4 text-slate-600" />
              <span className="hidden sm:inline">REST API</span>
            </button>

            <button
              type="button"
              onClick={onOpenReportModal}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors whitespace-nowrap cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Clinical Summary</span>
            </button>

            <button
              type="button"
              onClick={onReset}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Reset intake to baseline"
            >
              <RefreshCw className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
