"""
Pydantic V2 schemas for RenalGlyco AI API request validation and response contracts
"""

from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime


class DemographicsSchema(BaseModel):
    age: int = Field(..., ge=1, le=120, description="Patient age in years")
    gender: str = Field(..., description="Biological sex ('male', 'female', 'other')")
    pregnancies: int = Field(default=0, ge=0, le=20, description="Number of prior pregnancies")


class T2DBiomarkersSchema(BaseModel):
    glucose: float = Field(..., ge=40.0, le=400.0, description="Fasting plasma glucose in mg/dL")
    blood_pressure: float = Field(..., ge=30.0, le=180.0, description="Diastolic blood pressure in mm Hg")
    skin_thickness: float = Field(default=20.0, ge=5.0, le=100.0, description="Triceps skinfold thickness in mm")
    insulin: float = Field(default=80.0, ge=5.0, le=900.0, description="Serum insulin in µU/mL")
    bmi: float = Field(..., ge=12.0, le=75.0, description="Body Mass Index in kg/m²")
    diabetes_pedigree: float = Field(default=0.35, ge=0.01, le=3.0, description="Diabetes pedigree function score")


class CKDBiomarkersSchema(BaseModel):
    specific_gravity: float = Field(default=1.020, ge=1.000, le=1.040, description="Urine specific gravity density")
    urine_albumin: int = Field(default=0, ge=0, le=5, description="Urine albumin level (scale 0-5)")
    urine_sugar: int = Field(default=0, ge=0, le=5, description="Urine glucose level (scale 0-5)")
    blood_glucose_random: float = Field(..., ge=40.0, le=450.0, description="Random blood glucose in mg/dL")
    blood_urea: float = Field(..., ge=5.0, le=250.0, description="Blood Urea Nitrogen (BUN) in mg/dL")
    serum_creatinine: float = Field(..., ge=0.2, le=25.0, description="Serum creatinine in mg/dL")
    sodium: float = Field(default=138.0, ge=100.0, le=170.0, description="Serum sodium in mEq/L")
    potassium: float = Field(default=4.4, ge=2.0, le=9.0, description="Serum potassium in mEq/L")
    hemoglobin: float = Field(default=13.0, ge=4.0, le=22.0, description="Hemoglobin in g/dL")
    packed_cell_volume: float = Field(default=40.0, ge=15.0, le=60.0, description="Hematocrit (PCV) %")
    white_blood_cell_count: float = Field(default=7500.0, ge=1500.0, le=30000.0, description="White blood cell count cells/cumm")


class MultiRiskPredictionRequest(BaseModel):
    mrn: str = Field(..., description="Medical Record Number / Pseudonymized Patient ID")
    demographics: DemographicsSchema
    t2d_biomarkers: T2DBiomarkersSchema
    ckd_biomarkers: CKDBiomarkersSchema


class ShapImpactItem(BaseModel):
    feature: str
    shap_impact: float
    value: Optional[float] = None


class DiseasePredictionItem(BaseModel):
    risk_probability: float
    risk_category: str
    top_risk_drivers: List[ShapImpactItem]


class MultiRiskPredictionResponse(BaseModel):
    status: str
    assessment_id: str
    predictions: Dict[str, DiseasePredictionItem]
    clinical_alerts: Optional[List[str]] = None
    timestamp: str
