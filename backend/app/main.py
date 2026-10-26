"""
RenalGlyco AI — FastAPI Backend Application Entry Point
"""

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import uuid

from app.schemas.prediction import (
    MultiRiskPredictionRequest,
    MultiRiskPredictionResponse,
)
from app.ml.predictor import model_registry

app = FastAPI(
    title="RenalGlyco AI API Gateway",
    description="Asynchronous Clinical Decision Support Platform for Dual T2D and CKD Risk Assessment with TreeSHAP Explainability.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configuration for web clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", tags=["System"])
def health_check():
    return {
        "status": "online",
        "service": "RenalGlyco AI Core Gateway",
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat()
    }


@app.post(
    "/api/v1/predict/multi-risk",
    response_model=MultiRiskPredictionResponse,
    tags=["Clinical Inference & XAI"],
    summary="Multi-Disease Cardiorenal Risk & SHAP Evaluation",
    status_code=status.HTTP_200_OK
)
def predict_multi_risk(payload: MultiRiskPredictionRequest):
    """
    Ingests non-invasive blood panels, electrolytes, and urinalysis markers;
    executes XGBoost & Random Forest inference; and computes local TreeSHAP attributions.
    """
    try:
        results = model_registry.predict_multi_risk(payload)
        assessment_id = str(uuid.uuid4())
        
        alerts = []
        if results["diabetes"]["risk_probability"] >= 0.60 and results["chronic_kidney_disease"]["risk_probability"] >= 0.60:
            alerts.append("CRITICAL: Combined high metabolic and renal risk. Consider spot uACR and SGLT2i evaluation.")
        
        return {
            "status": "success",
            "assessment_id": assessment_id,
            "predictions": results,
            "clinical_alerts": alerts,
            "timestamp": datetime.utcnow().isoformat() + "Z"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Inference failure: {str(e)}"
        )
