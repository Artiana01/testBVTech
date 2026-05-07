/**
 * global-setup.ts
 * Configuration globale avant les tests
 */
import { chromium, FullConfig } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

async function globalSetup(config: FullConfig) {
  // Setup global variables si nécessaire
  console.log('Initialisation des tests BV Portage...');
  
  // Optionnel : créer des dossiers de rapports s'ils n'existent pas
  const reportDir = path.join(__dirname, 'playwright-report');
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }
}

export default globalSetup;
