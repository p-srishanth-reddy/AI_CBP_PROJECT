import React, { useState } from 'react';
import {
  BookOpen,
  ShieldCheck,
  Activity,
  Droplets,
  AlertTriangle,
  Heart,
  Scale,
  CheckCircle2,
  FileText,
  ExternalLink,
} from 'lucide-react';

export const ClinicalGuidelinesHub = () => {
  const [activeSection, setActiveSection] = useState('kdigo_ckd');

  return (
    <div className="space-y-6">
      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2.5 text-slate-900 font-bold text-base mb-1">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>KDIGO 2024 CKD Standard</span>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            Consensus classification combining glomerular filtration (G1-G5) and albuminuria categories (A1-A3).
          </p>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Staging: G1 to G5</span>
            <span className="text-emerald-700 font-bold">2024 Guideline</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2.5 text-slate-900 font-bold text-base mb-1">
            <Activity className="w-5 h-5 text-amber-600" />
            <span>ADA Standards of Care</span>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            Metabolic diagnostic criteria: FPG &gt; 126 mg/dL, Random Glucose &ge; 200 mg/dL, early glycemic intervention.
          </p>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Target: HbA1c &lt; 7.0%</span>
            <span className="text-amber-700 font-bold">Current Edition</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2.5 text-slate-900 font-bold text-base mb-1">
            <Heart className="w-5 h-5 text-rose-600" />
            <span>Cardiorenal Protection</span>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            Guideline-directed medical therapy (GDMT) including SGLT2 inhibitors and RAAS blockade for nephron protection.
          </p>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>SGLT2i + ACEi / ARB</span>
            <span className="text-rose-700 font-bold">First-Line Class</span>
          </div>
        </div>
      </div>

      {/* Main Content Workspace with Navigation */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Navigation Bar */}
        <div className="border-b border-slate-200 bg-slate-50/70 p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-600" />
            <h2 className="text-base font-bold text-slate-900">
              Clinical Guidelines & Diagnostic Protocols
            </h2>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 rounded-lg text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveSection('kdigo_ckd')}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                activeSection === 'kdigo_ckd'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              KDIGO CKD Staging
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('ada_glycemic')}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                activeSection === 'ada_glycemic'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ADA Glycemic Criteria
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('biomarkers')}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                activeSection === 'biomarkers'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Biomarker Reference Ranges
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('pharmacotherapy')}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                activeSection === 'pharmacotherapy'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Renoprotection Therapies
            </button>
          </div>
        </div>

        {/* Section 1: KDIGO CKD Staging Matrix */}
        {activeSection === 'kdigo_ckd' && (
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                KDIGO Glomerular Filtration Rate (GFR) Categories
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                Calculated using the 2021 CKD-EPI Creatinine Equation without race modifier.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-wider border-b border-slate-200">
                    <th className="p-3">Stage</th>
                    <th className="p-3">eGFR Range (mL/min/1.73m²)</th>
                    <th className="p-3">Clinical Description</th>
                    <th className="p-3">Surveillance & Action Plan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-emerald-700">Stage G1</td>
                    <td className="p-3 font-mono font-semibold">&ge; 90</td>
                    <td className="p-3">Normal or elevated glomerular filtration</td>
                    <td className="p-3 text-xs text-slate-600">Screen for proteinuria; monitor BP and glycemic control annually.</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-emerald-600">Stage G2</td>
                    <td className="p-3 font-mono font-semibold">60 - 89</td>
                    <td className="p-3">Mild reduction in renal filtration</td>
                    <td className="p-3 text-xs text-slate-600">Investigate underlying etiology; annual eGFR and urine albumin check.</td>
                  </tr>
                  <tr className="hover:bg-slate-50 bg-amber-50/30">
                    <td className="p-3 font-bold text-amber-700">Stage G3a</td>
                    <td className="p-3 font-mono font-semibold">45 - 59</td>
                    <td className="p-3">Mild-to-moderate reduction in filtration</td>
                    <td className="p-3 text-xs text-slate-600">Initiate renal protective pharmacotherapy (SGLT2i / ACEi / ARB); monitor every 6 months.</td>
                  </tr>
                  <tr className="hover:bg-slate-50 bg-orange-50/30">
                    <td className="p-3 font-bold text-orange-700">Stage G3b</td>
                    <td className="p-3 font-mono font-semibold">30 - 44</td>
                    <td className="p-3">Moderate-to-severe reduction in filtration</td>
                    <td className="p-3 text-xs text-slate-600">Dose-adjust renally cleared medications; evaluate anemia and bone mineral disease; monitor every 3-4 months.</td>
                  </tr>
                  <tr className="hover:bg-slate-50 bg-rose-50/30">
                    <td className="p-3 font-bold text-rose-700">Stage G4</td>
                    <td className="p-3 font-mono font-semibold">15 - 29</td>
                    <td className="p-3">Severe reduction in renal clearance</td>
                    <td className="p-3 text-xs text-slate-600">Nephrology referral required; prepare for renal replacement therapy (vascular access planning).</td>
                  </tr>
                  <tr className="hover:bg-slate-50 bg-rose-100/40">
                    <td className="p-3 font-bold text-rose-900">Stage G5</td>
                    <td className="p-3 font-mono font-semibold">&lt; 15</td>
                    <td className="p-3 font-semibold">Kidney Failure (End-Stage Renal Disease)</td>
                    <td className="p-3 text-xs text-slate-600">Active nephrology management, dialysis initiation, or renal transplant evaluation.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Proteinuria Categories */}
            <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <h4 className="text-sm font-bold text-slate-900 mb-2">
                Persistent Albuminuria Categories (Glomerular Permeability)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <span className="font-bold text-emerald-700 block">A1: Normal to Mildly Increased</span>
                  <span className="text-slate-500 font-mono">Dipstick 0 (Negative)</span>
                  <p className="text-slate-600 mt-1">UACR &lt; 30 mg/g. Low relative cardiorenal risk.</p>
                </div>
                <div className="p-3 bg-white rounded-lg border border-amber-200">
                  <span className="font-bold text-amber-700 block">A2: Moderately Increased</span>
                  <span className="text-slate-500 font-mono">Dipstick 1+ to 2+ (Trace-Moderate)</span>
                  <p className="text-slate-600 mt-1">UACR 30 - 300 mg/g. Early microvascular leak; requires intervention.</p>
                </div>
                <div className="p-3 bg-white rounded-lg border border-rose-200">
                  <span className="font-bold text-rose-700 block">A3: Severely Increased</span>
                  <span className="text-slate-500 font-mono">Dipstick 3+ to 4+ (Severe-Nephrotic)</span>
                  <p className="text-slate-600 mt-1">UACR &gt; 300 mg/g. High risk of progressive renal decline and cardiovascular events.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 2: ADA Glycemic Criteria */}
        {activeSection === 'ada_glycemic' && (
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                ADA Diagnostic Criteria for Glycemic Impairment
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                American Diabetes Association Standards of Medical Care in Diabetes diagnostic thresholds.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block mb-1">
                  Normoglycemic Range
                </span>
                <div className="text-2xl font-bold font-mono text-emerald-900 mb-2">
                  &lt; 100 <span className="text-xs font-normal">mg/dL</span>
                </div>
                <ul className="text-xs text-slate-700 space-y-1.5">
                  <li><strong>FPG:</strong> &lt; 100 mg/dL (5.6 mmol/L)</li>
                  <li><strong>Random Glucose:</strong> &lt; 140 mg/dL</li>
                  <li><strong>Status:</strong> Low metabolic risk</li>
                  <li><strong>Action:</strong> Routine screening every 3 years</li>
                </ul>
              </div>

              <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800 block mb-1">
                  Impaired Fasting (Prediabetes)
                </span>
                <div className="text-2xl font-bold font-mono text-amber-900 mb-2">
                  100 - 125 <span className="text-xs font-normal">mg/dL</span>
                </div>
                <ul className="text-xs text-slate-700 space-y-1.5">
                  <li><strong>FPG:</strong> 100 - 125 mg/dL (5.6 - 6.9 mmol/L)</li>
                  <li><strong>Random Glucose:</strong> 140 - 199 mg/dL</li>
                  <li><strong>Status:</strong> Intermediate conversion risk</li>
                  <li><strong>Action:</strong> Lifestyle modification, weight loss, consider Metformin</li>
                </ul>
              </div>

              <div className="p-4 bg-rose-50/50 rounded-xl border border-rose-200">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-800 block mb-1">
                  Overt Diabetes Mellitus
                </span>
                <div className="text-2xl font-bold font-mono text-rose-900 mb-2">
                  &ge; 126 <span className="text-xs font-normal">mg/dL</span>
                </div>
                <ul className="text-xs text-slate-700 space-y-1.5">
                  <li><strong>FPG:</strong> &ge; 126 mg/dL (confirmed on repeat)</li>
                  <li><strong>Random Glucose:</strong> &ge; 200 mg/dL with symptoms</li>
                  <li><strong>Status:</strong> Established glucotoxicity</li>
                  <li><strong>Action:</strong> Comprehensive cardiorenal risk management (SGLT2i/GLP-1 RA)</li>
                </ul>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700 space-y-2">
              <span className="font-bold text-slate-900 block">Cardiorenal Comorbidity Interaction:</span>
              <p className="leading-relaxed">
                Diabetic kidney disease (DKD) develops in 30-40% of patients with Type 2 Diabetes. Hyperglycemia induces glomerular hyperfiltration, podocyte detachment, and mesangial expansion. Glycemic stabilization combined with hemodynamic pressure reduction is essential to halt progressive nephropathy.
              </p>
            </div>
          </div>
        )}

        {/* Section 3: Biomarker Reference Ranges */}
        {activeSection === 'biomarkers' && (
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Key Laboratory Biomarkers & Clinical Significance
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                Standard reference intervals, pathophysiological significance, and alert triggers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900">Serum Creatinine (sCr)</span>
                  <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-700">0.60 - 1.20 mg/dL</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-xs">
                  End-product of muscle creatine catabolism filtered freely by glomeruli. Elevation signifies reduced functional nephron clearance. Serves as primary input for 2021 CKD-EPI formula.
                </p>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900">Blood Urea Nitrogen (BUN)</span>
                  <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-700">7 - 20 mg/dL</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-xs">
                  Hepatic urea synthesized from protein deamination. Levels &gt; 25 mg/dL indicate azotemia, prerenal hypoperfusion, or advanced tubular/glomerular impairment.
                </p>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900">Serum Potassium (K⁺)</span>
                  <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-700">3.5 - 5.0 mEq/L</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-xs">
                  Critical intracellular cation regulated by aldosterone in distal nephron. Levels &gt; 5.0 mEq/L require caution when escalating RAAS inhibitors or potassium-sparing diuretics.
                </p>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900">Hemoglobin (Hgb)</span>
                  <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-700">12.0 - 17.5 g/dL</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-xs">
                  Decreases in CKD due to diminished peritubular capillary erythropoietin production and chronic inflammation. Levels &lt; 12.0 g/dL warrant anemia workup.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Section 4: Pharmacotherapy Guidelines */}
        {activeSection === 'pharmacotherapy' && (
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Evidence-Based Cardiorenal Renoprotective Therapy
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                Clinical recommendations from KDIGO 2024 and ADA/EASD consensus statements.
              </p>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span className="font-bold text-emerald-950 text-base">
                    SGLT2 Inhibitors (Empagliflozin, Dapagliflozin, Canagliflozin)
                  </span>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  <strong>Indication:</strong> Recommended for patients with T2D and CKD with eGFR &ge; 20 mL/min/1.73m² or persistent albuminuria.
                </p>
                <p className="text-slate-700 leading-relaxed">
                  <strong>Mechanism:</strong> Restores tubuloglomerular feedback, diminishes intraglomerular hypertension, and reduces renal and cardiovascular events by 30-40%.
                </p>
              </div>

              <div className="p-4 bg-cyan-50/60 rounded-xl border border-cyan-200 space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-cyan-600" />
                  <span className="font-bold text-cyan-950 text-base">
                    RAAS Blockade (ACE Inhibitor or ARB at Maximum Tolerated Dose)
                  </span>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  <strong>Indication:</strong> First-line antihypertensive therapy in patients with diabetes, hypertension, and albuminuria (UACR &ge; 30 mg/g).
                </p>
                <p className="text-slate-700 leading-relaxed">
                  <strong>Monitoring:</strong> Expect up to a 30% acute rise in serum creatinine upon initiation due to efferent arteriolar vasodilation; check sCr and K⁺ at 2-4 weeks.
                </p>
              </div>

              <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-200 space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                  <span className="font-bold text-indigo-950 text-base">
                    Non-Steroidal Mineralocorticoid Receptor Antagonists (Finerenone)
                  </span>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  <strong>Indication:</strong> Recommended for persistent albuminuria despite maximally tolerated ACEi/ARB to target residual renal inflammation and fibrosis.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
