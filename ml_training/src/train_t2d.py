"""
RenalGlyco AI — Type 2 Diabetes (T2D) XGBoost Training Pipeline with TreeSHAP
"""

import os
import joblib
import numpy as np
from sklearn.model_selection import StratifiedKFold, cross_validate
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from xgboost import XGBClassifier
import shap
from data_loader import load_and_preprocess_t2d


def train_t2d_model():
    print("RenalGlyco AI — Training XGBoost T2D Classifier")
    X, y = load_and_preprocess_t2d()
    
    model = XGBClassifier(
        n_estimators=160,
        max_depth=4,
        learning_rate=0.04,
        subsample=0.85,
        colsample_bytree=0.85,
        reg_alpha=0.1,
        reg_lambda=1.2,
        random_state=42,
        eval_metric="logloss"
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
    
    print(f"5-Fold CV ROC-AUC: {np.mean(scores['test_roc_auc']):.4f} (Target: >= 0.88)")
    print(f"5-Fold CV F1:      {np.mean(scores['test_f1']):.4f} (Target: >= 0.86)")
    
    pipeline.fit(X, y)
    transformed_X = pipeline.named_steps["scaler"].transform(X)
    explainer = shap.TreeExplainer(
        pipeline.named_steps["classifier"],
        data=transformed_X[:100]
    )
    
    os.makedirs("backend/app/ml/artifacts", exist_ok=True)
    joblib.dump(pipeline, "backend/app/ml/artifacts/t2d_pipeline.joblib")
    joblib.dump(explainer, "backend/app/ml/artifacts/t2d_explainer.joblib")
    print("Saved pipeline and TreeSHAP explainer to backend/app/ml/artifacts/")


if __name__ == "__main__":
    train_t2d_model()
