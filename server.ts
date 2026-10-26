import express from 'express';
import { createServer as createViteServer } from 'vite';
import { execFile } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Health check endpoint
  app.get('/api/v1/health', (req, res) => {
    res.json({
      status: 'online',
      service: 'RenalGlyco AI Fullstack Gateway',
      python_engine: 'Python 3.10.12',
      model_source: 'python_trained_models.json',
      timestamp: new Date().toISOString(),
    });
  });

  // Multi-risk prediction endpoint: executes Python inference engine
  app.post('/api/v1/predict/multi-risk', (req, res) => {
    const patientData = req.body;
    const pythonScriptPath = path.join(__dirname, 'backend', 'app', 'ml', 'infer.py');

    execFile(
      'python3',
      [pythonScriptPath, JSON.stringify(patientData)],
      { maxBuffer: 1024 * 1024 },
      (error, stdout, stderr) => {
        if (error) {
          console.error('[Python Execution Error]:', stderr || error.message);
          return res.status(500).json({
            status: 'error',
            message: 'Python model inference failed',
            details: stderr || error.message,
          });
        }

        try {
          const parsed = JSON.parse(stdout);
          return res.json(parsed);
        } catch (parseErr) {
          console.error('[JSON Parse Error]:', stdout);
          return res.status(500).json({
            status: 'error',
            message: 'Invalid JSON returned by Python model',
          });
        }
      }
    );
  });

  // Vite development middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[RenalGlyco AI] Fullstack Server running on http://0.0.0.0:${PORT}`);
    console.log(`[RenalGlyco AI] Python Inference Engine active at /api/v1/predict/multi-risk`);
  });
}

startServer();
