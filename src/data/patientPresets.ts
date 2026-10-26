/**
 * Clinical patient presets representing classic diagnostic phenotypes and edge cases.
 */

import { ClinicalPatientRecord, HistoricalVisit } from '../types/clinical';

export interface PatientPreset {
  id: string;
  name: string;
  badge: string;
  description: string;
  record: ClinicalPatientRecord;
  history: HistoricalVisit[];
}

export const CLINICAL_PRESETS: PatientPreset[] = [
  {
    id: 'silent-nephropathy',
    name: 'Silent Diabetic Nephropathy (Early Synergistic)',
    badge: 'High Synergistic Risk',
    description: 'Borderline fasting plasma glucose and mild creatinine elevation with early microalbuminuria. Frequently overlooked by single-threshold screening.',
    record: {
      demographics: {
        mrn: 'MRN-2026-8491',
        name: 'Eleanor Vance',
        age: 56,
        gender: 'female',
        pregnancies: 2,
      },
      glycemic: {
        fastingGlucose: 138,
        randomGlucose: 168,
        serumInsulin: 164,
        bmi: 31.8,
        skinThickness: 33,
        diabetesPedigree: 0.64,
      },
      renal: {
        serumCreatinine: 1.38,
        bloodUrea: 38,
        sodium: 137,
        potassium: 4.7,
        hemoglobin: 12.1,
        packedCellVolume: 36,
        whiteBloodCellCount: 7800,
        bloodPressureSystolic: 138,
        bloodPressureDiastolic: 86,
      },
      urinalysis: {
        specificGravity: 1.015,
        urineAlbumin: 2,
        urineSugar: 1,
      },
    },
    history: [
      { visitDate: '18 Mos Ago', fastingGlucose: 112, serumCreatinine: 0.95, eGfr: 78, t2dRisk: 0.38, ckdRisk: 0.22 },
      { visitDate: '12 Mos Ago', fastingGlucose: 124, serumCreatinine: 1.10, eGfr: 68, t2dRisk: 0.52, ckdRisk: 0.44 },
      { visitDate: '6 Mos Ago',  fastingGlucose: 132, serumCreatinine: 1.25, eGfr: 61, t2dRisk: 0.61, ckdRisk: 0.63 },
      { visitDate: 'Current',    fastingGlucose: 138, serumCreatinine: 1.38, eGfr: 54, t2dRisk: 0.69, ckdRisk: 0.74 },
    ],
  },
  {
    id: 'healthy-control',
    name: 'Normoglycemic & Preserved Renal Function',
    badge: 'Low Risk Baseline',
    description: 'Biomarkers well within physiologic reference ranges. Ideal reference point for baseline TreeSHAP attributions.',
    record: {
      demographics: {
        mrn: 'MRN-2026-1042',
        name: 'Marcus Chen',
        age: 38,
        gender: 'male',
        pregnancies: 0,
      },
      glycemic: {
        fastingGlucose: 88,
        randomGlucose: 110,
        serumInsulin: 55,
        bmi: 23.4,
        skinThickness: 20,
        diabetesPedigree: 0.22,
      },
      renal: {
        serumCreatinine: 0.88,
        bloodUrea: 14,
        sodium: 141,
        potassium: 4.2,
        hemoglobin: 15.2,
        packedCellVolume: 44,
        whiteBloodCellCount: 6200,
        bloodPressureSystolic: 116,
        bloodPressureDiastolic: 74,
      },
      urinalysis: {
        specificGravity: 1.022,
        urineAlbumin: 0,
        urineSugar: 0,
      },
    },
    history: [
      { visitDate: '18 Mos Ago', fastingGlucose: 86, serumCreatinine: 0.86, eGfr: 106, t2dRisk: 0.08, ckdRisk: 0.06 },
      { visitDate: '12 Mos Ago', fastingGlucose: 89, serumCreatinine: 0.87, eGfr: 105, t2dRisk: 0.09, ckdRisk: 0.07 },
      { visitDate: '6 Mos Ago',  fastingGlucose: 87, serumCreatinine: 0.89, eGfr: 104, t2dRisk: 0.09, ckdRisk: 0.08 },
      { visitDate: 'Current',    fastingGlucose: 88, serumCreatinine: 0.88, eGfr: 105, t2dRisk: 0.09, ckdRisk: 0.07 },
    ],
  },
  {
    id: 'early-prediabetes',
    name: 'Early Metabolic Impairment (Isolated Glycemic)',
    badge: 'Moderate T2D / Normal CKD',
    description: 'Elevated fasting glucose, insulin resistance, and elevated BMI, but preserved renal glomerular filtration with zero proteinuria.',
    record: {
      demographics: {
        mrn: 'MRN-2026-3190',
        name: 'Sofia Rodriguez',
        age: 47,
        gender: 'female',
        pregnancies: 3,
      },
      glycemic: {
        fastingGlucose: 122,
        randomGlucose: 154,
        serumInsulin: 142,
        bmi: 32.4,
        skinThickness: 34,
        diabetesPedigree: 0.58,
      },
      renal: {
        serumCreatinine: 0.82,
        bloodUrea: 18,
        sodium: 139,
        potassium: 4.3,
        hemoglobin: 13.4,
        packedCellVolume: 40,
        whiteBloodCellCount: 7100,
        bloodPressureSystolic: 126,
        bloodPressureDiastolic: 80,
      },
      urinalysis: {
        specificGravity: 1.020,
        urineAlbumin: 0,
        urineSugar: 0,
      },
    },
    history: [
      { visitDate: '18 Mos Ago', fastingGlucose: 104, serumCreatinine: 0.80, eGfr: 96, t2dRisk: 0.32, ckdRisk: 0.09 },
      { visitDate: '12 Mos Ago', fastingGlucose: 112, serumCreatinine: 0.81, eGfr: 95, t2dRisk: 0.44, ckdRisk: 0.10 },
      { visitDate: '6 Mos Ago',  fastingGlucose: 118, serumCreatinine: 0.82, eGfr: 94, t2dRisk: 0.53, ckdRisk: 0.11 },
      { visitDate: 'Current',    fastingGlucose: 122, serumCreatinine: 0.82, eGfr: 94, t2dRisk: 0.58, ckdRisk: 0.12 },
    ],
  },
  {
    id: 'advanced-cardiorenal',
    name: 'Advanced Cardiorenal Diabetic Glomerulosclerosis',
    badge: 'Critical Dual Disease',
    description: 'Marked fasting hyperglycemia combined with stage G4 CKD, overt proteinuria, hyperkalemia, and secondary renal anemia.',
    record: {
      demographics: {
        mrn: 'MRN-2026-9904',
        name: 'Harold Jenkins',
        age: 67,
        gender: 'male',
        pregnancies: 0,
      },
      glycemic: {
        fastingGlucose: 215,
        randomGlucose: 260,
        serumInsulin: 210,
        bmi: 34.8,
        skinThickness: 38,
        diabetesPedigree: 0.85,
      },
      renal: {
        serumCreatinine: 2.85,
        bloodUrea: 68,
        sodium: 133,
        potassium: 5.4,
        hemoglobin: 9.8,
        packedCellVolume: 29,
        whiteBloodCellCount: 9600,
        bloodPressureSystolic: 158,
        bloodPressureDiastolic: 94,
      },
      urinalysis: {
        specificGravity: 1.010,
        urineAlbumin: 4,
        urineSugar: 3,
      },
    },
    history: [
      { visitDate: '18 Mos Ago', fastingGlucose: 160, serumCreatinine: 1.65, eGfr: 44, t2dRisk: 0.74, ckdRisk: 0.62 },
      { visitDate: '12 Mos Ago', fastingGlucose: 180, serumCreatinine: 2.10, eGfr: 33, t2dRisk: 0.82, ckdRisk: 0.78 },
      { visitDate: '6 Mos Ago',  fastingGlucose: 198, serumCreatinine: 2.45, eGfr: 27, t2dRisk: 0.88, ckdRisk: 0.87 },
      { visitDate: 'Current',    fastingGlucose: 215, serumCreatinine: 2.85, eGfr: 22, t2dRisk: 0.94, ckdRisk: 0.95 },
    ],
  },
  {
    id: 'isolated-ckd',
    name: 'Isolated Hypertensive Nephropathy (Non-Diabetic)',
    badge: 'High CKD / Low T2D',
    description: 'Normal blood glucose regulation but substantial renal dysfunction secondary to chronic hypertension and vascular sclerosis.',
    record: {
      demographics: {
        mrn: 'MRN-2026-5521',
        name: 'David O’Connor',
        age: 72,
        gender: 'male',
        pregnancies: 0,
      },
      glycemic: {
        fastingGlucose: 92,
        randomGlucose: 118,
        serumInsulin: 48,
        bmi: 24.2,
        skinThickness: 18,
        diabetesPedigree: 0.19,
      },
      renal: {
        serumCreatinine: 2.15,
        bloodUrea: 52,
        sodium: 135,
        potassium: 4.9,
        hemoglobin: 11.0,
        packedCellVolume: 33,
        whiteBloodCellCount: 8200,
        bloodPressureSystolic: 162,
        bloodPressureDiastolic: 92,
      },
      urinalysis: {
        specificGravity: 1.012,
        urineAlbumin: 2,
        urineSugar: 0,
      },
    },
    history: [
      { visitDate: '18 Mos Ago', fastingGlucose: 90, serumCreatinine: 1.45, eGfr: 51, t2dRisk: 0.11, ckdRisk: 0.54 },
      { visitDate: '12 Mos Ago', fastingGlucose: 91, serumCreatinine: 1.70, eGfr: 42, t2dRisk: 0.12, ckdRisk: 0.68 },
      { visitDate: '6 Mos Ago',  fastingGlucose: 93, serumCreatinine: 1.95, eGfr: 35, t2dRisk: 0.12, ckdRisk: 0.77 },
      { visitDate: 'Current',    fastingGlucose: 92, serumCreatinine: 2.15, eGfr: 31, t2dRisk: 0.12, ckdRisk: 0.85 },
    ],
  },
];
