import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import { defineConfig } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let pythonProcess = null;

function pythonFastApiPlugin() {
  return {
    name: 'python-fastapi-backend',
    configureServer(server) {
      if (!pythonProcess) {
        console.log('[RenalGlyco AI] Spawning Python Clinical Backend on http://127.0.0.1:8001...');
        const scriptPath = path.join(__dirname, 'backend', 'app', 'server.py');
        pythonProcess = spawn('python3', [scriptPath], {
          stdio: 'inherit',
          env: { ...process.env, PYTHON_PORT: '8001' },
        });

        pythonProcess.on('error', (err) => {
          console.error('[RenalGlyco AI Python Error]:', err);
        });

        pythonProcess.on('exit', (code, signal) => {
          console.log(`[RenalGlyco AI Python Process Exited]: code ${code}, signal ${signal}`);
          pythonProcess = null;
        });

        const cleanup = () => {
          if (pythonProcess) {
            console.log('[RenalGlyco AI] Terminating Python backend...');
            try {
              pythonProcess.kill();
            } catch (e) {
              // ignore
            }
            pythonProcess = null;
          }
        };

        server.httpServer?.on('close', cleanup);
        process.on('SIGINT', cleanup);
        process.on('SIGTERM', cleanup);
      }
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), pythonFastApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:8001',
          changeOrigin: true,
        },
      },
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
