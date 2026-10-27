import React from 'react';
import { CLINICAL_PRESETS } from '../data/patientPresets.js';
import { Stethoscope, Sparkles } from 'lucide-react';

export const PatientIntakeForm = ({
  record,
  onChange,
  onSelectPreset,
  selectedPresetId,
}) => {
  const updateDemographics = (key, val) => {
    onChange({
      ...record,
      demographics: { ...record.demographics, [key]: val },
    });
  };

  const updateGlycemic = (key, val) => {
    onChange({
      ...record,
      glycemic: { ...record.glycemic, [key]: val },
    });
  };

  const updateRenal = (key, val) => {
    onChange({
      ...record,
      renal: { ...record.renal, [key]: val },
    });
  };

  const updateUrinalysis = (key, val) => {
    onChange({
      ...record,
      urinalysis: { ...record.urinalysis, [key]: val },
    });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs divide-y divide-slate-100">
      {/* Preset Selector Banner */}
      <div className="p-5 bg-slate-50/80">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4.5 h-4.5 text-cyan-600" />
            <span className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Benchmark Clinical Profiles
            </span>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            UCI / NHANES Calibrated Cohorts
          </span>
        </div>

        {/* Preset segmented buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {CLINICAL_PRESETS.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => onSelectPreset(preset.id)}
                className={`text-left p-3 rounded-lg border text-xs sm:text-sm transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="font-semibold text-sm truncate">{preset.name}</div>
                <div
                  className={`text-xs mt-1 font-medium ${
                    isSelected ? 'text-cyan-300' : 'text-slate-500'
                  }`}
                >
                  {preset.badge}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Patient Demographics */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-slate-500" />
            Demographics & Baseline
          </span>
          <span className="text-sm font-mono text-slate-500 font-semibold">
            MRN: {record.demographics.mrn}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Patient Age
            </label>
            <div className="flex items-center">
              <input
                type="number"
                min="18"
                max="99"
                value={record.demographics.age}
                onChange={(e) => updateDemographics('age', Number(e.target.value) || 18)}
                className="w-full px-3 py-2 text-base font-mono border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
              <span className="text-sm text-slate-500 font-mono ml-2 font-medium">yrs</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Biological Sex
            </label>
            <select
              value={record.demographics.gender}
              onChange={(e) => updateDemographics('gender', e.target.value)}
              className="w-full px-3 py-2 text-sm font-medium border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Body Mass Index
            </label>
            <div className="flex items-center">
              <input
                type="number"
                step="0.1"
                min="15"
                max="65"
                value={record.glycemic.bmi}
                onChange={(e) => updateGlycemic('bmi', Number(e.target.value) || 20)}
                className="w-full px-3 py-2 text-base font-mono border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
              <span className="text-xs text-slate-500 font-mono ml-1.5 font-medium">kg/m²</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Prior Pregnancies
            </label>
            <input
              type="number"
              min="0"
              max="17"
              value={record.demographics.pregnancies}
              onChange={(e) => updateDemographics('pregnancies', Number(e.target.value) || 0)}
              className="w-full px-3 py-2 text-base font-mono border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
        </div>
      </div>

      {/* Glycemic Biomarker Panel */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-bold uppercase tracking-wider text-slate-900">
            Glycemic & Metabolic Biomarkers
          </span>
          <span className="text-xs text-slate-500 font-medium">
            FPG Reference Range: 70 - 99 mg/dL
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200">
            <div className="flex justify-between items-baseline mb-1.5">
              <label className="text-sm font-semibold text-slate-800">
                Fasting Plasma Glucose
              </label>
              <span className="text-sm font-mono font-bold text-slate-900">
                {record.glycemic.fastingGlucose}{' '}
                <span className="text-xs text-slate-500 font-normal">mg/dL</span>
              </span>
            </div>
            <input
              type="range"
              min="65"
              max="280"
              value={record.glycemic.fastingGlucose}
              onChange={(e) => updateGlycemic('fastingGlucose', Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
            />
            <div className="flex justify-between text-xs font-mono text-slate-500 mt-1">
              <span>70 (Normal)</span>
              <span>126 (Diabetic)</span>
              <span>280</span>
            </div>
          </div>

          <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200">
            <div className="flex justify-between items-baseline mb-1.5">
              <label className="text-sm font-semibold text-slate-800">
                Random Blood Glucose
              </label>
              <span className="text-sm font-mono font-bold text-slate-900">
                {record.glycemic.randomGlucose}{' '}
                <span className="text-xs text-slate-500 font-normal">mg/dL</span>
              </span>
            </div>
            <input
              type="range"
              min="70"
              max="350"
              value={record.glycemic.randomGlucose}
              onChange={(e) => updateGlycemic('randomGlucose', Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
            />
            <div className="flex justify-between text-xs font-mono text-slate-500 mt-1">
              <span>70</span>
              <span>140 (Normal)</span>
              <span>350</span>
            </div>
          </div>

          <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200">
            <div className="flex justify-between items-baseline mb-1.5">
              <label className="text-sm font-semibold text-slate-800">
                Serum Insulin
              </label>
              <span className="text-sm font-mono font-bold text-slate-900">
                {record.glycemic.serumInsulin}{' '}
                <span className="text-xs text-slate-500 font-normal">µU/mL</span>
              </span>
            </div>
            <input
              type="range"
              min="15"
              max="400"
              value={record.glycemic.serumInsulin}
              onChange={(e) => updateGlycemic('serumInsulin', Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
            />
            <div className="flex justify-between text-xs font-mono text-slate-500 mt-1">
              <span>16 (Normal)</span>
              <span>166</span>
              <span>400</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Triceps Skinfold Thickness
            </label>
            <div className="flex items-center">
              <input
                type="number"
                min="5"
                max="99"
                value={record.glycemic.skinThickness}
                onChange={(e) => updateGlycemic('skinThickness', Number(e.target.value) || 10)}
                className="w-full px-3 py-2 text-base font-mono border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
              <span className="text-xs text-slate-500 font-mono ml-2 font-medium">mm</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Diabetes Pedigree Score
            </label>
            <div className="flex items-center">
              <input
                type="number"
                step="0.01"
                min="0.05"
                max="2.5"
                value={record.glycemic.diabetesPedigree}
                onChange={(e) => updateGlycemic('diabetesPedigree', Number(e.target.value) || 0.1)}
                className="w-full px-3 py-2 text-base font-mono border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
              <span className="text-xs text-slate-500 font-mono ml-2 font-medium">score</span>
            </div>
          </div>
        </div>
      </div>

      {/* Renal & Urinalysis Panel */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-bold uppercase tracking-wider text-slate-900">
            Renal Function & Electrolytes
          </span>
          <span className="text-xs text-slate-500 font-medium">
            Creatinine Ref: 0.6 - 1.2 mg/dL
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200">
            <div className="flex justify-between items-baseline mb-1.5">
              <label className="text-sm font-semibold text-slate-800">
                Serum Creatinine
              </label>
              <span className="text-sm font-mono font-bold text-slate-900">
                {Number(record.renal.serumCreatinine).toFixed(2)}{' '}
                <span className="text-xs text-slate-500 font-normal">mg/dL</span>
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="5.0"
              step="0.05"
              value={record.renal.serumCreatinine}
              onChange={(e) => updateRenal('serumCreatinine', Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
            />
            <div className="flex justify-between text-xs font-mono text-slate-500 mt-1">
              <span>0.6 (Normal)</span>
              <span>1.2 (Upper Ref)</span>
              <span>5.0</span>
            </div>
          </div>

          <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200">
            <div className="flex justify-between items-baseline mb-1.5">
              <label className="text-sm font-semibold text-slate-800">
                Blood Urea Nitrogen (BUN)
              </label>
              <span className="text-sm font-mono font-bold text-slate-900">
                {record.renal.bloodUrea}{' '}
                <span className="text-xs text-slate-500 font-normal">mg/dL</span>
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="120"
              value={record.renal.bloodUrea}
              onChange={(e) => updateRenal('bloodUrea', Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
            />
            <div className="flex justify-between text-xs font-mono text-slate-500 mt-1">
              <span>7 (Normal)</span>
              <span>20</span>
              <span>120</span>
            </div>
          </div>

          <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200">
            <div className="flex justify-between items-baseline mb-1.5">
              <label className="text-sm font-semibold text-slate-800">
                Urine Albumin (Proteinuria)
              </label>
              <span className="text-sm font-mono font-bold text-slate-900">
                {record.urinalysis.urineAlbumin === 0 ? 'Negative (0)' : `${record.urinalysis.urineAlbumin}+`}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="5"
              step="1"
              value={record.urinalysis.urineAlbumin}
              onChange={(e) => updateUrinalysis('urineAlbumin', Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
            />
            <div className="flex justify-between text-xs font-mono text-slate-500 mt-1">
              <span>0 (Negative)</span>
              <span>1+ (Micro)</span>
              <span>4+ (Nephrotic)</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Serum Potassium (K⁺)
            </label>
            <div className="flex items-center">
              <input
                type="number"
                step="0.1"
                min="2.5"
                max="7.5"
                value={record.renal.potassium}
                onChange={(e) => updateRenal('potassium', Number(e.target.value) || 4.0)}
                className="w-full px-3 py-2 text-base font-mono border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
              <span className="text-xs text-slate-500 font-mono ml-2 font-medium">mEq/L</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Hemoglobin (Hgb)
            </label>
            <div className="flex items-center">
              <input
                type="number"
                step="0.1"
                min="5.0"
                max="20.0"
                value={record.renal.hemoglobin}
                onChange={(e) => updateRenal('hemoglobin', Number(e.target.value) || 12.0)}
                className="w-full px-3 py-2 text-base font-mono border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
              <span className="text-xs text-slate-500 font-mono ml-2 font-medium">g/dL</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Blood Pressure (Sys/Dia)
            </label>
            <div className="flex items-center gap-1.5 font-mono">
              <input
                type="number"
                min="70"
                max="220"
                value={record.renal.bloodPressureSystolic}
                onChange={(e) => updateRenal('bloodPressureSystolic', Number(e.target.value) || 120)}
                className="w-18 px-2 py-2 text-sm text-center border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
              <span className="text-slate-400 font-bold">/</span>
              <input
                type="number"
                min="40"
                max="140"
                value={record.renal.bloodPressureDiastolic}
                onChange={(e) => updateRenal('bloodPressureDiastolic', Number(e.target.value) || 80)}
                className="w-18 px-2 py-2 text-sm text-center border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Urine Specific Gravity
            </label>
            <input
              type="number"
              step="0.001"
              min="1.000"
              max="1.040"
              value={record.urinalysis.specificGravity}
              onChange={(e) => updateUrinalysis('specificGravity', Number(e.target.value) || 1.020)}
              className="w-full px-3 py-2 text-base font-mono border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
