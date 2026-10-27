/**
 * RenalGlyco AI — HTTP API Client
 * Connects the React JavaScript frontend directly to the Python FastAPI backend.
 * Python is the single source of truth for all predictions, eGFR calculation,
 * KDIGO staging, and TreeSHAP feature explanations.
 */

const API_BASE = '/api/v1';

export async function predictMultiRisk(patientRecord) {
  const response = await fetch(`${API_BASE}/predict/multi-risk`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(patientRecord),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Python backend error (${response.status}): ${errorText}`);
  }

  return await response.json();
}

export async function checkBackendHealth() {
  const response = await fetch(`${API_BASE}/health`);
  if (!response.ok) {
    throw new Error(`Backend health check failed: ${response.status}`);
  }
  return await response.json();
}
