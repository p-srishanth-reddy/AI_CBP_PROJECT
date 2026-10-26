"""
RenalGlyco AI — Data Ingestion & Preprocessing Pipeline
Loads benchmark clinical cohorts:
1. Pima Indians / NHANES Type 2 Diabetes Dataset (UCI ML Repository)
2. Chronic Kidney Disease (CKD) Dataset (UCI ML Repository)
"""

import numpy as np
import pandas as pd
from typing import Tuple
from sklearn.model_selection import train_test_split
from sklearn.impute import KNNImputer, SimpleImputer


def load_and_preprocess_t2d(file_path: str = "data/raw/diabetes.csv") -> Tuple[pd.DataFrame, pd.Series]:
    """
    Ingests and preprocesses the Pima Indians / NHANES Type 2 Diabetes cohort.
    Biological zeros in Glucose, BloodPressure, SkinThickness, Insulin, and BMI
    are converted to np.nan and imputed using KNN (k=5) and median strategies.
    """
    df = pd.read_csv(file_path)
    
    # Identify biologically implausible zero values
    zero_invalid_cols = ["Glucose", "BloodPressure", "SkinThickness", "Insulin", "BMI"]
    for col in zero_invalid_cols:
        df[col] = df[col].replace(0, np.nan)
        
    X = df.drop(columns=["Outcome"])
    y = df["Outcome"]
    
    # KNN imputation for continuous metabolic markers
    knn_cols = ["Glucose", "BloodPressure", "Insulin", "BMI"]
    knn_imputer = KNNImputer(n_neighbors=5, weights="distance")
    X[knn_cols] = knn_imputer.fit_transform(X[knn_cols])
    
    # Median imputation for triceps skinfold thickness
    median_imputer = SimpleImputer(strategy="median")
    X[["SkinThickness"]] = median_imputer.fit_transform(X[["SkinThickness"]])
    
    return X, y


def load_and_preprocess_ckd(file_path: str = "data/raw/ckd.csv") -> Tuple[pd.DataFrame, pd.Series]:
    """
    Ingests and preprocesses the UCI Chronic Kidney Disease dataset.
    Handles ordinal urine parameters (Albumin 0-5, Sugar 0-5, Specific Gravity)
    and continuous electrolyte and hematology markers.
    """
    df = pd.read_csv(file_path)
    
    # Map target feature: 'ckd' -> 1, 'notckd' -> 0
    if df["classification"].dtype == object:
        df["classification"] = df["classification"].str.strip()
        df["classification"] = df["classification"].replace({"ckd": 1, "notckd": 0, "ckd\t": 1})
        
    X = df.drop(columns=["classification", "id"], errors="ignore")
    y = df["classification"]
    
    # Impute numeric features with KNN (k=5)
    numeric_cols = X.select_dtypes(include=[np.number]).columns
    num_imputer = KNNImputer(n_neighbors=5)
    X[numeric_cols] = num_imputer.fit_transform(X[numeric_cols])
    
    # Impute categorical/ordinal features with most frequent
    cat_cols = X.select_dtypes(include=[object]).columns
    if len(cat_cols) > 0:
        cat_imputer = SimpleImputer(strategy="most_frequent")
        X[cat_cols] = cat_imputer.fit_transform(X[cat_cols])
        X = pd.get_dummies(X, drop_first=True)
        
    return X, y
