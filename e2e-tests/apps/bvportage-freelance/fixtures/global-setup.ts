import fs from 'fs';
import path from 'path';

async function globalSetup() {
  console.log('🚀 Initialisation globale - BV Portage Freelance Tests');

  const envFile = path.join(__dirname, '..', '.env');
  if (!fs.existsSync(envFile)) {
    console.warn('⚠️ Fichier .env manquant dans apps/bvportage-freelance. Utilisation de .env.example');
    const exampleEnvFile = path.join(__dirname, '..', '.env.example');
    if (fs.existsSync(exampleEnvFile)) {
      fs.copyFileSync(exampleEnvFile, envFile);
    }
  }

  console.log(`   BASE_URL = ${process.env.BASE_URL || '(non défini)'}`);
  console.log('✅ Initialisation complétée');
}

export default globalSetup;
