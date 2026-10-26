"""
RenalGlyco AI — Chronic Kidney Disease (CKD) Random Forest Training Pipeline
"""

import os
import joblib
import numpy as np
from sklearn.model_selection import StratifiedKFold, cross_validate
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
import shap
from data_loader import load_and_preprocess_ckd


def train_ckd_model():
    print("RenalGlyco AI — Training Random Forest CKD Classifier")
    X, y = load_and_preprocess_ckd()
    
    model = RandomForestClassifier(
        n_estimators=200,
        max_depth=6,
        min_samples_split=4,
        class_weight="balanced",
        random_state=42
    )
    
    pipeline = Pipeline([
        ("scaler", StandardScaler()),
        ("classifier", model)
    ])
    
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    scores = cross_validate(
        pipeline, X, y, cv=cv,
        scoring=["roc_auc", "f1", "precision", "recall"]
    )
    
    print(f"5-Fold CV ROC-AUC: {np.mean(scores['test_roc_auc']):.4f} (Target: >= 0.95)")
    print(f"5-Fold CV F1:      {np.mean(scores['test_f1']):.4f} (Target: >= 0.92)")
    
    pipeline.fit(X, y)
    transformed_X = pipeline.named_steps["scaler"].transform(X)
    explainer = shap.TreeExplainer(
        pipeline.named_steps["classifier"],
        data=transformed_X[:100]
    )
    
    os.makedirs("backend/app/ml/artifacts", exist_ok=True)
    joblib.dump(pipeline, "backend/app/ml/artifacts/ckd_pipeline.joblib")
    joblib.dump(explainer, "backend/app/ml/artifacts/ckd_explainer.joblib")
    print("Saved CKD pipeline and TreeSHAP explainer to backend/app/ml/artifacts/")


if __name__ == "__main__":
    train_ckd_model()
