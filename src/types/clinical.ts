/**
 * Clinical data structures and API contract interfaces for RenalGlyco AI
 */

export type Gender = 'male' | 'female' | 'other';

export interface PatientDemographics {
  mrn: string;
  name: string;
  age: number;
  gender: Gender;
  pregnancies: number;
}

export interface GlycemicBiomarkers {
  fastingGlucose: number;      // mg/dL (Normal: 70 - 99)
  randomGlucose: number;       // mg/dL (Normal: < 140)
  serumInsulin: number;        // mu U/mL (Normal: 16 - 166)
  bmi: number;                 // kg/m^2 (Normal: 18.5 - 24.9)
  skinThickness: number;       // mm (Triceps, Normal: 10 - 50)
  diabetesPedigree: number;    // Linear score 0.08 - 2.42
}

export interface RenalBiomarkers {
  serumCreatinine: number;     // mg/dL (Normal: 0.6 - 1.2)
  bloodUrea: number;           // mg/dL (BUN, Normal: 7 - 20)
  sodium: number;              // mEq/L (Normal: 135 - 145)
  potassium: number;           // mEq/L (Normal: 3.5 - 5.0)
  hemoglobin: number;          // g/dL (Normal: 12.0 - 17.5)
  packedCellVolume: number;    // % (Hematocrit, Normal: 36 - 50)
  whiteBloodCellCount: number; // cells/cumm (Normal: 4000 - 11000)
  bloodPressureSystolic: number; // mm Hg (Normal: < 120)
  bloodPressureDiastolic: number;// mm Hg (Normal: < 80)
}

export interface UrinalysisBiomarkers {
  specificGravity: number;     // 1.005 - 1.030 (Normal: 1.010 - 1.025)
  urineAlbumin: number;        // 0 to 5 scale (0 = negative, 1 = trace, 2 = 1+, 3 = 2+, 4 = 3+, 5 = 4+)
  urineSugar: number;          // 0 to 5 scale (0 = negative)
}

export interface ClinicalPatientRecord {
  demographics: PatientDemographics;
  glycemic: GlycemicBiomarkers;
  renal: RenalBiomarkers;
  urinalysis: UrinalysisBiomarkers;
}

export type RiskLevel = 'Low' | 'Moderate' | 'High' | 'Critical';

export interface ShapImpact {
  feature: string;
  clinicalName: string;
  value: number;
  unit: string;
  shapImpact: number; // Positive = increases risk, Negative = decreases risk
  normalRange: string;
}

export interface SingleDiseasePrediction {
  disease: string;
  riskProbability: number;     // 0.00 to 1.00
  riskCategory: RiskLevel;
  baseValue: number;           // Cohort E[f(x)]
  topRiskDrivers: ShapImpact[];
  protectiveFactors: ShapImpact[];
}

export interface MultiRiskPredictionResponse {
  status: 'success' | 'error';
  assessmentId: string;
  timestamp: string;
  patientId: string;
  mrn: string;
  eGfr: number;
  kdigoStage: string;
  glycemicStatus: string;
  predictions: {
    diabetes: SingleDiseasePrediction;
    chronicKidneyDisease: SingleDiseasePrediction;
  };
  clinicalAlerts: string[];
  executionTimeMs: number;
}

export interface HistoricalVisit {
  visitDate: string;
  fastingGlucose: number;
  serumCreatinine: number;
  eGfr: number;
  t2dRisk: number;
  ckdRisk: number;
}
