/**
 * RenalGlyco AI — HTTP API Client
 * Connects the React JavaScript frontend directly to the Python FastAPI backend.
 * Python is the single source of truth for all predictions, eGFR calculation,
 * KDIGO staging, and TreeSHAP feature explanations.
 */

const API_BASE = '/api/v1';

async function fetchWithRetry(url, options = {}, retries = 4, delay = 500) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) {
        return await response.json();
      }
      if (attempt === retries) {
        throw new Error('Unable to complete clinical risk calculation. Please verify entered values and retry.');
      }
    } catch (err) {
      if (attempt === retries) {
        throw err;
      }
      // Wait for Python server startup
      await new Promise((res) => setTimeout(res, delay * attempt));
    }
  }
}

export async function predictMultiRisk(patientRecord) {
  return await fetchWithRetry(`${API_BASE}/predict/multi-risk`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(patientRecord),
  });
}

export async function checkBackendHealth() {
  return await fetchWithRetry(`${API_BASE}/health`, {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
  }, 2, 300);
}
