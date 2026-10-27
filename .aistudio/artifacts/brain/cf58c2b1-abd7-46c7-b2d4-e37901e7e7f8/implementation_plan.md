# RenalGlyco AI — Architecture & Implementation Plan (React JS + Python FastAPI)

## Executive Summary of Architectural Migration
The RenalGlyco AI platform architecture has been migrated to:
- **Frontend**: Pure React with JavaScript (JSX) using Vite. All TypeScript files (`.ts` and `.tsx`) have been converted to JavaScript (`.js` and `.jsx`).
- **Backend**: Pure Python FastAPI (`backend/app/main.py`), running under Uvicorn.
- **Node.js/Express Backend Elimination**: `server.ts` and Express server have been deleted. Node.js is used exclusively for Vite tooling.
- **Single Source of Truth**: All backend clinical logic—Type 2 Diabetes prediction, Chronic Kidney Disease prediction, 2021 CKD-EPI eGFR calculation, KDIGO staging, ADA glycemic categorization, TreeSHAP feature attribution calculation, and evidence-based clinical alerts—resides exclusively in Python.
- **Communication**: React communicates with Python FastAPI via standard HTTP REST APIs (`POST /api/v1/predict/multi-risk`, `GET /api/v1/health`).
- **Feature Preservation**: Preserved 100% of all UI components, dual risk gauges, TreeSHAP waterfall charts, 2D cardiorenal matrix, longitudinal trajectory charts, clinical alerts, and printable report generation.
