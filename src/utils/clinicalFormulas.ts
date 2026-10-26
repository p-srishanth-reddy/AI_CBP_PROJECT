/**
 * Evidence-based clinical formulas and staging algorithms
 * Includes 2021 CKD-EPI race-free equation and KDIGO 2024 staging guidelines.
 */

import { Gender, RiskLevel } from '../types/clinical';

/**
 * Calculates Estimated Glomerular Filtration Rate (eGFR) using the 2021 CKD-EPI
 * Creatinine Equation (Ref: Inker LA et al., NEJM 2021; 385:1737-1749).
 * eGFR = 142 * min(Scr/kappa, 1)^alpha * max(Scr/kappa, 1)^-1.200 * 0.9938^Age * (1.012 if female)
 */
export function calculateEgfr(serumCreatinine: number, age: number, gender: Gender): number {
  if (serumCreatinine <= 0 || age <= 0) return 90;

  const isFemale = gender === 'female';
  const kappa = isFemale ? 0.7 : 0.9;
  const alpha = isFemale ? -0.241 : -0.302;
  const sexMultiplier = isFemale ? 1.012 : 1.0;

  const scrOverKappa = serumCreatinine / kappa;
  const term1 = Math.pow(Math.min(scrOverKappa, 1.0), alpha);
  const term2 = Math.pow(Math.max(scrOverKappa, 1.0), -1.200);
  const term3 = Math.pow(0.9938, age);

  const egfr = 142 * term1 * term2 * term3 * sexMultiplier;
  return Math.round(egfr * 10) / 10;
}

/**
 * Determines KDIGO 2024 Chronic Kidney Disease Stage based on eGFR
 */
export function getKdigoStage(egfr: number): {
  stage: string;
  description: string;
  severity: 'normal' | 'mild' | 'moderate' | 'severe' | 'failure';
} {
  if (egfr >= 90) {
    return { stage: 'G1', description: 'Normal or High Function (eGFR ≥ 90)', severity: 'normal' };
  } else if (egfr >= 60) {
    return { stage: 'G2', description: 'Mildly Decreased (eGFR 60 - 89)', severity: 'mild' };
  } else if (egfr >= 45) {
    return { stage: 'G3a', description: 'Mild-to-Moderate Reduction (eGFR 45 - 59)', severity: 'moderate' };
  } else if (egfr >= 30) {
    return { stage: 'G3b', description: 'Moderate-to-Severe Reduction (eGFR 30 - 44)', severity: 'severe' };
  } else if (egfr >= 15) {
    return { stage: 'G4', description: 'Severely Decreased Function (eGFR 15 - 29)', severity: 'severe' };
  } else {
    return { stage: 'G5', description: 'Kidney Failure (eGFR < 15)', severity: 'failure' };
  }
}

/**
 * Categorizes Fasting Glycemic Status based on American Diabetes Association (ADA 2024)
 */
export function getGlycemicStatus(fastingGlucose: number): {
  status: string;
  category: 'normal' | 'prediabetes' | 'diabetes';
} {
  if (fastingGlucose < 100) {
    return { status: 'Normoglycemic (FPG < 100 mg/dL)', category: 'normal' };
  } else if (fastingGlucose <= 125) {
    return { status: 'Impaired Fasting Glucose / Pre-Diabetes (100 - 125 mg/dL)', category: 'prediabetes' };
  } else {
    return { status: 'Provisional Diabetes Mellitus (FPG ≥ 126 mg/dL)', category: 'diabetes' };
  }
}

/**
 * Maps risk probability (0.00 to 1.00) to Risk Category
 */
export function getRiskCategory(prob: number): RiskLevel {
  if (prob < 0.30) return 'Low';
  if (prob < 0.65) return 'Moderate';
  if (prob < 0.85) return 'High';
  return 'Critical';
}

/**
 * Generates automated clinical alerts & evidence-based recommendations
 */
export function generateClinicalAlerts(
  t2dProb: number,
  ckdProb: number,
  egfr: number,
  albumin: number,
  potassium: number,
  bloodPressureSystolic: number
): string[] {
  const alerts: string[] = [];

  // Cardiorenal synergistic risk
  if (t2dProb >= 0.60 && ckdProb >= 0.60) {
    alerts.push('CRITICAL SYNERGY: Dual cardiorenal-metabolic risk detected. High susceptibility to accelerated microvascular nephron loss.');
  }

  // Albuminuria alert
  if (albumin >= 2) {
    alerts.push(`PATHOLOGIC PROTEINURIA: Urine Albumin ${albumin}+ indicates glomerular barrier disruption. Order spot urine albumin-to-creatinine ratio (uACR).`);
  }

  // Renoprotective guideline (KDIGO / ADA)
  if ((t2dProb >= 0.50 || ckdProb >= 0.50) && (albumin >= 1 || egfr < 60)) {
    alerts.push('PHARMACOTHERAPY GUIDELINE: Consider evaluation for SGLT2 inhibitor (e.g., Empagliflozin/Dapagliflozin) and ACE-inhibitor or ARB for renoprotective therapy.');
  }

  // Potassium warning
  if (potassium > 5.1) {
    alerts.push(`HYPERKALEMIA ALERT: Serum Potassium (${potassium} mEq/L) elevated. Exercise caution before initiating or titrating RAAS inhibitors.`);
  } else if (potassium < 3.5) {
    alerts.push(`HYPOKALEMIA ALERT: Serum Potassium (${potassium} mEq/L) below reference range.`);
  }

  // Nephrology Referral threshold
  if (egfr < 30) {
    alerts.push('URGENT REFERRAL: eGFR < 30 mL/min/1.73m² (Stage G4/G5 CKD). Immediate nephrology consultation recommended for renal replacement planning.');
  }

  // Blood Pressure Target
  if (bloodPressureSystolic >= 140) {
    alerts.push(`ELEVATED SYSTOLIC BP (${bloodPressureSystolic} mm Hg): Tighten blood pressure control (< 120/80 mm Hg target) to retard progression of diabetic glomerulosclerosis.`);
  }

  if (alerts.length === 0) {
    alerts.push('PHYSIOLOGIC STABILITY: Biomarker panel within acceptable surveillance tolerances. Maintain standard annual preventative metabolic screening.');
  }

  return alerts;
}
