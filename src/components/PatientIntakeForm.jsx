import React, { useState } from 'react';
import {
  Stethoscope,
  Activity,
  Heart,
  Droplets,
  AlertCircle,
  RotateCcw,
  FlaskConical,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';

export const PatientIntakeForm = ({
  record,
  onChange,
  onAnalyze,
  isLoading,
}) => {
  const [validationErrors, setValidationErrors] = useState({});

  // Helper updates for nested fields
  const updateDemographics = (key, val) => {
    onChange({
      ...record,
      demographics: { ...record.demographics, [key]: val },
    });
    clearError(`demographics.${key}`);
  };

  const updateGlycemic = (key, val) => {
    onChange({
      ...record,
      glycemic: { ...record.glycemic, [key]: val },
    });
    clearError(`glycemic.${key}`);
  };

  const updateRenal = (key, val) => {
    onChange({
      ...record,
      renal: { ...record.renal, [key]: val },
    });
    clearError(`renal.${key}`);
  };

  const updateUrinalysis = (key, val) => {
    onChange({
      ...record,
      urinalysis: { ...record.urinalysis, [key]: val },
    });
    clearError(`urinalysis.${key}`);
  };

  const clearError = (field) => {
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // Validate required inputs before sending to Python model
  const validateAndSubmit = (e) => {
    if (e) e.preventDefault();
    const errors = {};

    const age = Number(record.demographics?.age);
    if (!age || age < 18 || age > 110) {
      errors['demographics.age'] = 'Age must be between 18 and 110 years';
    }

    const bmi = Number(record.glycemic?.bmi);
    if (!bmi || bmi < 12 || bmi > 75) {
      errors['glycemic.bmi'] = 'BMI must be between 12.0 and 75.0 kg/m²';
    }

    const fpg = Number(record.glycemic?.fastingGlucose);
    if (!fpg || fpg < 40 || fpg > 400) {
      errors['glycemic.fastingGlucose'] = 'Fasting glucose must be between 40 and 400 mg/dL';
    }

    const rglu = Number(record.glycemic?.randomGlucose);
    if (!rglu || rglu < 40 || rglu > 450) {
      errors['glycemic.randomGlucose'] = 'Random glucose must be between 40 and 450 mg/dL';
    }

    const scr = Number(record.renal?.serumCreatinine);
    if (!scr || scr < 0.2 || scr > 25.0) {
      errors['renal.serumCreatinine'] = 'Serum creatinine must be between 0.20 and 25.0 mg/dL';
    }

    const bun = Number(record.renal?.bloodUrea);
    if (!bun || bun < 5 || bun > 250) {
      errors['renal.bloodUrea'] = 'BUN must be between 5 and 250 mg/dL';
    }

    const sys = Number(record.renal?.bloodPressureSystolic);
    if (!sys || sys < 70 || sys > 240) {
      errors['renal.bloodPressureSystolic'] = 'Systolic BP must be between 70 and 240 mm Hg';
    }

    const dia = Number(record.renal?.bloodPressureDiastolic);
    if (!dia || dia < 40 || dia > 140) {
      errors['renal.bloodPressureDiastolic'] = 'Diastolic BP must be between 40 and 140 mm Hg';
    }

    const pot = Number(record.renal?.potassium);
    if (!pot || pot < 2.0 || pot > 9.0) {
      errors['renal.potassium'] = 'Potassium must be between 2.0 and 9.0 mEq/L';
    }

    setValidationErrors(errors);

    if (Object.keys(errors).length === 0) {
      onAnalyze(record);
    }
  };

  const loadDefaultPatient = () => {
    onChange({
      demographics: {
        mrn: `MRN-${Math.floor(10000 + Math.random() * 90000)}`,
        age: 56,
        gender: 'female',
        pregnancies: 2,
      },
      glycemic: {
        fastingGlucose: 134,
        randomGlucose: 178,
        serumInsulin: 125,
        bmi: 31.8,
        skinThickness: 30,
        diabetesPedigree: 0.58,
      },
      renal: {
        serumCreatinine: 1.55,
        bloodUrea: 52,
        potassium: 4.8,
        sodium: 138,
        hemoglobin: 11.8,
        bloodPressureSystolic: 142,
        bloodPressureDiastolic: 88,
      },
      urinalysis: {
        urineAlbumin: 2,
        specificGravity: 1.018,
      },
    });
    setValidationErrors({});
  };

  const resetForm = () => {
    onChange({
      demographics: {
        mrn: `MRN-${Math.floor(10000 + Math.random() * 90000)}`,
        age: 45,
        gender: 'male',
        pregnancies: 0,
      },
      glycemic: {
        fastingGlucose: 95,
        randomGlucose: 120,
        serumInsulin: 75,
        bmi: 24.5,
        skinThickness: 20,
        diabetesPedigree: 0.32,
      },
      renal: {
        serumCreatinine: 0.95,
        bloodUrea: 16,
        potassium: 4.2,
        sodium: 140,
        hemoglobin: 14.5,
        bloodPressureSystolic: 118,
        bloodPressureDiastolic: 76,
      },
      urinalysis: {
        urineAlbumin: 0,
        specificGravity: 1.020,
      },
    });
    setValidationErrors({});
  };

  return (
    <form
      onSubmit={validateAndSubmit}
      className="bg-white rounded-xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden"
    >
      {/* Form Header */}
      <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold tracking-tight text-white">
              Clinical Parameter Intake Form
            </h2>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Directly input the patient&apos;s physiological biomarkers to compute dual-organ cardiorenal and metabolic risk.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadDefaultPatient}
            className="px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
            title="Load realistic sample clinical data"
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Load Sample Data</span>
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="px-2.5 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
            title="Reset to baseline values"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Group 1: Demographics & Vital Signs */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500" />
            1. Demographics & Baseline Vitals
          </span>
          <span className="text-xs font-mono text-slate-500 font-semibold bg-slate-100 px-2 py-0.5 rounded">
            MRN: {record.demographics?.mrn || 'N/A'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Patient Age */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Patient Age <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                min="18"
                max="110"
                step="1"
                value={record.demographics?.age ?? ''}
                onChange={(e) => updateDemographics('age', e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="e.g. 52"
                className={`w-full px-3 py-2 text-sm font-mono border rounded-lg bg-white focus:outline-none focus:ring-2 ${
                  validationErrors['demographics.age']
                    ? 'border-rose-400 focus:ring-rose-500 bg-rose-50/30'
                    : 'border-slate-300 focus:ring-slate-900'
                }`}
              />
              <span className="absolute right-3 top-2 text-xs text-slate-400 font-mono">yrs</span>
            </div>
            {validationErrors['demographics.age'] && (
              <span className="text-[11px] text-rose-600 mt-1 block">
                {validationErrors['demographics.age']}
              </span>
            )}
          </div>

          {/* Biological Sex */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Biological Sex <span className="text-rose-500">*</span>
            </label>
            <select
              value={record.demographics?.gender || 'female'}
              onChange={(e) => updateDemographics('gender', e.target.value)}
              className="w-full px-3 py-2 text-sm font-medium border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
            </select>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Used in 2021 CKD-EPI eGFR</span>
          </div>

          {/* BMI */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Body Mass Index (BMI) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                min="12.0"
                max="75.0"
                value={record.glycemic?.bmi ?? ''}
                onChange={(e) => updateGlycemic('bmi', e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="e.g. 28.4"
                className={`w-full px-3 py-2 text-sm font-mono border rounded-lg bg-white focus:outline-none focus:ring-2 ${
                  validationErrors['glycemic.bmi']
                    ? 'border-rose-400 focus:ring-rose-500 bg-rose-50/30'
                    : 'border-slate-300 focus:ring-slate-900'
                }`}
              />
              <span className="absolute right-3 top-2 text-xs text-slate-400 font-mono">kg/m²</span>
            </div>
            {validationErrors['glycemic.bmi'] && (
              <span className="text-[11px] text-rose-600 mt-1 block">
                {validationErrors['glycemic.bmi']}
              </span>
            )}
          </div>

          {/* Blood Pressure */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Blood Pressure (Sys / Dia) <span className="text-rose-500">*</span>
            </label>
            <div className="flex items-center gap-1.5 font-mono">
              <input
                type="number"
                min="70"
                max="240"
                step="1"
                value={record.renal?.bloodPressureSystolic ?? ''}
                onChange={(e) => updateRenal('bloodPressureSystolic', e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Sys"
                className={`w-1/2 px-2.5 py-2 text-sm text-center border rounded-lg bg-white focus:outline-none focus:ring-2 ${
                  validationErrors['renal.bloodPressureSystolic']
                    ? 'border-rose-400 focus:ring-rose-500'
                    : 'border-slate-300 focus:ring-slate-900'
                }`}
                title="Systolic blood pressure in mm Hg"
              />
              <span className="text-slate-400 font-bold">/</span>
              <input
                type="number"
                min="40"
                max="140"
                step="1"
                value={record.renal?.bloodPressureDiastolic ?? ''}
                onChange={(e) => updateRenal('bloodPressureDiastolic', e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Dia"
                className={`w-1/2 px-2.5 py-2 text-sm text-center border rounded-lg bg-white focus:outline-none focus:ring-2 ${
                  validationErrors['renal.bloodPressureDiastolic']
                    ? 'border-rose-400 focus:ring-rose-500'
                    : 'border-slate-300 focus:ring-slate-900'
                }`}
                title="Diastolic blood pressure in mm Hg"
              />
            </div>
            <span className="text-[10px] text-slate-500 mt-0.5 block text-center">mm Hg (Normal &lt; 120/80)</span>
          </div>
        </div>

        {/* Secondary Demographics row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3 pt-3 border-t border-slate-100">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Prior Pregnancies (if applicable)
            </label>
            <input
              type="number"
              min="0"
              max="20"
              step="1"
              value={record.demographics?.pregnancies ?? 0}
              onChange={(e) => updateDemographics('pregnancies', Number(e.target.value) || 0)}
              className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
            <span className="text-[10px] text-slate-500 mt-0.5 block">Gestational factor for metabolic models</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Triceps Skinfold Thickness
            </label>
            <div className="relative">
              <input
                type="number"
                min="5"
                max="99"
                step="1"
                value={record.glycemic?.skinThickness ?? 25}
                onChange={(e) => updateGlycemic('skinThickness', Number(e.target.value) || 20)}
                className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
              <span className="absolute right-3 top-2 text-xs text-slate-400 font-mono">mm</span>
            </div>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Adiposity index (median: 29 mm)</span>
          </div>
        </div>
      </div>

      {/* Group 2: Glycemic & Metabolic Biomarkers */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-500" />
            2. Glycemic & Metabolic Panel
          </span>
          <span className="text-xs text-slate-500 font-medium">
            FPG Reference Range: 70 - 99 mg/dL
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Fasting Glucose */}
          <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200">
            <div className="flex justify-between items-baseline mb-1">
              <label className="text-xs font-semibold text-slate-800">
                Fasting Plasma Glucose (FPG) <span className="text-rose-500">*</span>
              </label>
              <span className="text-xs font-mono font-bold text-slate-900">
                {record.glycemic?.fastingGlucose ?? '--'} mg/dL
              </span>
            </div>
            <input
              type="number"
              min="40"
              max="400"
              step="1"
              value={record.glycemic?.fastingGlucose ?? ''}
              onChange={(e) => updateGlycemic('fastingGlucose', e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="e.g. 105"
              className={`w-full px-3 py-2 text-sm font-mono border rounded-lg bg-white focus:outline-none focus:ring-2 ${
                validationErrors['glycemic.fastingGlucose']
                  ? 'border-rose-400 focus:ring-rose-500'
                  : 'border-slate-300 focus:ring-slate-900'
              }`}
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1.5">
              <span className="text-emerald-700 font-medium">&lt; 100 Normal</span>
              <span className="text-amber-700 font-medium">100-125 Prediabetes</span>
              <span className="text-rose-700 font-medium">≥ 126 Diabetes</span>
            </div>
            {validationErrors['glycemic.fastingGlucose'] && (
              <span className="text-[11px] text-rose-600 mt-1 block">
                {validationErrors['glycemic.fastingGlucose']}
              </span>
            )}
          </div>

          {/* Random Blood Glucose */}
          <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200">
            <div className="flex justify-between items-baseline mb-1">
              <label className="text-xs font-semibold text-slate-800">
                Random Blood Glucose <span className="text-rose-500">*</span>
              </label>
              <span className="text-xs font-mono font-bold text-slate-900">
                {record.glycemic?.randomGlucose ?? '--'} mg/dL
              </span>
            </div>
            <input
              type="number"
              min="40"
              max="450"
              step="1"
              value={record.glycemic?.randomGlucose ?? ''}
              onChange={(e) => updateGlycemic('randomGlucose', e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="e.g. 140"
              className={`w-full px-3 py-2 text-sm font-mono border rounded-lg bg-white focus:outline-none focus:ring-2 ${
                validationErrors['glycemic.randomGlucose']
                  ? 'border-rose-400 focus:ring-rose-500'
                  : 'border-slate-300 focus:ring-slate-900'
              }`}
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1.5">
              <span className="text-emerald-700 font-medium">&lt; 140 Normal</span>
              <span className="text-rose-700 font-medium">≥ 200 Hyperglycemic</span>
            </div>
            {validationErrors['glycemic.randomGlucose'] && (
              <span className="text-[11px] text-rose-600 mt-1 block">
                {validationErrors['glycemic.randomGlucose']}
              </span>
            )}
          </div>

          {/* Serum Insulin */}
          <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200">
            <div className="flex justify-between items-baseline mb-1">
              <label className="text-xs font-semibold text-slate-800">
                Fasting Serum Insulin
              </label>
              <span className="text-xs font-mono font-bold text-slate-900">
                {record.glycemic?.serumInsulin ?? '--'} µU/mL
              </span>
            </div>
            <input
              type="number"
              min="5"
              max="900"
              step="1"
              value={record.glycemic?.serumInsulin ?? ''}
              onChange={(e) => updateGlycemic('serumInsulin', e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="e.g. 85"
              className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1.5">
              <span>Ref: 16 - 166 µU/mL</span>
              <span className="text-amber-700">&gt; 166 Hyperinsulinemia</span>
            </div>
          </div>
        </div>

        {/* Diabetes Pedigree Function */}
        <div className="mt-3 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              Diabetes Pedigree Function (Genetic Susceptibility)
              <span className="text-slate-400" title="Coefficient based on family history of diabetes">
                <HelpCircle className="w-3.5 h-3.5" />
              </span>
            </label>
            <span className="text-xs font-mono font-bold text-slate-800">
              Score: {Number(record.glycemic?.diabetesPedigree || 0.35).toFixed(2)}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="0.05"
              max="2.50"
              step="0.01"
              value={record.glycemic?.diabetesPedigree ?? 0.35}
              onChange={(e) => updateGlycemic('diabetesPedigree', Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
            />
            <input
              type="number"
              step="0.01"
              min="0.05"
              max="2.50"
              value={record.glycemic?.diabetesPedigree ?? 0.35}
              onChange={(e) => updateGlycemic('diabetesPedigree', Number(e.target.value) || 0.1)}
              className="w-20 px-2 py-1 text-xs font-mono text-center border border-slate-300 rounded-lg bg-white"
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
            <span>0.05 (No family history)</span>
            <span>0.37 (Population median)</span>
            <span>2.50 (High multi-generational risk)</span>
          </div>
        </div>
      </div>

      {/* Group 3: Renal Function & Electrolytes */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <Droplets className="w-4 h-4 text-cyan-600" />
            3. Renal Function & Electrolytes
          </span>
          <span className="text-xs text-slate-500 font-medium">
            Creatinine Ref: 0.60 - 1.20 mg/dL
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Serum Creatinine */}
          <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200">
            <div className="flex justify-between items-baseline mb-1">
              <label className="text-xs font-semibold text-slate-800">
                Serum Creatinine (sCr) <span className="text-rose-500">*</span>
              </label>
              <span className="text-xs font-mono font-bold text-slate-900">
                {Number(record.renal?.serumCreatinine || 0).toFixed(2)} mg/dL
              </span>
            </div>
            <input
              type="number"
              step="0.01"
              min="0.20"
              max="25.0"
              value={record.renal?.serumCreatinine ?? ''}
              onChange={(e) => updateRenal('serumCreatinine', e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="e.g. 1.10"
              className={`w-full px-3 py-2 text-sm font-mono border rounded-lg bg-white focus:outline-none focus:ring-2 ${
                validationErrors['renal.serumCreatinine']
                  ? 'border-rose-400 focus:ring-rose-500'
                  : 'border-slate-300 focus:ring-slate-900'
              }`}
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1.5">
              <span>0.6 - 1.2 Normal</span>
              <span className="text-rose-700 font-medium">&gt; 1.3 Nephron decline</span>
            </div>
            {validationErrors['renal.serumCreatinine'] && (
              <span className="text-[11px] text-rose-600 mt-1 block">
                {validationErrors['renal.serumCreatinine']}
              </span>
            )}
          </div>

          {/* Blood Urea Nitrogen (BUN) */}
          <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200">
            <div className="flex justify-between items-baseline mb-1">
              <label className="text-xs font-semibold text-slate-800">
                Blood Urea Nitrogen (BUN) <span className="text-rose-500">*</span>
              </label>
              <span className="text-xs font-mono font-bold text-slate-900">
                {record.renal?.bloodUrea ?? '--'} mg/dL
              </span>
            </div>
            <input
              type="number"
              min="5"
              max="250"
              step="1"
              value={record.renal?.bloodUrea ?? ''}
              onChange={(e) => updateRenal('bloodUrea', e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="e.g. 25"
              className={`w-full px-3 py-2 text-sm font-mono border rounded-lg bg-white focus:outline-none focus:ring-2 ${
                validationErrors['renal.bloodUrea']
                  ? 'border-rose-400 focus:ring-rose-500'
                  : 'border-slate-300 focus:ring-slate-900'
              }`}
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1.5">
              <span>7 - 20 Normal</span>
              <span className="text-rose-700 font-medium">&gt; 25 Azotemia</span>
            </div>
            {validationErrors['renal.bloodUrea'] && (
              <span className="text-[11px] text-rose-600 mt-1 block">
                {validationErrors['renal.bloodUrea']}
              </span>
            )}
          </div>

          {/* Serum Potassium */}
          <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200">
            <div className="flex justify-between items-baseline mb-1">
              <label className="text-xs font-semibold text-slate-800">
                Serum Potassium (K⁺) <span className="text-rose-500">*</span>
              </label>
              <span className="text-xs font-mono font-bold text-slate-900">
                {Number(record.renal?.potassium || 0).toFixed(1)} mEq/L
              </span>
            </div>
            <input
              type="number"
              step="0.1"
              min="2.0"
              max="9.0"
              value={record.renal?.potassium ?? ''}
              onChange={(e) => updateRenal('potassium', e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="e.g. 4.2"
              className={`w-full px-3 py-2 text-sm font-mono border rounded-lg bg-white focus:outline-none focus:ring-2 ${
                validationErrors['renal.potassium']
                  ? 'border-rose-400 focus:ring-rose-500'
                  : 'border-slate-300 focus:ring-slate-900'
              }`}
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1.5">
              <span>3.5 - 5.0 Normal</span>
              <span className="text-rose-700 font-medium">&gt; 5.1 Hyperkalemia</span>
            </div>
            {validationErrors['renal.potassium'] && (
              <span className="text-[11px] text-rose-600 mt-1 block">
                {validationErrors['renal.potassium']}
              </span>
            )}
          </div>
        </div>

        {/* Secondary Electrolytes & Hematology */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3 pt-3 border-t border-slate-100">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Serum Sodium (Na⁺)
            </label>
            <div className="relative">
              <input
                type="number"
                min="100"
                max="170"
                step="1"
                value={record.renal?.sodium ?? 138}
                onChange={(e) => updateRenal('sodium', Number(e.target.value) || 138)}
                className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
              <span className="absolute right-3 top-2 text-xs text-slate-400 font-mono">mEq/L</span>
            </div>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Reference range: 135 - 145 mEq/L</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Blood Hemoglobin (Hgb)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                min="4.0"
                max="22.0"
                value={record.renal?.hemoglobin ?? 13.0}
                onChange={(e) => updateRenal('hemoglobin', Number(e.target.value) || 12.0)}
                className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
              <span className="absolute right-3 top-2 text-xs text-slate-400 font-mono">g/dL</span>
            </div>
            <span className="text-[10px] text-slate-500 mt-0.5 block">CKD anemia threshold &lt; 12.0 g/dL</span>
          </div>
        </div>
      </div>

      {/* Group 4: Urinalysis & Proteinuria */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-emerald-600" />
            4. Urinalysis & Glomerular Barrier Integrity
          </span>
          <span className="text-xs text-slate-500 font-medium">
            Dipstick Albumin: 0 (Negative) - 4+ (Nephrotic)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Urine Albumin */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1.5">
              Urine Albumin (Proteinuria Dipstick) <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {[
                { val: 0, label: '0', sub: 'Negative' },
                { val: 1, label: '1+', sub: 'Trace' },
                { val: 2, label: '2+', sub: 'Moderate' },
                { val: 3, label: '3+', sub: 'Severe' },
                { val: 4, label: '4+', sub: 'Nephrotic' },
              ].map((opt) => {
                const isSelected = (record.urinalysis?.urineAlbumin ?? 0) === opt.val;
                return (
                  <button
                    key={opt.val}
                    type="button"
                    onClick={() => updateUrinalysis('urineAlbumin', opt.val)}
                    className={`py-2 px-1 text-center rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 border-slate-900 text-white font-bold shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-sm font-mono">{opt.label}</div>
                    <div className={`text-[10px] ${isSelected ? 'text-cyan-300' : 'text-slate-500'}`}>
                      {opt.sub}
                    </div>
                  </button>
                );
              })}
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">
              Glomerular hyperfiltration / microvascular leak marker
            </span>
          </div>

          {/* Specific Gravity */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1.5">
              Urine Specific Gravity (Density)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.001"
                min="1.000"
                max="1.040"
                value={record.urinalysis?.specificGravity ?? 1.020}
                onChange={(e) => updateUrinalysis('specificGravity', Number(e.target.value) || 1.020)}
                className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
              <span className="absolute right-3 top-2 text-xs text-slate-400 font-mono">density</span>
            </div>
            <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1.5">
              <span>1.010 (Dilute)</span>
              <span>1.020 (Normal)</span>
              <span>1.035 (Concentrated)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Validation Feedback & Prediction Action Button */}
      <div className="p-5 bg-slate-50/90 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-slate-600">
          {Object.keys(validationErrors).length > 0 ? (
            <div className="flex items-center gap-1.5 text-rose-600 font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Please resolve {Object.keys(validationErrors).length} invalid or missing value(s) before analyzing.</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Clinical biomarker panel is complete and ready for assessment.</span>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm text-white shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
            isLoading
              ? 'bg-slate-400 cursor-not-allowed'
              : 'bg-cyan-600 hover:bg-cyan-700 active:scale-[0.98]'
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Analyzing Clinical Data...</span>
            </>
          ) : (
            <>
              <Activity className="w-4.5 h-4.5" />
              <span>Analyze Clinical Data</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
