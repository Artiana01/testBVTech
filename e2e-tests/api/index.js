/**
 * Vercel API Handler
 * Adapte le serveur de tests pour Vercel
 */

const express = require('express');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const url = require('url');

const app = express();

const TEST_RESULTS_DIR = path.join(process.cwd(), 'test-results');
const ROOT_DIR = process.cwd();

// Config
const TESTS = {
  'e2e-01-signup':        { file: 'apps/bvtech/tests/e2e-01-signup.spec.ts',        label: 'E2E-01 — Inscription (Signup)' },
  'e2e-02-login':         { file: 'apps/bvtech/tests/e2e-02-login-navigation.spec.ts', label: 'E2E-02 — Connexion & Navigation' },
  'e2e-03-profile':       { file: 'apps/bvtech/tests/e2e-03-profile.spec.ts',        label: 'E2E-03 — Profil Client' },
  'e2e-04-dashboard':     { file: 'apps/bvtech/tests/e2e-04-dashboard.spec.ts',      label: 'E2E-04 — Dashboard Client' },
  'e2e-05-admin-login':   { file: 'apps/bvtech/tests/e2e-05-admin-login.spec.ts',    label: 'E2E-05 — Connexion Admin' },
  'e2e-06-admin-users':   { file: 'apps/bvtech/tests/e2e-06-admin-users.spec.ts',    label: 'E2E-06 — Gestion Utilisateurs (Admin)' },
  'e2e-07-admin-packs':   { file: 'apps/bvtech/tests/e2e-07-admin-packs.spec.ts',    label: 'E2E-07 — Gestion Packs (Admin)' },
  'e2e-08-admin-payments':{ file: 'apps/bvtech/tests/e2e-08-admin-payments.spec.ts', label: 'E2E-08 — Paiements (Admin)' },
  'e2e-09-admin-contacts':{ file: 'apps/bvtech/tests/e2e-09-admin-contacts.spec.ts', label: 'E2E-09 — Contacts (Admin)' },
  'regression':           { file: 'apps/bvtech/tests/regression.spec.ts',            label: 'Régression Complète' },
};

const AUTH_TOKEN = process.env.AUTH_TOKEN || 'test123';

// État des jobs
const jobs = new Map();
let jobIdCounter = 0;

app.use(express.json());
app.use(express.static('test-runner-ui'));

// Vérifier l'authentification
function verifyAuth(req) {
  return req.headers['x-auth-token'] === AUTH_TOKEN;
}

// ===== API =====

// GET /api/status
app.get('/api/status', (req, res) => {
  res.json({ tests: TESTS });
});

// GET /api/jobs/:id
app.get('/api/jobs/:id', (req, res) => {
  const job = jobs.get(req.params.id);
  if (!job) return res.status(404).json({ error: 'Job not found' });
  res.json(job);
});

// POST /api/run
app.post('/api/run', (req, res) => {
  if (!verifyAuth(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { tests: selectedTests } = req.body;

  if (!Array.isArray(selectedTests) || selectedTests.length === 0) {
    return res.status(400).json({ error: 'No tests selected' });
  }

  const jobId = String(++jobIdCounter);
  const job = {
    id: jobId,
    status: 'running',
    startTime: new Date(),
    logs: [],
    stats: { pass: 0, fail: 0, total: 0 },
  };

  jobs.set(jobId, job);

  // Lancer les tests en arrière-plan
  setImmediate(() => {
    runTestsAsync(jobId, selectedTests, job);
  });

  res.json({ jobId, status: 'started' });
});

// POST /api/stop/:id
app.post('/api/stop/:id', (req, res) => {
  if (!verifyAuth(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const job = jobs.get(req.params.id);
  if (!job) return res.status(404).json({ error: 'Job not found' });

  job.status = 'stopped';
  res.json({ ok: true });
});

// Fonction asynchrone pour exécuter les tests
async function runTestsAsync(jobId, selectedTests, job) {
  try {
    const args = ['playwright', 'test', '--config', 'playwright.bvtech.config.ts', '--reporter=list'];

    selectedTests.forEach(key => {
      const t = TESTS[key];
      if (t) args.push(t.file);
    });

    job.logs.push('🚀 Démarrage des tests...');

    const proc = spawn('npx', args, {
      cwd: ROOT_DIR,
      shell: true,
    });

    proc.stdout.on('data', (data) => {
      const lines = data.toString().split('\n');
      lines.forEach(line => {
        if (line.trim()) {
          job.logs.push(line);
          updateStats(line, job);
        }
      });
    });

    proc.stderr.on('data', (data) => {
      job.logs.push('ERROR: ' + data.toString());
    });

    await new Promise((resolve, reject) => {
      proc.on('close', (code) => {
        job.status = code === 0 ? 'success' : 'failed';
        job.code = code;
        job.endTime = new Date();
        resolve();
      });
      proc.on('error', reject);
    });
  } catch (error) {
    job.status = 'error';
    job.error = error.message;
    job.logs.push('ERROR: ' + error.message);
  }
}

function updateStats(line, job) {
  if (/^ok\s+\d+\s/.test(line)) {
    job.stats.pass++;
    job.stats.total++;
  } else if (/^x\s+\d+\s/.test(line)) {
    job.stats.fail++;
    job.stats.total++;
  }
}

module.exports = app;
